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

## 12. Curriculum Philosophy & Graph Design
* **Nodes, Not Calendars**: The graph operates independently of calendar deadlines. Nodes represent conceptual or technical topics that take variable time to master. Progress is asymmetric and honestly tracked.
* **Node Life-Cycle States**:
  * **Ghost**: A planned lesson or project topic (uncompleted).
  * **Charging**: A topic currently in progress, visually pulsing on the graph.
  * **Lit**: A completed topic. Once marked learned, it is locked (`locked: true` in `curriculum/.locked/<node-id>.json`) and becomes immutable to preserve the integrity of the learning ledger.
* **The 10 Permanent Domains**: The graph is structured concentrically around 10 core AI Engineering domains that act as the permanent spine.

## 13. Mastery Graph Rules
1. **The Spine is Permanent**: The 10 domains (rings) are static. The nodes inside them evolve through updates, but the rings themselves never do.
2. **Lit Nodes are Immutable**: Completed nodes cannot be modified or altered by system scripts.
3. **Feynman Depth Requirement**: A node is only lit when its markdown note contains a clear Feynman explanation and, for builds, a functioning code artifact.
4. **Organic Backlinks**: Wikilinks (`[[node-id]]`) in notes generate graph edges and bidirectional backlinks dynamically during daily builds.
5. **Deterministic Edges**: Node relationships are generated deterministically based on prerequisite chains, clusters, and wikilinks (targeting 2–6 edges per node).
6. **Replan Integrity**: Any modifications/replans of ghost nodes must be justified with a stated reason appended to `curriculum/CHANGELOG.md`.
7. **Frontier Scanning**: Future placeholder nodes are updated dynamically when approached by running a scan of the current industry state.

## 14. Floating Milestones
* **M1 — RESURRECTION** (related: `production`): Deploy the backend (Machine 1) and dashboard (Machine 2) manually (env, DB, migrations, OAuth, scheduler, gate, UI). Triggered by unfreezing `agent-lab`. Baseline node: `resurrection`.
* **M2 — THE BRIDGE** (related: `production`, `agents`): The deployed agent proposes new brain nodes through its own human-approval gate, merging agent and curriculum into a single system. Baseline node: `the-bridge`.
* **M3 — FIRST PUBLIC ARTIFACT** (related: `prompting-apis`): Ship a publicly usable application. Baseline node: `build-feynman-bot`.
* **M4 — HALF-LIT BRAIN** (related: all): Achieve a 50% completion rate of curriculum nodes.
* **M5 — VIZIER v2** (related: `frontier-capstone`): The final capstone where the user designs and implements a unified agent + brain system from scratch without code assistants. Baseline node: `define-vizier-v2`.

## 15. Operational Workflow Loops

### 15.1 The Daily Loop
* **Initialization**: Execute `npm run next-node` to select the next ghost node or continue charging the active one.
* **Build & Document**: Write notes in `brain/knowledge/` using the frontmatter template. Use double-bracket `[[wikilinks]]` to relate concepts.
* **Verification**: Execute `npm run finish-node` to transition the note's status to `learned`, locking it.
* **Daily Close**: Run `npm run day:close` (or `npm run sync`) to build the static graph data, compute streaks, commit all changes, and push to the remote repository.

### 15.2 The Content Loop
* **Polish Drafts**: On lighting a node, `draft-post` generates drafts (Feynman-style posts, carousel outlines, video scripts) in `posts/<node-id>/`. Polish a draft in under 15 minutes.
* **1-in-4 Format Rotation**: Cycle content types between Carousels, Text posts, Infographics, and Video walk-throughs.
* **Sunday Batching**: Spend time each Sunday batch-generating and scheduling posts.

### 15.3 The Evolution Loop
* **Weekly Frontier Scan**: Run `npm run frontier-scan` to crawl recent AI engineering developments.
* **Replan**: Execute `npm run replan` to interactively modify ghost nodes using LLM suggestions on approved prompts, updating `curriculum/curriculum.json` and `CHANGELOG.md`.
* **Capstone checkpoints**: Every domain's final capstone requires evaluating progress and performing a replan before moving to the next ring.

## 16. The Full 200-Node Curriculum Map

### DOMAIN 01 — FOUNDATIONS · ring: `foundations` · 21 nodes
*How AI actually works, plus the engineer's floor everything stands on.*

#### Cluster: How AI Works
* **map-of-ai** — The Map of AI (concept · S): AI vs ML vs DL vs GenAI vs Agentic — the family tree.
* **how-machines-learn** — How Machines Learn (concept · S): weights, loss, gradient descent — pure intuition.
* **what-is-a-language-model** — What a Language Model Is (concept · S): next-token prediction, and why that's enough for magic.
* **tokens** — Tokens (concept · S): play with a real tokenizer; why "strawberry" confuses models.
* **embeddings-intuition** — Embeddings Intuition (concept · S): meaning as coordinates; nearest-neighbor thinking.
* **attention-transformers** — Attention & Transformers (concept · M): the "every word looks at every word" idea.
* **training-pipeline** — Pretraining → Fine-tuning → RLHF (concept · S): the three-stage recipe behind every chatbot.
* **context-windows** — Context Windows (concept · S): the model's short-term memory and what fits.
* **sampling-controls** — Temperature & Top-p (concept · S): why the same prompt gives different answers.
* **hallucination** — Hallucination (concept · S): why models confidently make things up; grounding preview.
* **model-landscape** — The Current Model Landscape (frontier · S): open vs closed, frontier vs small — as of the day I light this node.

#### Cluster: The Engineer's Floor
* **python-environments** — Environments & Packages (build · S): venv, pip, running scripts like a pro.
* **python-data-shapes** — Data Shapes (build · S): functions, dicts, JSON — the shapes of AI data.
* **python-classes-modules** — Classes & Modules (build · S): reading real codebases.
* **python-async** — Async/Await (build · M): why AI apps need it; hands-on.
* **python-typing-pydantic** — Types & Pydantic (build · S): the schema mindset.
* **git-mastery** — Git Mastery (build · S): branches, commits, history — understand my own daily ritual.
* **terminal-fluency** — Terminal Fluency (build · S): navigate, pipe, grep — no more fear.
* **build-token-cost-calculator** — Build: Token & Cost Calculator (build · M): count tokens, estimate API cost, write the explainer.

#### Cluster: Consolidation
* **synthesis-foundations** — Synthesis: The Foundations Map (synthesis · S): explain "how an LLM works" to a 12-year-old, end to end.
* **capstone-foundations** — 🏁 Capstone: Foundations (capstone · M): mega-note + carousel "How AI really works" + replan checkpoint.

### DOMAIN 02 — PROMPTING & LLM APIs · ring: `prompting-apis` · 20 nodes
*Talk to models like an engineer: APIs, structure, tools, reliability.*

#### Cluster: Speaking to Models
* **first-api-call** — First API Call (build · S): call Gemini from Python; inspect the raw response.
* **roles-and-system-prompts** — Roles & System Prompts (concept · S): who's talking; why system prompts steer everything.
* **prompt-skeleton** — The Prompt Skeleton (concept · S): role + context + task + format — the reusable pattern.
* **few-shot-prompting** — Few-shot Examples (concept · S): when 3 examples beat 300 words.
* **reasoning-prompts** — Reasoning Prompts (concept · S): chain-of-thought, step-by-step, and their limits.
* **structured-output** — Structured Output (build · S): force clean JSON out of a model; parse safely.
* **tool-calling** — Tool / Function Calling (concept · M): the single most important mechanic in agentic AI.

#### Cluster: Engineering the Call
* **streaming-responses** — Streaming (build · S): tokens flowing into the terminal, live.
* **errors-retries-backoff** — Errors, Retries, Backoff (build · S): API calls that survive failure.
* **rate-limits-caching** — Rate Limits & Caching (concept · S): why free tiers throttle; how caching saves you.
* **build-gateway** — Build: Provider-Agnostic LLM Gateway (build · M): Build a LiteLLM-like gateway with fallbacks (Gemini -> Groq -> OpenRouter), retry logic, exponential backoff, semantic caching, and token/cost tracking; verify with simulated key failures.
* **injection-first-look** — Prompt Injection: First Look (concept · S): the attack that shapes everything later.
* **multimodal-input** — Multimodal In (build · S): send an image; extract structured info.
* **voice-audio-apis** — Voice & Audio APIs (concept · S): speech-to-text and text-to-speech landscape.
* **long-context-strategies** — Long-Context Strategies (concept · S): stuffing vs retrieval vs summarizing.
* **prompt-quality** — Is My Prompt Good? (concept · S): informal evaluation; A/B thinking begins.

#### Cluster: First Ships
* **build-cli-chatbot** — Build: CLI Chatbot (build · M): terminal chatbot with in-session memory, streaming, a persona.
* **build-feynman-bot** — Build: Feynman-Bot (build · L): explains any AI term with an Indian-life analogy — ship it public. -> M3
* **synthesis-apis** — Synthesis: The API Layer (synthesis · S): the whole call path, explained start to finish.
* **capstone-apis** — 🏁 Capstone: APIs (capstone · M): "I taught a computer to take orders" + replan checkpoint.

### DOMAIN 03 — RAG & RETRIEVAL · ring: `rag-retrieval` · 21 nodes
*Ground models in real knowledge: embeddings, vector search, citations.*

#### Cluster: Retrieval Fundamentals
* **why-rag** — Why RAG Exists (concept · S): closed-book vs open-book exams; the grounding solution.
* **embeddings-hands-on** — Embeddings Hands-on (build · S): embed sentences; cosine similarity by hand.
* **chunking** — Chunking (concept · S): slicing documents; why overlap matters.
* **vector-databases** — Vector Databases (concept · M): what pgvector/HNSW actually do.
* **build-first-rag** — Build: First RAG Pipeline (build · M): ingest → embed → store → retrieve → answer.

#### Cluster: Retrieval, Seriously
* **keyword-fulltext-search** — Keyword & Full-Text Search (concept · S): BM25/tsvector — old magic that still wins.
* **build-hybrid-search** — Build: Hybrid Search & RRF (build · M): Build a hybrid retrieval system merging semantic vector results (using cosine similarity/pgvector) with keyword full-text matches, re-ranked using Reciprocal Rank Fusion (RRF); verify against test search queries.
* **reranking** — Reranking (concept · S): the second pass that fixes retrieval quality.
* **citations-grounding** — Citations & Grounding (build · S): every answer points at its source.
* **rag-failure-modes** — RAG Failure Modes (concept · S): lost-in-the-middle, bad chunks, stale indexes.
* **metadata-filters** — Metadata & Filters (build · S): retrieval with structure — dates, tags, domains.
* **query-rewriting-hyde** — Query Rewriting & HyDE (concept · S): fixing bad questions before retrieval.
* **multi-hop-retrieval** — Multi-hop Retrieval (concept · S): questions that need two lookups.
* **ingestion-pipelines** — Build: Ingestion Pipeline & Seeder (build · M): Build an ingestion pipeline that parses markdown note files, splits them into clean semantic chunks, generates vector embeddings, and seeds a pgvector database; verify with chunk length assertions.
* **rag-evals-intro** — RAG Evals Intro (concept · S): faithfulness & context recall — measuring groundedness.

#### Cluster: RAG on My Own Brain
* **build-chat-with-my-brain** — Build: Chat With My Brain (build · L): RAG over my own notes, with citations + domain filters — meta and glorious.
* **evaluate-brain-chat** — Build: Evaluate It (build · M): mini golden set; score faithfulness.
* **graphrag-preview** — GraphRAG Preview (concept · S): when knowledge is a graph, not a pile.
* **semantic-caching** — Semantic Caching (concept · S): answering repeat questions for free.
* **synthesis-rag** — Synthesis: The Retrieval Story (synthesis · S): the full pipeline, one diagram.
* **capstone-rag** — 🏁 Capstone: Retrieval (capstone · M): "I gave AI an open book" + replan checkpoint.

### DOMAIN 04 — AGENTS · ring: `agents` · 20 nodes
*From chatbot to agent: loops, tools, state, LangGraph.*

#### Cluster: The Loop
* **what-makes-an-agent** — What Makes an Agent (concept · S): reason, act, observe, repeat.
* **react-by-hand** — ReAct By Hand (build · S): run the loop manually on paper with a real task.
* **designing-tools** — Designing Tools (concept · S): schemas, descriptions, why naming matters.
* **build-agent-from-scratch** — Build: Agent From Scratch (build · M): Build a pure-Python manual ReAct loop handling raw prompt formatting, regex tool-calling parsing, and a tool dispatch execution loop; verify with 5 mock tasks.

#### Cluster: LangGraph & Patterns
* **langgraph-state** — LangGraph: Nodes & State (concept · M): the graph mental model.
* **langgraph-checkpointers** — Checkpointers (concept · S): pause, resume, survive crashes.
* **hitl-interrupts** — Human-in-the-Loop Interrupts (build · M): an agent that stops and asks permission.
* **plan-and-execute** — Plan-and-Execute (concept · S): planners vs reactors.
* **reflection-patterns** — Reflection / Reflexion (concept · S): agents that critique themselves.
* **subgraphs** — Subgraphs (concept · S): agents made of agents.
* **build-supervisor** — Build: LangGraph Supervisor (build · M): Build a LangGraph supervisor that routes to 4 specialist subgraphs by intent using structured LLM output, persistence checkpointers, and thread state tracking; verify with 10 routing tests.
* **build-specialists** — Build: Specialist Subgraphs & Loops (build · M): Build Scheduler, Scribe, Researcher, and Analyst subgraphs, integrating local API tools and bridging async event loops with sync supervisor threads; verify with mock task completions.
* **scratchpads-working-memory** — Scratchpads (concept · S): what the agent remembers mid-task.

#### Cluster: Real Agents
* **build-research-agent** — Build: Research Agent (build · L): web-search tool + multi-step plans + cited synthesis.
* **add-the-gate** — Build: Add the Gate (build · M): HITL approval before it saves anything.
* **agent-failure-modes** — Agent Failure Modes (concept · S): infinite loops, tool spam, derailment — and guards.
* **cost-latency-budgets** — Cost & Latency Budgets (concept · S): agents burn tokens; engineer the bill.
* **build-node-proposer** — Build: The Node-Proposer (build · L): an agent that proposes brain nodes for my approval — the seed of The Bridge.
* **synthesis-agents** — Synthesis: Chatbot vs Agent (synthesis · S): explained forever.
* **capstone-agents** — 🏁 Capstone: Agents (capstone · M): milestone mega-post + replan checkpoint.

### DOMAIN 05 — MULTI-AGENT & MCP · ring: `multi-agent-mcp` · 19 nodes
*Teams of agents and the protocols that connect everything.*

#### Cluster: Teams
* **when-many-beats-one** — When Many Beats One (concept · S): honest criteria for multi-agent (and when it's hype).
* **orchestrator-worker** — Orchestrator–Worker (concept · S): the supervisor pattern, formalized.
* **handoffs-routing** — Handoffs & Routing (concept · S): tasks moving between agents cleanly.
* **shared-state-patterns** — Shared State (concept · S): scratchpads, blackboards, message passing.
* **parallel-agents** — Parallel Agents (concept · S): fan-out/fan-in; what's safe to parallelize.
* **debate-consensus** — Debate & Consensus (concept · S): agents arguing their way to better answers.
* **token-economics-of-teams** — Token Economics of Teams (concept · S): multi-agent cost math, honestly.

#### Cluster: MCP & Protocols
* **mcp-fundamentals** — MCP: The USB-C of AI (concept · M): why one protocol won tool connectivity.
* **build-mcp-server** — Build: System Utilities MCP Server (build · M): Build a custom Model Context Protocol server exposing system utility tools, handling stdio communication, and executing subprocess actions; verify with a command-line client.
* **build-mcp-bridge** — Build: Async MCP Sync Bridge (build · M): Build a background event loop wrapper that executes async MCP client calls within sync LangGraph thread environments; verify by invoking tools concurrently.
* **mcp-clients** — MCP Clients (build · S): connect my server to a client and call it.
* **mcp-resources-prompts** — MCP Deep: Resources & Prompts (concept · S): beyond tools — the full spec.
* **mcp-security** — MCP Security (concept · M): tool poisoning, confused deputies — the new attack surface.
* **protocol-landscape** — The Protocol Landscape (frontier · S): A2A and whatever is current when I light this node.

#### Cluster: Team Builds
* **build-writer-critic** — Build: Writer + Critic (build · M): two agents improving a draft in a loop; add a supervisor; measure gain.
* **build-brain-mcp-server** — Build: Brain MCP Server (build · L): expose my brain graph as MCP tools — any AI client can query my learning.
* **experiment-one-vs-many** — Experiment: One vs Many (build · M): same task, single vs multi; publish the honest finding.
* **synthesis-multi-agent** — Synthesis: The Connected-Agents Map (synthesis · S).
* **capstone-multi-agent** — 🏁 Capstone: Multi-Agent (capstone · M): + replan checkpoint.

### DOMAIN 06 — MEMORY & KNOWLEDGE · ring: `memory-knowledge` · 19 nodes
*Agents that remember, and knowledge shaped as graphs.*

#### Cluster: Agent Memory
* **build-memory-taxonomy** — Build: Memory Taxonomy (build · S): Build a semantic memory extraction service that classifies inputs into semantic, episodic, and procedural categories and stores them in Postgres tables; verify with test conversation snippets.
* **memory-architectures** — Memory Architectures (concept · S): context vs store; the memory stack.
* **memory-extraction** — Memory Extraction (concept · S): conversations → durable facts.
* **retrieval-and-decay** — Retrieval & Decay (concept · S): importance, recency, forgetting on purpose.
* **memory-frameworks** — Memory Frameworks (frontier · S): the current landscape when I light this node.
* **compaction-summarization** — Compaction & Summarization (concept · S): keeping memory small and sharp.
* **personalization-via-memory** — Personalization (concept · S): assistants that actually know you.
* **privacy-in-memory** — Privacy in Memory (concept · S): what should never be remembered.

#### Cluster: Knowledge Graphs
* **knowledge-graphs-101** — Knowledge Graphs 101 (concept · S): entities, relations, triples.
* **entity-extraction** — Entity Extraction (build · M): LLM pulls entities/relations from my notes.
* **graphrag-deep** — GraphRAG Properly (concept · M): community summaries, graph-aware retrieval.
* **temporal-knowledge** — Temporal Knowledge (concept · S): facts that change over time.
* **brain-as-knowledge-graph** — My Brain, Formalized (concept · M): map my graph to a real KG schema.

#### Cluster: Memory Builds
* **build-memory-layer** — Build: Memory Layer (build · L): long-term memory bolted onto my research agent — extraction, retrieval, importance.
* **build-link-suggester-v2** — Build: Link-Suggester v2 (build · M): entity-aware edge proposals for the brain, still human-approved.
* **build-brain-reviewer** — Build: Self-Critical Graph Reviewer (build · M): Build a self-review script that parses note links, identifies sparse domains, and prompts LLMs to suggest new entity connections and honesty checks; verify with local note files.
* **build-learning-recall-agent** — Build: "What Did I Learn?" Agent (build · M): ask my brain about any period; grounded, node-cited answers.
* **synthesis-memory** — Synthesis: The Memory Stack (synthesis · S).
* **capstone-memory** — 🏁 Capstone: Memory (capstone · M): "I built an AI that remembers" + replan checkpoint.

### DOMAIN 07 — EVALS & OBSERVABILITY · ring: `evals-observability` · 19 nodes
*The senior-engineer superpower: measuring non-deterministic systems.*

#### Cluster: Measuring Quality
* **why-evals-rule** — Why Evals Rule Everything (concept · S): you can't improve what you can't measure.
* **build-golden-dataset** — Build: Golden Dataset (build · M): 20 golden cases for my research agent.
* **build-eval-judge** — Build: LLM-as-a-Judge Scorer (build · M): Build an LLM-as-a-judge scoring engine using customized rubrics, confidence metrics, and golden dataset assertions; verify by scoring 20 generated agent responses.
* **judge-bias-pinning** — Judge Bias & Pinning (concept · S): when the judge is wrong; version-pin the judge.
* **trajectory-evals** — Trajectory Evals (concept · S): scoring the path, not just the answer.
* **tool-use-metrics** — Tool-Use Metrics (concept · S): right tool, right args, right time.
* **eval-frameworks-hands-on** — Eval Frameworks Hands-on (build · M): run current frameworks on my brain-chat.
* **prompt-regression-tests** — Prompt Regression Tests (build · S): freeze behavior; catch silent breakage.
* **ci-gates-for-ai** — CI Gates for AI (concept · S): evals as merge blockers.

#### Cluster: Seeing Inside
* **build-tracing-instrumentation** — Build: Tracing & Instrumentation (build · M): Build a tracing integration that tracks agent executions, span latency, and nested subgraphs using open telemetry SDKs/Langfuse; verify by generating nested run traces.
* **reading-traces** — Reading Traces (build · S): debug a real agent failure from its trace.
* **online-evals** — Online Evals (concept · S): scoring production traffic continuously.
* **ab-testing-prompts** — A/B Testing Prompts (concept · S): shipping prompt changes like features.
* **cost-latency-dashboards** — Cost & Latency Dashboards (build · M): see the money and the milliseconds.

#### Cluster: The Harness
* **build-eval-harness** — Build: Eval Harness (build · L): trajectory + judge + regression around the node-proposer, one command.
* **failure-to-golden-loop** — Build: Failure→Golden Loop (build · M): every bug becomes a permanent test.
* **error-analysis-practice** — Error Analysis Practice (build · S): categorize 20 failures; find the pattern.
* **synthesis-evals** — Synthesis: Eval-Driven Development (synthesis · S): the full EDD loop, internalized.
* **capstone-evals** — 🏁 Capstone: Evals (capstone · M): "How I test software that's never the same twice" + replan checkpoint.

### DOMAIN 08 — SAFETY & SECURITY · ring: `safety-security` · 20 nodes
*Building agents that can't be turned against you.*

#### Cluster: The Attacks
* **agent-threat-model** — The Threat Model (concept · M): everything that can go wrong with an agent, mapped.
* **direct-injection** — Direct Prompt Injection (concept · S): attacks in the user's own message.
* **build-overlap-scanner** — Build: Indirect Injection Overlap Scanner (build · M): Build a security scanner that parses payloads for override keywords and correlates thread checkpoints to detect untrusted data overlap; verify with custom injection attacks.
* **jailbreaks-redteaming** — Jailbreaks & Red-Teaming (concept · S): thinking like the attacker.
* **supply-chain-risks** — Supply-Chain Risks (concept · S): poisoned packages, models, and MCP servers.

#### Cluster: The Defenses
* **spotlighting-delimiters** — Spotlighting & Delimiters (concept · S): quarantining untrusted content.
* **lethal-trifecta** — The Lethal Trifecta & Rule of Two (concept · S): private data + untrusted input + exfil paths.
* **least-privilege-tools** — Least-Privilege Tools (concept · S): capabilities, not keys to everything.
* **build-proposal-gate** — Build: HITL Proposal Gate (build · M): Build a database-backed proposal queue that intercepts agent actions, checks risk policies, and supports user editing of payloads before execution; verify with mock email/task proposals.
* **build-idempotency-audit** — Build: Idempotency & Audit Logger (build · M): Build an append-only database auditor and idempotency key guard ensuring critical actions are executed exactly once and logged to a tamper-evident table; verify with duplicate runs.
* **guardrails-in-out** — Guardrails In & Out (concept · S): input scanning, output enforcement.
* **pii-redaction** — PII Redaction (build · S): scrub personal data before the model sees it.
* **refusals-content-safety** — Refusals & Content Safety (concept · S): designing what my system won't do.
* **sandboxing-isolation** — Sandboxing & Isolation (concept · S): blast-radius thinking for tools.

#### Cluster: Prove It
* **build-redteam-my-agent** — Build: Red-Team My Agent (build · M): attack my own agent with injection payloads.
* **fix-what-broke** — Build: Fix What Broke (build · M): patch the holes; document each fix.
* **build-injection-suite** — Build: Injection Test Suite (build · M): permanent attack suite + CI; zero-exfil gate.
* **responsible-shipping** — Responsible Shipping (concept · S): what you owe the public when you deploy AI.
* **synthesis-safety** — Synthesis: Defense in Depth (synthesis · S): the layered diagram.
* **capstone-safety** — 🏁 Capstone: Safety (capstone · M): "I attacked my own AI. Here's what I learned" + replan checkpoint.

### DOMAIN 09 — PRODUCTION · ring: `production` · 22 nodes
*Take systems to the real world. Home ring of RESURRECTION and THE BRIDGE — both pull-forwardable any time.*

#### Cluster: The Backend Craft
* **build-fastapi-backend** — Build: Core FastAPI Application (build · M): Build the main backend REST API with route controllers, settings validation, state serialization, and SSE token streaming channels; verify using simulated client connections.
* **sse-streaming** — SSE & Streaming (concept · S): how tokens travel from server to screen.
* **build-briefing-scheduler** — Build: Briefing Scheduler & Cron (build · M): Build a background cron scheduler that runs periodic briefing builders, aggregating calendars, emails, and notes into structured summaries; verify by triggering manual runs.
* **build-migration-runner** — Build: Migration Runner & Pool (build · M): Build a schema migration runner that connects to PostgreSQL, manages transaction safety, runs sequential SQL migrations, and exposes database pooling; verify with a clean database reset.
* **docker-for-ai** — Docker for AI Services (build · M): containerize a small service myself.
* **deploying-backends** — Deploying Backends (frontier · S): current hosting options and tradeoffs when I light this node.
* **secrets-done-right** — Secrets Done Right (concept · S): env, vaults, rotation — never again in a repo.
* **google-oauth-flow** — Build: Google OAuth Integration (build · M): Build a Google OAuth2 client with flow initialization, token storage/rotation, and local redirection handlers; verify with a web authentication login.
* **gmail-calendar-read** — Build: Gmail & Calendar Reader (build · M): Build services that read from Gmail and Calendar APIs, parse MIME message details, format queries, and sanitize untrusted content markers; verify by listing recent inbox items.

#### Cluster: The Platform
* **supabase-deep-dive** — Supabase Deep Dive (concept · M): auth, RLS, realtime — the whole platform.
* **realtime-subscriptions** — Build: Realtime Postgres Approvals UI (build · M): Build a Next.js Approvals UI that subscribes to PostgreSQL changes via Supabase realtime channels and updates the cockpit layout dynamically; verify by simulating database inserts.
* **build-command-center** — Build: Command Center UI (build · M): Build the Next.js React cockpit dashboard featuring chat interfaces, state graphs, real-time activity views, and audit logging pages; verify with simulated server messages.
* **caching-layers** — Caching Layers (concept · S): response cache, semantic cache, CDN.
* **build-poller-engine** — Build: Async Queue Poller (build · S): Build a terminal-based and web-based queue poller that fetches pending database tasks, checks status transitions, and triggers executors; verify with mock queues.
* **webhooks-telegram** — Webhooks & Telegram (build · S): wire a real notification path.
* **monitoring-alerting** — Monitoring & Alerting (concept · S): knowing it broke before users do.
* **build-demo-mode** — Build: Credential-Free Demo Mode (build · S): Design and build a credential-free mock/simulator mode for the dashboard and backend APIs to run safely without live keys; verify by running local tests.

#### Cluster: The Resurrection
* **resurrection** — 🔥 Build: RESURRECTION (build · L): deploy Machine 1 + Machine 2 with my own hands — env, DB, migrations, OAuth, scheduler, gate, dashboard, every subsystem verified. -> M1
* **the-bridge** — 🔥 Build: THE BRIDGE (build · L): the deployed agent proposes brain nodes through its own approval gate — agent + brain, one nervous system. -> M2
* **hardening-pass** — Build: Hardening Pass (build · M): load, cost caps, failure drills.
* **synthesis-production** — Synthesis: The Production Diagram (synthesis · S): the full system, mine now.
* **capstone-production** — 🏁 Capstone: Production (capstone · M): "The AI built it. I understood it. I run it." + replan checkpoint.

### DOMAIN 10 — FRONTIER & CAPSTONE · ring: `frontier-capstone` · 21 nodes
*THE MOST FLUID RING BY DESIGN — the capstone-production replan checkpoint rewrites the frontier cluster from a fresh frontier-scan before I enter it.*

#### Cluster: The Moving Edge (baseline guesses — expect replans)
* **local-models** — Local Models (build · M): run a model on my own laptop.
* **fine-tuning-when-why** — Fine-Tuning: When & Why (concept · M): adapter concepts; the buy-vs-tune decision.
* **small-distilled-models** — Small & Distilled Models (concept · S): why tiny models are eating the edge.
* **voice-agents** — Voice Agents (concept · M): realtime speech loops; latency budgets.
* **computer-use-agents** — Computer-Use & Browser Agents (concept · M): agents that click and type.
* **coding-agents** — Coding Agents (concept · S): how the tools that built VIZIER actually work.
* **agentic-rag-frontiers** — Agentic RAG Frontiers (concept · S): retrieval as a tool inside the loop.
* **reasoning-test-time-compute** — Reasoning & Test-Time Compute (concept · S): models that think longer, not just bigger.
* **protocol-futures** — Protocol Futures (frontier · S): where MCP/A2A and successors are heading — live view.
* **reading-papers-forever** — Reading Papers Forever (concept · S): a personal system to stay frontier forever.

#### Cluster: VIZIER v2 — The Final Masterpiece
* **define-vizier-v2** — Define VIZIER v2 (capstone · M): spec the unified agent+brain, written by ME. -> M5
* **build-vizier-v2-core** — Build: v2 Core Loop (build · L).
* **vizier-v2-memory-retrieval** — Build: v2 Memory + Retrieval (build · L).
* **vizier-v2-gate-safety** — Build: v2 Gate + Safety (build · M).
* **vizier-v2-evals-traces** — Build: v2 Evals + Traces (build · M).
* **vizier-v2-redteam-ship** — Build: v2 Red-Team & Ship (build · M): golden gate, then deploy.

#### Cluster: Graduation
* **the-full-story** — The Full Story (synthesis · M): long-form essay — the whole arc.
* **the-demo-film** — The Demo Film (build · S): record the cinematic brain tour + system walkthrough.
* **portfolio-integration** — Portfolio Integration (build · M): VIZIER takes its throne on tharungajula.vercel.app.
* **retrospective** — Retrospective (synthesis · S): what actually changed in me; honest lessons.
* **graduation** — 🏆 GRADUATION (capstone · S): the graph is lit. Publish the mega-post. Begin again.

## 17. Cross-Domain Edge Wiring
* **study-gateway** → `mcp-fundamentals`
* **hybrid-search-rrf** → `graphrag-deep`
* **hitl-interrupts** → `the-approval-gate`
* **designing-tools** → `build-mcp-server`
* **build-golden-dataset** → `build-redteam-my-agent`
* **hallucination** → `citations-grounding`
* **build-node-proposer** → `the-bridge`
* **injection-first-look** → `direct-injection`
* **tool-calling** → `what-makes-an-agent`
* **build-chat-with-my-brain** → `build-brain-mcp-server`
* **memory-taxonomy** → `build-memory-layer`
* **tracing-spans** → `monitoring-alerting`
* **Domain Capstone Progression**: Each domain's capstone connects to the next domain's first node.
* **Milestone Anchors**: Every milestone points to its baseline node.

