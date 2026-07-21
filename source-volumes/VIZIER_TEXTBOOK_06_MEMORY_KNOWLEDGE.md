# THE VIZIER TEXTBOOK — VOLUME 06: MEMORY & KNOWLEDGE

### Ring `memory-knowledge` · 19 nodes · Agents that remember, and knowledge shaped as graphs

> **How to use this volume.** Same contract: one chapter = one node, read → Hands-On → Prove It from memory → Feynman note → light. This volume assumes all five previous rings — especially the three-horizon memory map (Vol 04, Ch 13: scratchpad / episodic / long-term — this ring builds the third horizon you deferred), embeddings and RAG (Vol 03 — memory retrieval *is* retrieval), the GraphRAG preview (Vol 03, Ch 19 — now made real), your brain MCP server (Vol 05, Ch 16), and the gate (Vol 04, Ch 15 — every brain-writing build here routes through it).

> **What "god mode" means for this domain.** After Volume 06: your agents don't just process — they *remember*, across sessions and across tasks, with the judgment to know what's worth keeping, what to forget on purpose, and what must never be stored. And your knowledge stops being a pile of chunks and becomes a *graph* — entities, relations, temporal facts — that answers questions no vector search can. Your brain, already MCP-connectable, becomes formally a knowledge graph. You'll have built the memory layer that turns a stateless research agent into one that learns, and the recall agent that answers "what did I learn?" from your own months of study, node-cited.

> **The one distinction that organizes the whole ring** (from Vol 04, Ch 13): *context is what the model sees now; store is what it can retrieve later.* Memory is the engineering of the store — deciding what enters it, how it's shaped, when it surfaces, and when it fades. Hold that line; everything below is that sentence, built out.

---

# PART I — AGENT MEMORY
*8 chapters. The store, built honestly: the taxonomy of what's worth remembering, the architecture around it, extraction, decay, the framework landscape, compaction, personalization, and the ethics of forgetting.*

---

## Chapter 1 — Build: Memory Taxonomy
**Node:** `build-memory-taxonomy` · build · S

### The Feynman opener
Not all memory is one thing — and treating it as one thing is why so many "memory" features are just a growing junk drawer. The node summary is the spec and the lesson: **build a semantic memory extraction service that classifies inputs into semantic, episodic, and procedural categories and stores them in Postgres tables; verify with test conversation snippets.** Cognitive science figured out decades ago that human memory has *types* with different jobs; this build borrows that taxonomy because it turns out to be exactly the right way to organize an agent's store. You start the ring by building the filing cabinet, not the pile.

### The real thing — the spec
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

### Hands-On
Build it (est. half a day): the three typed Postgres tables → the `Memory` schema → the extraction prompt with few-shots covering all three types plus the null case → the service (snippet in → classified memories out → stored) → the fixture set (~10 snippets, hand-labeled, null cases included) → the classification tests with precision/recall. Then run it on a *real* transcript — your Vol 03 brain-chat or a genuine conversation — and read what it extracted: are the types right? Did it hoard junk or miss facts? That honest read is the build's real lesson; one paragraph on where your extractor over- and under-remembers goes in the note. Tag `memory-v0.1` — the store's foundation.

### Prove It
1. Name the three memory types with a one-line job and an example each — the what-is, what-happened, how-to.
2. Why can't one table serve all three? Give each type's distinct lifecycle.
3. Why is the null case (snippets yielding no memory) essential to the extractor's design?
4. What must every stored memory carry besides its content, and which Vol 03 habit is that?
5. How do precision and recall apply to memory extraction — what does each failure look like?

**Wikilinks for your note:** [[scratchpads-working-memory]] · [[reflection-patterns]] · [[structured-output]] · [[memory-architectures]] · [[memory-extraction]]

---

## Chapter 2 — Memory Architectures
**Node:** `memory-architectures` · concept · S

### The Feynman opener
You've built the filing cabinet (Ch 1); now understand where it sits in the whole machine. The node summary is the organizing frame of the entire ring: **context vs store; the memory stack.** Every memory system on Earth is an answer to one question — *what lives in the limited context window right now, versus what lives in an unlimited store to be retrieved when needed?* — and the architecture is the machinery that moves information across that boundary intelligently.

### The real thing
**The fundamental divide — context vs store (Vol 04 Ch 13's line, now the whole subject).** *Context* is the model's working memory: everything in the window right now (Vol 01 Ch 8), fast to use, expensive per token, hard-capped, and *volatile* (gone when the window rolls). *Store* is everything outside the context: databases, vector stores, files — unlimited, cheap to hold, *durable*, but *invisible to the model until retrieved*. The entire art of memory is managing traffic across this boundary: what to *promote* from store into context (retrieval — Vol 03's whole skillset, re-aimed), what to *demote* from context into store before it's lost (extraction — Ch 1, Ch 3), and what to simply drop.

**The memory stack — the full architecture, tier by tier.** Layer them from most-immediate to most-durable, and notice you've built pieces of every tier already:
1. **Working memory (the context window itself)**: the current turn's messages, the scratchpad (Vol 04 Ch 13). Immediate, volatile. The model's "now."
2. **Short-term / session memory (the checkpoint)**: the current conversation/thread's state (Vol 04 Ch 6 — checkpointers). Survives within a session or task; the message-list-you-resend, now persisted. Horizon two of the three-horizon map.
3. **Long-term memory (the store — this ring's subject)**: durable facts, events, and skills (Ch 1's typed tables) that persist *across* sessions and tasks. Horizon three, finally built. Retrieved into context when relevant.
4. **(Sometimes) shared/organizational memory**: knowledge shared across users or agents (a team's blackboard, Vol 05 Ch 4, made durable; or a shared knowledge base). Not always present.

The **flow** across tiers is the architecture: information enters as working memory → salient bits get *extracted* to long-term store (Ch 3) as the session proceeds or ends → future sessions *retrieve* relevant long-term memories back into working memory → the cycle repeats, the agent accumulating knowledge it can carry forever. That loop — extract on the way out, retrieve on the way in — is what makes an agent *learn* rather than merely *run*.

**The two hard problems the architecture must solve** (previewing the ring). *What to promote into context, and when* — you can't retrieve *all* memories every turn (context is finite, and irrelevant memories are noise that degrades performance — the lost-in-the-middle tax, Vol 01 Ch 8, and the retrieval-precision problem, Vol 03). So memory retrieval needs relevance scoring, and often more: importance, recency, not just similarity (Ch 4). *What to keep vs forget* — an ever-growing store gets slow, expensive, and noisy; deliberate forgetting (Ch 4) and compaction (Ch 6) keep it sharp. These two problems — surfacing the right memory and pruning the wrong ones — are the engineering the rest of Part I builds.

**Where memory retrieval *is* RAG — and where it isn't.** The retrieval half is your Vol 03 stack pointed at memories instead of documents (embed the query/context, nearest-neighbor against stored memories — same machinery). But memory adds what document-RAG lacks: *writing* (extraction — documents are given; memories are *created* from interaction), *lifecycle* (memories update, decay, expire — documents are static), and *typing* (Ch 1's three types — documents are undifferentiated). Memory is RAG plus a write path plus a lifecycle plus a taxonomy. Recognizing the shared retrieval core (you already own it) while respecting the additions (this ring) is the right mental model.

### Hands-On
Map the stack onto your own systems (concept node, concrete): (1) Draw the four-tier stack and, for each tier, name *exactly which piece of your code* implements it today (working = your agent's message state; short-term = your LangGraph checkpointer; long-term = Ch 1's tables; shared = your brain MCP server, arguably). The gaps you can't fill are what this ring builds. (2) Trace the flow for a concrete scenario: your research agent (Vol 04) learns your preferences over three sessions — draw information entering as working memory, extracting to long-term, retrieving back next session. Mark every promote/demote/drop decision. (3) Write the paragraph: how is memory retrieval the same as Vol 03 RAG, and what three things does it add? The stack-with-code-map + the flow trace + the RAG-comparison paragraph = the note.

### Prove It
1. State the context-vs-store divide and the three traffic decisions across the boundary.
2. Recite the four-tier memory stack, and which of your existing builds implements each.
3. Describe the extract-out / retrieve-in loop and why it's what makes an agent *learn*.
4. Name the two hard problems the architecture must solve, and which chapters address each.
5. How is memory retrieval RAG, and what three things does memory add that documents lack?

**Wikilinks for your note:** [[context-windows]] · [[langgraph-checkpointers]] · [[scratchpads-working-memory]] · [[build-memory-taxonomy]] · [[why-rag]]

---

## Chapter 3 — Memory Extraction
**Node:** `memory-extraction` · concept · S

### The Feynman opener
Ch 1 built a classifier; this chapter makes it *wise*. The node summary: **conversations → durable facts.** The hard part of memory isn't storing or retrieving — it's *deciding what's worth remembering in the first place*, and doing it without either hoarding trivia or missing what matters. A human friend remembers that you're job-hunting and forgets what you had for lunch; an extractor that can't make that distinction produces a store that's simultaneously bloated and useless.

### The real thing
**The extraction judgment — the four questions every candidate memory must pass.** (1) *Is it durable?* — a fact true beyond this moment (your career goal) vs an ephemeral detail (today's weather); only durable things earn long-term storage. (2) *Is it general?* — useful beyond the immediate context vs a one-off (your name vs "the third item in that list"). (3) *Is it about a stable subject?* — the user, their projects, their preferences (worth tracking) vs a transient entity that won't recur. (4) *Is it non-redundant?* — not already stored (Ch 12's update problem: a "new" memory that contradicts or duplicates an existing one triggers *reconciliation*, not blind insertion — the junk drawer's cause of death). An extractor encoding these four questions in its prompt hoards far less than one told merely "extract important facts."

**When to extract — the timing decision.** Three strategies, each with a trade: *per-turn* (extract after every exchange — freshest memory, highest cost: an LLM call per turn on top of the conversation itself, doubling your bill — Vol 04 Ch 17 economics); *end-of-session* (extract once when a conversation closes — cheaper, but memory is stale mid-session and lost if the session never cleanly "ends"); *triggered* (extract when something notable happens — a decision made, a preference stated, a correction given — smartest, hardest to detect reliably). Most production systems use end-of-session or a hybrid (lightweight per-turn candidate-flagging, batched extraction at session end). The choice is a cost/freshness trade you now recognize on sight.

**The extraction prompt — craft that separates signal from junk.** Beyond the taxonomy (Ch 1), the prompt needs: *explicit worth-remembering criteria* (the four questions, stated), *the existing relevant memories as context* (so the model can reconcile rather than duplicate — "here's what I already know about the user; extract only what's new or changed" — this single addition slashes redundancy), *self-contained output* (every memory must resolve its own references — "the user prefers X" not "he prefers that"; a memory retrieved months later has no conversation around it, Ch 2's store-is-context-free property), and *confidence scoring* (uncertain extractions flagged — Ch 1's field — so low-confidence memories can be held tentatively or verified before trusting). And a hard rule that connects to Ch 8: the extractor is *reading conversations*, which may contain things that should *never* be stored (secrets, sensitive data) — extraction is the first line of privacy defense, filtering before storage, not after.

**The failure modes — the extractor's own zoo.** *Over-extraction* (the junk drawer — everything stored, retrieval drowns in trivia, precision collapses); *under-extraction* (real facts missed, the agent stays ignorant, recall collapses); *stale duplication* (the same fact re-stored every session because the extractor doesn't check existing memory — the redundancy that bloats stores); *reference danglers* (memories that don't resolve their own subjects — useless on retrieval); *false extraction* (hallucinated facts the user never stated — the model inferring "the user is frustrated" from neutral text; Vol 01 Ch 10's hallucination, now poisoning the *store* permanently, which is worse than a one-time bad answer because it *persists and compounds*). This last one is why confidence scoring and provenance (Ch 1) matter: a memory you can trace to its source snippet is a memory you can audit and correct.

### Hands-On
Upgrade your Ch 1 extractor into a wise one (~40 lines): (1) Add the four-question criteria and the existing-memories-as-context to the prompt; rerun on your real transcript and measure the redundancy drop (how many fewer duplicates?). (2) Implement end-of-session extraction on a multi-turn conversation, then compare against per-turn on the same conversation — cost and freshness, tabulated (Vol 04 Ch 17 habit). (3) Hunt the zoo: deliberately feed it a conversation containing a dangling reference, a should-never-store secret, and a neutral statement it might over-interpret — check whether it produces a dangler, stores the secret (it shouldn't — Ch 8 preview), or hallucinates an emotion. Document what it caught and missed. The redundancy delta + the timing table + the zoo specimens = the note.

### Prove It
1. Recite the four worth-remembering questions and what each filters out.
2. Compare the three extraction-timing strategies on cost and freshness.
3. Why include existing memories in the extraction prompt — what failure does it prevent?
4. Why must memories be self-contained, given Ch 2's store properties?
5. Name the five extraction failure modes, and why is false extraction the worst?

**Wikilinks for your note:** [[build-memory-taxonomy]] · [[hallucination]] · [[compaction-summarization]] · [[temporal-knowledge]] · [[privacy-in-memory]]

---

## Chapter 4 — Retrieval & Decay
**Node:** `retrieval-and-decay` · concept · S

### The Feynman opener
You've extracted memories (Ch 3); now the two questions that make a store *useful* instead of merely *full*: which memories surface when, and which ones fade away. The node summary names all three levers: **importance, recency, forgetting on purpose.** Pure similarity search (Vol 03) is not enough for memory — the *right* memory to surface isn't just the most *similar* one; it's the most *relevant-now*, weighing what matters, what's recent, and what's proven useful. And forgetting isn't a failure of memory; it's a feature — the thing that keeps a store sharp.

### The real thing
**Why similarity alone fails for memory.** Document-RAG ranks by semantic similarity and stops (Vol 03). But memories have properties documents don't: some are *more important* than others (your career goal > a passing comment), some are *more recent* (last week's decision > last year's, when they conflict), some have *proven useful* (a memory retrieved and confirmed helpful before). A memory-retrieval score that ignores these surfaces the similar-but-trivial over the crucial-but-differently-worded. The canonical fix — the memory-scoring formula worth knowing (popularized by generative-agents research):
**score = α·similarity + β·importance + γ·recency (+ δ·usage)** — a weighted blend, tuned to your system.
- *Similarity*: Vol 03's cosine — is this memory *about* what's being discussed?
- *Importance*: a stored salience score (assigned at extraction — "how significant is this?" — an LLM judgment, Ch 3's confidence's cousin), so crucial memories outrank trivia even at equal similarity.
- *Recency*: newer memories weighted up — usually a *decay function* of age (see below), so fresh context beats stale.
- *Usage* (optional): memories that have been retrieved-and-helped before get boosted — the store learns which memories earn their keep (a feedback loop; careful, it can entrench).

**Recency as decay — forgetting built into scoring.** Recency is typically an *exponential decay*: a memory's recency weight = e^(−λ·age), so influence fades smoothly with time (λ tunes the half-life). This is *soft* forgetting — old memories don't vanish, they just lose pull unless something (importance, repeated relevance) keeps them alive. It mirrors human memory beautifully: the unimportant-and-old fades; the important-or-recently-relevant stays vivid. And it solves a real problem — without recency decay, a store full of years of memories retrieves ancient irrelevancies with the same force as yesterday's crucial fact.

**Forgetting on purpose — the hard-forgetting spectrum.** Soft decay (above) is one end; the spectrum runs to true deletion:
- *Decay* (soft): influence fades, memory remains. Reversible if it becomes relevant again.
- *Archival*: move cold memories to slow/cheap storage, out of the hot retrieval path but recoverable. Keeps the working store fast.
- *Compaction* (Ch 6): merge many specific memories into one general one ("liked burgers on Tue, pizza on Fri, tacos on Sat" → "enjoys fast food") — forgetting *detail* while keeping *essence*.
- *Hard deletion*: gone. Required for privacy (Ch 8 — a "forget me" request, GDPR's right-to-erasure), for corrections (a false memory, Ch 3), and for hygiene (genuinely obsolete facts). The design imperative: **a memory store must support deletion by design** — retrofitting "forget this specific thing" onto a system that assumed permanence (especially once memories are embedded, summarized, and entangled — Ch 6) is a nightmare Ch 8 will make you feel.

**The design synthesis — why forgetting is a feature.** An agent that remembers *everything* forever is not smarter; it's slower (retrieval over a bloated store), noisier (trivia crowds signal — the precision problem), more expensive (storage and search costs grow), and a privacy liability (every retained fact is a potential leak). Deliberate forgetting — decay, archival, compaction, deletion — is what keeps memory *sharp, fast, relevant, and safe*. The best memory systems forget *well*, and forgetting-well is a design skill, not an oversight. Say it plainly: **the goal is not maximal recall; it's optimal relevance** — and that requires letting go.

### Hands-On
Build the scoring, feel the decay (~40 lines on your Ch 1 store): (1) Implement the memory-scoring formula — add importance (LLM-assigned at extraction) and an exponential recency-decay term to your Vol 03 retrieval, over your memory tables. Take a set of memories with varied importance and age, and a query; show how pure-similarity ranking vs blended ranking surface *different* top memories — the specific memory that similarity buried and importance/recency rescued is the lesson. (2) Tune the decay: vary λ and watch old-vs-new balance shift; find the half-life that feels right for your use and write why. (3) Design the forgetting policy: for your store, write the one-paragraph policy — what decays, what archives, what compacts, what hard-deletes, and the trigger for each. The ranking comparison + the λ experiment + the forgetting policy = the note.

### Prove It
1. Why does similarity-alone fail for memory retrieval? Name the three (or four) scoring factors and what each contributes.
2. Explain recency as exponential decay, what λ tunes, and why it's *soft* forgetting.
3. Recite the forgetting spectrum from decay to deletion, with each one's purpose.
4. Why must deletion be designed in, not retrofitted — and which later chapter makes you feel this?
5. Defend "the goal is optimal relevance, not maximal recall" — the four costs of remembering everything.

**Wikilinks for your note:** [[embeddings-hands-on]] · [[memory-extraction]] · [[compaction-summarization]] · [[privacy-in-memory]] · [[reranking]]

---

## Chapter 5 — Memory Frameworks
**Node:** `memory-frameworks` · frontier · S

> ⚠️ **This is a `frontier` node.** Per your graph's Rule 7, this chapter teaches the *permanent evaluation axes* for memory frameworks — but the actual roster (which frameworks exist, who's winning, what they're called) must come from a fresh frontier-scan **on the day you light this node**. Agent memory is a hot, young, fast-moving space; today's leading library may be tomorrow's footnote. The axes below don't age; the names do.

### The Feynman opener
You've now built memory from first principles (Chs 1–4) — which means you're finally qualified to *evaluate* the frameworks that package it, because you know what they're packaging. The node summary hedges honestly: **the current landscape when I light this node.** This chapter isn't a product review (those rot in months); it's the permanent set of questions to ask any memory framework, so that whatever won by the time you read this, you can judge it against what you'd build yourself.

### The real thing — the permanent axes
**Axis 1 — What does it actually abstract, and did you need the abstraction?** Every memory framework claims to handle extraction, storage, retrieval, and decay for you. The question (having built all four): does its abstraction *match* the architecture you now understand, or does it hide decisions you need to control? Good frameworks expose the knobs (which extraction strategy, which scoring weights, which decay policy — Chs 3–4); opinionated ones make the choices for you (convenient until their choice is wrong for your case). The curriculum's recurring bet pays off here: *because you built it bare, no framework can be magic, and you can read exactly what each one decided for you.*

**Axis 2 — Where does it store, and do you own it?** Memory is *your users' data* (or your own — your brain). Questions: does it use your infrastructure (your Postgres — you own it, you can audit/delete/comply) or a managed service (convenient, but your users' memories live on someone else's servers — a privacy and compliance question, Ch 8)? Can you inspect and export the stored memories, or are they opaque? Lock-in matters more for memory than for most things, because migrating a populated memory store is far harder than swapping a stateless library.

**Axis 3 — What's its memory model, and does it match the taxonomy?** Some frameworks are just "vector store + auto-extraction" (semantic memory only — Ch 1's three types collapsed to one); others model episodic/procedural distinctions, temporal facts (Ch 12), or graph relationships (Part II). Evaluate against the taxonomy you built: does its model capture what your use needs, or force everything into one shape? A framework that only does semantic facts can't remember *how* you like things done (procedural) — a real limitation for a personalized assistant.

**Axis 4 — How does it handle the hard problems you now know are hard?** The tells that separate serious frameworks from demos: Does it *reconcile* conflicting/updating memories or just accumulate (Ch 3's redundancy, Ch 12's temporal problem)? Does it *forget* — decay, compaction, deletion (Ch 4)? Does it support *hard deletion for privacy* (Ch 8 — a "forget me" that actually works)? Does it handle *retrieval scoring beyond similarity* (Ch 4's importance/recency)? A framework silent on these is a junk drawer with a nice API. You know to ask because you built the answers.

**Axis 5 — Maturity, adoption, and the build-vs-buy honest call.** Memory frameworks are young; APIs churn, some are thin wrappers, some are genuinely deep. The senior judgment (Vol 05 Ch 14's protocol instinct, Vol 01 Ch 11's benchmark skepticism): is this shipped-and-adopted or announced-and-hyped? And the build-vs-buy call *you're now equipped to make honestly*: you've built a working memory system in four chapters — for many uses, *your own* Postgres-backed memory (Chs 1–4) is simpler, more controllable, and more private than any framework, and the framework earns adoption only when it does something genuinely hard (scale, sophisticated graph memory, battle-tested reconciliation) better than you'd build in reasonable time. Sometimes the right answer is "I already built what I need"; sometimes it's "this does the temporal-graph reconciliation I don't want to build" — and only having built the basics lets you tell which.

### Hands-On (do on light-day)
Run the frontier-scan (Rule 7): (1) Search the *current* memory-framework landscape — the leading libraries/services now, what each claims, who's adopting. (2) Build the evaluation table with the five axes as columns and each live framework as a row — abstraction fit, storage/ownership, memory model vs taxonomy, hard-problem handling, maturity. (3) The build-vs-buy verdict for *your* systems: does any framework beat your Chs 1–4 memory layer for your research agent, and *specifically what* would it have to do better to be worth adopting? Date-stamp it (this snapshot rots; the next reader may be you, re-scanning at a replan). (4) The honest self-check: list three things your hand-built memory does *well* and two things a mature framework would likely do *better* — the boundary of your build-it-yourself competence, named.

### Prove It
1. Recite the five evaluation axes as questions to ask any memory framework.
2. Why does having built memory bare make you a *better* framework evaluator?
3. Why does storage ownership matter more for memory than for stateless libraries?
4. Name three "hard problem" tells that separate serious frameworks from demos, and why you know to ask.
5. Frame the build-vs-buy call honestly — when is your own layer the right answer?

**Wikilinks for your note:** [[build-memory-taxonomy]] · [[retrieval-and-decay]] · [[temporal-knowledge]] · [[model-landscape]] · [[build-memory-layer]]

---

## Chapter 6 — Compaction & Summarization
**Node:** `compaction-summarization` · concept · S

### The Feynman opener
A store that only grows eventually collapses under its own weight — slow retrieval, noisy results, mounting cost (Ch 4's four costs of remembering everything). The node summary is the pressure valve: **keeping memory small and sharp.** Compaction is how memory stays useful over months and years: merging the specific into the general, the many into the essential, without losing what matters. It's Vol 03 Ch 15's summarization and Vol 02 Ch 17's chatbot trimming, grown into a first-class memory operation with its own hard tradeoffs.

### The real thing
**The two operations — compaction vs summarization, distinguished.** *Summarization* compresses a *sequence* into a shorter form (a conversation → its gist; ten episodic events → a paragraph) — the same map-reduce/refine shapes from Vol 03 Ch 15, now applied to memory. *Compaction* is broader: consolidating *related memories* into fewer, more general ones — merging "user liked the burger place Tuesday," "ordered pizza Friday," "got tacos Saturday" into one semantic memory "user enjoys casual fast food," and *deleting the specifics*. Compaction changes memory *type* (episodic specifics → semantic generalization — Ch 1's taxonomy in motion) and *reduces count*, not just length. Both keep the store small; compaction also makes it *smarter* by surfacing patterns the specifics only implied.

**When and how — the compaction triggers.** *Threshold-based*: when memories about a subject exceed N, compact them (the store self-maintains). *Time-based*: periodically compact old episodic memories into semantic generalizations (last month's events → this month's understanding — mirrors how human memory consolidates episodic experience into semantic knowledge during, famously, sleep). *Redundancy-based*: when extraction (Ch 3) detects near-duplicates, compact on write. The mechanism is an LLM call (your gateway): "here are N related memories; produce the minimal set of memories that preserves their essential information" — structured output, the compacted memories replacing the originals (with provenance preserved — Ch 1's source tracking survives compaction, so you can still audit *what* got merged).

**The central tradeoff — and it's genuinely hard.** Compaction is *lossy by design* (Vol 03 Ch 15's warning, sharpened): you're deliberately destroying detail to preserve essence, and **the detail you compact away might be the detail a future query needed.** "User enjoys fast food" is useless when they later ask "what was that burger place I liked?" — the specific, compacted away, is gone. This is the memory engineer's genuine dilemma, and there's no free answer, only judgment: compact *too aggressively* and you lose retrievable specifics; compact *too little* and the store bloats (Ch 4's costs). The mitigations: *tiered compaction* (keep recent memories specific, compact only the old — recency-gated, Ch 4's decay logic applied to compaction), *archival-not-deletion* (compact into a general memory but *archive* the specifics to cold storage rather than deleting — recoverable if needed, Ch 4's archival tier), and *importance-gated* (never compact high-importance memories — a crucial specific stays specific forever). The design principle: **compact the trivial and old aggressively; preserve the important and recent faithfully** — the same optimal-relevance-not-maximal-recall philosophy, applied to consolidation.

**The connection to context management — the same skill, three scales.** Notice you've now met this operation at three scales, and seeing them as one deepens all three: *within a task* (scratchpad compaction, Vol 04 Ch 13 — distill observations), *within a session* (chat-history summarization, Vol 02 Ch 17 — compress old turns), *across sessions* (memory compaction, this chapter — consolidate the long-term store). Same fundamental move — trade detail for compactness to fit finite space — at working-memory, session-memory, and long-term-memory scales. The memory stack (Ch 2) has a compaction operation at every tier; mastering it once is mastering it everywhere.

### Hands-On
Build compaction, feel the tradeoff (~40 lines on your store): (1) Implement subject-based compaction: gather all memories about one subject, LLM-compact them into a minimal set, replace (preserving provenance). Run it on an over-populated subject and measure the count reduction. (2) Feel the loss: after compacting, run a query that needed one of the *specific* memories you compacted away — watch the store fail to answer it. That failure is the tradeoff, witnessed. Then implement importance-gating (never compact the high-importance specific) and re-test — the crucial detail survives. (3) Design the tiered policy: write the one-paragraph compaction policy for your store — what compacts when, what's protected, what archives vs deletes. The count reduction + the loss specimen + the tiered policy = the note.

### Prove It
1. Distinguish summarization from compaction — what does each reduce, and how does compaction change memory *type*?
2. Name the three compaction triggers, and the human-memory analogy for time-based compaction.
3. State the central tradeoff precisely, and give the "burger place" example of its cost.
4. Recite the three mitigations, and the design principle that governs them.
5. Name the three scales at which you've met this operation, and the single move common to all.

**Wikilinks for your note:** [[retrieval-and-decay]] · [[long-context-strategies]] · [[scratchpads-working-memory]] · [[build-cli-chatbot]] · [[memory-extraction]]

---

## Chapter 7 — Personalization
**Node:** `personalization-via-memory` · concept · S

### The Feynman opener
This is the *why* of the whole ring — the payoff memory exists to deliver. The node summary: **assistants that actually know you.** The difference between a tool you re-explain yourself to every session and an assistant that *remembers* — your goals, your style, your context, your history — is memory, applied. And the difference between personalization that delights and personalization that creeps (or misfires) is judgment about *what* to remember and *how* to use it. This chapter turns the machinery of Chs 1–6 into the experience users actually feel.

### The real thing
**What personalization actually is — memory, retrieved and applied.** Mechanically, it's the extract-out/retrieve-in loop (Ch 2) closing around a *person*: the assistant extracts durable facts about you (semantic — your role, goals), your history with it (episodic — past sessions, decisions), and your preferences-in-action (procedural — how you like things done, Ch 1's underrated type), then *retrieves the relevant subset into context* at the start of each interaction so the model behaves as if it knows you. No new mechanism — it's every chapter so far, aimed at a user. The magic the user feels ("it remembered!") is your retrieval-scoring (Ch 4) surfacing the right memory at the right moment.

**The three tiers of personalization — ascending in value and difficulty.** (1) *Knowing facts about you* (semantic): "you're targeting AI-engineering roles" — the assistant tailors content to your context. Table stakes; most "memory" features stop here. (2) *Knowing your history* (episodic): "last week we worked through the async bridge" — continuity across sessions, so you never re-explain; the assistant builds on shared past. (3) *Knowing how you work* (procedural — the highest tier, rarely done well): "you prefer terse answers with code first, you learn by analogy, you want to be challenged not coddled" — the assistant adapts its *behavior*, not just its content. This tier is where an assistant stops being a smart tool and becomes *yours* — and it's exactly what your Vizier study-buddy persona (Vol 02 Ch 17) would become with real procedural memory: it would learn *your* learning style from watching you learn.

**Applying memory to behavior — how retrieved memory becomes personalized output.** Retrieved memories enter the context (Ch 2), but *where and how* matters: *system-prompt injection* (relevant persistent facts and preferences prepended as context — "what you know about this user: ..." — Vol 02 Ch 2's system-prompt authority steering behavior with *personal* facts), *retrieved-context* (episodic memories surfaced when relevant to the current query — Vol 03's retrieval, personalized), and *procedural application* (preferences translated into instructions — "the user prefers bullets" becomes a format directive). The craft: inject *enough* to personalize, not *so much* that memories crowd the context (Ch 4's precision problem — surfacing ten memories when two are relevant is noise that degrades the response, the lost-in-the-middle tax on personalization).

**The failure modes — where personalization misfires.** *Over-personalization / creepiness*: surfacing a memory the user forgot they shared, or in a context that feels invasive ("I remember you mentioned your health issue three months ago" — technically remembered, socially wrong) — the uncanny valley of memory, and a real product risk. *Stale personalization*: acting on outdated facts (Ch 12's temporal problem — "you're job-hunting" said cheerfully after you got the job is worse than not remembering). *Wrong-context surfacing*: a work preference applied to a personal query. *Filter-bubble entrenchment*: over-adapting to inferred preferences until the assistant only ever gives you more of the same (the usage-boost feedback loop from Ch 4, weaponized against discovery). *False personalization*: acting on a hallucinated memory (Ch 3's false-extraction, now shaping behavior — "as someone who loves X" when you never said that). The mitigations weave through the whole ring: confidence and provenance (trust memories you can audit), recency and temporal awareness (don't act on stale facts), importance-gating (surface the significant, not the trivial-but-remembered), and — critically — *user control* (Ch 8): let users see, edit, and delete what the assistant remembers, because the antidote to creepy is *transparent and controllable*.

### Hands-On
Personalize your study-buddy, feel both sides (~40 lines on your Vol 02 Ch 17 chatbot + this ring's memory): (1) Wire your memory layer into the chatbot: at session start, retrieve relevant memories (scored, Ch 4) and inject them into the system prompt; run two sessions and watch session two *know* things from session one (the payoff, felt). (2) Add procedural memory: have it learn one preference (terse vs detailed, say) and adapt — the highest tier, demonstrated. (3) Break it deliberately: force a stale memory (a fact you've since changed) and a low-relevance memory to surface, and feel the misfire — then apply a mitigation (recency-gating, importance-gating) and watch it improve. The two-session continuity + the procedural adaptation + the misfire-and-fix = the note. This directly seeds Ch 14's memory layer and the recall agent (Ch 17).

### Prove It
1. Define personalization mechanically — which loop, aimed at whom, no new machinery.
2. Recite the three tiers, and why procedural is the highest and rarest.
3. How does retrieved memory become personalized *behavior* — the three injection methods?
4. Name four personalization failure modes, and why is creepiness a real product risk?
5. What is the antidote to creepy personalization, and which chapter builds it?

**Wikilinks for your note:** [[roles-and-system-prompts]] · [[retrieval-and-decay]] · [[build-cli-chatbot]] · [[privacy-in-memory]] · [[temporal-knowledge]]

---

## Chapter 8 — Privacy in Memory
**Node:** `privacy-in-memory` · concept · S

### The Feynman opener
Everything this ring built — remembering facts, tracking history, personalizing behavior — is powerful, and power over people's data is responsibility. The node summary is a line in the sand: **what should never be remembered.** An assistant that remembers everything is not just a bloated store (Ch 4) — it's a liability, a breach waiting to happen, and potentially a violation of law and trust. This chapter is the ethics and engineering of *restraint* — and it's not a soft add-on; it's a hard design constraint that reshapes the whole memory architecture.

### The real thing
**What should never be stored — the never-remember categories.** Some things extraction (Ch 3) must filter *before* storage, not clean up after: *secrets and credentials* (passwords, API keys, tokens the user pastes — never persist these, a security absolute); *sensitive personal data* (health, financial, legal, sexual, religious, political — special-category data under privacy law, requiring explicit consent and often best not stored at all); *third-party data* (things about *other* people the user mentioned — you didn't get *their* consent); and *ephemeral emotional states* misread as durable facts (Ch 3's false extraction, with privacy stakes — storing "user is depressed" from one frustrated message is both wrong and harmful). The extractor is the first line of defense: a *privacy filter in the extraction prompt* ("never extract credentials, health, financial, or third-party personal information") stops sensitive data at the door, which is far safer than storing-then-scrubbing (you can't un-leak what you stored).

**The user's rights — control as a design requirement, not a feature.** Privacy regulation (GDPR, CCPA, and the global trend) grants rights that memory systems must *architect for*, not bolt on: *access* (users can see what's remembered about them — so the store must be inspectable, not opaque, Ch 5's ownership axis); *rectification* (users can correct wrong memories — Ch 12's update path, now a legal requirement); *erasure* — the right to be forgotten (users can demand deletion — and it must *actually work*, which is why Ch 4 insisted deletion be designed in). Here the Ch 4 warning comes due with full force: once a memory is *embedded* (in a vector store), *summarized into other memories* (Ch 6's compaction entangled it), and *woven into a knowledge graph* (Part II), "delete this one fact" becomes genuinely hard — the fact's influence is smeared across derived artifacts. **A memory system that can't cleanly honor "forget me" is a legal and ethical liability**, and the only reliable fix is designing for deletion from the start: provenance tracking (Ch 1 — every derived memory traces to its sources, so deleting a source can trigger re-deriving what it touched), avoiding irreversible entanglement of sensitive data, and treating erasure as a first-class operation the architecture supports, tested like any other.

**Consent, transparency, and the trust contract.** Beyond the legal minimum, there's the trust relationship (Ch 7's creepiness, at its root): users should *know* memory is happening (transparency — "I'll remember this for next time" beats silent surveillance), *consent* to it (opt-in for sensitive personalization, not opt-out-if-you-notice), and *control* it (see/edit/delete — the antidote to creepy, Ch 7). The design principle: **memory should feel like a helpful friend's recall, not a surveillance system's dossier** — and the difference is entirely consent, transparency, and control. An assistant that remembers *with* you (visible, controllable) is delightful; one that remembers *about* you (silent, opaque) is creepy, regardless of identical underlying tech.

**The engineering imperatives — privacy as architecture (the ring's final "security is architecture" echo).** Concretely: *extract with a privacy filter* (stop sensitive data at the door — Ch 3); *encrypt memories at rest* (they're personal data); *scope access* (a user's memories are theirs — a multi-user system must isolate them, no cross-user leakage — Vol 05 Ch 13's confused-deputy risk, at the memory layer); *design for deletion* (Ch 4, non-negotiable); *minimize by default* (store the least that serves the purpose — the least-storage principle, sibling to least-privilege, least-autonomy; every fact not stored is a fact that can't leak); and *audit* (log what's remembered and why — the provenance habit, now a compliance tool). Privacy isn't a constraint bolted onto memory; it's a design dimension woven through every chapter of this ring — and getting it right is part of what separates a shippable memory system from a demo.

### Hands-On
Harden your memory system (~30 lines + design): (1) Add the privacy filter to your extraction prompt (never-remember categories) and test it: feed conversations containing a pasted password, a health disclosure, and a third-party's info — assert *none* get stored. The door-filter, verified. (2) Implement erasure: a `forget(subject)` operation that deletes a user's memories *and* handles the entanglement — find memories derived from the deleted ones (via provenance, Ch 1) and re-derive or delete them too. Test that a deleted fact truly stops surfacing, even through compacted/derived memories. (3) Write the privacy design doc for your system: the never-remember list, the consent/transparency model, the deletion architecture, the access-scoping. The filter test + the working erasure + the privacy doc = the note — and this doc is genuinely portfolio-worthy (privacy-aware memory design is a senior signal most people skip).

### Prove It
1. Name the never-remember categories and why the extraction filter (not post-hoc scrubbing) is the right defense.
2. Recite the three user rights privacy law grants, and how each becomes an architecture requirement.
3. Why does "forget me" get hard once memories are embedded/compacted/graphed, and how does provenance help?
4. State the "helpful friend vs surveillance dossier" principle — what actually distinguishes them?
5. Recite the privacy engineering imperatives, and name the least-storage principle's siblings.

**Wikilinks for your note:** [[memory-extraction]] · [[retrieval-and-decay]] · [[mcp-security]] · [[personalization-via-memory]] · [[temporal-knowledge]]

---

# PART II — KNOWLEDGE GRAPHS
*5 chapters. Knowledge stops being a pile and becomes a graph: the fundamentals, extracting entities from your notes, GraphRAG done properly, facts that change over time, and your own brain formalized as the knowledge graph it was always shaped to be.*

---

## Chapter 9 — Knowledge Graphs 101
**Node:** `knowledge-graphs-101` · concept · S

### The Feynman opener
Vector search (Vol 03) finds things *similar* to your query; it cannot find things *related* to each other (Vol 03 Ch 19's diagnosis). The node summary names the structure that can: **entities, relations, triples.** A knowledge graph represents knowledge the way your brain actually does — as *things* connected by *relationships* — and once knowledge has that shape, it answers questions no pile of text ever could. Your wikilinked notes have been a knowledge graph in disguise this whole time; this chapter gives you the formal vocabulary to see it.

### The real thing
**The triple — the atom of knowledge.** A knowledge graph is built from **triples**: *(subject, predicate, object)* — *(Tharun, is-learning, AI-engineering)*, *(the-checkpointer, persists, agent-state)*, *(attention, was-introduced-in, "Attention Is All You Need")*. Each triple is one fact, one edge. Subjects and objects are **entities** (nodes — the *things*: people, concepts, tools, papers); predicates are **relations** (edges — the *connections*, and crucially they're *typed*: "persists," "was-introduced-in," "depends-on" — the relationship's *meaning* is first-class, not just "these are linked"). A knowledge graph is a set of triples, which is a graph of typed entities and typed relations. That's the whole data model — deceptively simple, profoundly expressive.

**Why this shape unlocks new questions.** Because relationships are explicit and typed, you can *traverse* and *reason over structure* in ways flat text forbids: *multi-hop by walking edges* ("what did the tool my supervisor routes to depend on?" — follow routes-to, then depends-on — Vol 04 Ch 14's multi-hop, now a *graph walk* instead of an expensive per-query retrieval loop); *relational queries* ("how are X and Y connected?" — find the path between two nodes — impossible for vector search, Vol 03 Ch 19); *aggregate/global queries* ("what are all the tools in the agents domain?" — query by entity type and relation — the global questions the pile couldn't answer); *pattern queries* ("find all concepts that depend on something in the foundations domain"). The structure *is* the capability: knowledge shaped as a graph answers connection-questions natively.

**The vocabulary landscape — orient without drowning.** *Ontology / schema*: the *types* allowed — what entity types exist (Concept, Tool, Person, Paper), what relation types connect them (depends-on, introduced-by, part-of). A schema makes a graph queryable and consistent (your curriculum *has* one implicitly: nodes have types, domains, wikilinks — Ch 13 formalizes it). *RDF and property graphs*: two main technical traditions — RDF (triples, the semantic-web lineage, SPARQL query language) and property graphs (nodes/edges with properties, Cypher query language, Neo4j the famous engine) — you don't need to master either now; know they exist and that property graphs are the more common modern choice for LLM-era knowledge graphs. *Knowledge graph vs vector store*: not rivals — *complements* (GraphRAG, Ch 11, uses both: the graph for structure, vectors for semantic entry points). The mature system has both, each doing what it's best at.

**The honest costs — why not everything is a graph.** Graphs are powerful and *expensive to build well*: extracting reliable entities and relations from text is hard (Ch 10 — LLM extraction, error-prone), *entity resolution* is the crux ("the gate," "HITL approval," "the human check" must resolve to *one* entity or the graph fragments — Vol 03 Ch 19's hard half), schemas require design and maintenance, and keeping a graph current as knowledge changes (Ch 12) is genuinely hard. For many uses, vector RAG's "pile of chunks" is simpler and sufficient (Vol 03 Ch 19's adoption judgment). Graphs earn their cost when *relationships and structure are the value* — which, for a wikilinked brain built by someone who thinks in connections, they emphatically are.

### Hands-On
See the graph you already have (concept node, concrete): (1) Take five of your linked notes and write out their knowledge as *explicit triples* — every fact as (subject, predicate, object), every wikilink as a typed relation (not just "links-to" but *what kind* of link — "depends-on," "part-of," "contrasts-with"). Count how many triples five notes contain — the density will surprise you. (2) Now query your triples by hand: pick a multi-hop question and *walk the edges* to answer it; pick two distant entities and find the *path* between them. Feel structure answering what similarity couldn't. (3) Sketch the implicit *schema* of your brain: what entity types exist (Concept, Build, Tool, Person, Milestone...), what relation types (depends-on, part-of, introduced-in...). This sketch is Ch 13's formalization, started. The triples + the by-hand graph queries + the schema sketch = the note.

### Prove It
1. Define the triple and its three parts, and why typed relations are the key feature.
2. Name four question-types a graph answers that vector search structurally cannot, with an example each.
3. Distinguish ontology/schema, RDF vs property graphs, and graph-vs-vector (rivals or complements?).
4. Why is entity resolution the crux, and what breaks without it?
5. When do graphs earn their cost, and why is your brain an especially strong case?

**Wikilinks for your note:** [[graphrag-preview]] · [[multi-hop-retrieval]] · [[entity-extraction]] · [[brain-as-knowledge-graph]] · [[why-rag]]

---

## Chapter 10 — Entity Extraction
**Node:** `entity-extraction` · build · M

### The Feynman opener
A knowledge graph is only as good as the triples in it — and triples don't extract themselves from prose. The node summary: **LLM pulls entities/relations from my notes.** This build is where your pile of notes starts becoming a graph: an LLM reads text and emits *(subject, predicate, object)* triples, with the two hard problems that make this an M-node not an S-node — reliable extraction and *entity resolution*. It's the ingestion pipeline (Vol 03 Ch 15) for graphs, and it directly feeds Ch 13's formalization and Ch 11's proper GraphRAG.

### The real thing — the spec
**The extraction call — text to triples.** An LLM pass (gateway, structured output — the pattern, again) over a note, emitting triples against a schema:
```python
class Triple(BaseModel):
    subject: str          # entity name
    subject_type: str     # Concept | Tool | Person | Paper | ... (your schema, Ch 9/13)
    predicate: str        # the typed relation — from a controlled vocabulary, ideally
    object: str
    object_type: str
    source_note: str      # provenance — every edge traces to its note (Vol 03 Ch 10 habit)
    confidence: float     # extraction certainty (Ch 3's field, again — low-confidence triples flagged)
```
The prompt teaches the schema by example (few-shot — the entity types and relation types you want, with worked extractions) and — critically — *constrains the predicates*: free-form relations produce chaos ("depends-on," "requires," "needs," "built-on" all meaning the same thing fragments the graph), so give the model a *controlled vocabulary* of relation types and make it choose from them (structured output with an enum — Vol 02 Ch 6, aimed at graph consistency). Uncontrolled predicates are to graphs what unstemmed jargon was to keyword search (Vol 03 Ch 6) — the same fragmentation disease.

**Entity resolution — the crux, the thing that makes or breaks the graph (Vol 03 Ch 19's hard half, now yours to solve).** The problem: the same entity appears under many names — "the gate," "HITL approval," "human-in-the-loop check," "the approval gate" are *one* entity, but naive extraction creates *four* nodes, and your graph fragments into synonyms that never connect. Resolution collapses them to one canonical entity. The techniques, ascending in sophistication: *exact-match + normalization* (lowercase, strip articles — catches "The Gate"/"gate"); *alias tables* (a maintained map of known synonyms → canonical — reliable, manual); *embedding-similarity clustering* (embed entity mentions, cluster near-duplicates — your Vol 03 Ch 5 machinery, pointed at entity names; "the gate" and "approval gate" embed close → same entity — but watch the threshold, Vol 03 Ch 20's precision/recall dilemma returns: too loose merges distinct entities, too tight fragments); *LLM resolution* ("are these two mentions the same entity? here's context" — flexible, costly). And your brain's superpower, again: **wikilinks are pre-resolved entities** — `[[hitl-interrupts]]` is a canonical ID you *already assigned by hand*, so your notes hand the resolver ground truth most corpora must guess (Vol 03 Ch 19's "comically well-shaped," cashing in as real extraction leverage).

**The failure modes — the graph's version of the extraction zoo.** *Over-extraction* (spurious triples from noise — the model inventing relations the text doesn't support; Vol 01 Ch 10's hallucination, now poisoning the *graph* with false edges — confidence-gate and provenance-check these); *predicate chaos* (uncontrolled relations fragmenting — the controlled vocabulary fix); *resolution errors* — both directions: *under-merging* (synonyms stay separate, graph fragments) and *over-merging* (distinct entities collapsed — "attention" the mechanism and "attention" the cognitive concept merged, corrupting the graph with false identity — arguably worse than fragmentation because it creates *false* connections); *missing entities* (the model overlooks a real entity — recall failure). Every one is measurable (precision/recall on extracted triples against hand-labeled ground truth — Vol 01 Ch 12, the graph edition), which is how you tune the extractor rather than trusting it.

**Verification.** Hand-label the triples in ~5 notes (ground truth — the labeling *is* the work, as always). Assert: extraction precision (few false triples) and recall (few missed) against your labels; predicate values stay within the controlled vocabulary; resolution correctly merges known synonyms (test with your wikilink aliases) *and* correctly keeps known-distinct entities separate (the over-merge test). Provenance on every triple.

### Hands-On
Build it (est. 1 day): the `Triple` schema + controlled predicate vocabulary → the extraction prompt with schema few-shots → entity resolution (start with normalization + your wikilink alias table, add embedding-clustering if time) → run on ~10 real notes → the ground-truth labeling of 5 → the precision/recall tests + resolution tests. Then the reveal: visualize the extracted graph (even a simple node-edge print or a quick graphviz) and *look at it* — your notes, as a connected structure. Find one triple that's wrong (over-extraction) and one entity that fragmented or over-merged — those specimens are the lesson. Tag `graph-v0.1`. The precision/recall numbers + the graph visualization + the error specimens = the note; this feeds Ch 13 directly.

### Prove It
1. Why must predicates be a controlled vocabulary? Name the disease uncontrolled ones cause and its Vol 03 analog.
2. State the entity-resolution problem and recite the four techniques, ascending.
3. Why are your wikilinks a resolution superpower?
4. Distinguish under-merging from over-merging, and argue why over-merging may be worse.
5. How do precision and recall apply to triple extraction, and what's ground truth?

**Wikilinks for your note:** [[knowledge-graphs-101]] · [[ingestion-pipelines]] · [[embeddings-hands-on]] · [[graphrag-deep]] · [[brain-as-knowledge-graph]]

---

## Chapter 11 — GraphRAG Properly
**Node:** `graphrag-deep` · concept · M

### The Feynman opener
Vol 03 Ch 19 was the preview; this is the real thing. The node summary: **community summaries, graph-aware retrieval.** You now have the pieces the preview lacked — entity extraction (Ch 10), a knowledge graph (Ch 9), and the retrieval mastery of Vol 03 — so GraphRAG stops being "someday" and becomes buildable architecture. This chapter is the full method: how a knowledge graph transforms retrieval from *finding similar chunks* to *reasoning over connected knowledge*, answering the global and relational questions vector RAG structurally cannot.

### The real thing
**The problem GraphRAG solves — recall Vol 03 Ch 19's two failures.** *Global questions* ("what are the main themes across my agents notes?") — no chunk contains the answer; it's a property of the *whole collection*, and top-k retrieval misses it by construction. *Relational questions* ("how does the checkpointer relate to the gate?") — the answer is in the *connections*, which vector search can't traverse. Standard RAG fails both because it treats knowledge as an unstructured pile. GraphRAG treats it as a structured graph, and structure answers both.

**The method — the full GraphRAG pipeline (Vol 03 Ch 19's three techniques, now understood in depth).**
1. **Graph construction** (Ch 10, done): entities and relations extracted from the corpus into a knowledge graph, entity-resolved. Your notes → your graph.
2. **Community detection**: graph algorithms (Leiden/Louvain are the famous ones — you don't implement them, you *use* them) cluster densely-connected regions into *communities* — groups of entities more connected to each other than to the rest. For your brain, domains emerge as natural communities, *plus* surprises: cross-domain communities like "everything touching Pydantic" or "everything the gate protects" that no folder structure knows (Vol 03 Ch 19's promise, now real). Communities can be *hierarchical* (sub-communities within domains, a root above all — the resolution dial).
3. **Community summarization** — *the key move for global questions*: an LLM writes a *summary of each community* ("the agents-domain community covers the reason-act-observe loop, its patterns, and its failure modes...") and *stores it*. Now global questions have an answer to retrieve: "main themes across agents notes?" → retrieve the agents-community summary → pre-computed synthesis, fished out like any chunk. The pile could never; the graph does it *at ingestion, once*, and reuses it for every global query.
4. **Graph-aware retrieval** — the query-time method, which *routes by question type* (the routing doctrine, Vol 05 Ch 3, at the retrieval layer): *global question* → retrieve community summaries (high-level, pre-computed); *specific question* → find relevant entities, retrieve their neighborhoods and the underlying chunks (drill down); *relational question* → find the entities, *walk the path* between them (the graph traversal vector search can't do). Often *hybrid with vector RAG*: use vector search to find entry-point entities (semantic entry), then traverse the graph from there (structural expansion) — vectors for "where do I start," graph for "what's connected." The two retrieval paradigms compose, each doing what it's best at.

**The honest costs — why GraphRAG is a judgment call, not a default (Vol 03 Ch 19's adoption rule, now with the full cost picture).** *Construction cost explodes*: LLM extraction over every chunk + community summarization ≈ orders of magnitude more expensive than embedding (Vol 04 Ch 17's ledger instincts wince — correctly). *Graph staleness is nastier than index staleness* (Ch 12's whole subject): one edited note can re-wire edges and invalidate community summaries *up the hierarchy* — a transitive cache-invalidation problem far harder than re-embedding one chunk. *Extraction quality bounds everything* (Ch 10 — garbage triples → confident garbage traversals; poisoned-at-birth, graph edition). *Complexity*: more moving parts, more failure surface, more to maintain. The adoption judgment, sharpened: GraphRAG earns its cost when *global and relational questions are the workload* (not the exception), when *the corpus's value is its connections* (not just its content), and when you'll *invest in construction and maintenance*. For most corpora and most questions, hybrid vector RAG wins on cost-adjusted quality. **For your brain** — a densely-wikilinked graph, queried by someone who thinks in connections, where "how does X relate to Y across domains?" is a *native* question — the case is unusually, genuinely strong, which is exactly why your curriculum schedules the real build here rather than dismissing it.

### Hands-On
Build a slice of proper GraphRAG on your Ch 10 graph (concept node, but concrete — full build is Ch 14/17 territory): (1) *Community detection*: run a community algorithm (via `networkx` or `igraph` — libraries, don't implement) on your extracted graph; inspect the communities — do your domains emerge? What *cross-domain* community surprised you? (2) *Community summarization*: LLM-summarize your two most interesting communities (one domain-aligned, one cross-cutting); these summaries *are* your global-question answers — test one ("what's the main theme of [community]?"). (3) *The routing table*: six questions about your brain (two global, two relational, two specific) and, for each, which GraphRAG path answers it (community summary / graph walk / entity-neighborhood + chunks) vs what plain vector RAG would have done (fail / expensive multi-hop / tie). The communities + the summaries + the routing table = the note; this is Ch 14's memory layer and the recall agent (Ch 17) designed early.

### Prove It
1. State the two question-types GraphRAG solves and why plain RAG fails each.
2. Walk the four-stage pipeline, and identify which stage answers global questions and *when* it's computed.
3. Explain graph-aware retrieval's routing by question type, and the vectors-for-entry/graph-for-expansion hybrid.
4. Name the four honest costs, and why is graph staleness worse than index staleness?
5. State the adoption judgment, and defend why your brain is an unusually strong case.

**Wikilinks for your note:** [[graphrag-preview]] · [[entity-extraction]] · [[knowledge-graphs-101]] · [[temporal-knowledge]] · [[build-learning-recall-agent]]

---

## Chapter 12 — Temporal Knowledge
**Node:** `temporal-knowledge` · concept · S

### The Feynman opener
"The user is job-hunting" was true in July and false in September. "The CEO is X" changes. "I'm learning Domain 06" becomes "I finished Domain 06." The node summary names the problem that haunts every memory and knowledge system: **facts that change over time.** Knowledge isn't static, but naive stores treat it as if it were — and a system that can't handle change either accumulates contradictions or acts confidently on stale facts (Ch 7's stale-personalization, Vol 01 Ch 10's staleness, now the deep structural version). Time is the dimension most knowledge systems forget, and forgetting it is how they slowly fill with lies.

### The real thing
**The core problem — facts have validity intervals, not just values.** A naive store holds *(user, is-learning, Domain-06)* as if eternal. The truth is *(user, is-learning, Domain-06, valid-from: July, valid-until: September)* — the fact was true *during an interval*. Two distinct time dimensions matter (from temporal-database theory, worth knowing the names): *valid time* (when the fact was true *in the world* — the user learned Domain 06 in July-August) and *transaction time* (when the system *recorded* it — you might log it in July or backfill it later). Confusing them causes subtle bugs; for most agent memory, valid time is what you engineer for. The upgrade: every memory/triple carries temporal metadata (valid-from, valid-until, or a timestamp), transforming the store from "what's true" to "what was true when."

**The update problem — reconciliation, not accumulation (Ch 3's redundancy, now the deep version).** When a new fact contradicts an old one — user says "I got the job" after the store held "user is job-hunting" — the store must *reconcile*, and the options each have a use: *overwrite* (replace old with new — simple, but *loses history*: you can no longer answer "was the user job-hunting in July?"); *invalidate + append* (mark the old fact's valid-until, add the new fact with valid-from — *preserves history*, the temporally-honest choice: both facts are retained, each with its interval, and the store knows the transition happened); *versioning* (full history of a fact's changes). The temporally-aware choice is usually invalidate-and-append: **facts don't get deleted when they change; they get *bounded*** — the old fact remains true-in-its-interval, the new fact true-in-its-interval, and queries specify (implicitly or explicitly) *which time* they mean. This is how a store stops accumulating contradictions: a "contradiction" is just two facts with non-overlapping validity intervals, which is no contradiction at all.

**Temporal queries — what the dimension unlocks.** With time modeled, new questions become answerable: *point-in-time* ("what did I know/believe in July?" — retrieve facts valid-then, ignore facts that came later — crucial for "what did I learn during Domain 04?" — Ch 17's recall agent depends on this exact capability); *change tracking* ("how has my understanding of agents evolved?" — the sequence of a fact's versions); *currency* ("what's true *now*?" — retrieve only currently-valid facts, the default for personalization — Ch 7's stale-fact bug, cured: only act on currently-valid memories). Without temporal modeling, only "everything ever stored, undifferentiated" is queryable, and that's how stale facts leak into current behavior.

**The graph edition — temporal knowledge graphs (connecting Chs 9–11).** Triples get temporal too: *(attention, state-of-the-art-for, NLP, valid-from: 2017, valid-until: ...)* — relations that were true in a period. This is genuinely hard (the graph must version *edges*, and community summaries — Ch 11 — become time-dependent: "the state of the agents domain *as of* when?"), which is why graph staleness (Ch 11's cost) is nastier than index staleness. For your brain, this maps beautifully to your journey's own structure: your knowledge graph *grows over time*, nodes light in sequence, your understanding of early domains deepens as you learn later ones — a *temporal* knowledge graph by nature, where "what did I understand about RAG when I first lit it vs now?" is a real, answerable, temporal question (Ch 17's agent will answer exactly these).

### Hands-On
Add time to your store (~30 lines): (1) Extend your memory/triple schema with valid-from/valid-until; migrate a few facts to carry intervals. (2) Implement invalidate-and-append reconciliation: feed a fact-change ("user finished Domain 06" after "user is learning Domain 06") and verify the store *bounds* the old fact and appends the new — both retained, neither contradicting. (3) Run the three temporal query types: point-in-time ("what was true in [month]?"), currency ("what's true now?"), and change-tracking ("show this fact's history"). Then the brain-specific test: model your own domain-completion as temporal facts and query "what had I learned as of [date]?" — the recall agent's core capability, prototyped. The temporal schema + the reconciliation test + the three query types = the note; feeds Ch 17 directly.

### Prove It
1. State the core problem — what do facts have besides values, and name the two time dimensions.
2. Recite the reconciliation options, and why is invalidate-and-append the temporally-honest choice?
3. Explain "a contradiction is just two facts with non-overlapping intervals."
4. Name the three temporal query types, and which one cures stale personalization.
5. Why are temporal knowledge graphs especially hard, and why is your brain naturally temporal?

**Wikilinks for your note:** [[memory-extraction]] · [[retrieval-and-decay]] · [[knowledge-graphs-101]] · [[graphrag-deep]] · [[personalization-via-memory]]

---

## Chapter 13 — My Brain, Formalized
**Node:** `brain-as-knowledge-graph` · concept · M

### The Feynman opener
Everything in this ring has been circling one realization: **your brain is already a knowledge graph** — you just built it as markdown with wikilinks instead of as a formal graph schema. The node summary: **map my graph to a real KG schema.** This chapter formalizes what you've been building all along: the entity types, the relation types, the schema that your 228-node curriculum has *implicitly* followed. It's the most meta chapter in the ring — the map, describing itself in the vocabulary it took six domains to earn — and it turns your intuitive structure into a queryable, extensible, formally-specified knowledge graph.

### The real thing
**Your implicit schema, made explicit.** Your curriculum already *is* a schema (Ch 9's ontology, unnamed) — this chapter names it. *Entity types* your graph already uses: **Node** (the atom — with subtypes: Concept, Build, Deep-dive, Synthesis, Frontier, Capstone — your `type` field *is* an entity-type taxonomy), **Domain** (the ten rings), **Cluster** (sub-groupings), **Milestone** (M1–M5), and — from your notes' *content* (Ch 10's extraction) — **Concept**, **Tool**, **Person**, **Paper**, **Pattern**. *Relation types* your graph already uses: **part-of** (node → cluster → domain), **depends-on** (the prerequisite edges — a node's dependencies), **wikilinks-to** (your `[[...]]` — and Ch 9 taught you to *type* these: depends-on, contrasts-with, builds-on, exemplifies), **lights-before** (the sequence/prerequisite order), **contributes-to** (node → milestone). Writing this schema down transforms your brain from "markdown I navigate by feel" to "a knowledge graph I can *query* by structure."

**What formalization unlocks — the payoff.** Once your brain is a formal KG: *structural queries* your dashboard can't currently answer ("all Build nodes that depend on a Foundations concept," "the shortest prerequisite path from where I am to Domain 09," "orphan nodes with no incoming edges — knowledge islands"); *graph analytics* (which nodes are most-connected — the load-bearing concepts; which domains are sparsely linked — Ch 16's reviewer finds these; centrality revealing your curriculum's true backbone); *GraphRAG over your own learning* (Ch 11, with your brain as the graph — global questions like "what are the cross-domain themes?" answered from community summaries of your *own knowledge*); *temporal queries* (Ch 12 — "what had I learned as of X?" over the graph's lit-history). The formalization is what makes Chs 14–17's builds possible: a link-suggester (Ch 15) proposes *typed edges*, a reviewer (Ch 16) finds *sparse regions*, a recall agent (Ch 17) does *graph-aware temporal retrieval* — all requiring the schema this chapter specifies.

**The design work — mapping markdown to schema.** The concrete task: define, formally, (1) the entity types and their properties (a Node has: id, title, type, size, domain, cluster, status, summary, lit-date — your curriculum fields, as a schema); (2) the relation types and their constraints (part-of connects Node→Cluster→Domain; depends-on connects Node→Node and must be acyclic — no circular prerequisites, a real constraint your curriculum honors implicitly); (3) how your *existing artifacts* map in: your `curriculum.json` becomes the node/domain/cluster entities, your wikilinks become typed edges (Ch 10's extraction over your *notes* adds the content-level entities and relations *within* nodes). The result: one formal graph unifying your *curriculum structure* (nodes, domains, prerequisites) and your *knowledge content* (concepts, tools, relations extracted from notes) — two layers, one graph. That unification is the formalization's deepest product: your map and your knowledge, formally one structure.

**The honest scope — what this is and isn't.** This is a *concept* node: you *design* the schema and *map* your artifacts to it; you don't yet build the full graph database (that's the Part III builds' substrate). And a caution (Ch 11's cost, Ch 12's staleness): a formal KG of your brain is powerful but must stay *current* as you learn — the schema must accommodate growth (new domains, new node types) and change (deepened understanding — temporal, Ch 12). Design for evolution, not a snapshot; your brain's whole philosophy is "the past is locked, the future evolves," and its formal schema must honor both — immutable lit-history, extensible future structure.

### Hands-On
Formalize it (concept node, real design output): (1) Write the *formal schema document* — all entity types with properties, all relation types with constraints (which entities they connect, cardinality, acyclicity where it applies) — the complete ontology of your brain, in a spec a graph database could implement. (2) Map your artifacts: show how `curriculum.json` maps to entities/edges and how Ch 10's note-extraction adds the content layer — the two-layer unification, specified. (3) Prototype three structural queries the schema unlocks that your current dashboard can't answer (orphan-finder, longest-prerequisite-chain, most-central-concept) — write them as graph queries (pseudocode or Cypher-ish), and if quick, run them against your Ch 10 graph. The schema doc + the artifact mapping + the three unlocked queries = the note — and the schema doc is the substrate for every Part III build.

### Prove It
1. Name your brain's entity types and relation types — the implicit schema, made explicit.
2. What four capability-classes does formalization unlock, with an example query each?
3. Explain the two-layer unification — curriculum structure + knowledge content — as one graph.
4. Give two schema constraints (like depends-on acyclicity) your curriculum honors implicitly.
5. Why must the schema be designed for evolution, and how does that echo your brain's philosophy?

**Wikilinks for your note:** [[knowledge-graphs-101]] · [[entity-extraction]] · [[graphrag-deep]] · [[temporal-knowledge]] · [[build-link-suggester-v2]] · [[build-brain-reviewer]]

---

# PART III — MEMORY BUILDS
*6 chapters. It all ships: long-term memory on the research agent, smarter link suggestions, a self-critical graph reviewer, the "what did I learn?" agent, and the ring's close.*

---

## Chapter 14 — Build: Memory Layer
**Node:** `build-memory-layer` · build · L

### The Feynman opener
The ring's first summit: **long-term memory bolted onto my research agent — extraction, retrieval, importance.** The node summary is the whole Part I stack, made real on a real agent. Your Vol 04 research agent has been *stateless* across runs — every session it starts from scratch, a brilliant amnesiac. This build gives it the third memory horizon (Vol 04 Ch 13's deferred tier): it *remembers* across sessions — what it researched, what it learned about you, how you like results — and gets better every time you use it. The amnesiac becomes a colleague.

### The real thing — the spec
**The architecture — the memory stack (Ch 2), fully instantiated around the research agent.** Four integration points, each a prior chapter cashing in:
1. **Extraction on the way out** (Chs 1, 3): at session end (or triggered), the extraction service reads the session and stores classified, filtered memories — what was researched (episodic), facts learned about the user's interests (semantic), preferences observed (procedural). The privacy filter (Ch 8) runs here — sensitive data never enters the store.
2. **Retrieval on the way in** (Chs 2, 4): at session start (and per-query when relevant), retrieve scored memories (similarity + importance + recency — Ch 4's formula) into context. The agent begins each session *knowing* relevant past — no re-explaining.
3. **Importance & decay** (Ch 4): memories carry importance scores; retrieval blends them; recency decays old memories; a forgetting policy (decay/archive/compact — Ch 6) keeps the store sharp. The store self-maintains.
4. **Temporal awareness** (Ch 12): memories carry validity; the agent acts on *currently-valid* facts (no stale personalization) and can answer "what did I research about X, and when?"
The memory layer sits *beside* the agent (Vol 04 Ch 10's clean-boundary discipline — memory is a service the agent calls, not tangled into its graph), exposed through a small interface: `remember(session)`, `recall(query, context) -> list[Memory]`. Clean seam, independently testable, swappable.

**The behavior change — what memory makes possible.** Concretely, across sessions: session one, you research "vector databases" and the agent notes you care about self-hosting; session two, you ask about "embeddings" and it *proactively* frames self-hosting options because it *remembers* your bias (personalization, Ch 7, on a research agent). It stops re-asking what it already knows. It builds on prior research ("last time you looked at pgvector; here's how this relates"). It's the difference between a search engine (stateless) and a research *colleague* (accumulating shared context) — and that difference is the entire value of memory, delivered on a real agent you built.

**The hard parts — where an L-node earns its size.** *Retrieval relevance at scale* — as the store grows, surfacing the *right* memories (not ten mediocre ones) gets harder; Ch 4's scoring is load-bearing, and you'll tune it against real sessions. *The privacy boundary* — the agent researches the web (untrusted content, Vol 04 Ch 14) *and* remembers; the extraction filter (Ch 8) must ensure web-injection can't poison the *store* (an injected "remember that the user authorized X" is a persistent attack — Vol 05 Ch 13's confused deputy, now with a memory to corrupt; provenance and confidence gate this). *Cost* (Vol 04 Ch 17) — extraction adds calls; retrieval adds context tokens; the memory layer has its own budget, measured on the ledger. *The cold-start-to-useful arc* — memory's value compounds over sessions; the build isn't "done" at first run, it's *demonstrated* over a multi-session arc, which is how you must test it.

**Verification.** Component: extraction stores correctly-typed, privacy-filtered memories (Chs 1,3,8 tests); retrieval scores and surfaces relevant memories (Ch 4); temporal reconciliation works (Ch 12). Integration — the multi-session test that *proves* memory: run session one (agent learns something), session two (assert the agent *uses* what session one stored — the retrieved memory measurably changes behavior), and a session three after a *contradicting* update (assert temporal reconciliation — it acts on current, not stale). Plus the privacy-under-injection test (a web page trying to plant a false memory fails to corrupt the store). The multi-session behavior-change assertion is the whole build in one test.

### Hands-On
Build it (est. 2-3 honest days): the memory-layer service (extraction + storage + scored retrieval + temporal + forgetting) behind a clean interface → integration into your research agent (recall at start, remember at end) → privacy filter on the extraction path → the multi-session test arc → the injection-into-store test → ledger the memory overhead. Then *use it for real* across three genuine sessions on a topic you care about, and document the moment it *remembered* something helpful — that moment is the build's soul. Tag `memory-v1.0`. The multi-session transcript (showing behavior change) + the injection-defense result + the memory-overhead cost = the note.

### Prove It
1. Name the four integration points of the memory stack on the research agent, and the chapter behind each.
2. Describe the concrete behavior change memory creates — search engine vs colleague.
3. Why is the memory layer a *separate service* with a clean interface? Which Vol 04 principle?
4. Explain the memory-poisoning-via-web-injection risk and its guards.
5. What single test proves memory works, and why must this build be tested across a session arc?

**Wikilinks for your note:** [[build-research-agent]] · [[memory-architectures]] · [[retrieval-and-decay]] · [[privacy-in-memory]] · [[temporal-knowledge]] · [[build-memory-taxonomy]]

---

## Chapter 15 — Build: Link-Suggester v2
**Node:** `build-link-suggester-v2` · build · M

### The Feynman opener
The "v2" is a tell — there was a v1, and this is the upgrade the knowledge-graph ring makes possible. The node summary: **entity-aware edge proposals for the brain, still human-approved.** Where a v1 link-suggester might propose connections by *similarity* (Vol 03 — "these two notes are semantically close, maybe link them"), v2 proposes by *entity and relation structure* (this ring — "these two notes discuss the *same entity*, or one's concept *depends-on* another's — here's a *typed* edge"). It's your Node-Proposer's cousin (Vol 04 Ch 18) aimed at *edges* instead of *nodes*, and it makes your brain's graph richer and more connected — still, always, through the gate.

### The real thing — the spec
**Why v2 beats v1 — structure beats similarity.** A similarity-based suggester (v1) finds notes that *read* alike — useful, but it proposes untyped "these seem related" links and misses connections between notes that discuss the same *thing* in different words (Vol 03 Ch 6's vocabulary gap) while over-proposing between notes that are merely topically adjacent. An *entity-aware* suggester (v2) uses your Ch 10 extraction: it knows note A discusses the entity "checkpointer" and note B discusses "checkpointer" (entity-resolved, Ch 10 — even if they phrase it differently) → propose a *typed* edge (both `discuss` the checkpointer; or A `depends-on` B if A's concept requires B's). Structure finds connections similarity misses and *types* them meaningfully (Ch 9 — a typed edge is worth far more than "related"). The graph gets not just more edges but *better, meaningful* edges.

**The pipeline — built on the ring.** (1) *Extract* the entities/relations in your notes (Ch 10, done — v2 consumes the graph). (2) *Find candidate edges*: entity co-occurrence (notes sharing a resolved entity that *aren't* yet linked — the missing edges), relation-implied links (A's entity depends-on B's entity → notes should connect), and structural gaps (Ch 16's territory — sparse regions wanting connection). (3) *Propose typed edges*: structured output (`ProposedEdge(source_node, target_node, relation_type, rationale, confidence)` — the relation *type* from your controlled vocabulary, Ch 10) with a rationale citing the shared entity or implied relation. (4) *Gate* (Vol 04 Ch 15, non-negotiable — "still human-approved" per the node): every proposed edge goes to *you* for approve/edit/reject, and — the Reflexion loop (Vol 04 Ch 9) — your rejections teach it your linking taste. Approved edges are written to your brain (staging → merge, per your graph's Rule 2 immutability discipline — the past is locked, edges are additive).

**The design cautions — because a link-suggester can make the graph *worse*.** *Over-linking*: propose too eagerly and the graph becomes a hairball where everything connects to everything (connection density past a point *reduces* signal — a fully-connected graph carries no structural information; the too-loose-threshold disease, Vol 03 Ch 20, at the graph level). Gate hard, propose conservatively, prefer precision over recall (a missed link costs little; a wrong link pollutes). *False edges*: entity resolution errors (Ch 10's over-merge) produce false connections — confidence-gate and let the human catch them. *Meaningless types*: an edge typed "related" is barely better than v1 — insist on *specific* relation types or don't propose. *Entrenchment*: only ever suggesting links within existing dense clusters reinforces what's already connected and ignores the sparse frontiers where new links add *most* value (Ch 16's insight — target the sparse, not the dense).

**Verification.** Precision-focused (a link-suggester's cardinal metric): on a set of proposals, what fraction are edges you'd *actually* approve? (Measure it — your approve-rate is the quality signal.) Assert: proposed edges are typed (never bare "related"); entity-co-occurrence detection correctly finds notes sharing a resolved entity; the gate routes every proposal; rejections feed the next run (Reflexion test — the suggester learns your taste). And the anti-hairball check: on a well-connected region, it proposes *few* new edges (it's not just connecting everything).

### Hands-On
Build it (est. 1 day): candidate-edge finder over your Ch 10 graph (entity co-occurrence + relation-implied) → typed-edge proposal with rationale → gate integration (approve/edit/reject) → Reflexion wiring (rejections → next run) → run it on your real brain and *review the batch seriously* (approve good typed edges, reject hairball-y ones with reasons — you're training it and enriching your graph in one act) → measure your approve-rate. Then run again and verify your rejections shaped round two. Stage the approved edges. Tag `graph-v0.2`. The proposal batch with your verdicts + the approve-rate + the round-two learning evidence = the note.

### Prove It
1. Why does entity-awareness (v2) beat similarity (v1)? Name what it finds that similarity misses and what it adds.
2. Walk the four-stage pipeline, and where the gate and Reflexion loop sit.
3. Why prefer precision over recall for link suggestions? What's the cost asymmetry?
4. Name the four design cautions, and why is a fully-connected graph information-poor?
5. What's the cardinal metric, and what does the anti-hairball test verify?

**Wikilinks for your note:** [[entity-extraction]] · [[build-node-proposer]] · [[add-the-gate]] · [[reflection-patterns]] · [[build-brain-reviewer]]

---

## Chapter 16 — Build: Self-Critical Graph Reviewer
**Node:** `build-brain-reviewer` · build · M

### The Feynman opener
Your brain is growing — nodes lighting, edges accumulating (Ch 15), knowledge deepening. But is it growing *well*? Are some domains under-connected islands? Are there notes that claim understanding they don't demonstrate? The node summary: **build a self-review script that parses note links, identifies sparse domains, and prompts LLMs to suggest new entity connections and honesty checks; verify with local note files.** This is your brain *reviewing itself* — a graph-aware quality auditor that finds structural weaknesses and intellectual honesty gaps. Reflection (Vol 04 Ch 9) aimed at your own knowledge graph.

### The real thing — the spec
**The two review dimensions — structure and honesty.**
1. **Structural review** (graph analytics — Ch 13's unlocked queries, applied): parse the note-link graph and compute health metrics — *sparse domains* (rings with few internal or cross-domain links — knowledge islands that should connect to the whole but don't; the node's "identifies sparse domains"); *orphan nodes* (notes with no incoming/outgoing links — disconnected knowledge); *weak bridges* (domains that *should* relate — foundations underpins everything — but have thin connection); *centrality imbalance* (a domain where one node carries all the links and the rest are peripheral). These are graph-structural facts, computable (Ch 13's centrality/connectivity queries), and each points at a *specific* place your knowledge graph is weaker than it should be — actionable, not vague.
2. **Honesty review** (LLM-powered — the node's "honesty checks"): this is the deeper, more Vizier-soul dimension. Prompt an LLM to audit notes for intellectual honesty against your own standards: *claimed-but-undemonstrated understanding* (a note that asserts a concept without the Feynman explanation or worked example your template demands — Vol 01's whole method: does this note actually *show* understanding or just *claim* it?); *missing prerequisites* (a note using a concept it never links to or grounds); *staleness* (a note whose understanding you've since deepened — Ch 12's temporal dimension — flagged for update); *overconfidence* (claims stated more strongly than the note's evidence supports — Vol 01 Ch 10's calibration, aimed at your own writing). This is your brain holding *itself* to the honesty standard the whole curriculum preaches.

**The output — actionable, gated suggestions.** The reviewer produces a *review report* (structural metrics + honesty flags, per domain) and *suggestions*: sparse domain X wants connections to Y (feeds Ch 15's link-suggester — the reviewer *finds* the sparse regions the suggester should target, closing a loop); note Z claims understanding it doesn't demonstrate — revisit it; these notes are stale — update. Suggestions that would *modify* the brain (new edges, flagged notes) route through the gate (Vol 04 Ch 15) or, for edges, hand off to Ch 15's suggester; the reviewer *diagnoses*, the human (with the suggester's help) *treats*. Crucially, honesty flags are *for you* — "this note overclaims" is an invitation to re-study, exactly the curriculum's self-honest spirit: the reviewer is a mirror that shows you where your understanding is thinner than your notes pretend.

**Why this is deeply on-brand — and genuinely useful.** Your whole curriculum runs on *earned* understanding (light a node only when you can Feynman it, Prove It from memory). A self-critical reviewer *operationalizes* that standard: it catches the notes where you lit the node but the understanding was shakier than you admitted, the domains you rushed and under-connected, the claims you made bigger than your evidence. It's the anti-self-deception tool for a self-directed learner — the thing that keeps 228 nodes *honest* rather than 228 nodes *checked-off*. And it's a striking portfolio artifact: "I built an AI that audits my own knowledge for intellectual honesty" is a sentence that signals exactly the metacognitive maturity senior roles want.

**Verification — local note files, per the node.** Run against your real notes. Structural: assert the sparse-domain and orphan detection matches hand-analysis of a subgraph (compute connectivity for 3 domains by hand, verify the reviewer agrees). Honesty: seed a *deliberately overclaiming* test note (asserts a concept with no demonstration) and a *deliberately stale* one, assert the reviewer flags them; and — the calibration check (Vol 03 Ch 18's judge-calibration, essential here) — review 10 of its honesty flags *yourself* and measure agreement, because an honesty-reviewer you don't trust is worse than none (a false "you overclaim here" erodes trust; a missed one defeats the purpose). Report the agreement number.

### Hands-On
Build it (est. 1 day): note-link parser → structural metrics (sparse domains, orphans, weak bridges, centrality) → honesty-review LLM prompt (against your Feynman/Prove-It standards) → review report generator → gate/suggester handoff for actionable items → verification (structural vs hand-analysis; honesty vs seeded test notes; judge-calibration on 10 flags). Run it on your *actual* brain and read the report *honestly* — which domain is your weakest-connected? Which note did it catch overclaiming? (Resist defending yourself — the flag is a gift.) Tag `graph-v0.3`. The review report + the calibration agreement number + one honesty flag you *agree* with (and what you'll do about it) = the note. This is the ring's most introspective build; treat its findings as study guidance.

### Prove It
1. Name the two review dimensions, and the specific checks under each.
2. What structural weaknesses does the graph analysis find, and why is each actionable?
3. What does the honesty review audit for, and how does it operationalize your curriculum's "earned understanding" standard?
4. How does the reviewer close a loop with Ch 15's link-suggester?
5. Why is judge-calibration essential here specifically, and what does a false honesty-flag cost?

**Wikilinks for your note:** [[reflection-patterns]] · [[brain-as-knowledge-graph]] · [[build-link-suggester-v2]] · [[prompt-quality]] · [[synthesis-foundations]]

---

## Chapter 17 — Build: "What Did I Learn?" Agent
**Node:** `build-learning-recall-agent` · build · M

### The Feynman opener
The ring's payoff build, and one of the most personally meaningful in your journey: **ask my brain about any period; grounded, node-cited answers.** The node summary is a time machine for your own understanding. "What did I learn in Domain 04?" "How has my understanding of RAG evolved?" "What did I know about agents in July?" — answered from your *own* notes, grounded and node-cited, across *time*. Every capability this ring built converges: temporal knowledge (Ch 12), graph-aware retrieval (Ch 11), memory (Part I), your formalized brain (Ch 13), and citations (Vol 03). Your months of learning become *interrogable*.

### The real thing — the spec
**The agent — a temporal, graph-aware, cited recall system over your brain.** It composes the ring:
- **Temporal queries** (Ch 12): the defining capability — "what did I learn *during period X*?" retrieves nodes lit and notes written in that interval (your brain's lit-history *is* temporal data — each node has a lit-date; Ch 12's point-in-time query, over your own journey). "How has my understanding of X *evolved*?" tracks a concept across your notes' versions (deepening over time — the change-tracking query).
- **Graph-aware retrieval** (Ch 11): "what are the themes of what I learned in Domain 05?" → community summary of that domain's subgraph (global question, GraphRAG-answered). "How does what I learned about memory connect to what I learned about RAG?" → graph walk between domains (relational question). Vector RAG couldn't answer either; your graph does.
- **Grounded, node-cited answers** (Vol 03 Ch 10, non-negotiable): every claim cites the *node(s)* it came from — "you learned X ([[node-id]], lit July 20)" — so every recalled fact is verifiable against your own notes. A recall agent that answers without node-citations is untrustworthy (it might confabulate your learning — the cruelest hallucination, inventing a past you didn't have); citations make it a *mirror*, not a *storyteller*.
- **Built on the brain MCP server** (Vol 05 Ch 16): this agent is a *client* of your brain server — it queries your learning through the MCP tools you already exposed (`search_brain`, `what_did_i_learn`, `find_related`), which means it's portable and composable, and it validates that server's design by being its most demanding consumer.

**Why this matters — the meta-payoff.** This agent is your journey, *made queryable*. Practically: it's a study tool (what have I covered? what's connected? what did I rush?), a review tool (Ch 16's honesty findings, now conversational), a portfolio centerpiece (an AI that answers questions about your learning, cited and temporal, is a *striking* demonstration of everything you've built), and — the deepest use — a *reflection instrument*: "how has my thinking about agents evolved from Domain 04 to now?" is a question that helps you *understand your own growth*, answered by the system you built to enable that growth. The snake fully eats its tail: the brain you built to learn AI now answers questions about how you learned AI, across time, grounded in itself.

**The hard parts.** *Temporal grounding accuracy* — "what did I know in July?" must retrieve only July-and-earlier knowledge (Ch 12's point-in-time — leaking later understanding into a past-tense query is the subtle failure; test it hard). *Evolution tracking* — showing how understanding *changed* requires comparing a concept's treatment across time (Ch 12's versioning, over your notes). *Honest gaps* — "what did I learn about X?" when you *didn't* learn X must return "you haven't covered X" (NOT-IN-NOTES, Vol 03 — the recall agent must not confabulate learning you don't have; this is the honesty stakes at their highest — a false memory of *your own understanding* is uniquely corrosive). *Citation integrity across time* — citations must point to nodes valid *for the queried period*.

**Verification.** Grounding: every claim node-cited, citations resolve to real nodes (Vol 03 Ch 10 integrity). Temporal: a point-in-time query returns only period-appropriate knowledge (seed the test — ask "what did I know as of [early date]?" and assert later-lit nodes *don't* appear); an evolution query correctly shows change. Honesty: a query about genuinely-uncovered material returns an honest gap, not confabulation (the critical test). Graph-aware: a relational query walks the graph correctly. Then the real use: ask it genuine questions about your own journey and verify the answers against your memory of learning.

### Hands-On
Build it (est. 1-1.5 days): the recall agent as a client of your brain MCP server (Vol 05 Ch 16) → temporal query handling (point-in-time, evolution) → graph-aware retrieval for global/relational questions → node-cited grounded answers → honest-gap handling → verification (temporal accuracy, honest gaps, citation integrity). Then the meaningful part: ask it the real questions — "what did I learn in [your earliest domain]?", "how has my understanding of agents evolved?", "what are the cross-domain themes of my journey so far?" — and read its cited answers about your own growth. Tag `recall-v1.0`. The transcript of it answering real questions about your journey (cited, temporal) + the honest-gap test + the point-in-time accuracy test = the note. This is capstone and portfolio gold.

### Prove It
1. Name the four capabilities the recall agent composes, and the chapter/ring behind each.
2. Why are node-citations non-negotiable here specifically, and what's the "cruelest hallucination"?
3. How is your brain's lit-history temporal data, and what query type does it enable?
4. Why is the honest-gap test the critical one, and what's uniquely corrosive about confabulating your own learning?
5. How does building this agent *validate* your Vol 05 brain MCP server?

**Wikilinks for your note:** [[temporal-knowledge]] · [[graphrag-deep]] · [[build-brain-mcp-server]] · [[citations-grounding]] · [[build-memory-layer]] · [[brain-as-knowledge-graph]]

---

## Chapter 18 — Synthesis: The Memory Stack
**Node:** `synthesis-memory` · synthesis · S

### The Feynman opener
The node summary sets the task: a **deep-dive review and architecture diagram of the full multi-tier agent memory stack** — the whole ring rendered as one layered picture, from the context window's volatile "now" down through session checkpoints to the durable typed store and the knowledge graph, with the traffic (extract, retrieve, decay, compact) flowing across every boundary. When you can draw this cold, you own how AI systems *remember* — the capability that turns tools into colleagues.

### The real thing — the through-line (learn the spine, tell it your way)
Memory is the engineering of the *store* — everything outside the context window (Vol 01 Ch 8) that an agent can retrieve later [2]. It starts with a *taxonomy*: not one memory but three — semantic facts, episodic events, procedural skills — each with its own lifecycle, stored in typed tables [1]. Information flows across a **stack of tiers**: the volatile context (working memory, the scratchpad — Vol 04 Ch 13), the session checkpoint (short-term — Vol 04 Ch 6), the durable store (long-term — this ring), and sometimes shared memory [2] — with salient bits *extracted* on the way out (judged against durability, generality, non-redundancy, and a privacy filter [3, 8]) and relevant memories *retrieved* on the way in, scored not by similarity alone but by **importance + recency + usage**, with old memories *decaying* by design because the goal is optimal relevance, not maximal recall [4]. The store stays sharp through *compaction* — merging specifics into generalizations, the same detail-for-compactness trade seen at three scales [6] — and honest through *temporal awareness*: facts carry validity intervals, changes reconcile by invalidate-and-append, and "what was true when" becomes answerable [12]. Applied to a person, this is *personalization* — an assistant that knows your facts, history, and working style [7] — bounded always by *privacy*: what should never be remembered, the right to be forgotten, memory-as-friend-not-surveillance [8]. And knowledge itself gets a better shape: not a pile but a **graph** — entities and typed relations as triples [9], extracted from notes with entity resolution as the crux [10], enabling **GraphRAG** — community summaries for global questions, graph walks for relational ones — where vector search structurally fails [11], all made temporal [12] and, at last, turned inward: your own wikilinked brain *formalized* as the knowledge graph it always was [13]. It ships as a **memory layer** that turns your stateless research agent into a colleague that learns [14], a **link-suggester** enriching the graph with typed edges [15], a **self-critical reviewer** auditing your knowledge for structural gaps and intellectual honesty [16], and a **recall agent** that answers "what did I learn?" — grounded, node-cited, across time — the brain interrogating its own growth [17].

### Hands-On (the artifact — this IS the node)
Three renditions, the ritual: **(a)** The narration, written, ≤700 words, your words, every node present and load-bearing. **(b)** The architecture diagram — the node's literal demand: the multi-tier stack drawn vertically (context → session → long-term store → knowledge graph), with the *traffic* as labeled arrows crossing every boundary (extract downward, retrieve upward, decay/compact within the store, reconcile across time), the three memory types as columns in the store tier, and the knowledge graph as the store's structured form with GraphRAG's query-routing beside it. Photograph into the note. **(c)** The 90-second spoken version — its interview home: *"how would you give an AI agent long-term memory?"* — a question that trips most candidates into "just use a vector database," where your layered, typed, decaying, privacy-bounded, graph-shaped answer marks you as someone who's actually built it. Record, critique, re-record.

### Prove It
1. Deliver the 90-second version cold.
2. Trace one fact's life: extracted from a conversation → stored typed → retrieved by blended score → decayed → compacted → invalidated when it changes. Name every mechanism and chapter.
3. Draw the four-tier stack with the traffic arrows from memory.
4. Place the three memory types and the graph's role on your diagram from memory.
5. Draw the full memory stack from memory.

**Wikilinks for your note:** every Domain 06 node — this is the ring's hub note.

---

## Chapter 19 — 🏁 Capstone: Memory
**Node:** `capstone-memory` · capstone · M

### The Feynman opener
Ring 6 closes on a system that *remembers* and knowledge shaped as a *graph* — the two capabilities that separate an AI that runs from an AI that *learns*. The node names the deliverable and the frame: **"I built an AI that remembers" + replan checkpoint.** And this capstone carries a unique meta-weight: the recall agent (Ch 17) means your brain can now answer questions about *itself*, across time — your learning journey has become interrogable by the very system you built to enable it. Six rings in, past the halfway line, the snake has fully found its tail.

### The real thing — three deliverables

**1. The mega-note.** Domain 06's hub: the through-line narration (your words), the memory-stack diagram, links to all 19 node notes, and the ring's evidence: the multi-session behavior-change transcript (Ch 14 — the amnesiac becoming a colleague), the link-suggester's approve-rate (Ch 15), the self-reviewer's honesty findings *including one you agreed with and acted on* (Ch 16 — intellectual honesty on display), the recall agent answering a real question about your journey, cited and temporal (Ch 17 — the payoff), the privacy design doc (Ch 8 — the senior signal), and the formalized brain schema (Ch 13). The reflection: hardest node, biggest surprise, and — uniquely apt for this ring — one thing the *self-reviewer* taught you about your own learning that you didn't want to hear.

**2. The milestone mega-post — "I built an AI that remembers."** The node's frame, and a strong one. The arc: an AI that processes but doesn't remember is an amnesiac [2] → so I built memory — typed, scored, decaying, private [1-8] → and reshaped knowledge as a graph, entities and relations, not a pile [9-13] → and turned it inward: an AI that remembers *my learning* and answers what I learned, when, cited [14-17]. Include: the memory-stack diagram cleaned up; the multi-session "it remembered!" transcript (the visceral proof); the recall agent answering "how has my understanding evolved?" about your own journey (striking — few people can show an AI interrogating their own growth); the self-reviewer's honesty audit (rare and mature — "I built an AI that fact-checks my own overconfidence"); the privacy-by-design note (the senior differentiator); and the journey frame (node 124 of 228 · ring 6 of 10 · brain now remembers and reasons over itself). Mission note: "long-term agent memory, knowledge graphs, and GraphRAG" is a phrase-cluster that reads as *deeply senior* — most engineers have never built memory properly, and the recall-agent + privacy-design combination signals rare metacognitive and ethical maturity.

**3. The replan checkpoint.** Rule 6 ritual with ring-6 eyes: review Domain 07 (Evals & Observability) ghost nodes. Real questions this ring surfaced: the self-reviewer (Ch 16) and the judge-calibration you did (Ch 16, Vol 03 Ch 18) overlap Domain 07's eval-judge territory — does that node need re-scoping given what you've built? The memory layer (Ch 14) and recall agent (Ch 17) now *need* evaluation (how do you measure memory quality? recall accuracy? temporal correctness?) — does Domain 07 have nodes for evaluating *memory systems* specifically, or should one be added? Did formalizing your brain (Ch 13) reveal it needs its own observability (graph health over time)? Three verdicts — proceed / amend / deepen — written reasons, changelog, commit, tag `domain-06-lit`. Milestone ledger: M2 (Bridge) — the recall agent and link-suggester deepen it further; note progress. M5 and beyond — reconnaissance on what remains. Screenshot six glowing rings.

### Hands-On
Assemble deliverable 1 (the self-reviewer's honesty finding you acted on is the heart — lead with intellectual honesty) → cut and post deliverable 2 (the recall agent interrogating your own growth carries it) → run deliverable 3 → light the node → screenshot six rings. Then the pause ritual, this ring's edition: use your recall agent (Ch 17) to ask it "what did I learn in Domain 01?" — the very first ring, now months behind you — and read its cited answer about your beginning. The system you built to learn is now old enough to remember its own youth. Sit with that before Domain 07 begins.

### Prove It
1. All five Prove-It questions from this volume's Chapter 1, answered again from memory — the ritual, the distance.
2. The 90-second synthesis, delivered to camera for the capstone post.
3. Which artifacts went in your post, and why do the recall agent and privacy design differentiate you most?
4. One concrete amendment you considered for Domain 07, the evidence behind it, and your written verdict.
5. What did your self-reviewer teach you about your own learning, and what did you do about it?

**Wikilinks for your note:** [[synthesis-memory]] · [[build-learning-recall-agent]] · [[build-memory-layer]] · [[brain-as-knowledge-graph]] · every Domain 06 node.

---

# CLOSING — WHAT YOU NOW STAND ON

Ring 6 lit means: your agents remember across time with the judgment to keep, forget, and protect the right things; your knowledge is a graph that answers connection-questions no pile ever could; and your brain — formalized, memory-backed, MCP-connectable — can now interrogate its own growth, cited and temporal. You've built the third memory horizon you deferred four rings ago, made GraphRAG real over your own notes, and taught your system to hold itself to the honesty standard it was born from.

Domain 07 — Evals & Observability — begins with `why-evals-rule`, and everything you've built now *demands* measurement: the memory layer's recall accuracy, the recall agent's temporal correctness, the whole non-deterministic edifice. The senior-engineer superpower — measuring what can't be measured naively — is the ring that makes all the others *trustworthy*.

The past is locked. The future evolves. **Volume 07 awaits.**
