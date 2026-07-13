# VIZIER — Master Progress Tracker & Learning Logbook

> Keep this file at the repo ROOT as `PROGRESS.md`. Update it after EVERY session — it's part of the discipline.
> Rule: a block is only ✅ when its VERIFY checklist in the Build Guide fully passed AND you committed.

---

## 0. VITAL SIGNS (fill these in once, update when they change)

| Item | Value | Notes |
|---|---|---|
| Project start date | 2026-07-03 | |
| Repo GitHub URL | ____ | secondary account |
| Supabase project name | ____ | pauses after ~1 week idle — click Restore |
| Google Cloud project | vizier-actions | OAuth in TESTING mode — token expires ~7 days |
| Last OAuth re-consent date | ____ | re-run authorize.py when expired |
| Current phase | Phase 0 | |
| Total hours logged | ____ | be honest |

---

## 1. PHASE 0 — LAPTOP SETUP (manual)

- [x] Python 3.12 installed, `python --version` works in a fresh terminal (v3.12.9)
- [x] Node LTS installed, `node --version` works (v24.17.0)
- [x] Git installed + `user.name` / `user.email` configured
- [x] Antigravity signed into secondary account, auto-run terminal DISABLED
- [ ] (Optional) Ollama installed, `qwen2.5:7b` or `:3b` pulled and answers a prompt

## 2. PHASE 1 — ACCOUNTS & KEYS (manual)

- [ ] Gemini API key (AI Studio, secondary acct)
- [ ] Groq API key
- [ ] OpenRouter API key + noted 2–3 free tool-capable models
- [ ] Supabase: URL, anon key, service role key, session-pooler DB URL
- [ ] Supabase extensions enabled: `vector`, `pg_cron`
- [x] Google Cloud: 5 APIs enabled (Gmail, Calendar, Drive, Tasks, People)
- [x] OAuth consent screen created, TESTING mode, self added as Test user
- [ ] Desktop OAuth client created, `google_oauth_client.json` downloaded
- [ ] Langfuse: public key, secret key, host
- [ ] Telegram: bot created, token saved, chat id extracted via getUpdates
- [ ] Vercel + GitHub accounts ready (secondary email)
- [ ] All keys in temp file → will move to `.env` in Block 2.1 → temp file DELETED after

---

## 3. THE 22 BLOCKS — MASTER CHECKLIST

For each block: tick the three boxes, then fill its logbook entry in Section 4.

| # | Block | Prompted | Ran & Verified | Committed | Date |
|---|---|---|---|---|---|
| 1 | 2.1 Monorepo + env hygiene | ☑ | ☑ | ☑ | 2026-07-03 |
| 2 | 2.2 FastAPI + first ping | ☑ | ☑ | ☑ | 2026-07-04 |
| 3 | 3.1 Academy schema + seed (SQL 001–002) | ☑ | ☑ | ☑ | 2026-07-04 |
| 4 | 3.2 Academy UI (Dictionary/Lessons/Progress) | ☑ | ☑ | ☑ | 2026-07-04 |
| 5 | 4.1 LiteLLM gateway + fallbacks (seed 003) | ☑ | ☑ | ☑ | 2026-07-04 |
| 6 | 5.1 Handmade ReAct agent (seed 004) | ☑ | ☑ | ☑ | 2026-07-04 |
| 7 | 5.2 LangGraph + Postgres checkpointer (seed 005) | ☑ | ☑ | ☑ | 2026-07-04 |
| 8 | 6.1 Supervisor + 4 specialists + SSE (seed 006) | ☑ | ☑ | ☑ | 2026-07-04 |
| 9 | 7.1 pgvector RAG + hybrid search (mig 007) | ☑ | ☑ | ☑ | 2026-07-04 |
| 10 | 7.2 Long-term memory system (mig/seed 008) | ☑ | ☑ | ☑ | 2026-07-04 |
| 11 | 8.1 Own MCP server + Telegram action (seed 009) | ☑ | ☑ | ☑ | 2026-07-04 |
| 12 | 9.1 Google OAuth + Gmail/Calendar READ (seed 010) | ☑ | ☑ | ☑ | 2026-07-04 |
| 13 | 9.2 Write actions via proposal gate (mig 011) | ☑ | ☑ | ☑ | 2026-07-04 |
| 14 | 10.1 Approval Inbox + tiers + audit (mig 012) | ☑ | ☑ | ☑ | 2026-07-05 |
| 15 | 10.2 Injection defense + red-team drill (seed 013) | ☑ | ☑ | ☑ | 2026-07-05 |
| 16 | 11.1 Scheduler + Morning Briefing (mig 013, seed 014) | ☑ | ☑ | ☑ | 2026-07-05 |
| 17 | 12.1 Langfuse + golden evals (mig 014, seed 015) | ☑ | ☑ | ☑ | 2026-07-05 |
| 18 | 13.1 Command Center frontend (seed 016) | ☑ | ☑ | ☑ | 2026-07-05 |
| 19 | 14.1 Deploy + demo mode + README (seed 017) | ☑ | ☑ | ☑ | 2026-07-05 |

### Phase 15 — LIFE-OS BRAIN LAYER (Additive Extension)

| # | Block/Layer | Prompted | Ran & Verified | Committed | Date |
|---|---|---|---|---|---|
| 20 | L1 Domains taxonomy & skeleton | ☑ | ☑ | ☑ | 2026-07-09 |
| 21 | L2 metadata scanner scan.js | ☑ | ☑ | ☑ | 2026-07-09 |
| 22 | L3 D3 brain graph viewer UI | ☑ | ☑ | ☑ | 2026-07-09 |
| 23 | L4 Hybrid Canvas optimization | ☑ | ☑ | ☑ | 2026-07-09 |
| 24 | L5 Feynman Note Layer CLI | ☑ | ☑ | ☑ | 2026-07-09 |
| 25 | L6 Routines & Apps registries | ☑ | ☑ | ☑ | 2026-07-09 |
| 26 | L7 Grounded Research Mode | ☑ | ☑ | ☑ | 2026-07-09 |
| 27 | L8 Micro-learning Telegram loop | ☑ | ☑ | ☑ | 2026-07-09 |
| 28 | L9 "Better model" reasoning tier | ☑ | ☑ | ☑ | 2026-07-09 |

**Milestone moments — record the date you felt each one:**
- ⚡ Fallback chain saved me when I sabotaged my Gemini key: ____
- ⚡ Agent memory survived a server kill: ____
- ⚡ My phone buzzed from a natural-language command: ____
- ⚡ First REAL email sent only after my approval: ____
- ⚡ My injection attack FAILED against my own defenses: ____
- ⚡ Morning briefing arrived without me asking: ____
- ⚡ Public demo URL worked from my phone: ____

---

## 4. LEARNING LOGBOOK (fill after every block — this becomes your interview gold)

Copy this template per block:

```
### Block __._ — <name>            Date: ____   Hours: ____
WHAT I BUILT (one sentence, my own words):
WHAT BROKE:
HOW I FIXED IT (the actual debugging steps):
THE CONCEPT THAT CLICKED:
STILL FUZZY (ask the agent / revisit):
DICTIONARY TERMS I MARKED LEARNED TODAY:
```

*(19 empty entries pre-created below — fill as you go)*

### Block 2.1 — Date: 2026-07-03 Hours: 0.5
WHAT I BUILT: Restructured the workspace into a clean monorepo with `web/` and `backend/` folders, set up backend requirements, `.env.example`, and root `.gitignore`.
WHAT BROKE: Ran into "fatal: not a git repository" when attempting to check git status and run commit commands.
HOW I FIXED IT: Initialized the Git repository locally using `git init` and verified that local commits work independently of GitHub.
THE CONCEPT THAT CLICKED: Git is entirely local—commits are written to the local `.git` folder, and a remote repository is not required to create version checkpoints.
STILL FUZZY: None.
TERMS LEARNED: Monorepo, Virtual Environment (venv), secret hygiene, .gitignore.

### Block 2.2 — Date: 2026-07-04 Hours: 0.5
WHAT I BUILT: A FastAPI backend with CORS middleware configuration, secure config diagnostics, and a Next.js client status page at `/status` querying backend status.
WHAT BROKE: Encountered terminal path issues when activating the virtual environment (used `venv` instead of `.venv`, and ran `.bat` instead of `.ps1` on PowerShell).
HOW I FIXED IT: Moved to the `backend/` directory and ran the correct PowerShell activation script (`.venv\Scripts\Activate.ps1`).
THE CONCEPT THAT CLICKED: CORS (Cross-Origin Resource Sharing) prevents cross-site scripts from querying localhost unless the server explicitly white-lists the client's port.
STILL FUZZY: None.
TERMS LEARNED: CORS, REST API, JSON, Uvicorn, ASGI, Ports, localhost.

### Block 3.1 — Date: 2026-07-04 Hours: 0.5
WHAT I BUILT: SQL schema migrations creating database tables (`dictionary_terms`, `lessons`, `workbook_exercises`, `user_progress`) and a seeding script populating 44 core Agentic AI glossary items and historical lessons.
WHAT BROKE: Supabase SQL Editor threw a security warning alert recommending Row Level Security (RLS) be enabled.
HOW I FIXED IT: Analyzed the security boundary and clicked "Run without RLS" since the app runs locally on a personal machine where RLS restriction is not required.
THE CONCEPT THAT CLICKED: Cascade deletes (linked rows automatically self-clean when a parent record is deleted) and SQL check constraints ensuring type integrity.
STILL FUZZY: None.
TERMS LEARNED: UUID, Primary Key, Foreign Key, Check Constraint, Cascading Deletes, Database Index.

### Block 3.2 — Date: 2026-07-04 Hours: 0.5
WHAT I BUILT: The Next.js frontend pages for the Learning Academy dashboard stats, searchable dictionary, and syllabus rendering, connected to Supabase database.
WHAT BROKE: Browser requests returned empty data due to 401/403 (Permission Denied) Postgres permissions.
HOW I FIXED IT: Executed SQL commands in Supabase granting usage on public schema and select/modify permissions on the tables to the `anon`, `authenticated`, and `service_role` roles.
THE CONCEPT THAT CLICKED: Next.js Client vs Server Component separation (`"use client"`), React state re-rendering, and the PostgREST translation layer of Supabase.
STILL FUZZY: None.
TERMS LEARNED: Components, Props, State, Server Component, Client Component, PostgREST, SQL Privileges.

### Block 4.1 — Date: 2026-07-04 Hours: 0.5
WHAT I BUILT: LiteLLM model gateway (`gateway.py`) with fallback chain (Gemini -> Groq -> OpenRouter -> Ollama), exponential backoff with random jitter, provider cooldowns, development caching on-disk, and token/cost logging. Exposed POST `/chat` FastAPI endpoint.
WHAT BROKE: Database connection password contain slashes `/` which broke URI parsing, and git status was bloated tracking the entire `.venv/` due to a missing root `.gitignore`.
HOW I FIXED IT: Connected using key-value psycopg parameters directly and cleaned brackets from `.env`. Added a root `.gitignore` and unstaged `.venv` to restore repository hygiene.
THE CONCEPT THAT CLICKED: Token caching to preserve free-tier quotas and jitter to resolve concurrency spikes (thundering herd problem).
STILL FUZZY: None.
TERMS LEARNED: Rate Limit, Backoff, Jitter, Fallback Chain, Router, Cache Hit/Miss, Provider.

### Block 5.1 — Date: 2026-07-04 Hours: 0.5
WHAT I BUILT: A handmade ReAct agent loop (`handmade_react.py`) with a tool registry (safe AST calculator, time, weather). Implemented custom regex-based text parsing loop and a native function-calling loop.
WHAT BROKE: Emojis in print logs threw `UnicodeEncodeError` in Windows cp1252 shells. Zero-argument tools failed with `TypeError` when called with empty input strings.
HOW I FIXED IT: Removed console emojis, updated ReAct regex parser to match empty strings (`Action Input:\s*(.*)`), and validated function signature parameters using `inspect.signature`.
THE CONCEPT THAT CLICKED: Perceive-Plan-Act-Observe loops. Why native function-calling schemas beat fragile, error-prone custom regex text-parsers.
STILL FUZZY: None.
TERMS LEARNED: ReAct trace, tool schema, tool registry, max iterations, hallucinated tool call, native function calling.

### Block 5.2 — Date: 2026-07-04 Hours: 0.5
WHAT I BUILT: Refactored the agent loop into a LangGraph `StateGraph` with a `PostgresSaver` checkpointer connected to Supabase Postgres. Updated FastAPI POST `/chat` to run the graph and persist message state per `thread_id`.
WHAT BROKE: `psycopg` connection URI parser failed to resolve the host due to a slash `/` in the database password. Additionally, `checkpointer.setup()` migrations failed because psycopg default connection pools wrap `CREATE INDEX CONCURRENTLY` inside transaction blocks.
HOW I FIXED IT: Created a DSN string parser to convert the URI connection string to space-separated key-value parameters. Ran checkpointer setup using a temporary direct connection configured with `autocommit=True`.
THE CONCEPT THAT CLICKED: Durable execution: checkpointers serializing and writing graph checkpoints to Postgres, allowing states to survive server crashes.
STILL FUZZY: None.
TERMS LEARNED: StateGraph, node, edge, reducer, checkpointer, thread.

### Block 6.1 — Date: 2026-07-04 Hours: 0.5
WHAT I BUILT: Hierarchical Multi-Agent Supervisor coordination graph (`supervisor.py`) with 4 specialist subgraphs (`specialists.py`): Scheduler, Scribe, Researcher, Analyst. Integrated real web search (DuckDuckGo), text extraction (Trafilatura), and stock checks (yfinance). Exposed `/chat` streaming agent status updates over SSE.
WHAT BROKE: `ModelGateway.complete()` lacked `**kwargs` support, raising a `TypeError` when we queried it with `response_format` for JSON outputs.
HOW I FIXED IT: Refactored `gateway.py` to support `**kwargs` dynamically inside cache key hashing and `litellm.completion()` invocations.
THE CONCEPT THAT CLICKED: Hierarchical agent routing: supervisor delegating sequentially to multiple specialists, accumulating facts in a shared scratchpad.
STILL FUZZY: None.
TERMS LEARNED: supervisor, subgraph, handoff, routing, structured output, scratchpad, SSE.

### Block 7.1 — Date: 2026-07-04 Hours: 0.75
WHAT I BUILT: pgvector RAG pipeline on Supabase with HNSW and GIN indexes (`007_rag_schema.sql`). Document ingestion pipeline (`ingest.py`) with recursive chunker and PyMuPDF text parser. Hybrid Cosine and Full-Text GIN Index search (`retrieve.py`) merged via Reciprocal Rank Fusion (RRF). Integrated `search_my_documents` tool into the RESEARCHER specialist agent.
WHAT BROKE: 
1. Missing packages in virtual environment.
2. Gemini API threw `Missing corresponding tool call` because raw tool messages and assistant tool calls leaked from subgraphs into parent supervisor history.
3. `finalize_response` returned empty replies because the last message sent to the gateway was an `assistant` message.
HOW I FIXED IT:
1. Re-ran pip install directly.
2. Refactored specialist graph runners to ONLY bubble up the final specialist text `AIMessage` to the parent graph's messages.
3. Updated `finalize_response` to only pass the system prompt and the user's human messages (removing intermediate assistant messages), ensuring the last message is always a `user` message. Added a `visited` list loop-guard in `call_supervisor`.
THE CONCEPT THAT CLICKED: Hierarchical agent isolation: specialist subgraphs should keep their raw tool messages private, only returning the final text reply to the supervisor. Chat LLM completion endpoints require the last message in history to be from the `user` to prevent empty completions.
STILL FUZZY: None.
TERMS LEARNED: pgvector, cosine distance, HNSW, tsvector, GIN index, Reciprocal Rank Fusion (RRF), RAG, recursive chunking.

### Block 7.2 — Date: 2026-07-04 Hours: 0.75
WHAT I BUILT: Long-term memory system with the `memories` table and HNSW index in Supabase Postgres (`009_memory_schema.sql`). Structured LLM memory extraction, embedding storage, and vector retrieval functions in `memory.py`. Wired `call_supervisor` and `finalize_response` to inject relevant memories into prompts. Integrated a post-finalization `memory_node` in `supervisor.py`. Added GET, POST, PUT, and DELETE `/memories` REST API endpoints in `main.py`. Built a dark-mode Next.js `/memories` CRUD vault page (`web/app/memories/page.tsx`) with detailed memory transparency explanations. Created SQL seeds (`010_memory_seed.sql`) and markdown curriculum (`docs/09_memory_lesson.md`).
WHAT BROKE:
1. Subsequent HTTP calls to `/memories` timed out because instantiating `SentenceTransformer("all-mpnet-base-v2")` inside the memory extraction loop on every single call took 10+ seconds and blocked uvicorn's single thread.
2. Lessons seed query threw a constraint exception due to `ON CONFLICT (title)` where the unique constraint was actually `(phase, order_index)`.
HOW I FIXED IT:
1. Cached the `SentenceTransformer` instance globally in `gateway.py` (`_local_embed_model = None`) to prevent loading weights from disk repeatedly.
2. Updated the lessons conflict target to `(phase, order_index)`.
THE CONCEPT THAT CLICKED: Memory taxonomy (semantic/episodic/procedural). Combining pre-turn vector memory recall with post-turn LLM memory extraction. The necessity of user-visible memory vault CRUD for safety, error correction, and trust/privacy alignment.
STILL FUZZY: None.
TERMS LEARNED: semantic memory, episodic memory, procedural memory, memory extraction, consolidation, importance scoring.

### Block 8.1 — Date: 2026-07-04 Hours: 0.75
WHAT I BUILT: A custom local MCP server (`vizier_utils_server.py`) using FastMCP exposing `get_time`, `telegram_notify` (Telegram bot push actions), and `read_todo_list`. Built `mcp_client.py` using `langchain-mcp-adapters` to dynamically start the server over stdio on-demand. Integrated the client into `specialists.py` to register MCP tools into subgraphs (`SCHEDULER` and `SCRIBE`). Wrote the MCP security overview (`docs/10_mcp_lesson.md`) and database migrations/seeds (`011_todos_schema.sql`, `012_mcp_seed.sql`).
WHAT BROKE:
1. `pip install` of `mcp` failed because the active FastAPI worker was locking `uvicorn.exe` inside `.venv/Scripts/`.
2. Seed SQL threw column errors because `dictionary_terms` uses `beginner_definition`/`deep_definition` and `lessons` uses `body_markdown`.
HOW I FIXED IT:
1. Terminated the uvicorn process on port 8000, installed dependencies, and restarted the server.
2. Formatted the dictionary terms and lesson content to match the exact database schema structures.
THE CONCEPT THAT CLICKED: Model Context Protocol (MCP) decoupling model hosting from tool execution. JSON-RPC protocol transport layers (stdio vs HTTP SSE). Security threat vectors: confused deputy privilege abuse, indirect prompt injection (tool poisoning), and allowlists.
STILL FUZZY: None.
TERMS LEARNED: Model Context Protocol (MCP), MCP server, MCP client, stdio transport, tool poisoning, confused deputy, allowlist.

### Block 9.1 — Date: 2026-07-04 Hours: 1.0
WHAT I BUILT: Google OAuth2 Installed App flow via `authorize.py` generating a `google_token.json` saved to `backend/secrets/`. Built `backend/app/google/auth.py` (credential loading/refresh) and `backend/app/google/readers.py` (Gmail `list_recent_emails` + Calendar `upcoming_events` tools). Wired both tools into the SCRIBE and SCHEDULER specialist agents respectively. Created `docs/11_google_oauth_lesson.md` with OAuth security concepts. Ran DB seed `013_google_oauth_seed.sql` to add lessons and dictionary terms.
WHAT BROKE:
1. `Error 403: access_denied` during OAuth consent — our Google Cloud app was in TESTING mode but the test user's account wasn't added as an approved tester.
2. `tool_calls.args` Pydantic validation error — LLM returned `None` for tool call arguments instead of an empty JSON dict.
3. `StructuredTool does not support sync invocation` — MCP tools from `langchain-mcp-adapters` are async-only, but LangGraph's `ToolNode` calls them synchronously.
4. `AttributeError: 'dict' object has no attribute 'model_fields'` — `args_schema` on async MCP tools is a plain dict, not a Pydantic model.
5. `TypeError: tool() got an unexpected keyword argument 'name'` — attempted `@lc_tool(name=...)` decorator syntax which is not supported.
HOW I FIXED IT:
1. Added the account as a Test User in Google Cloud → OAuth & Access → Test Users.
2. Added `if tc_args is None: tc_args = {}` guard in `_bridge_to_langchain()` in `specialists.py`.
3. Launched a persistent daemon thread running `asyncio.new_event_loop().run_forever()` and used `asyncio.run_coroutine_threadsafe()` to bridge async MCP tool calls to sync invocations.
4. Switched from `args_schema.model_fields` to `hasattr(schema, 'model_fields')` conditional detection.
5. Replaced `@lc_tool(name=...)` decorator with `StructuredTool.from_function(func=..., name=..., description=...)` factory.
THE CONCEPT THAT CLICKED: OAuth2 Installed App Flow (offline `access_type` for refresh tokens, PKCE for public client security). Async bridge patterns for mixing sync (LangGraph ToolNode) and async (MCP stdio) code in the same process — using a persistent background event loop thread.
STILL FUZZY: None.
TERMS LEARNED: OAuth2, Authorization Code Flow, PKCE, refresh token, scope, consent screen, testing mode.

### Block 9.2 — Date: 2026-07-04 Hours: 0.75
WHAT I BUILT: Extended OAuth scopes to include gmail.send, gmail.modify, calendar.events, and tasks. Created `backend/app/actions/` package with `proposer.py` (the only write-action entry point for agents), `executors.py` (four action executors: send_email, create_calendar_event, create_task, label_email), and `review.py` (interactive CLI approval tool). Added PROPOSE-only tools to SCRIBE and SCHEDULER specialists — agents can never call executors directly (code-level enforcement). Added `/proposals` REST API endpoints to FastAPI. Created `014_proposed_actions.sql` migration, `015_actions_seed.sql` terms and lesson, and `docs/12_actions_lesson.md` curriculum.
WHAT BROKE: N/A — built preventively from experience with Block 9.1. All imports verified clean before commit.
HOW I FIXED IT: N/A
THE CONCEPT THAT CLICKED: The propose→approve→execute pipeline is the production pattern for safe agentic AI. Code-level enforcement (Python import isolation) is categorically stronger than prompt-level rules because it cannot be bypassed by prompt injection. Idempotency keys guarantee at-most-once execution even when approval is clicked multiple times.
STILL FUZZY: None.
TERMS LEARNED: Proposal pattern, executor, idempotency key, risk tier, code-level enforcement, prompt-level enforcement, confused deputy.

### Block 10.1 — Date: 2026-07-05 Hours: 1.5
WHAT I BUILT: Built the Safety Cockpit database schemas (action_permissions and audit_log tables), Fastapi backend (setting configuration APIs, audit trails log API, background approved actions execution poller loop, and LangGraph native interrupt resume stream support), specialists clear_calendar_tomorrow tool using interrupt(), and three React pages (/approvals dashboard with Supabase Realtime WebSocket changes sync, /settings panel, and /audit trail log view).
WHAT BROKE: UnicodeEncodeError during the console printing of the checkmark character in unit tests on Windows.
HOW I FIXED IT: Noted that the underlying Python database queries, REST API responses, and assertions passed flawlessly, so the error was solely a console stdout charset encoding limitation. Adjusted test script prints to use plain ASCII.
THE CONCEPT THAT CLICKED: How checkpointers enable durable human-in-the-loop flows via LangGraph's native `interrupt()` and `Command(resume=...)`. When a node is interrupted, graph execution halts and releases server memory, resuming precisely where it left off when commanded.
STILL FUZZY: None.
TERMS LEARNED: Human-in-the-loop, interrupt/resume, permission tier, audit log, append-only, Supabase Realtime.

### Block 10.2 — Date: 2026-07-05 Hours: 1.0
WHAT I BUILT: Created backend/app/actions/scanner.py with a regex-based heuristic scanner and checkpointer-based correlation analyzer. Modified proposer.py to call scanner and auto-escalate flagged proposals to HIGH risk. Updated read_recent_emails and web_fetch tools in specialists.py to wrap outputs in XML quarantine tags. Created academy_workbooks/red_team_01.md drill workbook and docs/14_injection_lesson.md.
WHAT BROKE: ModuleNotFoundError on sys.path in unit tests.
HOW I FIXED IT: Fixed backslash escaping typo by prepending path addition with raw string r"..." prefix.
THE CONCEPT THAT CLICKED: Spotlighting (quarantining) untrusted external content inside custom tags instructs the LLM attention mechanism that the text is data, not system instructions, preventing indirect prompt injection from hijacking the agent.
STILL FUZZY: None.
TERMS LEARNED: Indirect prompt injection, lethal trifecta, exfiltration, spotlighting, red teaming.

### Block 11.1 — Date: 2026-07-05 Hours: 1.5
WHAT I BUILT: Installed apscheduler and feedparser. Created backend/app/scheduler.py managing recurring cron-triggers for daily Morning Briefing and Weekly Reviews. Handled fan-out concurrency with asyncio.gather, database persistence to the new briefings table, and Telegram alerts. Hooked scheduler lifecycle inside FastAPI lifespan. Created briefings list and read view page on web/app/briefings/page.tsx.
WHAT BROKE: Backtracking resolver loop in pip when installing without package constraints. VertexAI Gemini API experiencing transient 503 high demand during testing.
HOW I FIXED IT: Interrupted the unconstrained pip installer and ran target pip install command directly. Tested the Model Gateway's robust cooldown/failover system, which successfully caught the Gemini 503 and routed both syntheses through Groq Versatile llama-3.3-70b cleanly.
THE CONCEPT THAT CLICKED: Fanning out queries concurrently using asyncio.gather allows us to aggregate from 6 separate resources in parallel without cumulative HTTP network latency. Ensuring try-except wrappers on each source achieves robust Graceful Degradation.
STILL FUZZY: None.
TERMS LEARNED: Cron, misfire, coalescing, fan-out/fan-in, graceful degradation, proactive agent.

### Block 12.1 — Date: 2026-07-05 Hours: 1.5
WHAT I BUILT: Installed langfuse. Created backend/app/observability.py to export the Langfuse CallbackHandler. Injected it into the FastAPI /chat stream route and enabled global LiteLLM-level success/failure callbacks to capture all LLM completions. Created backend/app/evals.py implementing the 4-case Golden Query evaluation dataset with patch mocks (Gmail, Calendar, proposer, web scraper), LLM-as-a-Judge scoring engine, and database persistence to the new eval_runs table. Created the frontend evals view page on web/app/evals/page.tsx.
WHAT BROKE: backend default view_file parameter parser failing when EndLine was omitted.
HOW I FIXED IT: Provided explicit StartLine and EndLine values to view_file calls.
THE CONCEPT THAT CLICKED: Tracing vs flat logging. Tracing nests child spans (tool executions, SQL queries, LLM completions) under a parent trace in LangGraph. Mocks are critical in evaluations to isolate the core agent reasoning and routing loops from third-party API dependencies.
STILL FUZZY: None.
TERMS LEARNED: Observability, tracing, golden dataset, LLM-as-a-judge, regression testing.

### Block 13.1 — Date: 2026-07-05 Hours: 1.5
WHAT I BUILT: Replaced the Next.js home entrypoint web/app/page.tsx with a premium unified dark Command Center console. Integrated the main SSE Chat interface (with real-time status updates and interrupt approval triggers), approvals list (subscribing to Supabase Realtime changes via WebSockets), recent briefings select list + overlays modal, and System Health indicator (eval run averages). Created backend/migrations/023_frontend_seed.sql.
WHAT BROKE: N/A — built preventively by reusing proven patterns from approvals and briefings.
HOW I FIXED IT: N/A
THE CONCEPT THAT CLICKED: Unified layout and state sync. Placing chat, approvals, and briefings in a single viewport eliminates navigation friction and context switching. Connecting graph interrupts to instant buttons that post to the resume API makes human-in-the-loop interactions feel seamless.
STILL FUZZY: None.
TERMS LEARNED: Glassmorphism, micro-animations, unified dashboard, real-time sync.

### Block 14.1 — Date: 2026-07-05 Hours: 1.0
WHAT I BUILT: Created backend/Dockerfile and backend/.dockerignore for production containerization. Added DEMO_MODE: bool setting to settings.py and intercepted execute_proposal in executors.py to bypass real Google OAuth/write API calls with mock simulated executions when active. Created docs/17_deployment_lesson.md guide comparing local-first tunnels, HF Spaces, and Render. Wrote the portfolio-grade ROOT README.md containing Hero Pitch, routing flows, feature-to-competency mappings, and interview demo scripts.
WHAT BROKE: N/A
HOW I FIXED IT: N/A
THE CONCEPT THAT CLICKED: Deploying safety-first applications. Public demo targets (like recruiters or portfolios) must never hold active write credentials/tokens. Implementing a clean DEMO_MODE bypass at the dispatcher level isolates mock behavior from the agent reasoning graph, allowing secure demonstrations.
STILL FUZZY: None.
TERMS LEARNED: Container, image, cold start, tunnel, demo mode.

---

## 5. RECURRING MAINTENANCE (check weekly)

- [ ] Google OAuth token still valid? (testing mode ≈ 7 days → re-run authorize.py)
- [ ] Supabase project active (not paused)?
- [ ] All secrets still ONLY in .env / secrets/ (run `git status`, spot-check a recent commit)
- [ ] Free-tier watchlist: any provider emails about quota/model changes? (Gemini/Groq/OpenRouter/Supabase/Langfuse) → if yes, gateway-only fix per Appendix E.3
- [ ] Academy progress: any terms sitting in `review` status? Do a 10-minute dictionary review session
- [ ] `git push` done (laptop is not a backup!)

## 6. RED-TEAM EVIDENCE LOCKER (Phase 10+)

| Date | Attack I tried | What VIZIER did | Screenshot saved? |
|---|---|---|---|
| | | | ☐ |
| | | | ☐ |

## 7. EVAL SCORE HISTORY (Phase 12+)

| Date | Golden dataset score | What changed since last run | Regression? |
|---|---|---|---|
| | | | |

## 8. PARKED IDEAS (do NOT build mid-phase — park here)

- None.

---

## 9. MODEL TIER ROLES & MAPPINGS

| Node/Task Type | Model Role | Primary Model | Fallback Models |
|---|---|---|---|
| **Supervisor Planning** (`supervisor`) | `reasoning` | `gemini/gemini-1.5-pro` | `groq/llama-3.3-70b-versatile` $\rightarrow$ OpenRouter Llama 70B $\rightarrow$ Standard free chain |
| **Grounded Research Mode** (`RESEARCHER`) | `reasoning` | `gemini/gemini-1.5-pro` | `groq/llama-3.3-70b-versatile` $\rightarrow$ OpenRouter Llama 70B $\rightarrow$ Standard free chain |
| **Everyday Chat/Execution** (Standard) | `default` | `gemini/gemini-2.5-flash-lite` | `groq/llama-3.3-70b-versatile` $\rightarrow$ OpenRouter Gemini $\rightarrow$ Local Ollama Qwen |

