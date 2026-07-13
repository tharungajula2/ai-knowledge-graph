-- ==========================================
-- VIZIER Academy - Seed Data (005_langgraph_seed)
-- ==========================================

-- 1. SEED DICTIONARY TERMS FOR PHASE 5 (BLOCK 5.2)
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, related_terms, first_seen_phase) VALUES
('StateGraph', 'Architectures',
 'A way to build AI programs as a map of steps (a graph) where the program keeps track of a single shared state or memory.',
 'The core orchestration class in LangGraph used to define agent structures by adding nodes (actions) and edges (routing paths) over a TypedDict state.',
 'A board game board. The board shows all the squares (nodes) and paths (edges), and the state is the current position of the players and game cards.',
 ARRAY['node', 'edge', 'reducer'], 'Phase 5'),

('node', 'Architectures',
 'A single step or action in your AI program''s graph (like calling the AI model or running a database tool).',
 'An executable function or class registered within a StateGraph that receives the current state as input and returns state updates as output.',
 'A work station in a factory assembly line. Each station performs one specific action (like painting or packing) and passes the product along.',
 ARRAY['StateGraph', 'edge'], 'Phase 5'),

('edge', 'Architectures',
 'A path or rule that connects one step (node) to another in your AI program''s graph.',
 'A transition definition in a StateGraph specifying the sequence of node executions, or a conditional function deciding the next node dynamically.',
 'A conveyor belt that carries a package from Station A to Station B, or a fork in the road with signposts.',
 ARRAY['StateGraph', 'node'], 'Phase 5'),

('reducer', 'Architectures',
 'A special function that decides how to merge new information into the agent''s memory instead of completely erasing the old memory.',
 'A function assigned to a state key (e.g. add_messages) that governs how updates are appended or merged into the current state value.',
 'A ledger book. When you get a new transaction, you add a line at the bottom, rather than throwing the ledger away and starting a new one.',
 ARRAY['StateGraph'], 'Phase 5'),

('checkpointer', 'Durable Execution',
 'A tool that automatically saves the entire state of your AI agent to a database after every single step, so it never forgets its place.',
 'A persistence layer (e.g. PostgresSaver) that serializes and saves the state of a thread at each checkpoint, allowing durable execution and recovery.',
 'The auto-save feature in a video game that saves your progress every time you walk through a door or complete a quest.',
 ARRAY['thread', 'StateGraph'], 'Phase 5'),

('thread', 'Durable Execution',
 'A unique conversation ID that groups all messages and checkpoints for a specific user session.',
 'A unique execution context identifier used by checkpointers to isolate state records, history sequences, and checkpoints for separate sessions.',
 'A separate save file slot in a video game, allowing Player A and Player B to have their own individual histories on the same console.',
 ARRAY['checkpointer'], 'Phase 5')
ON CONFLICT (term) DO NOTHING;

-- 2. SEED LESSONS FOR PHASE 5 (BLOCK 5.2)
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag) VALUES
(5, 2, 'LangGraph & Postgres Checkpointing',
 '# Lesson 5.2: Orchestration & Durable Execution

In this block, we migrated our handmade ReAct agent loop into **LangGraph** and added database-backed persistence via **PostgresSaver**.

### Why LangGraph?
- **State Preservation:** Every node receives the current `messages` state, and returns updates which are merged using the `add_messages` reducer.
- **Node/Edge Modularity:** Splitting agent thought and tool execution into distinct modules makes the code clean and extensible.

### The Magic of Checkpointing (Durable Execution)
By wrapping `PostgresSaver` around the connection pool, LangGraph serializes the entire graph state after each step and writes it to Supabase tables. 
If the backend process is killed mid-turn, or if the server crashes, the agent can resume execution from the exact same state without losing memory or repeating costly tool calls. This is the foundation of production-grade workflow engines.',
 'langgraph_checkpoint')
ON CONFLICT (phase, order_index) DO NOTHING;
