# VIZIER System Specification & Master Reconstruction Guide

This document provides a complete, context-free technical blueprint of the **VIZIER (Personal AI Chief-of-Staff)** project. It details the system architecture, directory layouts, database schemas, code templates, and configuration settings required to rebuild, replicate, or port the entire system from scratch in any environment.

---

## 1. System & Security Architecture

VIZIER is built on three core architectural principles: **Domain Specialization** via a supervisor-specialist multi-agent graph, **Security-First human-in-the-loop authorization** for write actions, and **State-preserving proactive workflows**.

### 1.1 Multi-Agent Routing Flow (LangGraph)
User prompts are intercepted by a supervisor agent that coordinates specialized specialist subgraphs. Execution follows a cyclic loop until the supervisor chooses to finalize.

```mermaid
graph TD
    User([User Prompt]) --> Supervisor{Supervisor Node}
    
    Supervisor -- Route: SCHEDULER --> Scheduler[Scheduler Specialist]
    Supervisor -- Route: SCRIBE --> Scribe[Scribe Specialist]
    Supervisor -- Route: RESEARCHER --> Researcher[Researcher Specialist]
    Supervisor -- Route: ANALYST --> Analyst[Analyst Specialist]
    
    Scheduler --> Sync[Return Output to Scratchpad] --> Supervisor
    Scribe --> Sync --> Supervisor
    Researcher --> Sync --> Supervisor
    Analyst --> Sync --> Supervisor
    
    Supervisor -- Route: FINALIZE --> Finalizer[Finalize Node]
    Finalizer --> MemoryNode[Extract & Save Memory] --> End([Output Response])
```

### 1.2 Write Actions Proposal Gate (Human-in-the-Loop)
Specialist agents are structurally prohibited from calling write APIs. Instead, they write to a database-backed gated proposal queue. Humans approve, reject, or edit proposals via the Dashboard or a Telegram link. An independent background worker polls the database for approved actions and executes them.

```mermaid
sequenceDiagram
    participant Agent as Specialist Agent
    participant DB as Supabase PostgreSQL
    participant Web as Web Dashboard / Telegram
    participant Poller as Background Poller Task
    participant API as External Google API

    Agent->>DB: INSERT proposed_actions (status='proposed', idempotency_key=UUID)
    Note over Agent, DB: High-risk actions trigger Telegram alerts
    Web->>DB: UPDATE proposed_actions SET status='approved' (Human Approve)
    loop Every 2 Seconds
        Poller->>DB: SELECT id WHERE status='approved'
        activate Poller
        Poller->>Poller: Idempotency check (ensure not already executed)
        Poller->>API: Execute write action (Gmail / Calendar API)
        API-->>Poller: Response (Gmail ID / Event Link)
        Poller->>DB: UPDATE proposed_actions SET status='executed', result=JSON
        deactivate Poller
    end
```

### 1.3 Prompt Injection Defense Pipeline
VIZIER employs a multi-tiered security pipeline to prevent **Indirect Prompt Injection** (e.g., malicious instructions hidden within fetched emails or website content).

1. **Spotlighting Delimiters:** Any untrusted external content fetched via APIs is quarantined within `<untrusted_source_data>` XML tags.
2. **Heuristic Keyword Scanner:** Payload and rationale fields are scanned using regular expressions for override keywords (`ignore previous instructions`, `bypass the gate`, etc.).
3. **Thread Correlation Check:** The checkpointer history is scanned to determine if sentences inside the proposed write payload overlap with untrusted data retrieved earlier in the thread.
4. **Auto-Escalation:** If heuristics or correlation check flags a proposal, its risk tier is auto-escalated to **HIGH**, forcing status to `proposed` (requiring human confirmation) even if the general cockpit setting allows auto-approval.

---

## 2. Directory & File Hierarchy Map

```
vizier/
├── README.md                           # Quickstart & overview pitch
├── PROGRESS.md                         # Detailed project log & milestone tracker
├── backend/                            # Python FastAPI + LangGraph Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application router & SSE chat streaming
│   │   ├── settings.py                 # Pydantic Settings env loader
│   │   ├── scheduler.py                # APScheduler Daily Morning Briefing & Weekly Review jobs
│   │   ├── observability.py            # Langfuse traces & spans integration
│   │   ├── evals.py                    # Golden dataset runner & LLM-as-a-Judge scoring engine
│   │   ├── run_migrations.py           # Helper to apply SQL migrations
│   │   ├── actions/                    # Proposal pipeline
│   │   │   ├── audit.py                # Append-only security audit logger
│   │   │   ├── proposer.py             # Policy permission checks, scanners, and proposal creation
│   │   │   ├── executors.py            # Real Google write API calls & mock demo executions
│   │   │   └── scanner.py              # Heuristics & checkpointer-based correlation checks
│   │   ├── agents/                     # LangGraph multi-agent configurations
│   │   │   ├── supervisor.py           # StateGraph router node & psycopg checkpointer
│   │   │   └── specialists.py          # Scheduler, Scribe, Researcher, Analyst agent subgraphs
│   │   ├── google/                     # Google Workspace API integration
│   │   │   ├── auth.py                 # Scopes, credential checking, token refreshes
│   │   │   ├── authorize.py            # Local OAuth browser authorization flow
│   │   │   └── gmail_reader.py         # MIME email extraction & searching
│   │   └── rag/                        # Memory & search pipeline
│   │       ├── memory.py               # Memory extraction node & database insertion
│   │       └── retrieve.py             # Hybrid Vector/Keyword search + RRF merger
│   ├── mcp_servers/
│   │   └── vizier_utils_server.py      # MCP Utilities server (time checks, todo lists)
│   ├── migrations/                     # Sequential PostgreSQL migrations (001 - 023)
│   ├── secrets/                        # Gitted placeholder / Local google OAuth tokens
│   ├── Dockerfile
│   └── requirements.txt
├── web/                                # Next.js frontend UI dashboard
│   ├── app/
│   │   ├── page.tsx                    # Command Center (Chat, Cockpit Inbox, Briefings)
│   │   ├── globals.css                 # Global styling overrides
│   │   ├── layout.tsx
│   │   └── [approvals, briefings, evals, audit, settings]/  # Sub-pages for admin panels
│   ├── lib/
│   │   ├── supabase.ts                 # Supabase JS client client configuration
│   │   └── markdown.tsx                # Markdown parser helper
│   ├── package.json
│   └── tsconfig.json
└── site/                               # Static D3 concentric knowledge brain visualizer
    ├── index.html                      # Landing page with embedded mini-brain
    ├── brain.html                      # Large interactive knowledge brain explorer
    ├── capabilities.html               # 7 structural capabilities detail
    └── brain-index.[preview/public].json # Graph dataset databases (preview vs actual ledger)
```

---

## 3. Consolidated Database Schema (DDL)

To replicate the backend database, apply the following DDL statements to a PostgreSQL database (equipped with the `pgvector` extension):

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================================
-- 1. ACADEMY LEARNING SCHEMA
-- =====================================================================
CREATE TABLE IF NOT EXISTS dictionary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    beginner_definition TEXT NOT NULL,
    deep_definition TEXT NOT NULL,
    analogy TEXT NOT NULL,
    related_terms TEXT[] DEFAULT '{}',
    first_seen_phase TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    body_markdown TEXT NOT NULL,
    competency_tag TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_phase_order UNIQUE (phase, order_index)
);

CREATE TABLE IF NOT EXISTS workbook_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    instruction_markdown TEXT NOT NULL,
    expected_observation TEXT NOT NULL,
    break_it_challenge TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type TEXT NOT NULL CHECK (item_type IN ('term', 'lesson', 'exercise')),
    item_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'done', 'review')),
    notes TEXT,
    ease_factor FLOAT DEFAULT 2.5,
    next_review_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_progress_item ON user_progress(item_type, item_id);

-- =====================================================================
-- 2. HYBRID RAG SCHEMA
-- =====================================================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doc_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(768),
    tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS doc_chunks_embedding_hnsw_idx ON doc_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS doc_chunks_tsv_gin_idx ON doc_chunks USING gin (tsv);

-- =====================================================================
-- 3. LONG-TERM SYSTEM MEMORIES
-- =====================================================================
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind VARCHAR(50) NOT NULL CHECK (kind IN ('semantic', 'episodic', 'procedural')),
    content TEXT NOT NULL,
    importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 10),
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_accessed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS memories_embedding_idx ON memories USING hnsw (embedding vector_cosine_ops);

-- =====================================================================
-- 4. SIMPLE TODOS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================================
-- 5. SAFETY COCKPIT & PROPOSALS PIPELINE
-- =====================================================================
CREATE TABLE IF NOT EXISTS proposed_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('send_email', 'create_calendar_event', 'create_task', 'label_email')),
    payload JSONB NOT NULL,
    rationale TEXT NOT NULL DEFAULT '',
    risk_tier TEXT NOT NULL CHECK (risk_tier IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'rejected', 'executed', 'failed')),
    idempotency_key TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decided_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ,
    result JSONB
);
CREATE INDEX IF NOT EXISTS idx_proposed_actions_status ON proposed_actions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposed_actions_agent ON proposed_actions (agent);

CREATE TABLE IF NOT EXISTS action_permissions (
    action_type TEXT PRIMARY KEY CHECK (action_type IN ('send_email', 'create_calendar_event', 'create_task', 'label_email')),
    permission_tier TEXT NOT NULL DEFAULT 'always_ask' CHECK (permission_tier IN ('always_ask', 'auto_approve_low_risk', 'blocked')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor TEXT NOT NULL, -- 'agent', 'human', 'system'
    event_type TEXT NOT NULL, -- 'proposal_created', 'proposal_approved', 'permission_changed', etc.
    details JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_log_ts ON audit_log (ts DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON audit_log (event_type);

-- =====================================================================
-- 6. BRIEFINGS & EVALS SCHEMA
-- =====================================================================
CREATE TABLE IF NOT EXISTS briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    kind TEXT NOT NULL CHECK (kind IN ('morning_briefing', 'weekly_review')),
    summary TEXT NOT NULL,
    raw_data JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_briefings_kind ON briefings (kind);
CREATE INDEX IF NOT EXISTS idx_briefings_created_at ON briefings (created_at DESC);

CREATE TABLE IF NOT EXISTS eval_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    run_id TEXT NOT NULL,
    query TEXT NOT NULL,
    expected_route TEXT NOT NULL,
    actual_route TEXT NOT NULL,
    routing_match BOOLEAN NOT NULL,
    judge_score FLOAT NOT NULL,
    judge_reason TEXT NOT NULL,
    raw_response TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_eval_runs_run_id ON eval_runs (run_id);
CREATE INDEX IF NOT EXISTS idx_eval_runs_created_at ON eval_runs (created_at DESC);
```

---

## 4. Backend Component Implementations

To enable replication, the core operational code of the backend is specified here. Skeletons represent the exact APIs, configurations, and core functional logic of the python service.

### 4.1 Model Gateway (`gateway.py`)
LiteLLM wrapper that manages exponential backoff, jitter, cooldowns, and on-disk caching.

```python
# app/llm/gateway.py
import os, time, random, hashlib, json, litellm
from app.settings import settings

litellm.telemetry = False

class ModelGateway:
    def __init__(self):
        self.cache_dir = ".cache"
        os.makedirs(self.cache_dir, exist_ok=True)
        self.cooldowns = {}
        
        self.providers = [
            {"name": "gemini", "model": f"gemini/{settings.GEMINI_MODEL}", "api_key": settings.GEMINI_API_KEY, "api_base": None},
            {"name": "groq", "model": "groq/llama-3.3-70b-versatile", "api_key": settings.GROQ_API_KEY, "api_base": None},
            {"name": "openrouter", "model": "openrouter/google/gemini-2.5-flash-lite:free", "api_key": settings.OPENROUTER_API_KEY, "api_base": "https://openrouter.ai/api/v1"},
            {"name": "ollama", "model": "ollama/qwen2.5:7b", "api_key": "ollama", "api_base": "http://localhost:11434"}
        ]

    def _get_cache_key(self, messages, model, tools, **kwargs):
        payload = {"messages": messages, "model": model, "tools": tools, "kwargs": kwargs}
        return hashlib.md5(json.dumps(payload, sort_keys=True).encode()).hexdigest()

    def complete(self, messages, tools=None, reasoning=False, **kwargs):
        # Cache Lookup
        cache_key = self._get_cache_key(messages, self.providers[0]["model"], tools, **kwargs)
        cache_path = os.path.join(self.cache_dir, f"{cache_key}.json")
        if os.path.exists(cache_path): return json.load(open(cache_path, "r"))

        # Provider loop with fallbacks
        for provider in self.providers:
            name = provider["name"]
            if self.cooldowns.get(name, 0) > time.time(): continue
            
            litellm.api_key = provider["api_key"]
            litellm.api_base = provider["api_base"]
            
            for attempt in range(3):
                try:
                    response = litellm.completion(
                        model=provider["model"], messages=messages, tools=tools, temperature=0.2, **kwargs
                    )
                    choice = response.choices[0]
                    parsed_tools = None
                    if getattr(choice.message, "tool_calls", None):
                        parsed_tools = [{
                            "id": tc.id, "type": tc.type,
                            "function": {"name": tc.function.name, "arguments": tc.function.arguments}
                        } for tc in choice.message.tool_calls]
                        
                    res = {"reply": choice.message.content or "", "tool_calls": parsed_tools, "provider": name}
                    # Save to Cache
                    json.dump(res, open(cache_path, "w"))
                    return res
                except Exception as e:
                    if "429" in str(e) and attempt < 2:
                        time.sleep(2.0 * (2 ** attempt) + random.uniform(0, 1.0))
                    else:
                        self.cooldowns[name] = time.time() + 60.0 # Cooldown for 1 minute
                        break
        raise RuntimeError("All LLM providers failed.")

    def embed(self, texts):
        # Calls gemini/text-embedding-004, falls back to sentence-transformers locally
        try:
            litellm.api_key = settings.GEMINI_API_KEY
            res = litellm.embedding(model="gemini/text-embedding-004", input=texts)
            return [d["embedding"] for d in res["data"]]
        except Exception:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer("all-mpnet-base-v2")
            return [e.tolist() for e in model.encode(texts)]
```

### 4.2 Supervisor Agent (`supervisor.py`)
Coordinates LangGraph routing and persists checkpoints into PostgreSQL.

```python
# app/agents/supervisor.py
from typing import Annotated, Sequence, TypedDict, Dict, Any, Literal
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.postgres import PostgresSaver
from psycopg_pool import ConnectionPool
from app.llm.gateway import gateway

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    scratchpad: Dict[str, str]
    next_agent: str
    visited: Annotated[list, lambda x, y: x + y]

def call_supervisor(state: AgentState):
    user_query = next((m.content for m in reversed(state["messages"]) if isinstance(m, HumanMessage)), "")
    
    # Retrieve memories
    from app.rag.memory import get_relevant_memories
    mems = get_relevant_memories(user_query, limit=3)
    memories_str = "\n".join(f"- {m['content']}" for m in mems)
    
    system_prompt = (
        "You are VIZIER's Supervisor. Choose the next specialized agent: SCHEDULER, SCRIBE, RESEARCHER, ANALYST. "
        "Choose FINALIZE when you have all facts to satisfy the query.\n"
        f"Memories:\n{memories_str}\n"
        f"Scratchpad:\n{json.dumps(state.get('scratchpad', {}))}\n"
        "Format reply as JSON: {'next_agent': '...', 'rationale': '...', 'task_brief': '...'}"
    )
    
    res = gateway.complete([{"role": "system", "content": system_prompt}], response_format={"type": "json_object"})
    decision = json.loads(res["reply"])
    chosen = decision["next_agent"]
    
    if chosen in state.get("visited", []): chosen = "FINALIZE"
    return {"next_agent": chosen, "visited": [chosen] if chosen != "FINALIZE" else []}

# Define Specialist Nodes calling sub-agent graphs ...
# ...
```

### 4.3 Specialist Agents (`specialists.py`)
Details the tools and sub-graphs for Scribe, Scheduler, Researcher, and Analyst.

```python
# app/agents/specialists.py
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode
import datetime, yfinance as yf

# ----------------- SCHEDULER TOOLS -----------------
@tool
def get_current_time():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@tool
def propose_create_calendar_event(title: str, start_time: str, end_time: str, description: str, rationale: str, config=None):
    from app.actions.proposer import propose_action
    tid = config.get("configurable", {}).get("thread_id") if config else None
    pid = propose_action("SCHEDULER", "create_calendar_event", 
                         {"title": title, "start_time": start_time, "end_time": end_time, "description": description},
                         "medium", rationale, thread_id=tid)
    return f"Proposal created: ID {pid}"

# ----------------- SCRIBE TOOLS -----------------
@tool
def read_recent_emails():
    # Fetch from gmail
    return "<untrusted_source_data>Emails text here</untrusted_source_data>"

@tool
def propose_send_email(to: str, subject: str, body: str, rationale: str, config=None):
    from app.actions.proposer import propose_action
    tid = config.get("configurable", {}).get("thread_id") if config else None
    pid = propose_action("SCRIBE", "send_email", {"to": to, "subject": subject, "body": body}, "high", rationale, thread_id=tid)
    return f"Proposal created: ID {pid}"

# ----------------- RESEARCHER TOOLS -----------------
@tool
def web_search(query: str):
    from duckduckgo_search import DDGS
    with DDGS() as ddgs:
        return str([r for r in ddgs.text(query, max_results=3)])

# ----------------- ANALYST TOOLS -----------------
@tool
def stock_lookup(symbol: str):
    t = yf.Ticker(symbol.upper())
    hist = t.history(period="1d")
    return f"Close: {hist['Close'].iloc[-1]}"
```

### 4.4 Proposal pipeline (`proposer.py` & `executors.py`)
Bridges agent tools and Google APIs via security checks and manual intervention limits.

```python
# app/actions/proposer.py
import psycopg, uuid, json
from app.settings import settings
from app.actions.scanner import scan_content_heuristics, check_untrusted_correlation

def propose_action(agent, action_type, payload, risk_tier, rationale, thread_id=None):
    # 1. Permission checks
    dsn = parse_db_url(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT permission_tier FROM action_permissions WHERE action_type=%s", (action_type,))
            row = cur.fetchone()
            policy = row[0] if row else "always_ask"
            
    if policy == "blocked":
        raise PermissionError(f"Action {action_type} is blocked.")

    # 2. Scanner protections
    is_flagged = scan_content_heuristics(str(payload) + " " + rationale)
    if not is_flagged and thread_id:
        is_flagged = check_untrusted_correlation(payload, thread_id)
        
    if is_flagged:
        risk_tier = "high"
        status = "proposed"
    else:
        status = "approved" if (policy == "auto_approve_low_risk" and risk_tier == "low") else "proposed"

    # 3. Create Proposal
    proposal_id = str(uuid.uuid4())
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO proposed_actions (id, agent, action_type, payload, rationale, risk_tier, status) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (proposal_id, agent, action_type, json.dumps(payload), rationale, risk_tier, status)
            )
    return proposal_id
```

```python
# app/actions/executors.py
import psycopg, json
from app.settings import settings
from app.google.auth import get_google_credentials

def execute_send_email(proposal_id):
    # Gated write logic calling Gmail API
    # Verify status is approved & use unique idempotency key
    pass

def execute_proposal(proposal_id):
    if settings.DEMO_MODE:
        # Mock execution logic returning dummy results immediately
        return {"status": "simulated_executed", "proposal_id": proposal_id}
    # Load proposal, dispatch to execute_send_email/execute_create_calendar_event etc.
```

### 4.5 Security Scanner (`scanner.py`)
Heuristics matching and thread-based correlation logic.

```python
# app/actions/scanner.py
import re
from app.agents.supervisor import supervisor_agent
from langchain_core.messages import ToolMessage

SUSPICIOUS = [r"ignore\s+previous\s+instructions", r"system\s+override", r"bypass\s+the\s+gate"]

def scan_content_heuristics(text: str) -> bool:
    return any(re.search(p, text, re.IGNORECASE) for p in SUSPICIOUS)

def check_untrusted_correlation(payload: dict, thread_id: str) -> bool:
    config = {"configurable": {"thread_id": thread_id}}
    state = supervisor_agent.get_state(config)
    
    # Extract untrusted texts
    untrusted = []
    for msg in state.values.get("messages", []):
        if isinstance(msg, ToolMessage) and msg.name in ("read_recent_emails", "web_fetch"):
            m = re.search(r"<untrusted_source_data>(.*?)</untrusted_source_data>", msg.content, re.DOTALL)
            untrusted.append(m.group(1) if m else msg.content)
            
    payload_str = " ".join(str(v) for v in payload.values()).lower()
    for text in untrusted:
        for sentence in re.split(r'[.!?\n]', text):
            clean = sentence.strip().lower()
            if len(clean) > 20 and clean in payload_str:
                return True
    return False
```

### 4.6 Long-Term Memory & RAG Retrieval (`memory.py` & `retrieve.py`)
Computes embeddings, runs pgvector similarity queries, and merges results using Reciprocal Rank Fusion (RRF).

```python
# app/rag/retrieve.py
import psycopg
from app.settings import settings
from app.llm.gateway import gateway

def reciprocal_rank_fusion(vector_results, text_results, k=60):
    scores = {}
    for rank, doc in enumerate(vector_results):
        scores[doc["id"]] = {"doc": doc, "score": 1.0 / (k + rank + 1)}
    for rank, doc in enumerate(text_results):
        did = doc["id"]
        if did not in scores: scores[did] = {"doc": doc, "score": 0.0}
        scores[did]["score"] += 1.0 / (k + rank + 1)
    return [item["doc"] for item in sorted(scores.values(), key=lambda x: x["score"], reverse=True)]

def search(query, limit=5):
    # Generate query embedding
    vec = gateway.embed([query])[0]
    vec_str = str(vec)
    
    # Parallel query database
    dsn = parse_db_url(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            # 1. Vector Cosine Search
            cur.execute("SELECT c.id, c.content, d.title FROM doc_chunks c JOIN documents d ON c.document_id=d.id ORDER BY c.embedding <=> %s::vector LIMIT %s", (vec_str, limit * 2))
            vector_res = [{"id": r[0], "content": r[1], "title": r[2]} for r in cur.fetchall()]
            
            # 2. Full-Text GIN Keyword Search
            cur.execute("SELECT c.id, c.content, d.title FROM doc_chunks c JOIN documents d ON c.document_id=d.id WHERE c.tsv @@ websearch_to_tsquery('english', %s) LIMIT %s", (query, limit * 2))
            text_res = [{"id": r[0], "content": r[1], "title": r[2]} for r in cur.fetchall()]
            
    return reciprocal_rank_fusion(vector_res, text_res)[:limit]
```

### 4.7 Background Scheduler (`scheduler.py`)
Orchestrates parallel daily briefings and weekly memory scans.

```python
# app/scheduler.py
import asyncio, httpx
from app.llm.gateway import gateway

async def gather_weather():
    res = await httpx.get("https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true")
    return res.json().get("current_weather")

async def run_morning_briefing():
    # Gather weather, calendar events, emails, todos in parallel
    weather, calendar, email = await asyncio.gather(gather_weather(), get_calendar(), get_emails())
    
    prompt = f"Write morning brief based on:\nWeather: {weather}\nCalendar: {calendar}\nEmail: {email}"
    res = gateway.complete([{"role": "user", "content": prompt}])
    
    # Save to briefings table & push alert to Telegram
    # ...
    return res["reply"]
```

---

## 5. Frontend Dashboard (Next.js & Supabase)

The Command Center features a real-time reactive grid built with Next.js and Supabase Client APIs. It handles SSE event streams for the chat interface and listens to real-time database modifications on approvals.

```typescript
// web/app/page.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardHome() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [proposals, setProposals] = useState<any[]>([]);
  const [statusText, setStatusText] = useState<string | null>(null);

  // Subscribe to real-time safety proposals in Safety Cockpit Panel
  useEffect(() => {
    fetchPendingProposals();
    const sub = supabase
      .channel("proposals-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "proposed_actions" }, () => {
        fetchPendingProposals();
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(prev => [...prev, { sender: "user", text: inputText }]);
    setInputText("");
    
    // Server-Sent Events (SSE) chat streaming
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputText, thread_id: "default-thread" })
    });
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let reply = "";
    
    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      // Process SSE events: 'event: status', 'event: message'
      // Parse payload to update statusText or append content to reply
    }
  };

  return (
    <div className="flex h-screen bg-[#090a0f] text-slate-100">
      {/* LEFT PANEL: Briefings & Stats */}
      {/* CENTER PANEL: Streaming Chat Console */}
      {/* RIGHT PANEL: Real-time Gated Safety Cockpit (Human Inbox) */}
    </div>
  );
}
```

---

## 6. Static Brain Visualization & Build Pipeline

The frontend portal contains an interactive, Canvas-based knowledge graph detailing the ledger of completed lessons.

### 6.1 Layout Engine (`brain.html`)
- **Cinematic Concentric Rings:** Renders note nodes along concentric circles grouped by domain (gut, mind, nutrition, meta) to represent memory bands. Spin velocity is modifiable.
- **Force-Directed Layout:** Toggleable traditional spring physics engine layout.
- **D3.js Implementation:** Uses HTML Canvas context for rendering up to 1,500 nodes efficiently, with SVG overlays for links, boundaries, and active highlights.

### 6.2 Seed/Build Processes
- **Unified Build Engine (`tools/site-build/build.js`):** Compiles the master curriculum node graph from `curriculum.json` and local markdown notes, resolving relative wiki links, wiping emojis, updating date trackers, and packaging identical datasets with 200 plan nodes for both VISION and LIVE mode distribution.

---

## 7. Step-by-step Reconstruction & Porting Guide

To rebuild or port this system, complete the following steps in sequence:

### Step 1: Environment & Credentials Configuration
Create a `.env` file in `backend/` containing:
```ini
GEMINI_API_KEY="your_gemini_api_key"
GEMINI_MODEL="gemini-2.5-flash-lite"
GROQ_API_KEY="your_groq_api_key"
OPENROUTER_API_KEY="your_openrouter_api_key"

SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="eyJhb..."
SUPABASE_SERVICE_ROLE_KEY="eyJhb..."
SUPABASE_DB_URL="postgresql://postgres:your_pwd@db.your-project.supabase.co:5432/postgres"

LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_HOST="https://cloud.langfuse.com"

TELEGRAM_BOT_TOKEN="bot_token"
TELEGRAM_CHAT_ID="chat_id"

DEMO_MODE=True  # Enables mock executions without actual API credentials
```

### Step 2: Set Up Database Schemas
1. Start a PostgreSQL instance (or create a Supabase project).
2. Enable `pgvector` extension.
3. Run the consolidated DDL commands in Section 3 to establish tables, indexes, and constraints.
4. Run migrations using python:
   ```bash
   cd backend
   python -m app.run_migrations
   ```

### Step 3: Run Google Workspace OAuth Authorization
If running in live production (not `DEMO_MODE=True`):
1. Create a Project on Google Cloud Console.
2. Enable Gmail API, Google Calendar API, and Google Tasks API.
3. Configure the OAuth Consent Screen and download `google_oauth_client.json` to `backend/secrets/`.
4. Trigger the local local server flow:
   ```bash
   python -m app.google.authorize
   ```
   Follow the browser prompt to generate `google_token.json` in `backend/secrets/`.

### Step 4: Run the Backend Services
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Spawn the FastAPI backend:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
   *Note: This automatically starts the background polling loop for approved actions and starts the APScheduler cron engines.*

### Step 5: Start the Frontend UI Command Center
1. Navigate to the web workspace and configure environment keys:
   Configure `web/.env.local` to point to Supabase URL/Keys.
2. Install npm packages and run dev server:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` to interact with VIZIER.
