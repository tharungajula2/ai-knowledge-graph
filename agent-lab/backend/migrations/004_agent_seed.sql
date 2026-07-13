-- ==========================================
-- VIZIER Academy - Seed Data (004_agent_seed)
-- ==========================================

-- 1. SEED DICTIONARY TERMS FOR PHASE 5
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, related_terms, first_seen_phase) VALUES
('ReAct trace', 'Observability',
 'A step-by-step printed log of an agent''s thinking process (Thought, Action, Action Input, Observation) that lets you watch it solve a problem.',
 'The verbose log displaying the execution flow of a reasoning-and-acting agent loop, capturing the transitions between model completion and environment response.',
 'A detective talking out loud while inspecting a crime scene: "I see a footprint. I will measure it with a ruler. The ruler says 30cm. That means the suspect is tall."',
 ARRAY['tool registry', 'hallucinated tool call'], 'Phase 5'),

('tool schema', 'Basics',
 'A structured JSON description of what a tool does and what inputs it expects, so the AI model knows how to write requests for it.',
 'The JSON-schema specification describing a function name, description, parameters, and required arguments passed to an LLM for structured tool selection.',
 'A user manual for a blender telling the owner what ingredients it accepts and what buttons to press.',
 ARRAY['tool registry', 'native function calling'], 'Phase 5'),

('tool registry', 'Architectures',
 'A list or catalog in your code that maps tool names to the actual functions they should trigger.',
 'A system mapping tool identifier keys to execution handlers or callable Python objects, enabling the execution layer to invoke tools requested by the LLM.',
 'A phone registry where calling the extension "sales" automatically routes the call to the sales department.',
 ARRAY['tool schema', 'ReAct trace'], 'Phase 5'),

('max iterations', 'Safety',
 'A safety limit on how many cycles of thinking and acting an agent is allowed to do before stopping, to prevent it from getting stuck forever.',
 'A termination guard condition that halts the execution loop of an agent if it has not returned a final response within a set number of execution cycles.',
 'A time limit on a test. If you don''t solve the puzzle in 10 minutes, you must put down your pencil.',
 ARRAY['ReAct trace'], 'Phase 5'),

('hallucinated tool call', 'Safety',
 'An error where the AI model invents a tool that does not exist or tries to call it with invalid arguments.',
 'A model generation error requesting the invocation of a function that is absent from the tool schema allowlist, or passing arguments that fail validation.',
 'A restaurant customer trying to order a hamburger when the menu only serves sushi.',
 ARRAY['tool schema', 'max iterations'], 'Phase 5'),

('native function calling', 'Protocols',
 'A built-in feature of modern AI models that outputs structured tool requests directly, instead of needing us to parse text descriptions.',
 'A model capability where the LLM parses system tool definitions and structures its responses directly into standardized JSON tool call formats.',
 'Giving a form to a customer to fill out with checkboxes, instead of asking them to write a freeform essay about what they want.',
 ARRAY['tool schema', 'ReAct trace'], 'Phase 5')
ON CONFLICT (term) DO NOTHING;

-- 2. SEED LESSONS FOR PHASE 5
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag) VALUES
(5, 1, 'The First Agent Loop',
 '# Lesson 5.1: The Atomic Heart of Agentic AI

In this block, we built a ReAct agent loop from scratch. An agent is not a single model call, but a **loop of execution** where the model interacts with the environment.

### The Agent Loop (Perceive -> Plan -> Act -> Observe)
1. **Perceive:** Receive user input or previous tool results.
2. **Plan (Thought):** Determine the best next step using chain-of-thought.
3. **Act (Action):** Select a tool and construct its arguments.
4. **Observe (Observation):** Run the tool and feed the outcome back to the model.

### Text Parsing vs Native Function Calling
- **Text-Parsing (ReAct):** The agent outputs raw text patterns (e.g. `Action: calculator`) parsed via Regex. Highly fragile and prone to parsing syntax failures.
- **Native Function Calling:** The model outputs structured JSON directly using API schema definitions. Significantly more reliable and handles complex tool signatures with ease.',
 'agent_loop')
ON CONFLICT (phase, order_index) DO NOTHING;
