from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import json
import asyncio
from contextlib import asynccontextmanager
from langchain_core.messages import HumanMessage
from app.settings import settings
from app.llm.gateway import gateway
from app.agents.supervisor import supervisor_agent


_poller_task = None


async def poll_approved_actions():
    """
    Lightweight background loop that polls the database for approved proposals
    and executes them. Runs every 2 seconds.
    
    Why poller:
    A lightweight poller is extremely robust, self-reconnecting, and simple
    compared to running database WebSocket subscriptions (Supabase Realtime) on the backend,
    ensuring approved actions execute in near real-time without blocking api threads.
    """
    import psycopg
    import re
    from app.actions.executors import execute_proposal

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    print("[Poller] Background approved actions poller started.")

    while True:
        try:
            # Look for approved, non-executed proposals
            with psycopg.connect(dsn) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "SELECT id FROM proposed_actions WHERE status = 'approved' ORDER BY created_at ASC"
                    )
                    rows = cur.fetchall()
                    approved_ids = [str(r[0]) for r in rows]

            for pid in approved_ids:
                print(f"[Poller] Found approved proposal {pid}. Executing...")
                try:
                    res = execute_proposal(pid)
                    print(f"[Poller] Proposal {pid} executed successfully: {res}")
                except Exception as ex:
                    print(f"[Poller] Failed to execute proposal {pid}: {ex}")

        except Exception as e:
            print(f"[Poller Error] Exception in background loop: {e}")

        await asyncio.sleep(2.0)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _poller_task
    # Start Poller loop
    _poller_task = asyncio.create_task(poll_approved_actions())
    
    # Start APScheduler
    from app.scheduler import scheduler, init_scheduler
    init_scheduler()
    scheduler.start()
    print("[Main] Scheduler started.")
    
    yield
    
    # Shutdown Poller loop
    if _poller_task:
        _poller_task.cancel()
        try:
            await _poller_task
        except asyncio.CancelledError:
            pass
            
    # Shutdown APScheduler
    scheduler.shutdown()
    print("[Main] Scheduler shut down.")


app = FastAPI(
    title="VIZIER API",
    description="Backend API services for VIZIER - Personal AI Chief-of-Staff",
    version="0.1.0",
    lifespan=lifespan
)

# CORS Configuration
# Browsers enforce the Same-Origin Policy, which prevents a script running on one origin 
# (e.g. localhost:3000) from querying a resource on another origin (e.g. localhost:8000) 
# unless the server explicitly permits it.
# We configure Cross-Origin Resource Sharing (CORS) to allow localhost:3000.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"], # Allow all headers
)

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None
    resume: Optional[str] = None


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Gateway chat endpoint. Accepts a user query, streams agent status transitions via SSE,
    and returns the final synthesized agent message. Supports resuming interrupted states.
    """
    async def sse_generator():
        thread_id = request.thread_id or "default-session"
        
        from app.observability import get_langfuse_callback
        callbacks = get_langfuse_callback(trace_name="chat_interaction", thread_id=thread_id)
        config = {
            "configurable": {"thread_id": thread_id},
            "callbacks": callbacks
        }
        
        if request.resume is not None:
            from langgraph.types import Command
            inputs = Command(resume=request.resume)
        else:
            inputs = {"messages": [HumanMessage(content=request.message)], "scratchpad": {}}
        
        try:
            # Stream graph updates
            for chunk in supervisor_agent.stream(inputs, config, stream_mode="updates"):
                # Check for native LangGraph interrupts
                if "__interrupt__" in chunk:
                    interrupt_val = chunk["__interrupt__"][0].value
                    yield f"event: interrupt\ndata: {json.dumps({'message': interrupt_val})}\n\n"
                    break

                for node_name, state_update in chunk.items():
                    if node_name == "supervisor":
                        next_agent = state_update.get("next_agent", "FINALIZE")
                        yield f"event: status\ndata: {json.dumps({'agent': 'SUPERVISOR', 'message': f'Routing to {next_agent}...'})}\n\n"
                    elif node_name == "scheduler_node":
                        yield f"event: status\ndata: {json.dumps({'agent': 'SCHEDULER', 'message': 'Scheduler is checking dates/calendar events...' })}\n\n"
                    elif node_name == "scribe_node":
                        yield f"event: status\ndata: {json.dumps({'agent': 'SCRIBE', 'message': 'Scribe is drafting message draft...' })}\n\n"
                    elif node_name == "researcher_node":
                        yield f"event: status\ndata: {json.dumps({'agent': 'RESEARCHER', 'message': 'Researcher is querying DuckDuckGo/fetching url...' })}\n\n"
                    elif node_name == "analyst_node":
                        yield f"event: status\ndata: {json.dumps({'agent': 'ANALYST', 'message': 'Analyst is running stock ticker queries/math...' })}\n\n"
                    elif node_name == "finalize_node":
                        final_msg = state_update["messages"][-1]
                        yield f"event: message\ndata: {json.dumps({'reply': final_msg.content})}\n\n"
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"
            
    return StreamingResponse(sse_generator(), media_type="text/event-stream")

@app.get("/health")
def health_check():
    """
    Ping endpoint to verify server is active and reachable.
    """
    return {
        "status": "ok",
        "service": "vizier"
    }

@app.get("/config-check")
def config_check():
    """
    Diagnostics endpoint to check if required keys are populated in the environment.
    
    CRITICAL SECURITY DESIGN:
    - We NEVER return the actual secret values of the keys here.
    - Returning raw keys is an extreme security risk (CWE-200: Information Exposure).
    - If this endpoint leaked keys, any script running on an authorized origin (or someone 
      accessing the endpoint directly) could extract your private API keys.
    - Therefore, we cast each configuration value to a boolean, reporting only True/False 
      to indicate if the key is present.
    """
    return {
        "GEMINI_API_KEY_PRESENT": bool(settings.GEMINI_API_KEY),
        "GROQ_API_KEY_PRESENT": bool(settings.GROQ_API_KEY),
        "OPENROUTER_API_KEY_PRESENT": bool(settings.OPENROUTER_API_KEY),
        "SUPABASE_URL_PRESENT": bool(settings.SUPABASE_URL),
        "SUPABASE_ANON_KEY_PRESENT": bool(settings.SUPABASE_ANON_KEY),
        "SUPABASE_SERVICE_ROLE_KEY_PRESENT": bool(settings.SUPABASE_SERVICE_ROLE_KEY),
        "SUPABASE_DB_URL_PRESENT": bool(settings.SUPABASE_DB_URL),
        "LANGFUSE_PUBLIC_KEY_PRESENT": bool(settings.LANGFUSE_PUBLIC_KEY),
        "LANGFUSE_SECRET_KEY_PRESENT": bool(settings.LANGFUSE_SECRET_KEY),
        "TELEGRAM_BOT_TOKEN_PRESENT": bool(settings.TELEGRAM_BOT_TOKEN),
        "TELEGRAM_CHAT_ID_PRESENT": bool(settings.TELEGRAM_CHAT_ID),
        "GEMINI_MODEL_CONFIGURED": settings.GEMINI_MODEL
    }

# =====================================================================
# MEMORIES ENDPOINTS
# =====================================================================
class MemoryCreateRequest(BaseModel):
    kind: str
    content: str
    importance: int

class MemoryUpdateRequest(BaseModel):
    kind: str
    content: str
    importance: int

@app.get("/memories")
def get_memories(search: Optional[str] = None):
    """
    Get list of memories, optionally filtered by keyword search.
    """
    from app.rag.memory import parse_db_url_to_dsn
    import psycopg
    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            if search:
                cur.execute(
                    """
                    SELECT id, kind, content, importance, created_at, last_accessed_at 
                    FROM memories 
                    WHERE content ILIKE %s 
                    ORDER BY created_at DESC
                    """,
                    (f"%{search}%",)
                )
            else:
                cur.execute(
                    """
                    SELECT id, kind, content, importance, created_at, last_accessed_at 
                    FROM memories 
                    ORDER BY created_at DESC
                    """
                )
            rows = cur.fetchall()
            memories = []
            for r in rows:
                memories.append({
                    "id": str(r[0]),
                    "kind": r[1],
                    "content": r[2],
                    "importance": r[3],
                    "created_at": r[4].isoformat(),
                    "last_accessed_at": r[5].isoformat()
                })
            return memories

@app.post("/memories")
def create_memory(req: MemoryCreateRequest):
    """
    Manually create a new memory and calculate its embedding vector.
    """
    from app.rag.memory import save_memory
    memory_id = save_memory(kind=req.kind, content=req.content, importance=req.importance)
    return {"status": "ok", "id": memory_id}

@app.put("/memories/{memory_id}")
def update_memory(memory_id: str, req: MemoryUpdateRequest):
    """
    Update memory content, kind, importance, and re-compute its embedding.
    """
    from app.rag.memory import parse_db_url_to_dsn
    from app.llm.gateway import gateway
    import psycopg
    
    try:
        embedding = gateway.embed([req.content])[0]
        embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    except Exception as e:
        print(f"[Memory System Error] Failed to generate embedding on update: {e}")
        embedding_str = None
        
    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE memories 
                SET kind = %s, content = %s, importance = %s, embedding = %s, last_accessed_at = now()
                WHERE id = %s
                """,
                (req.kind, req.content, req.importance, embedding_str, memory_id)
            )
    return {"status": "ok"}

@app.delete("/memories/{memory_id}")
def delete_memory(memory_id: str):
    """
    Delete a memory by its UUID.
    """
    from app.rag.memory import parse_db_url_to_dsn
    import psycopg
    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM memories WHERE id = %s", (memory_id,))
    return {"status": "ok"}


# =====================================================================
# PROPOSALS ENDPOINTS (Block 9.2 — Write Actions via Proposal Gate)
# These endpoints power the web Approval Inbox (built in Block 10.1).
# The CLI reviewer (python -m app.actions.review) uses the same DB.
# =====================================================================

@app.get("/proposals")
def get_proposals(status: Optional[str] = None):
    """
    List proposals, optionally filtered by status.
    Status values: proposed, approved, rejected, executed, failed
    """
    import psycopg
    import re
    from app.settings import settings

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            if status:
                cur.execute(
                    """
                    SELECT id, agent, action_type, payload, rationale, risk_tier, status,
                           idempotency_key, created_at, decided_at, executed_at, result
                    FROM proposed_actions
                    WHERE status = %s
                    ORDER BY created_at DESC
                    """,
                    (status,)
                )
            else:
                cur.execute(
                    """
                    SELECT id, agent, action_type, payload, rationale, risk_tier, status,
                           idempotency_key, created_at, decided_at, executed_at, result
                    FROM proposed_actions
                    ORDER BY created_at DESC
                    LIMIT 50
                    """
                )
            rows = cur.fetchall()
            proposals = []
            for r in rows:
                proposals.append({
                    "id": str(r[0]),
                    "agent": r[1],
                    "action_type": r[2],
                    "payload": r[3],
                    "rationale": r[4],
                    "risk_tier": r[5],
                    "status": r[6],
                    "idempotency_key": r[7],
                    "created_at": r[8].isoformat() if r[8] else None,
                    "decided_at": r[9].isoformat() if r[9] else None,
                    "executed_at": r[10].isoformat() if r[10] else None,
                    "result": r[11],
                })
            return proposals


@app.post("/proposals/{proposal_id}/approve")
def approve_proposal(proposal_id: str):
    """
    Approve a pending proposal and update database state.
    The background poller loop will execute the approved action.
    """
    import psycopg
    import re
    from datetime import datetime, timezone
    from app.settings import settings
    from app.actions.audit import log_audit

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE proposed_actions SET status='approved', decided_at=%s WHERE id=%s AND status='proposed'",
                (datetime.now(timezone.utc), proposal_id)
            )
        conn.commit()

    log_audit(
        actor="human",
        event_type="proposal_approved",
        details={"proposal_id": proposal_id, "interface": "api"}
    )
    return {"status": "approved", "proposal_id": proposal_id}


@app.post("/proposals/{proposal_id}/reject")
def reject_proposal(proposal_id: str):
    """
    Reject a pending proposal. Sets status to 'rejected'. Cannot be undone.
    """
    import psycopg
    import re
    from datetime import datetime, timezone
    from app.settings import settings
    from app.actions.audit import log_audit

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE proposed_actions SET status='rejected', decided_at=%s WHERE id=%s AND status='proposed'",
                (datetime.now(timezone.utc), proposal_id)
            )
        conn.commit()

    log_audit(
        actor="human",
        event_type="proposal_rejected",
        details={"proposal_id": proposal_id, "interface": "api"}
    )
    return {"status": "rejected", "proposal_id": proposal_id}


class ProposalUpdateRequest(BaseModel):
    payload: dict
    rationale: Optional[str] = None


@app.put("/proposals/{proposal_id}")
def update_proposal(proposal_id: str, req: ProposalUpdateRequest):
    """
    Update a pending proposal's payload and rationale.
    Useful for 'Edit-then-Approve' flows.
    """
    import psycopg
    import re
    from app.settings import settings
    from app.actions.audit import log_audit

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT status, payload, rationale FROM proposed_actions WHERE id = %s",
                (proposal_id,)
            )
            row = cur.fetchone()
            if not row:
                return {"status": "error", "message": "Proposal not found"}
            status, old_payload, old_rationale = row
            if status != "proposed":
                return {"status": "error", "message": f"Cannot edit proposal in status '{status}'"}

            cur.execute(
                """
                UPDATE proposed_actions
                SET payload = %s, rationale = COALESCE(%s, rationale)
                WHERE id = %s
                """,
                (json.dumps(req.payload), req.rationale, proposal_id)
            )
            
            log_audit(
                actor="human",
                event_type="proposal_edited",
                details={
                    "proposal_id": proposal_id,
                    "old_payload": old_payload,
                    "new_payload": req.payload,
                    "old_rationale": old_rationale,
                    "new_rationale": req.rationale or old_rationale
                }
            )
        conn.commit()
    return {"status": "ok"}


@app.get("/settings/permissions")
def get_permissions():
    """
    Retrieve current safety cockpit permissions settings.
    """
    import psycopg
    import re
    from app.settings import settings

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT action_type, permission_tier FROM action_permissions")
            rows = cur.fetchall()
            return [{"action_type": r[0], "permission_tier": r[1]} for r in rows]


class PermissionUpdateRequest(BaseModel):
    permission_tier: str


@app.put("/settings/permissions/{action_type}")
def update_permission(action_type: str, req: PermissionUpdateRequest):
    """
    Update permission safety setting for a specific action type.
    """
    if req.permission_tier not in ('always_ask', 'auto_approve_low_risk', 'blocked'):
        return {"status": "error", "message": "Invalid permission tier"}
        
    import psycopg
    import re
    from app.settings import settings
    from app.actions.audit import log_audit

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            # Get old setting
            cur.execute("SELECT permission_tier FROM action_permissions WHERE action_type = %s", (action_type,))
            row = cur.fetchone()
            old_tier = row[0] if row else None
            
            cur.execute(
                """
                INSERT INTO action_permissions (action_type, permission_tier, updated_at)
                VALUES (%s, %s, now())
                ON CONFLICT (action_type) 
                DO UPDATE SET permission_tier = EXCLUDED.permission_tier, updated_at = now()
                """,
                (action_type, req.permission_tier)
            )
            
            log_audit(
                actor="human",
                event_type="permission_changed",
                details={
                    "action_type": action_type,
                    "old_tier": old_tier,
                    "new_tier": req.permission_tier
                }
            )
        conn.commit()
    return {"status": "ok"}


@app.get("/audit-logs")
def get_audit_logs(limit: int = 100):
    """
    Fetch history of audit logs sorted by timestamp desc.
    """
    import psycopg
    import re
    from app.settings import settings

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, ts, actor, event_type, details
                FROM audit_log
                ORDER BY ts DESC
                LIMIT %s
                """,
                (limit,)
            )
            rows = cur.fetchall()
            return [
                {
                    "id": str(r[0]),
                    "ts": r[1].isoformat(),
                    "actor": r[2],
                    "event_type": r[3],
                    "details": r[4]
                } for r in rows
            ]


@app.post("/jobs/briefing/run-now")
async def run_morning_briefing_now():
    """Trigger the Morning Briefing generation manually for testing."""
    from app.scheduler import run_morning_briefing
    summary = await run_morning_briefing()
    return {"status": "ok", "summary": summary}


@app.post("/jobs/weekly/run-now")
async def run_weekly_review_now():
    """Trigger the Weekly Review generation manually for testing."""
    from app.scheduler import run_weekly_review
    summary = await run_weekly_review()
    return {"status": "ok", "summary": summary}


@app.get("/briefings")
def get_briefings(limit: int = 50):
    """Retrieve historical morning briefings and weekly reviews."""
    import psycopg
    import re
    from app.settings import settings

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, created_at, kind, summary, raw_data
                FROM briefings
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (limit,)
            )
            rows = cur.fetchall()
            return [
                {
                    "id": str(r[0]),
                    "created_at": r[1].isoformat(),
                    "kind": r[2],
                    "summary": r[3],
                    "raw_data": r[4]
                } for r in rows
            ]


@app.post("/evals/run")
async def run_evals():
    """Trigger the Golden Evaluation suite synchronously and return result summary."""
    from app.evals import run_eval_suite
    results = run_eval_suite()
    return {"status": "ok", "results": results}


@app.get("/evals/history")
def get_evals_history(limit: int = 200):
    """Retrieve historical evaluation test runs."""
    import psycopg
    import re
    from app.settings import settings

    def parse_db_url_to_dsn(url):
        m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
        if not m:
            return url
        user, password, host, port, dbname = m.groups()
        return f"dbname={dbname} user={user} password={password} host={host} port={port}"

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, created_at, run_id, query, expected_route, actual_route, routing_match, judge_score, judge_reason, raw_response
                FROM eval_runs
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (limit,)
            )
            rows = cur.fetchall()
            return [
                {
                    "id": str(r[0]),
                    "created_at": r[1].isoformat(),
                    "run_id": r[2],
                    "query": r[3],
                    "expected_route": r[4],
                    "actual_route": r[5],
                    "routing_match": r[6],
                    "judge_score": r[7],
                    "judge_reason": r[8],
                    "raw_response": r[9]
                } for r in rows
            ]
