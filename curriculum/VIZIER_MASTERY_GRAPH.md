# VIZIER — THE MASTERY GRAPH (v1.0.0)
### 200 nodes. 10 domains. One 250-day marathon. The past is locked. The future evolves.

---

## HOW THIS GRAPH WORKS (the whole philosophy — read first)

**NODES, NOT DAYS.** The marathon is 250 days of showing up — the graph doesn't care
which day a node falls on. Some nodes take an hour; some take four days. Finishing three
nodes on a Saturday and zero on a busy Tuesday are both healthy. Progress is asymmetric
by nature; the brain displays it honestly with three states: **ghost** (planned) →
**charging** (in progress, pulsing) → **lit** (done, glowing, locked forever).

**WHY 200 NODES (and why it's not a hard number).** v1.0 ships with exactly **200
nodes** because that's what full-anatomy coverage honestly requires today: every domain a
senior AI engineer must own — foundations, APIs, retrieval, agents, protocols, memory,
evaluation, security, production, and the frontier — at Feynman depth, with real builds
(~60 build nodes), deep-dives into my own frozen agent system (~15 🔩 nodes), and hard
capstones. 200 over 250 days is deliberate breathing room: L-nodes get multiple days,
S-nodes can double up, and life happens. But 200 is the *starting* count, not a
contract — `replan` and `frontier-scan` will add, deepen, and swap ghost nodes as the
field moves. **Mastery = finishing a LIVING graph, not a frozen list.** God-level isn't
"did 200 things"; it's "the map kept up with the frontier and I lit all of it."

**THE RULES:**
1. The 10 domains (rings) are the permanent spine. Nodes inside them evolve; rings never do.
2. A lit node is immutable — tooling must refuse to alter it.
3. A node isn't lit until its note has a Feynman explanation (and, for build nodes, an
   artifact that runs).
4. Notes use [[wikilinks]] freely; the daily rebuild rewires edges and backlinks — the
   organic connections I notice are as important as the planned ones.
5. `day:close` runs every single day of the marathon, lit node or not. Charging is real work.
6. Replans need a written reason in the changelog. Never replan from restlessness.
7. `frontier` nodes are explicit placeholders — regenerated from a fresh frontier-scan
   when I approach them, so they always reflect the field AS IT IS, not as it was on day 1.

**Node line format (for the parser):**
`- id — Title (type · size): summary` — type ∈ concept | build | deep-dive | synthesis |
frontier | capstone; size ∈ S (≤1 day) | M (1–2 days) | L (3+ days). 🔩 marks deep-dives
into `agent-lab/`. Cluster headers group nodes; clusters imply sequence edges.

---

## FLOATING MILESTONES (parse into curriculum.json → milestones[])

- **M1 — RESURRECTION** · related: production · Deploy Machine 1 (backend) and Machine 2
  (dashboard) with my own hands — env, DB, migrations, OAuth, scheduler, gate, UI.
  Trigger ANY day via "unfreeze agent-lab". Baseline node: `resurrection`.
- **M2 — THE BRIDGE** · related: production, agents · The deployed agent proposes new
  brain nodes through its own human-approval gate — agent and brain become one nervous
  system. Baseline node: `the-bridge`.
- **M3 — FIRST PUBLIC ARTIFACT** · related: prompting-apis · Ship something strangers can
  use. Baseline node: `build-feynman-bot`.
- **M4 — HALF-LIT BRAIN** · related: all · 50% of current plan's nodes lit; the halfway
  story post.
- **M5 — VIZIER v2** · related: frontier-capstone · The final capstone: a unified
  agent+brain system spec'd and built by ME, not by an IDE agent. Baseline node:
  `define-vizier-v2`.

---

## DOMAIN 01 — FOUNDATIONS · ring: `foundations` · 21 nodes
*How AI actually works, plus the engineer's floor everything stands on.*

### Cluster: How AI Works
- map-of-ai — The Map of AI (concept · S): AI vs ML vs DL vs GenAI vs Agentic — the family tree.
- how-machines-learn — How Machines Learn (concept · S): weights, loss, gradient descent — pure intuition.
- what-is-a-language-model — What a Language Model Is (concept · S): next-token prediction, and why that's enough for magic.
- tokens — Tokens (concept · S): play with a real tokenizer; why "strawberry" confuses models.
- embeddings-intuition — Embeddings Intuition (concept · S): meaning as coordinates; nearest-neighbor thinking.
- attention-transformers — Attention & Transformers (concept · M): the "every word looks at every word" idea.
- training-pipeline — Pretraining → Fine-tuning → RLHF (concept · S): the three-stage recipe behind every chatbot.
- context-windows — Context Windows (concept · S): the model's short-term memory and what fits.
- sampling-controls — Temperature & Top-p (concept · S): why the same prompt gives different answers.
- hallucination — Hallucination (concept · S): why models confidently make things up; grounding preview.
- model-landscape — The Current Model Landscape (frontier · S): open vs closed, frontier vs small — as of the day I light this node.

### Cluster: The Engineer's Floor
- python-environments — Environments & Packages (build · S): venv, pip, running scripts like a pro.
- python-data-shapes — Data Shapes (build · S): functions, dicts, JSON — the shapes of AI data.
- python-classes-modules — Classes & Modules (build · S): reading real codebases.
- python-async — Async/Await (build · M): why AI apps need it; hands-on.
- python-typing-pydantic — Types & Pydantic (build · S): the schema mindset.
- git-mastery — Git Mastery (build · S): branches, commits, history — understand my own daily ritual.
- terminal-fluency — Terminal Fluency (build · S): navigate, pipe, grep — no more fear.
- build-token-cost-calculator — Build: Token & Cost Calculator (build · M): count tokens, estimate API cost, write the explainer.

### Cluster: Consolidation
- synthesis-foundations — Synthesis: The Foundations Map (synthesis · S): explain "how an LLM works" to a 12-year-old, end to end.
- capstone-foundations — 🏁 Capstone: Foundations (capstone · M): mega-note + carousel "How AI really works" + replan checkpoint.

## DOMAIN 02 — PROMPTING & LLM APIs · ring: `prompting-apis` · 20 nodes
*Talk to models like an engineer: APIs, structure, tools, reliability.*

### Cluster: Speaking to Models
- first-api-call — First API Call (build · S): call Gemini from Python; inspect the raw response.
- roles-and-system-prompts — Roles & System Prompts (concept · S): who's talking; why system prompts steer everything.
- prompt-skeleton — The Prompt Skeleton (concept · S): role + context + task + format — the reusable pattern.
- few-shot-prompting — Few-shot Examples (concept · S): when 3 examples beat 300 words.
- reasoning-prompts — Reasoning Prompts (concept · S): chain-of-thought, step-by-step, and their limits.
- structured-output — Structured Output (build · S): force clean JSON out of a model; parse safely.
- tool-calling — Tool / Function Calling (concept · M): the single most important mechanic in agentic AI.

### Cluster: Engineering the Call
- streaming-responses — Streaming (build · S): tokens flowing into the terminal, live.
- errors-retries-backoff — Errors, Retries, Backoff (build · S): API calls that survive failure.
- rate-limits-caching — Rate Limits & Caching (concept · S): why free tiers throttle; how caching saves you.
- study-gateway — 🔩 Deep-dive: gateway.py (deep-dive · M): my own multi-provider fallback gateway, finally readable.
- injection-first-look — Prompt Injection: First Look (concept · S): the attack that shapes everything later.
- multimodal-input — Multimodal In (build · S): send an image; extract structured info.
- voice-audio-apis — Voice & Audio APIs (concept · S): speech-to-text and text-to-speech landscape.
- long-context-strategies — Long-Context Strategies (concept · S): stuffing vs retrieval vs summarizing.
- prompt-quality — Is My Prompt Good? (concept · S): informal evaluation; A/B thinking begins.

### Cluster: First Ships
- build-cli-chatbot — Build: CLI Chatbot (build · M): terminal chatbot with in-session memory, streaming, a persona.
- build-feynman-bot — Build: Feynman-Bot (build · L): explains any AI term with an Indian-life analogy — ship it public. → M3
- synthesis-apis — Synthesis: The API Layer (synthesis · S): the whole call path, explained start to finish.
- capstone-apis — 🏁 Capstone: APIs (capstone · M): "I taught a computer to take orders" + replan checkpoint.

## DOMAIN 03 — RAG & RETRIEVAL · ring: `rag-retrieval` · 21 nodes
*Ground models in real knowledge: embeddings, vector search, citations.*

### Cluster: Retrieval Fundamentals
- why-rag — Why RAG Exists (concept · S): closed-book vs open-book exams; the grounding solution.
- embeddings-hands-on — Embeddings Hands-on (build · S): embed sentences; cosine similarity by hand.
- chunking — Chunking (concept · S): slicing documents; why overlap matters.
- vector-databases — Vector Databases (concept · M): what pgvector/HNSW actually do.
- build-first-rag — Build: First RAG Pipeline (build · M): ingest → embed → store → retrieve → answer.

### Cluster: Retrieval, Seriously
- keyword-fulltext-search — Keyword & Full-Text Search (concept · S): BM25/tsvector — old magic that still wins.
- hybrid-search-rrf — 🔩 Deep-dive: Hybrid Search + RRF (deep-dive · M): my own retrieve.py — vectors + keywords merged.
- reranking — Reranking (concept · S): the second pass that fixes retrieval quality.
- citations-grounding — Citations & Grounding (build · S): every answer points at its source.
- rag-failure-modes — RAG Failure Modes (concept · S): lost-in-the-middle, bad chunks, stale indexes.
- metadata-filters — Metadata & Filters (build · S): retrieval with structure — dates, tags, domains.
- query-rewriting-hyde — Query Rewriting & HyDE (concept · S): fixing bad questions before retrieval.
- multi-hop-retrieval — Multi-hop Retrieval (concept · S): questions that need two lookups.
- ingestion-pipelines — Ingestion Pipelines (build · M): PDFs and messy HTML → clean chunks.
- rag-evals-intro — RAG Evals Intro (concept · S): faithfulness & context recall — measuring groundedness.

### Cluster: RAG on My Own Brain
- build-chat-with-my-brain — Build: Chat With My Brain (build · L): RAG over my own notes, with citations + domain filters — meta and glorious.
- evaluate-brain-chat — Build: Evaluate It (build · M): mini golden set; score faithfulness.
- graphrag-preview — GraphRAG Preview (concept · S): when knowledge is a graph, not a pile.
- semantic-caching — Semantic Caching (concept · S): answering repeat questions for free.
- synthesis-rag — Synthesis: The Retrieval Story (synthesis · S): the full pipeline, one diagram.
- capstone-rag — 🏁 Capstone: Retrieval (capstone · M): "I gave AI an open book" + replan checkpoint.

## DOMAIN 04 — AGENTS · ring: `agents` · 20 nodes
*From chatbot to agent: loops, tools, state, LangGraph.*

### Cluster: The Loop
- what-makes-an-agent — What Makes an Agent (concept · S): reason, act, observe, repeat.
- react-by-hand — ReAct By Hand (build · S): run the loop manually on paper with a real task.
- designing-tools — Designing Tools (concept · S): schemas, descriptions, why naming matters.
- build-agent-from-scratch — Build: Agent From Scratch (build · M): pure-Python loop, no framework.

### Cluster: LangGraph & Patterns
- langgraph-state — LangGraph: Nodes & State (concept · M): the graph mental model.
- langgraph-checkpointers — Checkpointers (concept · S): pause, resume, survive crashes.
- hitl-interrupts — Human-in-the-Loop Interrupts (build · M): an agent that stops and asks permission.
- plan-and-execute — Plan-and-Execute (concept · S): planners vs reactors.
- reflection-patterns — Reflection / Reflexion (concept · S): agents that critique themselves.
- subgraphs — Subgraphs (concept · S): agents made of agents.
- study-supervisor — 🔩 Deep-dive: supervisor.py (deep-dive · M): my own supervisor router, understood.
- study-specialists — 🔩 Deep-dive: specialists.py (deep-dive · M): Scheduler, Scribe, Researcher, Analyst dissected.
- scratchpads-working-memory — Scratchpads (concept · S): what the agent remembers mid-task.

### Cluster: Real Agents
- build-research-agent — Build: Research Agent (build · L): web-search tool + multi-step plans + cited synthesis.
- add-the-gate — Build: Add the Gate (build · M): HITL approval before it saves anything.
- agent-failure-modes — Agent Failure Modes (concept · S): infinite loops, tool spam, derailment — and guards.
- cost-latency-budgets — Cost & Latency Budgets (concept · S): agents burn tokens; engineer the bill.
- build-node-proposer — Build: The Node-Proposer (build · L): an agent that proposes brain nodes for my approval — the seed of The Bridge.
- synthesis-agents — Synthesis: Chatbot vs Agent (synthesis · S): explained forever.
- capstone-agents — 🏁 Capstone: Agents (capstone · M): milestone mega-post + replan checkpoint.

## DOMAIN 05 — MULTI-AGENT & MCP · ring: `multi-agent-mcp` · 18 nodes
*Teams of agents and the protocols that connect everything.*

### Cluster: Teams
- when-many-beats-one — When Many Beats One (concept · S): honest criteria for multi-agent (and when it's hype).
- orchestrator-worker — Orchestrator–Worker (concept · S): the supervisor pattern, formalized.
- handoffs-routing — Handoffs & Routing (concept · S): tasks moving between agents cleanly.
- shared-state-patterns — Shared State (concept · S): scratchpads, blackboards, message passing.
- parallel-agents — Parallel Agents (concept · S): fan-out/fan-in; what's safe to parallelize.
- debate-consensus — Debate & Consensus (concept · S): agents arguing their way to better answers.
- token-economics-of-teams — Token Economics of Teams (concept · S): multi-agent cost math, honestly.

### Cluster: MCP & Protocols
- mcp-fundamentals — MCP: The USB-C of AI (concept · M): why one protocol won tool connectivity.
- build-mcp-server — 🔩 Build: My First MCP Server (deep-dive · M): study vizier_utils_server.py, then extend it.
- mcp-clients — MCP Clients (build · S): connect my server to a client and call it.
- mcp-resources-prompts — MCP Deep: Resources & Prompts (concept · S): beyond tools — the full spec.
- mcp-security — MCP Security (concept · M): tool poisoning, confused deputies — the new attack surface.
- protocol-landscape — The Protocol Landscape (frontier · S): A2A and whatever is current when I light this node.

### Cluster: Team Builds
- build-writer-critic — Build: Writer + Critic (build · M): two agents improving a draft in a loop; add a supervisor; measure gain.
- build-brain-mcp-server — Build: Brain MCP Server (build · L): expose my brain graph as MCP tools — any AI client can query my learning.
- experiment-one-vs-many — Experiment: One vs Many (build · M): same task, single vs multi; publish the honest finding.
- synthesis-multi-agent — Synthesis: The Connected-Agents Map (synthesis · S).
- capstone-multi-agent — 🏁 Capstone: Multi-Agent (capstone · M): + replan checkpoint.

## DOMAIN 06 — MEMORY & KNOWLEDGE · ring: `memory-knowledge` · 18 nodes
*Agents that remember, and knowledge shaped as graphs.*

### Cluster: Agent Memory
- memory-taxonomy — 🔩 Memory Taxonomy (deep-dive · S): semantic/episodic/procedural — study my own memories table.
- memory-architectures — Memory Architectures (concept · S): context vs store; the memory stack.
- memory-extraction — Memory Extraction (concept · S): conversations → durable facts.
- retrieval-and-decay — Retrieval & Decay (concept · S): importance, recency, forgetting on purpose.
- memory-frameworks — Memory Frameworks (frontier · S): the current landscape when I light this node.
- compaction-summarization — Compaction & Summarization (concept · S): keeping memory small and sharp.
- personalization-via-memory — Personalization (concept · S): assistants that actually know you.
- privacy-in-memory — Privacy in Memory (concept · S): what should never be remembered.

### Cluster: Knowledge Graphs
- knowledge-graphs-101 — Knowledge Graphs 101 (concept · S): entities, relations, triples.
- entity-extraction — Entity Extraction (build · M): LLM pulls entities/relations from my notes.
- graphrag-deep — GraphRAG Properly (concept · M): community summaries, graph-aware retrieval.
- temporal-knowledge — Temporal Knowledge (concept · S): facts that change over time.
- brain-as-knowledge-graph — My Brain, Formalized (concept · M): map my graph to a real KG schema.

### Cluster: Memory Builds
- build-memory-layer — Build: Memory Layer (build · L): long-term memory bolted onto my research agent — extraction, retrieval, importance.
- build-link-suggester-v2 — Build: Link-Suggester v2 (build · M): entity-aware edge proposals for the brain, still human-approved.
- build-learning-recall-agent — Build: "What Did I Learn?" Agent (build · M): ask my brain about any period; grounded, node-cited answers.
- synthesis-memory — Synthesis: The Memory Stack (synthesis · S).
- capstone-memory — 🏁 Capstone: Memory (capstone · M): "I built an AI that remembers" + replan checkpoint.

## DOMAIN 07 — EVALS & OBSERVABILITY · ring: `evals-observability` · 19 nodes
*The senior-engineer superpower: measuring non-deterministic systems.*

### Cluster: Measuring Quality
- why-evals-rule — Why Evals Rule Everything (concept · S): you can't improve what you can't measure.
- build-golden-dataset — Build: Golden Dataset (build · M): 20 golden cases for my research agent.
- llm-as-judge — 🔩 LLM-as-Judge (deep-dive · M): study my own evals.py; judging with rubrics.
- judge-bias-pinning — Judge Bias & Pinning (concept · S): when the judge is wrong; version-pin the judge.
- trajectory-evals — Trajectory Evals (concept · S): scoring the path, not just the answer.
- tool-use-metrics — Tool-Use Metrics (concept · S): right tool, right args, right time.
- eval-frameworks-hands-on — Eval Frameworks Hands-on (build · M): run current frameworks on my brain-chat.
- prompt-regression-tests — Prompt Regression Tests (build · S): freeze behavior; catch silent breakage.
- ci-gates-for-ai — CI Gates for AI (concept · S): evals as merge blockers.

### Cluster: Seeing Inside
- tracing-spans — 🔩 Tracing: Spans & Traces (deep-dive · M): study observability.py; the tracing model.
- reading-traces — Reading Traces (build · S): debug a real agent failure from its trace.
- online-evals — Online Evals (concept · S): scoring production traffic continuously.
- ab-testing-prompts — A/B Testing Prompts (concept · S): shipping prompt changes like features.
- cost-latency-dashboards — Cost & Latency Dashboards (build · M): see the money and the milliseconds.

### Cluster: The Harness
- build-eval-harness — Build: Eval Harness (build · L): trajectory + judge + regression around the node-proposer, one command.
- failure-to-golden-loop — Build: Failure→Golden Loop (build · M): every bug becomes a permanent test.
- error-analysis-practice — Error Analysis Practice (build · S): categorize 20 failures; find the pattern.
- synthesis-evals — Synthesis: Eval-Driven Development (synthesis · S): the full EDD loop, internalized.
- capstone-evals — 🏁 Capstone: Evals (capstone · M): "How I test software that's never the same twice" + replan checkpoint.

## DOMAIN 08 — SAFETY & SECURITY · ring: `safety-security` · 20 nodes
*Building agents that can't be turned against you.*

### Cluster: The Attacks
- agent-threat-model — The Threat Model (concept · M): everything that can go wrong with an agent, mapped.
- direct-injection — Direct Prompt Injection (concept · S): attacks in the user's own message.
- indirect-injection — 🔩 Indirect Injection (deep-dive · M): study my own scanner.py — poisoned emails & pages.
- jailbreaks-redteaming — Jailbreaks & Red-Teaming (concept · S): thinking like the attacker.
- supply-chain-risks — Supply-Chain Risks (concept · S): poisoned packages, models, and MCP servers.

### Cluster: The Defenses
- spotlighting-delimiters — Spotlighting & Delimiters (concept · S): quarantining untrusted content.
- lethal-trifecta — The Lethal Trifecta & Rule of Two (concept · S): private data + untrusted input + exfil paths.
- least-privilege-tools — Least-Privilege Tools (concept · S): capabilities, not keys to everything.
- the-approval-gate — 🔩 The Approval Gate (deep-dive · M): study proposer.py — my own HITL gate, understood.
- idempotency-audit-logs — 🔩 Idempotency & Audit Logs (deep-dive · S): study audit.py; actions that can't double-fire.
- guardrails-in-out — Guardrails In & Out (concept · S): input scanning, output enforcement.
- pii-redaction — PII Redaction (build · S): scrub personal data before the model sees it.
- refusals-content-safety — Refusals & Content Safety (concept · S): designing what my system won't do.
- sandboxing-isolation — Sandboxing & Isolation (concept · S): blast-radius thinking for tools.

### Cluster: Prove It
- build-redteam-my-agent — Build: Red-Team My Agent (build · M): attack my own agent with injection payloads.
- fix-what-broke — Build: Fix What Broke (build · M): patch the holes; document each fix.
- build-injection-suite — Build: Injection Test Suite (build · M): permanent attack suite + CI; zero-exfil gate.
- responsible-shipping — Responsible Shipping (concept · S): what you owe the public when you deploy AI.
- synthesis-safety — Synthesis: Defense in Depth (synthesis · S): the layered diagram.
- capstone-safety — 🏁 Capstone: Safety (capstone · M): "I attacked my own AI. Here's what I learned" + replan checkpoint.

## DOMAIN 09 — PRODUCTION · ring: `production` · 19 nodes
*Take systems to the real world. Home ring of RESURRECTION and THE BRIDGE — both pull-forwardable any time.*

### Cluster: The Backend Craft
- fastapi-fundamentals — 🔩 FastAPI Fundamentals (deep-dive · M): study main.py; routes, models, dependency injection.
- sse-streaming — SSE & Streaming (concept · S): how tokens travel from server to screen.
- schedulers-cron — 🔩 Schedulers & Cron (deep-dive · S): study scheduler.py; the morning-briefing machinery.
- postgres-migrations — 🔩 Postgres & Migrations (deep-dive · M): study migrations/ 001–023; schema evolution.
- docker-for-ai — Docker for AI Services (build · M): containerize a small service myself.
- deploying-backends — Deploying Backends (frontier · S): current hosting options and tradeoffs when I light this node.
- secrets-done-right — Secrets Done Right (concept · S): env, vaults, rotation — never again in a repo.

### Cluster: The Platform
- supabase-deep-dive — Supabase Deep Dive (concept · M): auth, RLS, realtime — the whole platform.
- realtime-subscriptions — Realtime Subscriptions (build · S): live UI updates from Postgres changes.
- study-command-center — 🔩 The Command Center (deep-dive · M): study agent-lab/web — Next.js for AI dashboards.
- caching-layers — Caching Layers (concept · S): response cache, semantic cache, CDN.
- queues-pollers — 🔩 Queues & Pollers (deep-dive · S): study the approval poller; async job patterns.
- webhooks-telegram — Webhooks & Telegram (build · S): wire a real notification path.
- monitoring-alerting — Monitoring & Alerting (concept · S): knowing it broke before users do.

### Cluster: The Resurrection
- resurrection — 🔥 Build: RESURRECTION (build · L): deploy Machine 1 + Machine 2 with my own hands — env, DB, migrations, OAuth, scheduler, gate, dashboard, every subsystem verified. → M1
- the-bridge — 🔥 Build: THE BRIDGE (build · L): the deployed agent proposes brain nodes through its own approval gate — agent + brain, one nervous system. → M2
- hardening-pass — Build: Hardening Pass (build · M): load, cost caps, failure drills.
- synthesis-production — Synthesis: The Production Diagram (synthesis · S): the full system, mine now.
- capstone-production — 🏁 Capstone: Production (capstone · M): "The AI built it. I understood it. I run it." + replan checkpoint.

## DOMAIN 10 — FRONTIER & CAPSTONE · ring: `frontier-capstone` · 24 nodes
*THE MOST FLUID RING BY DESIGN — the capstone-production replan checkpoint rewrites the
frontier cluster from a fresh frontier-scan before I enter it.*

### Cluster: The Moving Edge (baseline guesses — expect replans)
- local-models — Local Models (build · M): run a model on my own laptop.
- fine-tuning-when-why — Fine-Tuning: When & Why (concept · M): adapter concepts; the buy-vs-tune decision.
- small-distilled-models — Small & Distilled Models (concept · S): why tiny models are eating the edge.
- voice-agents — Voice Agents (concept · M): realtime speech loops; latency budgets.
- computer-use-agents — Computer-Use & Browser Agents (concept · M): agents that click and type.
- coding-agents — Coding Agents (concept · S): how the tools that built VIZIER actually work.
- agentic-rag-frontiers — Agentic RAG Frontiers (concept · S): retrieval as a tool inside the loop.
- reasoning-test-time-compute — Reasoning & Test-Time Compute (concept · S): models that think longer, not just bigger.
- protocol-futures — Protocol Futures (frontier · S): where MCP/A2A and successors are heading — live view.
- reading-papers-forever — Reading Papers Forever (concept · S): a personal system to stay frontier after the marathon.
- frontier-slot-1 — Frontier Slot α (frontier · M): reserved — regenerated from frontier-scan on arrival.
- frontier-slot-2 — Frontier Slot β (frontier · M): reserved — regenerated from frontier-scan on arrival.
- frontier-slot-3 — Frontier Slot γ (frontier · M): reserved — regenerated from frontier-scan on arrival.

### Cluster: VIZIER v2 — The Final Masterpiece
- define-vizier-v2 — Define VIZIER v2 (capstone · M): spec the unified agent+brain, written by ME. → M5
- build-vizier-v2-core — Build: v2 Core Loop (build · L).
- vizier-v2-memory-retrieval — Build: v2 Memory + Retrieval (build · L).
- vizier-v2-gate-safety — Build: v2 Gate + Safety (build · M).
- vizier-v2-evals-traces — Build: v2 Evals + Traces (build · M).
- vizier-v2-redteam-ship — Build: v2 Red-Team & Ship (build · M): golden gate, then deploy.

### Cluster: Graduation
- the-full-story — The Full Story (synthesis · M): long-form essay — the whole arc.
- the-demo-film — The Demo Film (build · S): record the cinematic brain tour + system walkthrough.
- portfolio-integration — Portfolio Integration (build · M): VIZIER takes its throne on tharungajula.vercel.app.
- retrospective — Retrospective (synthesis · S): what actually changed in me; honest lessons.
- graduation — 🏆 GRADUATION (capstone · S): the graph is lit. Publish the mega-post. Begin again.

---

## CROSS-DOMAIN LINKS (encode as graph edges)
study-gateway → mcp-fundamentals · hybrid-search-rrf → graphrag-deep ·
hitl-interrupts → the-approval-gate · designing-tools → build-mcp-server ·
build-golden-dataset → build-redteam-my-agent · hallucination → citations-grounding ·
build-node-proposer → the-bridge · injection-first-look → direct-injection ·
tool-calling → what-makes-an-agent · build-chat-with-my-brain → build-brain-mcp-server ·
memory-taxonomy → build-memory-layer · tracing-spans → monitoring-alerting ·
each domain's capstone → the next domain's first node · every milestone → its baseline node.

## GRAPH TOTALS (v1.0.0)
21 + 20 + 21 + 20 + 18 + 18 + 19 + 20 + 19 + 24 = **200 nodes** · ~60 builds ·
15 🔩 deep-dives · 8 frontier placeholders · 10 capstones · 5 floating milestones.
This count will change — that's the point. The changelog will show every change and why.
