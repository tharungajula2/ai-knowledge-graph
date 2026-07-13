-- ==========================================
-- VIZIER Academy - Seed Data (006_supervisor_seed)
-- ==========================================

-- 1. SEED DICTIONARY TERMS FOR PHASE 6 (BLOCK 6.1)
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, related_terms, first_seen_phase) VALUES
('supervisor', 'Architectures',
 'A central coordinator AI that decides which specialized agent should handle each part of your request.',
 'A manager agent in a multi-agent hierarchy that uses structured output to select and route tasks sequentially or in parallel to sub-agents.',
 'A dispatcher in a taxi company or a customer service manager routing callers to tech support, billing, or sales.',
 ARRAY['subgraph', 'handoff', 'routing'], 'Phase 6'),

('subgraph', 'Architectures',
 'A mini-graph (or self-contained sub-agent program) nested inside a larger agent graph.',
 'An independent compiled StateGraph nested inside a parent graph node, inheriting a compatible state schema for modular encapsulation.',
 'A specialized department in a business (like accounting) that has its own internal workflow but reports back to the general manager.',
 ARRAY['supervisor', 'StateGraph'], 'Phase 6'),

('handoff', 'Architectures',
 'The moment one AI agent finishes its job and passes the results and control back to the manager or another agent.',
 'The transition event returning execution control and updated state dictionaries from a child specialist node back to the supervisor node.',
 'Passing a baton in a relay race or forwarding a customer file to the next department.',
 ARRAY['supervisor', 'routing'], 'Phase 6'),

('routing', 'Architectures',
 'The process of deciding which step or agent should run next based on the current situation.',
 'Conditional transition logic evaluated at supervisor decision points to route graph execution paths dynamically based on structured LLM outputs.',
 'A sorting office at a post office dividing packages into local delivery trucks based on zip codes.',
 ARRAY['supervisor', 'handoff'], 'Phase 6'),

('structured output', 'Interactions',
 'Ensuring the AI replies in a strict format (like a JSON template) rather than random conversational text, so other code can read it.',
 'Enforcing model output formats using JSON schema constraints or Pydantic validation to guarantee parsing stability and machine readability.',
 'Filling out a tax form. Every number must go in a specific numbered box rather than written in a blank letter.',
 ARRAY['supervisor'], 'Phase 6'),

('scratchpad', 'Architectures',
 'A shared notepad where different AI agents write their notes so they can share information with each other.',
 'A state key containing execution notes, tool outputs, and observations passed across specialist graph invocations for collective synthesis.',
 'A whiteboard in a meeting room where different team members add data points during a project brainstorm.',
 ARRAY['supervisor', 'subgraph'], 'Phase 6'),

('SSE', 'Protocols',
 'Server-Sent Events: A way for a web server to stream real-time updates to a browser over a single connection without the browser constantly asking.',
 'A HTTP push protocol enabling real-time unidirectionally streamed events from backend servers to web clients using text/event-stream headers.',
 'A continuous ticker tape machine or a live news broadcast where info is pushed out as it happens.',
 ARRAY['supervisor'], 'Phase 6')
ON CONFLICT (term) DO NOTHING;

-- 2. SEED LESSONS FOR PHASE 6 (BLOCK 6.1)
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag) VALUES
(6, 1, 'Multi-Agent Architectures: The Supervisor Pattern',
 '# Lesson 6.1: Multi-Agent Orchestration & Streaming

In this block, we graduated VIZIER from a single-agent loop to a **hierarchical Multi-Agent Supervisor** architecture.

### Why Multi-Agent?
As task complexity grows, a single agent prompt becomes bloated with tools and instructions (the megaprompt problem). This leads to:
- High token usage
- Confused routing (hallucinating tool parameters)
- Lack of testability

By decomposing the system into specialist subgraphs governed by a supervisor, each agent acts on a subset of tools, maintaining high precision.

### The Supervisor Coordinator
1. **Perceive & Route:** The supervisor receives the user request, reviews the `scratchpad` memory, and issues a Pydantic `RouteDecision` to route to the optimal specialist.
2. **Execute & Handoff:** The selected specialist (e.g. `RESEARCHER`) runs its independent graph, writes results to the shared `scratchpad`, and hands control back.
3. **Chaining:** The supervisor can route sequentially (e.g., RESEARCHER -> SCRIBE -> FINALIZE), enabling multi-part execution.

### Live Status Streaming (Server-Sent Events)
Instead of waiting for a long sequence of agent thoughts to resolve, VIZIER uses Server-Sent Events (SSE) to push status ticks (`"Routing to RESEARCHER..."`) to the frontend, keeping the user engaged with immediate feedback.',
 'multi_agent_supervisor')
ON CONFLICT (phase, order_index) DO NOTHING;
