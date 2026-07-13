# VIZIER Agent Lab 🧪

This is VIZIER's agentic engine (supervisor + specialists, RAG, memory, HITL proposal gate, injection scanner, evals, observability), built agentically and **FROZEN** as a study artifact. The curriculum's 🔩 deep-dive nodes read these files, and the floating RESURRECTION milestone deploys them by hand — which may happen ANY time I choose ('unfreeze agent-lab'), early or late.

## Key Files Map

* **`backend/app/agents/supervisor.py`**: Coordinates the multi-agent execution loop (LangGraph) and persists checkpoint states in PostgreSQL.
* **`backend/app/agents/specialists.py`**: Contains tool bindings and execution sub-graphs for individual Scheduler, Scribe, Researcher, and Analyst specialists.
* **`backend/app/actions/proposer.py`**: Bridges agent proposals, checkpointer state, policy permission checks, and database record insertions.
* **`backend/app/actions/scanner.py`**: Provides keyword heuristics and semantic correlation checks to detect indirect prompt injection payloads.
* **`backend/app/evals.py`**: Evaluates system responses against a golden dataset using LLM-as-a-Judge grading scoring.
* **`backend/app/llm/gateway.py`**: Handles LiteLLM API completions with fallback providers, backoff logic, and on-disk caching.
* **`backend/app/rag/retrieve.py`**: Performs hybrid semantic GIN vector/keyword searches merged using Reciprocal Rank Fusion (RRF).
* **`backend/app/rag/memory.py`**: Manages semantic, episodic, and procedural memory extraction and vector database storage.
* **`backend/app/main.py`**: Launches the FastAPI server, serving REST endpoints and SSE streaming connections for the chat dashboard.
* **`backend/app/scheduler.py`**: Executes background cron tasks (e.g. daily morning briefing builder, weekly memory reviews).
