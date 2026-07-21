## ELI5
Not all memory is one thing — and treating it as one thing is why so many "memory" features are just a growing junk drawer. The node summary is the spec and the lesson: **build a semantic memory extraction service that classifies inputs into semantic, episodic, and procedural categories and stores them in Postgres tables; verify with test conversation snippets.** Cognitive science figured out decades ago that human memory has *types* with different jobs; this build borrows that taxonomy because it turns out to be exactly the right way to organize an agent's store. You start the ring by building the filing cabinet, not the pile.

## The Real Explanation
**The three memory types — borrowed from cognitive science, earning their keep in code.**
- **Semantic memory** — *facts about the world and the user*, timeless-ish, context-free. "The user's name is Tharun." "Tharun is targeting AI-engineering roles." "The project is called Vizier." These are the *what-is* memories: true regardless of when or how learned, retrievable as standalone facts. This is where personalization lives (Ch 7).
- **Episodic memory** — *events, experiences, specific interactions with time and context*. "On July 18, the user asked me to plan their week." "Last session we debugged the async bridge together." The *what-happened* memories: tied to a moment, useful for continuity and for learning from experience (this is Reflexion's lesson-store, Vol 04 Ch 9, formalized as a memory type — you've met the middle horizon before).
- **Procedural memory** — *how to do things; learned skills and preferences-in-action*. "When the user asks for a summary, they prefer bullets under 100 words." "To deploy this project, run these steps." The *how-to* memories: often the highest-value and most-overlooked; they make an agent get *better at working with you* over time, not just *know more about you*.

The insight that makes this a build and not a lecture: **different types want different storage, retrieval, and lifecycle.** Semantic facts get updated in place (the user's job changes → overwrite, don't accumulate — Ch 12's temporal problem preview); episodic events accumulate append-only and decay with age (Ch 4); procedural memories are rare, precious, and rarely deleted. One junk-drawer table can't serve three lifecycles; three typed tables can.

**The extraction service — the build's engine.** Input: a conversation snippet. Job: an LLM call (your gateway, structured output — Vol 02 Ch 6) that reads the snippet and emits *classified memory candidates*:
```python
class Memory(BaseModel):
    type: Literal["semantic", "episodic", "procedural"]
    content: str                    # the distilled fact/event/skill, self-contained
    subject: str                    # who/what it's about (the user, the project, a tool)
    confidence: float               # extraction certainty (Ch 3 will use this)
    source_snippet_id: str          # provenance — memory needs receipts too (Vol 03 Ch 10 habit)
```
The prompt teaches the taxonomy by example (few-shot — Vol 02 Ch 4: show it a fact, an event, a skill, and one snippet that yields *nothing* worth remembering — the null case, because most conversation is not memory-worthy and an extractor that hoards everything is a junk drawer with extra steps). Store each classified memory in its typed Postgres table (`semantic_memory`, `episodic_memory`, `procedural_memory` — the same Postgres holding your brain and your checkpoints; co-location, the running theme).

**Verification — test conversation snippets, per the node.** A fixture set of snippets, each hand-labeled with the memories it *should* yield (including snippets that should yield *none*). Assert: correct type classification, self-contained content (a memory that reads "he prefers that" without a resolvable subject is useless — test for danglers), and the null cases produce nothing. This is a classification task, so your Vol 01 Ch 12 metrics apply — precision (did it store junk?) and recall (did it miss real facts?) on memory extraction, the first of many places this ring measures memory like the classifier it is.

## Why It Matters
Where this appears in real systems and jobs: Build a semantic memory extraction service that classifies inputs into semantic, episodic, and procedural categories and stores them in Postgres tables; verify with test conversation snippets.

## Hands-On
Build it (est. half a day): the three typed Postgres tables → the `Memory` schema → the extraction prompt with few-shots covering all three types plus the null case → the service (snippet in → classified memories out → stored) → the fixture set (~10 snippets, hand-labeled, null cases included) → the classification tests with precision/recall. Then run it on a *real* transcript — your Vol 03 brain-chat or a genuine conversation — and read what it extracted: are the types right? Did it hoard junk or miss facts? That honest read is the build's real lesson; one paragraph on where your extractor over- and under-remembers goes in the note. Tag `memory-v0.1` — the store's foundation.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the three memory types with a one-line job and an example each — the what-is, what-happened, how-to.
2. Why can't one table serve all three? Give each type's distinct lifecycle.
3. Why is the null case (snippets yielding no memory) essential to the extractor's design?
4. What must every stored memory carry besides its content, and which Vol 03 habit is that?
5. How do precision and recall apply to memory extraction — what does each failure look like?


---

## Wikilinks
[[scratchpads-working-memory]]
[[reflection-patterns]]
[[structured-output]]
[[memory-architectures]]
[[memory-extraction]]

## Status log
- Started: 2026-07-21
- Finished: null