# Vizier - PROJECT TRUTH
Last verified: July 14, 2026, from the active codebase.

## 1. One-liner
A curriculum visualizer tracking learning progress on a dynamic graph beside an agent dashboard.

## 2. Elevator pitch
It is a tool that tracks learning by rendering completed, in-progress, and planned curriculum topics as a dynamic, interactive map. It includes a simulated agent interface where users approve actions like emails or tasks before execution.

## 3. What it is
Vizier solves the problem of tracking structured learning paths over long marathons where linear logs fail to capture conceptual connections. It serves as a visual, self-rewiring knowledge base and a simulated multi-agent dashboard.

The project has two parts. The first is a static frontend displaying an interactive, concentric D3 graph of 200 curriculum nodes in 10 permanent AI domains. Nodes move from planned ghosts, to active charging states, to lit nodes representing completed lessons. During daily builds, a script parses markdown notes to extract wikilinks and map backlinks, generating graph edges dynamically.

The second part is the agent laboratory, which contains a frozen multi-agent system built on LangGraph. A supervisor agent coordinates specialized subgraphs for research, analysis, writing, and scheduling. It uses Model Context Protocol adapters to connect to external APIs. To prevent unauthorized writes, the system writes proposed actions like emails or tasks to a PostgreSQL database for human approval via a Next.js cockpit. The backend also runs heuristic regex matching and thread correlation scans to identify indirect prompt injection risks before execution.

Ultimately, Vizier provides an honest ledger of learning progress alongside a secure environment to experiment with agent orchestration.

## 4. Tech stack

| Component | Technologies Used | Role / Purpose |
| :--- | :--- | :--- |
| **Frontend Site** | HTML5, JavaScript, D3.js, Canvas, CSS | Renders the concentric, interactive learning graph and visualizes stats. |
| **Agent Web App** | Next.js, React, TypeScript, Tailwind CSS, Supabase Client | Renders the safety approvals cockpit and receives database updates in real time. |
| **Agent Backend** | FastAPI, Python, LangGraph, LiteLLM, Pydantic | Manages state graph coordination, specialist subgraphs, settings, and API routes. |
| **Data & Storage** | PostgreSQL, Supabase, pgvector | Stores checkpointer state, RAG vectors, and the proposed actions queue. |
| **Integrations** | Model Context Protocol, Trafilatura, DuckDuckGo Search | Enables agents to connect to external tools and retrieve web information. |
| **Monitoring** | Langfuse | Handles tracing and agent evaluation tracking. |

## 5. Core features
* **Concentric Graph Visualizer**: A physics-based D3 graph mapping 10 AI domains and 200 curriculum nodes with concentric ring rotation and Live/Vision modes.
* **Wikilink and Backlink Parser**: A build script that crawls markdown files, extracts internal link connections, and compiles backlink lists for the graph inspector.
* **Multi-Agent Orchestration**: A LangGraph supervisor-specialist graph coordinating Scheduler, Scribe, Researcher, and Analyst subgraphs.
* **Background Thread Event Loop**: A synchronous LangGraph wrapper that runs async Model Context Protocol client loops on a background thread.
* **Human-in-the-Loop Proposal Gate**: A queue system that intercepts database writes and requires manual authorization before performing actions.
* **Safety Cockpit Dashboard**: A Next.js approvals interface with custom payload editing, synced to PostgreSQL via Supabase Realtime.
* **Indirect Prompt Injection Scanner**: A security filter running regex check patterns and semantic correlation algorithms to find leaked instructions.
* **Provider-Agnostic LLM Gateway**: A LiteLLM wrapper with fallback logic, backoffs, and tracking configuration.
* **Hybrid RAG System**: Combines vector cosine similarity with full-text search database operations.

## 6. Feature status table

| Feature | Status | Evidence in Codebase |
| :--- | :--- | :--- |
| **D3 Concentric Graph Visualizer** | SHIPPED | Implemented in `site/index.html` and `site/brain.html` using custom canvas renderers. |
| **Wikilink and Backlink Parser** | SHIPPED | Executed in `tools/site-build/build-brain.js` during workspace builds. |
| **Curriculum Note System** | PARTIAL | The build engine is ready, but only one note (`map-of-ai.md`) exists as `in-progress` (Day 0). The other 199 nodes in `site/brain-index.public.json` are marked as `ghost`. |
| **Multi-Agent Orchestration** | SHIPPED | The graph topology is defined in `agent-lab/backend/app/agents/supervisor.py` and `specialists.py`. |
| **Background Thread Event Loop** | SHIPPED | Handled in `agent-lab/backend/app/agents/specialists.py` via `_mcp_loop` and `_mcp_thread`. |
| **Human-in-the-Loop Proposal Gate** | SHIPPED | Implemented in `agent-lab/backend/app/actions/proposer.py` and `executors.py` by queueing proposals. |
| **Simulation Mode (DEMO_MODE)** | SHIPPED | Configured in `agent-lab/backend/app/settings.py` and handled in `executors.py` to bypass credentials. |
| **Next.js Safety Cockpit** | SHIPPED | Implemented in `agent-lab/web/app/approvals/page.tsx` with full editing forms. |
| **Realtime Database Subscription** | SHIPPED | Configured via the Supabase JS client inside `agent-lab/web/app/approvals/page.tsx`. |
| **Indirect Prompt Injection Scanner** | SHIPPED | Found in `agent-lab/backend/app/actions/scanner.py` using regex and content overlap checks. |
| **Replan Engine** | PLANNED | Mentioned in runbooks and specifications, but CLI scripts are not implemented in the tools folder. |

## 7. Real vs. Demo/Simulation aspects
* **What is Real**:
  * The build-brain script compiles notes, extracts wikilinks, and generates graph JSON correctly.
  * The D3 visualization rendering concentric rings, nodes, streaks, and stats runs fully client-side.
  * The LangGraph supervisor-specialist graph runs, hooks up tool definitions, and processes message routing.
  * The Next.js dashboard retrieves pending actions and updates via Supabase realtime.
  * The Prompt Injection scanner executes regex and history correlation checks on payload items.
* **What is Simulated/Demo**:
  * **Simulation mode**: By default, `DEMO_MODE` is enabled. Write actions (such as sending emails, calendar events, or tasks) write mock results to the database rather than communicating with active Google OAuth services. This allows local and host deployments to function without active workspace credentials.
  * **Curriculum progress**: Out of 200 nodes, 199 are ghost placeholders. Only `map-of-ai.md` exists physically, representing Day 0 of the actual learning journey.
  * **Daily close pipeline**: The automated day close script and AI replan functions are outline concepts in documentation (`docs/DAILY_RITUAL.md`, `instructions.md`) and not active scripts.

## 8. Problems solved / Technical hurdles overcome
* **Bridging Async MCP Clients inside Synchronous LangGraph Nodes**: LangGraph agents are designed as synchronous node functions in this architecture, but the Model Context Protocol (MCP) client library is inherently asynchronous. To bridge this, a custom background event loop (`_mcp_loop`) is started on a dedicated thread (`_mcp_thread`). Synchronous agent nodes push requests to this thread and block, waiting for a thread-safe future to return the result.
* **Detecting Context-Leaking Prompt Injections**: Agents reading untrusted tools (like web content or email bodies) can be poisoned by malicious instructions. Vizier implements an overlap scanner that caches tool outputs and checks if these untrusted contents correlate semantically (using overlap metrics) with critical fields inside proposed write payloads.
* **Credential-Free Deployment**: Running agent portfolios on the web without exposing keys or crashing due to missing Google credentials was achieved by decoupling the proposal database table and creating a simulated execution branch (`DEMO_MODE`) in Python.

## 9. Known limitations / Contradictions
* **Static Graph build is empty**: The public site's main stats show `⚡ 0 / 200 NODES LIT` because only one note is in progress and none are marked learned.
* **Vercel Build Discrepancy**: The file `docs/DEPLOYMENT.md` specifies building the project using site-build scripts from the root, but `vercel.json` at the root is configured to point directly to `site` output or custom build triggers.
* **API Connection Errors**: The Next.js dashboard assumes `http://localhost:8000` is the active backend endpoint for details fetching, which means it will fail to update action items unless the backend is running locally alongside it.

## 10. Ready-made copy
* **Resume Bullet Points**:
  * Built a curriculum visualizer that tracks engineering progress by rendering conceptual notes as a dynamic concentric graph using D3.js.
  * Developed a multi-agent laboratory using LangGraph to orchestrate supervisor and specialist subgraphs communicating via Model Context Protocol.
  * Implemented a gated human-in-the-loop authorization gate in Python that writes proposed actions to a PostgreSQL database for review.
  * Designed an indirect prompt injection scanner that checks proposal fields against execution history to prevent data leakage.
* **LinkedIn Description**:
  I built Vizier to track my progress in AI engineering. It combines a dynamic concentric graph visualization of a 200-node curriculum with an agent laboratory. The agent system uses LangGraph to coordinate specialists and connects to APIs using the Model Context Protocol. To ensure safety, a Next.js dashboard requires human approval before the agent executes any email or calendar write actions. The system also scans for prompt injections by comparing proposed action details with the conversation history.
* **GitHub README Intro**:
  Vizier is a dual-purpose portfolio project. It is a dynamic knowledge graph that maps learning progress across ten domains of AI engineering, and a supervisor-specialist agent laboratory. The agent system features a safety cockpit that intercepts write actions for human authorization, and security scanners to protect against indirect prompt injections.

## 11. Interview Talking Points
* **Explaining the Multi-Agent Threading Bridging**: If asked how agents communicate with APIs, explain that you wrapped asynchronous Model Context Protocol (MCP) clients in a dedicated background event loop running on a separate thread, allowing synchronous LangGraph nodes to make safe, blocking tool calls.
* **Explaining the Safety Cockpit and HITL Gate**: Explain that you implemented a gated database schema to store write action proposals rather than giving LLM agents direct write access, requiring manual user interaction to edit and execute tasks.
* **Explaining the Prompt Injection Defense**: Detail how the correlation scanner detects indirect injections by comparing text overlap between untrusted tool read results and the final proposed write action payloads, catching leaked instructions before they trigger writes.
