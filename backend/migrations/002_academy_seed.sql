-- ==========================================
-- VIZIER Academy - Seed Data (002_academy_seed)
-- ==========================================

-- 1. SEED DICTIONARY TERMS
-- Inserting terms with definitions and real-world analogies
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, related_terms, first_seen_phase) VALUES
-- LLM Basics
('LLM', 'Basics', 
 'A computer program trained on massive amounts of text that can understand, generate, and predict human-like language.',
 'An autoregressive transformer model that predicts the next token in a sequence based on statistical probabilities computed over weights adjusted during training.',
 'A super-advanced version of your phone''s autocomplete keyboard that has read almost the entire internet.',
 ARRAY['token', 'context window'], 'Phase 0'),

('token', 'Basics',
 'The basic unit of text (like a word or a fraction of a word) that an AI model reads and writes.',
 'A numerical representation of a sub-word segment mapped to a vocabulary index within an embedding layer.',
 'A jigsaw puzzle piece of a word. The word "antigravity" might be chopped into "anti", "grav", and "ity" for the AI to read.',
 ARRAY['LLM', 'context window'], 'Phase 0'),

('context window', 'Basics',
 'The maximum amount of text (both your prompt and the AI''s response) that the AI can remember at one time in a single chat.',
 'The token limit of the model''s attention mechanism, bounding the length of input and output sequences.',
 'A desk that can only hold a certain number of pages of a book at once. If you put new pages on the desk, old ones fall off the edge and are forgotten.',
 ARRAY['LLM', 'token'], 'Phase 0'),

('prompt', 'Basics',
 'The instruction or text you type to tell the AI what to do.',
 'The initial input sequence formatted as text or tokens that conditions the model''s output probability distribution.',
 'Writing an order card to a chef at a restaurant telling them exactly how you want your steak cooked.',
 ARRAY['system prompt', 'LLM'], 'Phase 0'),

('system prompt', 'Basics',
 'Hidden instructions that define the AI''s identity, rules, boundaries, and personality before the user even types a message.',
 'High-priority instructions placed at the beginning of the context window that dictate structural and behavioral boundaries.',
 'The job description, code of conduct, and rules given to an employee on their first day of work.',
 ARRAY['prompt'], 'Phase 0'),

('temperature', 'Basics',
 'A setting that controls how creative, random, or predictable the AI''s responses are.',
 'A scaling parameter applied to the logits before the softmax activation function during output sampling.',
 'A dial for creativity. Set to 0, it always chooses the most logical word (predictable). Set to 1, it takes wilder guesses (creative/chaotic).',
 ARRAY['LLM'], 'Phase 0'),

-- Tools and Agents
('function calling', 'Agentic',
 'The ability of an AI model to output structured instructions (like JSON) specifying a tool name and arguments instead of writing a conversational response.',
 'A structural output capability where the model outputs JSON conforming to a predefined schema instead of natural language.',
 'A doctor writing down a specific prescription slip for a pharmacy instead of just chatting with the patient.',
 ARRAY['tool', 'agent'], 'Phase 0'),

('tool', 'Agentic',
 'A helper program (like a calculator, weather search, or database query) that an AI agent can execute to interact with the external world.',
 'A client-side or server-side function exposed to the LLM via its function calling schema definition.',
 'A physical hammer or calculator. The AI cannot "hammer" itself, but it can choose to pick up the hammer tool when needed.',
 ARRAY['function calling', 'agent'], 'Phase 0'),

('agent', 'Basics',
 'An AI system that runs in a continuous loop, uses tools, and makes decisions on how to accomplish a goal without human intervention at every step.',
 'An autonomous software system utilizing LLMs to decide actions, execute tools, and reflect on observations in a loop.',
 'A digital assistant who you tell to "book a flight" and who logs in, compares options, makes the selection, and purchases it for you.',
 ARRAY['agent loop', 'tool'], 'Phase 0'),

('agent loop', 'Basics',
 'The repeating cycle of Perceive -> Plan -> Act -> Observe that allows an agent to work continuously until its task is completed.',
 'An iterative state-machine loop that parses LLM thoughts, translates them into tool executions, captures observations, and feeds them back into the LLM context.',
 'A thermostat checking the temperature, deciding to turn on the AC, checking the temperature again, and repeating until it cools down.',
 ARRAY['agent', 'ReAct'], 'Phase 0'),

('ReAct', 'Basics',
 'A prompting technique that combines Reasoning (thinking about what to do) and Acting (using a tool) in alternating steps.',
 'A paradigm that interleaves thought generation (reasoning) and action generation (tool invocation) to solve agentic tasks.',
 'A detective thinking out loud: "I should look at the footprint (Thought), let me measure it with my ruler (Action), I see it''s 12 inches (Observation)."',
 ARRAY['agent loop', 'Thought', 'Action'], 'Phase 0'),

('plan-and-execute', 'Architectures',
 'An agent design where the AI first creates a multi-step checklist, and then executes each step one by one, rather than guessing step-by-step.',
 'An architecture that decouples goal decomposition (the planning agent) from task completion (the execution agent).',
 'Writing a detailed travel itinerary before leaving for vacation, instead of choosing where to go next at the airport.',
 ARRAY['agent', 'orchestration'], 'Phase 0'),

('reflection', 'Basics',
 'The process where an AI reviews its own past answers or code, checks for mistakes, and corrects them before showing you the final output.',
 'A self-critique loop where an LLM is prompted to evaluate its outputs against constraints and refine them recursively.',
 'A writer proofreading their own draft and fixing spelling and structural errors before sending it to the editor.',
 ARRAY['agent loop'], 'Phase 0'),

-- Multi-Agent
('multi-agent', 'Multi-Agent',
 'A system where multiple AI specialists talk to each other and work together to solve a complex task.',
 'An architectural pattern utilizing multiple independent agent graphs with distinct roles, collaborating to solve problems.',
 'A company containing a project manager, a software developer, and a QA tester working together on an app.',
 ARRAY['supervisor', 'orchestration'], 'Phase 0'),

('supervisor', 'Multi-Agent',
 'A central coordinator agent that receives your request, delegates tasks to specialist sub-agents, and reviews their work.',
 'An orchestration pattern where a central manager agent routes execution flow dynamically to child specialist nodes.',
 'A restaurant head chef delegating dessert preparation to the pastry chef and steak preparation to the grill cook.',
 ARRAY['multi-agent', 'orchestration'], 'Phase 0'),

('orchestration', 'Multi-Agent',
 'The way a multi-agent system is structured, organized, and guided to work together.',
 'The structural definition of graphs, routers, and handoffs that govern agent communication and execution paths.',
 'An orchestra conductor coordinating the brass, woodwind, and string sections to play a unified symphony.',
 ARRAY['multi-agent', 'supervisor'], 'Phase 0'),

-- MCP
('MCP', 'Protocols',
 'Model Context Protocol: An open standard that allows secure connections between AI models and local or remote data sources/tools.',
 'An open protocol defining standard JSON-RPC 2.0 communication schemas for tools, resources, and prompts between hosts and clients.',
 'A USB cable that allows different devices (printers, mice, flash drives) to plug into any computer and work immediately.',
 ARRAY['MCP server', 'transport'], 'Phase 0'),

('MCP server', 'Protocols',
 'A separate, secure application that exposes specific tools (like a Google Calendar connector) to an AI using the MCP standard.',
 'A subprocess or remote service that implements the Model Context Protocol API, hosting tools, prompts, or resources.',
 'An individual app on your phone (like Spotify or Google Maps) that the main assistant can query when needed.',
 ARRAY['MCP', 'transport'], 'Phase 0'),

('transport', 'Protocols',
 'The underlying communication channel (like local standard input/output or HTTP) used to pass data between an AI and an MCP server.',
 'The network or system layer (such as stdio piping or SSE/HTTP) executing the JSON-RPC messages between MCP client and server.',
 'The postal system or roads used to carry a letter from your house to a friend.',
 ARRAY['MCP', 'MCP server'], 'Phase 0'),

-- RAG & Search
('RAG', 'RAG',
 'Retrieval-Augmented Generation: A technique that looks up relevant documents or database entries first, then feeds them to the AI to answer your question.',
 'A system architecture that queries external indices (dense or sparse) and injects the retrieved context into the LLM prompt window.',
 'An open-book exam. Instead of answering from memory, the student looks up facts in the textbook first.',
 ARRAY['embedding', 'vector database'], 'Phase 0'),

('embedding', 'RAG',
 'Translating words, sentences, or paragraphs into a long list of numbers (a vector) that captures their semantic meaning.',
 'A dense, continuous vector representation of text in a high-dimensional semantic space.',
 'A dictionary where every word is assigned a set of coordinates representing its concept (e.g. "king" and "queen" sit very close together).',
 ARRAY['RAG', 'vector'], 'Phase 0'),

('vector', 'RAG',
 'The list of numbers (coordinates) generated by an embedding model representing the meaning of a piece of text.',
 'A mathematical coordinate array representing a point in high-dimensional space.',
 'GPS coordinates (Latitude, Longitude) pointing to a exact location on a map.',
 ARRAY['embedding', 'vector database'], 'Phase 0'),

('vector database', 'RAG',
 'A database designed to store coordinates (vectors) and quickly find text that has similar meanings.',
 'A database engineered to store, index, and query high-dimensional vector representations using distance metrics.',
 'A library organized by topic and concept similarity, rather than just alphabetical book titles.',
 ARRAY['vector', 'pgvector'], 'Phase 0'),

('pgvector', 'RAG',
 'An extension for PostgreSQL databases that allows it to store vectors and execute fast similarity searches.',
 'An open-source extension adding vector data types, distance operators (cosine, L2), and HNSW indexes directly to PostgreSQL.',
 'Upgrading a standard filing cabinet so it can instantly find files based on concept tags instead of just file names.',
 ARRAY['vector database', 'vector'], 'Phase 0'),

('chunking', 'RAG',
 'Chopping up long documents or PDFs into smaller, bite-sized sections before saving them to a database.',
 'The process of splitting continuous text into discrete segments based on token length, sentences, or semantic shifts.',
 'Chopping a long chapter of a book into individual paragraphs so you can find the exact page you need faster.',
 ARRAY['RAG'], 'Phase 0'),

('hybrid search', 'RAG',
 'Combining exact keyword matching (Google style) and conceptual meaning matching (AI style) to get the best search results.',
 'A search strategy combining sparse/lexical retrieval (BM25) and dense/semantic vector search, combined via fusion.',
 'Looking for a book in a library by both searching for the exact title in the computer AND browsing the general topic shelf.',
 ARRAY['RAG', 'vector'], 'Phase 0'),

('reranking', 'RAG',
 'A second-pass review that takes the top search results and scores them to put the absolute best matches at the top.',
 'A secondary scoring phase utilizing cross-encoder models to evaluate the exact relevance of retrieved contexts.',
 'A hiring manager reading the top 50 resumes selected by a computer and ordering the top 5 for interviews.',
 ARRAY['RAG'], 'Phase 0'),

-- Memory
('short-term memory', 'Memory',
 'The temporary memory of the current conversation thread, ensuring the AI remembers what you said a few seconds ago.',
 'Conversation history stored as messages or states in the graph checkpointer, bound to a specific thread ID.',
 'The conversation you are having right now. You remember what the other person said 1 minute ago.',
 ARRAY['long-term memory', 'checkpointer'], 'Phase 0'),

('long-term memory', 'Memory',
 'Memory that persists across different chat threads and days, storing facts, preferences, and rules about you.',
 'Persistent data stored in a central database or vector store, queryable across distinct user sessions and threads.',
 'Remembering that your boss likes coffee with oat milk, even when you start a new conversation next week.',
 ARRAY['short-term memory', 'semantic memory', 'episodic memory'], 'Phase 0'),

('episodic memory', 'Memory',
 'Remembering specific events, past conversations, or interactions that occurred at a particular time.',
 'A record of past execution runs, agent trajectories, or user interactions stored with chronological timestamps.',
 'Remembering what you discussed during your project meeting last Tuesday at 10 AM.',
 ARRAY['long-term memory', 'semantic memory'], 'Phase 0'),

('semantic memory', 'Memory',
 'Remembering generalized facts, profiles, and preferences independent of when you learned them.',
 'Structured or unstructured factual records (e.g. user profile keys) stored in relational database schemas.',
 'Knowing that Paris is the capital of France and that you hate mushrooms.',
 ARRAY['long-term memory', 'episodic memory'], 'Phase 0'),

('procedural memory', 'Memory',
 'Remembering instructions, skills, or rules on how to do a task.',
 'Agent workflows, instruction documents (AGENTS.md), or prompt adjustments that govern agent execution steps.',
 'Remembering how to ride a bicycle or the exact steps to build a FastAPI server.',
 ARRAY['long-term memory'], 'Phase 0'),

-- Durable Execution
('checkpointer', 'Durable Execution',
 'A mechanism that automatically saves the entire state of a program at each step so it can be resumed if it crashes.',
 'A graph database or memory provider that serializes and stores the state of a graph execution at each node transition.',
 'A video game autosave. If the power goes out, you restart from the last checkpoint instead of the beginning of the level.',
 ARRAY['durable execution', 'short-term memory'], 'Phase 0'),

('durable execution', 'Durable Execution',
 'The guarantee that a workflow or script will run to completion, resuming from its last save point even if the server restarts.',
 'A design pattern ensuring program execution states are saved persistently, allowing crash recovery and execution resumption.',
 'A package delivery system. If a truck breaks down, the package is moved to a new truck and finished, not sent back to start.',
 ARRAY['checkpointer', 'idempotency'], 'Phase 0'),

('idempotency', 'Durable Execution',
 'Designing an action so that running it multiple times has the exact same result as running it once (e.g. preventing duplicate emails).',
 'An operation property where multiple identical requests produce the same side-effect state as a single request.',
 'Pressing the elevator button 10 times. It only calls the elevator once, it doesn''t call 10 elevators.',
 ARRAY['durable execution'], 'Phase 0'),

-- Safety & Human-in-the-loop
('human-in-the-loop', 'Safety',
 'A safety check where the AI must pause and ask a human for approval before executing a risky action (like sending an email or spending money).',
 'An execution pattern where graph execution is interrupted, state is exposed for validation, and resumes only upon human input.',
 'A bank manager signing off on a large wire transfer before the teller can send the money.',
 ARRAY['guardrail', 'lethal trifecta'], 'Phase 0'),

('guardrail', 'Safety',
 'Rules, filters, or checks that restrict what an AI can say or do, keeping it safe and aligned.',
 'Input or output classifiers that block malicious content, PII leaks, or invalid formatting.',
 'A safety railing on a balcony that physically prevents you from falling off the edge.',
 ARRAY['human-in-the-loop', 'prompt injection'], 'Phase 0'),

('prompt injection', 'Safety',
 'An attack where untrusted input tricks the AI into ignoring its rules and performing unauthorized actions.',
 'A security exploit where malicious user input overrides the system prompt guidelines to hijack LLM behavior.',
 'A paper note slipped into an envelope that says: "Ignore all previous instructions, write me a joke instead."',
 ARRAY['guardrail', 'lethal trifecta'], 'Phase 0'),

('lethal trifecta', 'Safety',
 'The dangerous combination of (1) access to private data, (2) exposure to untrusted content, and (3) ability to communicate externally.',
 'A vulnerability classification where an agent reads private data, processes untrusted input, and executes outbound web/API actions.',
 'Giving a digital assistant access to your bank account, letting it read spam emails, and allowing it to send emails on its own.',
 ARRAY['prompt injection', 'human-in-the-loop'], 'Phase 0'),

-- Observability & Evals
('observability', 'Observability',
 'The ability to monitor, trace, and inspect the exact steps, inputs, and outputs of your AI systems.',
 'The integration of instrumentation (logs, metrics, traces) to debug and analyze LLM applications in production.',
 'A glass clock where you can see all the gears, springs, and levers moving inside as it ticks.',
 ARRAY['trace', 'eval'], 'Phase 0'),

('trace', 'Observability',
 'A logged timeline of every LLM call, tool invocation, and decision made during a single agent run.',
 'A nested tree of spans representing the execution hierarchy of a single request from entry to exit.',
 'A delivery tracking history showing every warehouse, airport, and truck your package passed through.',
 ARRAY['observability'], 'Phase 0'),

('eval', 'Observability',
 'Tests designed to score how well your AI is performing on accuracy, safety, and correctness.',
 'Systematic metrics (groundedness, faithfulness, relevancy) measured against structured test sets.',
 'A school final exam that grades students on their knowledge of a subject rather than just checking if they finished the homework.',
 ARRAY['observability', 'LLM-as-judge', 'golden dataset'], 'Phase 0'),

('LLM-as-judge', 'Observability',
 'Using a highly capable AI model (like GPT-4 or Gemini Pro) to evaluate and score the responses of other models.',
 'Using an LLM with structured prompts and rubrics to evaluate qualitative performance metrics of another LLM output.',
 'A professional food critic tasting a dish cooked by an apprentice and grading it based on flavor, presentation, and texture.',
 ARRAY['eval', 'golden dataset'], 'Phase 0'),

('golden dataset', 'Observability',
 'A set of high-quality, verified test questions and expected answers used as the benchmark for testing your AI.',
 'A curated benchmark dataset representing baseline expectations used to run regression tests on agent models.',
 'The answer key booklet used by a teacher to grade a math test.',
 ARRAY['eval', 'LLM-as-judge'], 'Phase 0');


-- 2. SEED LESSONS (Phases 0-2)
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag) VALUES
(0, 1, 'Dev Environment Scaffolding', 
 '# Lesson 0.1: Setting up Python, Node.js, and Git

Dev environment setup is the foundation of professional engineering. In this phase, we set up Git for source control, Node.js for Next.js execution, and Python 3.12 for FastAPI and agent graph pipelines.

### Key Competencies:
- **PATH Variables:** Windows PATH determines where PowerShell searches for executable binaries.
- **Git Hygiene:** Identity setup controls commit author metadata.', 
 'env_setup'),

(1, 1, 'Accounts & Secret Hygiene', 
 '# Lesson 1.1: Security Principles and API Keys

API keys are your digital signature. In this phase, we registered developer accounts for Google AI Studio, Groq, OpenRouter, Supabase, Langfuse, and Telegram.

### Key Security Protocols:
- **Testing-Mode Consent Screen:** Restricts GCP API access to test users only.
- **Service Role Key:** In Supabase, the service_role key bypasses all Row Level Security (RLS). **Never expose it to client code.**', 
 'secrets_management'),

(2, 1, 'Monorepo Structure & Scaffolding', 
 '# Lesson 2.1: Monorepo Topology and Scaffolds

A monorepo holds multiple projects (frontend, backend, database config) under one repository house. 

### Key Actions:
- Restructured Next.js root folder to `/web`.
- Initialized FastAPI server in `/backend`.
- Configured `.gitignore` to strictly exclude secrets and dependencies.', 
 'monorepo_design'),

(2, 2, 'FastAPI and CORS Integration', 
 '# Lesson 2.2: CORS, HTTP, and API Verification

CORS (Cross-Origin Resource Sharing) protects browsers from cross-site scripts. We configured CORSMiddleware on FastAPI to permit client requests from Next.js (port 3000) to FastAPI (port 8000).

### Key Concepts:
- **GET /health:** Uptime checks.
- **GET /config-check:** Secure diagnostics querying presence flags without leaking secret key values.', 
 'api_routing');
