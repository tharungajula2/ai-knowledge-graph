# VIZIER — DECOMMISSIONING & DEMOLITION MAP
This map documents the architecture and inventories of the VIZIER (Personal AI Chief-of-Staff) repository on the `brain-only` branch. It categorizes the codebase to prepare for simplifying the engine to a static, localized learning brain, identifying what the frozen agentic loop comprises and what must remain active.

---

## 1. Safety Actions & Context
* **Current Working Branch**: `brain-only` (All static brain simplification and future learning updates happen here).
* **Frozen Baseline Tag**: `pre-brain-simplification` (An annotated tag marking the state of the codebase containing the full agent-lab engine before decommissioning).

---

## 2. Agent Laboratory Inventory (`agent-lab/`)
The agent laboratory contains the supervisor-specialist multi-agent system, safety proposal gate, and real-time cockpit. Under a `brain-only` configuration, this entire directory is **frozen and deprecated**, serving as a study reference rather than active code.

### 2.1 Backend Modules (`agent-lab/backend/app/`)

| Module Path | Description (2-4 Sentences) | Embodied Concepts |
| :--- | :--- | :--- |
| `app/main.py` | Serves as the main FastAPI application entry point. It sets up application routes, manages CORS middleware settings, handles API endpoints for chat operations, and opens Server-Sent Events (SSE) streaming connections to relay agent tokens directly to the dashboard interface. | REST API routing, SSE streaming, FastAPI dependency injection, state serialization. |
| `app/settings.py` | Configures environment variables using Pydantic Settings. It validates and loads API keys (Gemini, Groq, OpenRouter), database connection parameters, Telegram notification credentials, and cockpit security default values. | Environment schema validation, settings injection, config hygiene. |
| `app/observability.py` | Integrates the Langfuse SDK to trace multi-agent execution steps. It creates span tracking context wrappers to monitor latency, cost, and tool invocation inputs/outputs throughout the supervisor cycle. | LLM tracing, span instrumentation, telemetry, latency/cost logging. |
| `app/evals.py` | Runs automated offline evaluation suites comparing agent outputs against a 20-row golden dataset. It grades correctness, grounding, and formatting using LLM-as-a-Judge rubrics and prints compliance metrics. | LLM-as-a-Judge grading, test harness, golden dataset assertions, evaluation metrics. |
| `app/scheduler.py` | Coordinates proactive background tasks using APScheduler. It triggers the daily morning briefing builder (which aggregates calendar items and unread emails) and schedules weekly memory review procedures. | Background event loops, cron job scheduling, proactive polling, scheduled RAG retrieval. |
| `app/run_migrations.py` | Database helper script that sequentially reads and applies SQL files located in the `migrations/` folder. It sets up the tables for checkpointer state, proposals, and audit logs. | Schema migration execution, DB connection pooling, DDL transactions. |
| `app/brain_review.py` | A local script analyzing the curriculum note status files. It queries the local LLM tier to suggest wiki-link connections, identify thin domains, and flag notes missing the mandatory "Where this could be wrong" section. | Self-critical reflection, graph topology analysis, prompt-based suggestion. |
| `app/mcp_client.py` | Spawns the local Python-based MCP utility server as a stdio subprocess. It retrieves exposed system tools and adapts them into LangChain-compatible tool structures for specialist agent binding. | Subprocess management, stdio communication, MCP-to-LangChain adaptation. |

### 2.2 Actions and Policies (`agent-lab/backend/app/actions/`)

| Module Path | Description (2-4 Sentences) | Embodied Concepts |
| :--- | :--- | :--- |
| `actions/proposer.py` | Serves as the gated pipeline intercepting all write actions proposed by agents. It runs policy permission checks, flags injection threats, saves proposals as rows in PostgreSQL, and alerts the user's phone via Telegram for high-risk operations. | HITL authorization, risk tiering, Telegram API notifications, policy checks. |
| `actions/executors.py` | Contains the real Google Workspace API write logic. It strictly enforces that a proposal must be approved before execution, and implements an idempotency check checking unique keys to avoid duplicate writes. | Write API clients, idempotency guards, transaction safety, Google API auth. |
| `actions/scanner.py` | Implements safety checks to block indirect prompt injection. It runs regex scans for instruction-override keywords and performs thread correlation checks to see if proposed write payloads overlap with untrusted data fetched earlier. | Prompt injection scanning, threat correlation analysis, heuristic security. |
| `actions/audit.py` | Writes immutable event records to a dedicated PostgreSQL database table. It ensures that every proposal creation, approval, execution, or rejection is logged with actor details for security analysis. | Append-only logging, security audit trails, tamper-evident records. |
| `actions/review.py` | CLI-based approval program. It allows the engineer to inspect, approve, or reject pending action proposals directly from a terminal window as an alternative to the Next.js cockpit. | CLI event loop, keyboard input routing, database mutation. |

### 2.3 Agent Logic (`agent-lab/backend/app/agents/`)

| Module Path | Description (2-4 Sentences) | Embodied Concepts |
| :--- | :--- | :--- |
| `agents/supervisor.py` | Orchestrates the primary LangGraph execution graph. It acts as the routing node, determining which specialist should take the turn next based on the scratchpad history, and integrates the PostgreSQL checkpointer to maintain thread state. | StateGraph routing, checkpointer persistence, supervisor design pattern. |
| `agents/specialists.py` | Holds subgraphs and tool definitions for the Scheduler, Scribe, Researcher, and Analyst agents. It coordinates calling Google APIs, scraping websites, and running calculations, and bridges async event loops to sync supervisor threads. | Subgraphs, tool binding, async-to-sync bridging, threading pools. |
| `agents/core_agent.py` | Formulates base schemas and messages for agent interactions. It provides utility helper functions to construct state structures and structure response payloads. | State formatting, validation, system prompt templates. |
| `agents/handmade_react.py` | Implements a prototype of a manual ReAct loop without using high-level frameworks. It serves as a structural baseline showing how a model chooses tools, processes inputs, and reasons in sequence. | Manual ReAct loop, raw prompt formatting, tool dispatch loops. |

### 2.4 Integrations, LLM, and RAG (`agent-lab/backend/app/google/`, `llm/`, `rag/`)

| Module Path | Description (2-4 Sentences) | Embodied Concepts |
| :--- | :--- | :--- |
| `google/auth.py` | Resolves Google Cloud credentials, managing OAuth scope requirements and automatic refresh token updates. | OAuth2 flow, credential storage, token rotation. |
| `google/authorize.py` | Starts a temporary local HTTP server to capture browser-based Google OAuth redirect parameters during initial setup. | OAuth redirection handlers, local token extraction. |
| `google/gmail_reader.py` | Connects to the Gmail read API to extract message sender, date, and MIME bodies, placing them inside delimiters. | MIME parsing, query syntax formatting, untrusted content marking. |
| `google/try_google.py` | Basic testing script to verify Google Cloud project connections by retrieving email headers or list values. | Connectivity validation, endpoint health checks. |
| `llm/gateway.py` | Handles fallback loops across providers (Gemini -> Groq -> OpenRouter). It supports request retries, exponential backoffs, caching, and token usage statistics collection. | Provider fallbacks, retry backoffs, semantic caching, billing analysis. |
| `llm/try_gateway.py` | Playground script to verify model output availability and fallback triggering when a provider key is broken. | Fault-tolerance verification, diagnostic test runs. |
| `rag/ingest.py` | Parses note markdown files and splits them into chunks to insert into pgvector storage. | Vector database seeding, text chunking, document parsing. |
| `rag/memory.py` | Automatically extracts facts, routines, and episodic rules from conversations and writes them to a memories database table. | Memory extraction, episodic/procedural storage, fact parsing. |
| `rag/retrieve.py` | Implements a hybrid search merging semantic vector results with keyword matches, re-ranking them using Reciprocal Rank Fusion (RRF). | Hybrid search, RRF merging, semantic indexing, cosine similarity. |

### 2.5 Next.js Web Frontend (`agent-lab/web/`)

| Component Path | Description (2-4 Sentences) | Embodied Concepts |
| :--- | :--- | :--- |
| `web/app/page.tsx` | Main cockpit chat page. It allows the user to converse with the supervisor and watch token streaming outputs in real time. | Real-time chat UI, message state trees, layout rendering. |
| `web/app/approvals/page.tsx` | The Human-in-the-Loop Cockpit. It displays pending proposals, risk indicators, safety flags, and lets the user approve, reject, or edit payloads. | Approval workflows, transaction controls, input editing. |
| `web/app/audit/page.tsx` | Renders a table of append-only audit trail records fetched from the database, helping the user trace the history of execution safety decisions. | Audit log reporting, data grids. |
| `web/app/settings/page.tsx` | UI panel for setting policy options (e.g. low-risk auto-approval, high-risk confirmation modes, or complete blocks). | Remote configuration panels, database state mutations. |
| `web/lib/supabase.ts` | Sets up the Supabase Client and configures real-time listener channels. It enables the UI to receive immediate updates when proposal status changes. | WebSockets, real-time database subscriptions, listener patterns. |

---

## 3. Site Pages & Tools Inventory

These components are responsible for building, rendering, and managing the static portfolio website and learning curriculum.

### 3.1 Static Pages (`site/`)
* **`site/index.html`**: The landing homepage. It displays the project summary, stats counters, and renders a mini force-directed canvas D3 graph representing the active universe.
* **`site/brain.html`**: The interactive curriculum hub. It imports D3.js to render the full 2D/3D graph in concentric rings representing domains, and includes an inspector to read lesson notes.
* **`site/feed.html`**: Log feed displaying notes sorted by completion date.
* **`site/about.html`**: Editorial guide detailing the rules of learning, feynman tests, locked nodes, and milestones.

### 3.2 Compilation and Local Scripts (`tools/`)
* **`tools/site-build/compile-curriculum.js`**: The compilation parser. It reads `VIZIER_MASTERY_GRAPH.md`, extracts node details and cross-domain links, groups them into clusters, crawls local markdown notes to map wikilinks and backlinks, validates locked configurations, and outputs `curriculum.json` and static indexes.
* **`tools/site-build/build.js`**: Rebuild script coordinating compiling curriculum JSON, building note pages, and copying assets.
* **`tools/site-build/verify.js`**: Automated security gate script. It checks generated site files for leaked credentials, private flags, or broken links.
* **`tools/site-build/scan-history.js`**: Reads local git history to verify commit messages and completion timestamps for stats.
* **`tools/next-node.js`**: CLI utility suggesting upcoming ghost nodes to learn based on graph prerequisites.
* **`tools/finish-node.js`**: Marks a node as learned, prompts the user for a Feynman summary, writes frontmatter, locks it, and commits the file to git.
* **`tools/replan.js`**: Auto-evolution script. It takes user input regarding changes in schedule or technology, queries the local model, and adjusts future ghost node structures.
* **`tools/frontier-scan.js`**: Industry scanner. It queries the model for recent technology developments relevant to the upcoming 10 ghost nodes, generating a markdown scan report.
* **`tools/suggest-links.js`**: CLI tool parsing note text to suggest new internal wikilinks between matching concepts.
* **`tools/ai/client.js`**: A zero-dependency JavaScript LLM client wrapping Gemini, Groq, and OpenRouter for the local CLI tools.
* **`vercel.json`**: Routing configuration file for hosting the static pages and mapping server headers.

---

## 4. Brain-Only Active Files
To run the project in a simplified, static **"brain-only"** configuration, only the following files are required:

```
vizier/
├── curriculum/
│   ├── .locked/                       # Immutable metadata snapshots of lit nodes
│   ├── curriculum.json                # Master compiled curriculum database
│   ├── CHANGELOG.md                   # Log of replans and edits
│   └── VIZIER_MASTERY_GRAPH.md        # Master layout markdown definition file
├── site/                              # All static HTML/CSS/JS frontend files
│   ├── index.html                     # Portfolio page & mini brain
│   ├── brain.html                     # Full interactive graph viewer
│   ├── feed.html                      # Chronological feed
│   ├── about.html                     # Rules & philosophy page
│   ├── assets/                        # Design assets
│   ├── brain-index.public.json        # Compiled public graph nodes and edges
│   ├── brain-index.preview.json       # Compiled preview graph (includes ghost notes)
│   └── notes/                         # Automatically compiled HTML lesson pages
├── tools/
│   ├── site-build/                    # Build scripts: build.js, compile-curriculum.js, verify.js
│   ├── ai/                            # Local LLM client: client.js
│   ├── next-node.js                   # CLI node selection utility
│   ├── finish-node.js                 # CLI node completion utility
│   ├── replan.js                      # AI replanning utility
│   ├── frontier-scan.js               # AI industry scanning utility
│   └── suggest-links.js               # CLI backlink suggestions utility
├── _local-secrets/                    # Folder containing local .env file
├── package.json                       # Scripts definition file
└── vercel.json                        # Deployment routing config
```
All folders under `agent-lab/` can be safely removed or archived on this branch, leaving a clean, lightweight static curriculum application.
