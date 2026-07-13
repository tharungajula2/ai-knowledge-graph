# Lesson 9: Long-Term Agentic Memory & Taxonomy

Building a personal AI assistant that behaves like a true Chief-of-Staff requires more than simple conversation history. It requires **Memory**—the capability to remember facts, events, and operating rules across completely separate chat sessions.

---

## 1. Memory Taxonomy in AI Systems

In psychology and computer science, memory is classified into distinct categories. For VIZIER, we implement the three key kinds:

| Memory Kind | Definition | Real-World Analogies | Chief-of-Staff Examples |
| :--- | :--- | :--- | :--- |
| **Semantic** | General facts, facts about the user, preferences, and standing definitions. | Knowing that the earth is round, or knowing a friend's favorite coffee. | *"The principal prefers 25-minute meetings."*<br>*"The principal's secondary email is test@example.com."* |
| **Episodic** | Context of specific events, historical transactions, or temporary situations tied to time/space. | Remembering what you ate for dinner yesterday, or a past trip. | *"On July 2 we rescheduled the dentist appointment."*<br>*"The principal met with John last Tuesday."* |
| **Procedural** | Operational rules, preferences for formatting, and instructions on how tasks must be completed. | Knowing how to ride a bike, or the steps to bake a cake. | *"When drafting emails, use short paragraphs and avoid exclamation points."* |

---

## 2. Memory Extraction vs. Verbatim Logs

A naive memory design simply stores the entire chat log verbatim. However, this causes significant issues:
1. **Context Window Pollution:** Passing thousands of lines of past chat logs exhausts token limits and dilutes the model's focus.
2. **Noise and Redundancy:** Conversation is full of greetings, typos, and temporary questions ("what time is it?") that have no long-term value.

Instead, VIZIER utilizes **Active Extraction**:
- After each conversation turn completes, a background LLM process analyzes the latest prompt-reply pair.
- The extraction model evaluates: *"Is there any persistent fact, event, or formatting preference in this turn that should be remembered?"*
- If yes, it consolidates it into a single, structured third-person fact (e.g. *"The principal dislikes emoji-heavy drafts"*), rates its importance, and stores it in the database.

---

## 3. Embedding Similarity and Injection

Whenever the user starts a new query, VIZIER fetches relevant memories:
1. The user's query is embedded into a 768-dimensional vector (via Gemini `text-embedding-004`).
2. We query the `memories` table in Supabase, using the **Cosine Distance** operator (`<=>`) supported by **pgvector**:
   ```sql
   SELECT content FROM memories ORDER BY embedding <=> query_vector LIMIT 3;
   ```
3. The matching memories are retrieved and prepended to the system prompt as a dedicated section:
   ```text
   What I know about my principal (relevant memories):
   - The principal prefers meetings at 2:00 PM.
   - The principal drafts should avoid exclamation points.
   ```
4. This ensures that the supervisor and specialists automatically align their behavior with the principal's state, even on brand new threads!

---

## 4. Privacy, Trust, and Forgetting (Decay)

Memory is not just a database; it is an intimate catalog of a user's habits. This introduces critical security and product requirements:

- **The Right to be Forgotten:** Users must have absolute transparency and control over what the AI has recorded. Exposing a `/memories` page where the user can view, edit, or delete any record is essential for trust and compliance (e.g., GDPR).
- **Correcting Mistakes:** Extraction models sometimes overgeneralize (e.g., interpreting "I'm busy today" as "The principal is never available on Mondays"). Allowing the user to manually edit or delete the memory resolves these glitches.
- **Forgetting (Decay):** In advanced systems, memories carry a decay factor. Every time a memory is retrieved, we update `last_accessed_at`. Memories that haven't been accessed for a long period can be consolidated, archived, or forgotten to make room for newer, more relevant facts.
