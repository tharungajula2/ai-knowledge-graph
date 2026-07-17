# VIZIER — CONCEPT ABSORPTION REPORT

This report verifies that 100% of the concept ledger entries extracted from the decommissioned `agent-lab/` codebase in `DEMOLITION_MAP.md` have been fully absorbed as active learning and building nodes within the VIZIER curriculum graph (`curriculum/VIZIER_MASTERY_GRAPH.md` and `PROJECT_TRUTH_vizierai.md` §16). 

Every "study" node has been converted into a "build" node with clear, functional criteria for implementation and validation. Additionally, new nodes have been introduced to cover missing foundational APIs (Google Cloud OAuth, Gmail/Calendar) and the five "famous hurdles."

---

## Concept-to-Node Mapping Ledger

| No. | Module / File Path | Concept Ledger Entry | Node ID | Node Title & Type | Domain |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `app/main.py` | REST API routing, SSE streaming, FastAPI dependency injection, state serialization. | `build-fastapi-backend` | Build: Core FastAPI Application (build · M) | 09 — Production |
| **2** | `app/settings.py` | Environment schema validation, settings injection, config hygiene. | `build-fastapi-backend` | Build: Core FastAPI Application (build · M) | 09 — Production |
| **3** | `app/observability.py` | LLM tracing, span instrumentation, telemetry, latency/cost logging. | `build-tracing-instrumentation` | Build: Tracing & Instrumentation (build · M) | 07 — Evals & Obs |
| **4** | `app/evals.py` | LLM-as-a-Judge grading, test harness, golden dataset assertions, evaluation metrics. | `build-eval-judge` | Build: LLM-as-a-Judge Scorer (build · M) | 07 — Evals & Obs |
| **5** | `app/scheduler.py` | Background event loops, cron job scheduling, proactive polling, scheduled RAG retrieval. | `build-briefing-scheduler` | Build: Briefing Scheduler & Cron (build · M) | 09 — Production |
| **6** | `app/run_migrations.py` | Schema migration execution, DB connection pooling, DDL transactions. | `build-migration-runner` | Build: Migration Runner & Pool (build · M) | 09 — Production |
| **7** | `app/brain_review.py` | Self-critical reflection, graph topology analysis, prompt-based suggestion. | `build-brain-reviewer` | Build: Self-Critical Graph Reviewer (build · M) | 06 — Memory & KG |
| **8** | `app/mcp_client.py` | Subprocess management, stdio communication, MCP-to-LangChain adaptation. | `build-mcp-bridge` | Build: Async MCP Sync Bridge (build · M) | 05 — Multi-Agent & MCP |
| **9** | `actions/proposer.py` | HITL authorization, risk tiering, Telegram API notifications, policy checks. | `build-proposal-gate` | Build: HITL Proposal Gate (build · M) | 08 — Safety & Security |
| **10** | `actions/executors.py` | Write API clients, idempotency guards, transaction safety, Google API auth. | `build-proposal-gate` / `build-idempotency-audit` | Build: HITL Proposal Gate / Build: Idempotency & Audit Logger | 08 — Safety & Security |
| **11** | `actions/scanner.py` | Prompt injection scanning, threat correlation analysis, heuristic security. | `build-overlap-scanner` | Build: Indirect Injection Overlap Scanner (build · M) | 08 — Safety & Security |
| **12** | `actions/audit.py` | Append-only logging, security audit trails, tamper-evident records. | `build-idempotency-audit` | Build: Idempotency & Audit Logger (build · M) | 08 — Safety & Security |
| **13** | `actions/review.py` | CLI event loop, keyboard input routing, database mutation. | `build-poller-engine` | Build: Async Queue Poller (build · S) | 09 — Production |
| **14** | `agents/supervisor.py` | StateGraph routing, checkpointer persistence, supervisor design pattern. | `build-supervisor` | Build: LangGraph Supervisor (build · M) | 04 — Agents |
| **15** | `agents/specialists.py` | Subgraphs, tool binding, async-to-sync bridging, threading pools. | `build-specialists` | Build: Specialist Subgraphs & Loops (build · M) | 04 — Agents |
| **16** | `agents/core_agent.py` | State formatting, validation, system prompt templates. | `build-specialists` | Build: Specialist Subgraphs & Loops (build · M) | 04 — Agents |
| **17** | `agents/handmade_react.py` | Manual ReAct loop, raw prompt formatting, tool dispatch loops. | `build-agent-from-scratch` | Build: Agent From Scratch (build · M) | 04 — Agents |
| **18** | `google/auth.py` | OAuth2 flow, credential storage, token rotation. | `google-oauth-flow` | Build: Google OAuth Integration (build · M) | 09 — Production |
| **19** | `google/authorize.py` | OAuth redirection handlers, local token extraction. | `google-oauth-flow` | Build: Google OAuth Integration (build · M) | 09 — Production |
| **20** | `google/gmail_reader.py` | MIME parsing, query syntax formatting, untrusted content marking. | `gmail-calendar-read` | Build: Gmail & Calendar Reader (build · M) | 09 — Production |
| **21** | `google/try_google.py` | Connectivity validation, endpoint health checks. | `gmail-calendar-read` | Build: Gmail & Calendar Reader (build · M) | 09 — Production |
| **22** | `llm/gateway.py` | Provider fallbacks, retry backoffs, semantic caching, billing analysis. | `build-gateway` | Build: Provider-Agnostic LLM Gateway (build · M) | 02 — Prompting & APIs |
| **23** | `llm/try_gateway.py` | Fault-tolerance verification, diagnostic test runs. | `build-gateway` | Build: Provider-Agnostic LLM Gateway (build · M) | 02 — Prompting & APIs |
| **24** | `rag/ingest.py` | Vector database seeding, text chunking, document parsing. | `ingestion-pipelines` | Build: Ingestion Pipeline & Seeder (build · M) | 03 — RAG & Retrieval |
| **25** | `rag/memory.py` | Memory extraction, episodic/procedural storage, fact parsing. | `build-memory-taxonomy` | Build: Memory Taxonomy (build · S) | 06 — Memory & KG |
| **26** | `rag/retrieve.py` | Hybrid search, RRF merging, semantic indexing, cosine similarity. | `build-hybrid-search` | Build: Hybrid Search & RRF (build · M) | 03 — RAG & Retrieval |
| **27** | `web/app/page.tsx` | Real-time chat UI, message state trees, layout rendering. | `build-command-center` | Build: Command Center UI (build · M) | 09 — Production |
| **28** | `web/app/approvals/page.tsx` | Approval workflows, transaction controls, input editing. | `build-command-center` / `build-proposal-gate` | Build: Command Center UI / Build: HITL Proposal Gate | 09 — Production / 08 |
| **29** | `web/app/audit/page.tsx` | Audit log reporting, data grids. | `build-command-center` / `build-idempotency-audit` | Build: Command Center UI / Build: Idempotency & Audit Logger | 09 — Production / 08 |
| **30** | `web/app/settings/page.tsx` | Remote configuration panels, database state mutations. | `build-command-center` / `build-demo-mode` | Build: Command Center UI / Build: Credential-Free Demo Mode | 09 — Production / 09 |
| **31** | `web/lib/supabase.ts` | WebSockets, real-time database subscriptions, listener patterns. | `realtime-subscriptions` | Build: Realtime Postgres Approvals UI (build · M) | 09 — Production |

---

## Verification of the Five Golden Hurdles

All 5 famous hurdles identified by the user are now represented as build-oriented nodes in the curriculum:

1. **async-MCP-inside-sync-LangGraph bridge**
   * **Node ID**: `build-mcp-bridge` (Domain 05)
   * **Summary**: *Build a background event loop wrapper that executes async MCP client calls within sync LangGraph thread environments; verify by invoking tools concurrently.*
2. **indirect prompt injection overlap scanner**
   * **Node ID**: `build-overlap-scanner` (Domain 08)
   * **Summary**: *Build a security scanner that parses payloads for override keywords and correlates thread checkpoints to detect untrusted data overlap; verify with custom injection attacks.*
3. **credential-free DEMO_MODE design**
   * **Node ID**: `build-demo-mode` (Domain 09)
   * **Summary**: *Design and build a credential-free mock/simulator mode for the dashboard and backend APIs to run safely without live keys; verify by running local tests.*
4. **HITL proposal gate with editable payloads**
   * **Node ID**: `build-proposal-gate` (Domain 08)
   * **Summary**: *Build a database-backed proposal queue that intercepts agent actions, checks risk policies, and supports user editing of payloads before execution; verify with mock email/task proposals.*
5. **realtime approvals UI on Postgres changes**
   * **Node ID**: `realtime-subscriptions` (Domain 09)
   * **Summary**: *Build a Next.js Approvals UI that subscribes to PostgreSQL changes via Supabase realtime channels and updates the cockpit layout dynamically; verify by simulating database inserts.*
