-- ==========================================
-- VIZIER Academy - Seed Data (010_memory_seed)
-- ==========================================

-- 1. SEED DICTIONARY TERMS FOR PHASE 7 (BLOCK 7.2)
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, related_terms, first_seen_phase) VALUES
('semantic memory', 'Memory',
 'Long-term general facts and preferences about you that VIZIER remembers (e.g. your name, your job, your meeting preferences).',
 'A category of long-term memory containing structured facts, preferences, and biographical information about the user/principal.',
 'Knowing that your friend has a dog, or knowing their favorite color.',
 ARRAY['episodic memory', 'procedural memory'], 'Phase 7'),

('episodic memory', 'Memory',
 'Remembering specific historical events, tasks, or interactions tied to time (e.g. "we rescheduled the doctor on July 2").',
 'A category of long-term memory that preserves contextual, temporal, and situational event sequences from past conversation history.',
 'Remembering what you ate for breakfast this morning, or what you discussed in yesterday''s meeting.',
 ARRAY['semantic memory', 'procedural memory'], 'Phase 7'),

('procedural memory', 'Memory',
 'Remembering the formatting rules or instructions on how to perform tasks (e.g. "write short paragraphs, use no exclamation marks").',
 'A category of long-term memory containing implicit rules, styles, operational policies, and structural preferences for agent actions.',
 'Knowing how to ride a bike, or the standard steps to bake a cake.',
 ARRAY['semantic memory', 'episodic memory'], 'Phase 7'),

('memory extraction', 'Memory',
 'The automated background process where VIZIER reviews your conversation to pull out facts worth remembering.',
 'An LLM-driven post-turn task that analyzes chat segments to identify, synthesize, and structure personal user context into discrete memories.',
 'A secretary writing down key action items and preferences in a notebook after a client call ends.',
 ARRAY['semantic memory', 'consolidation'], 'Phase 7'),

('consolidation', 'Memory',
 'Merging or simplifying overlapping memories over time to prevent duplication and keep your vault clean.',
 'The process of summarizing, merging, or updating existing memories to maintain database efficiency and context cleanliness.',
 'Organizing cluttered post-it notes into a single, neat bullet-point list on a whiteboard.',
 ARRAY['memory extraction'], 'Phase 7'),

('importance scoring', 'Memory',
 'Rating a memory from 1 to 10 to decide how crucial it is to remember it.',
 'A metadata rating assigned to extracted memories representing their cognitive value, retrieval priority, and decay resistance.',
 'Prioritizing a tax document (importance 10) over a grocery receipt (importance 1).',
 ARRAY['memory extraction', 'procedural memory'], 'Phase 7')
ON CONFLICT (term) DO NOTHING;

-- 2. SEED LESSONS FOR PHASE 7 (BLOCK 7.2)
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag) VALUES
(7, 2, 'Long-Term Memory Systems & Taxonomy',
 '# Lesson 7.2: Long-Term Memory Systems & Personalization

In this block, we built a production-grade **Long-Term Memory System** for VIZIER using Supabase Postgres and vector embeddings.

### Memory Taxonomy
To build a true Chief-of-Staff, we categorize the user''s memory space:
- **Semantic:** General facts and preferences (e.g. *"Principal prefers short summaries"*).
- **Episodic:** Historical logs and events (e.g. *"Dentist rescheduled to July 2"*).
- **Procedural:** Operating procedures and rules (e.g. *"Avoid exclamation marks in email drafts"*).

### Node Architecture
1. **Retrieval (Pre-turn):** Before running the routing coordinator, we embed the user''s query and pull the top-3 matching memories using pgvector similarity. These are injected into VIZIER''s system prompt as local context.
2. **Extraction (Post-turn):** After completing the response, a LangGraph background node evaluates the turn. If any personal preference or instruction is found, it is consolidated, scored, and saved to the database.

### Why Transparency is Key
For security, user trust, and compliance (e.g. GDPR), users must be able to view, edit, or delete any record in VIZIER''s Memory Vault. Exposing this through a dedicated `/memories` page guarantees user control.',
 'Memory & Personalization')
ON CONFLICT (phase, order_index) DO NOTHING;
