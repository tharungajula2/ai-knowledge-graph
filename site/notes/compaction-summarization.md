## ELI5
A store that only grows eventually collapses under its own weight — slow retrieval, noisy results, mounting cost (Ch 4's four costs of remembering everything). The node summary is the pressure valve: **keeping memory small and sharp.** Compaction is how memory stays useful over months and years: merging the specific into the general, the many into the essential, without losing what matters. It's Vol 03 Ch 15's summarization and Vol 02 Ch 17's chatbot trimming, grown into a first-class memory operation with its own hard tradeoffs.

## The Real Explanation
**The two operations — compaction vs summarization, distinguished.** *Summarization* compresses a *sequence* into a shorter form (a conversation → its gist; ten episodic events → a paragraph) — the same map-reduce/refine shapes from Vol 03 Ch 15, now applied to memory. *Compaction* is broader: consolidating *related memories* into fewer, more general ones — merging "user liked the burger place Tuesday," "ordered pizza Friday," "got tacos Saturday" into one semantic memory "user enjoys casual fast food," and *deleting the specifics*. Compaction changes memory *type* (episodic specifics → semantic generalization — Ch 1's taxonomy in motion) and *reduces count*, not just length. Both keep the store small; compaction also makes it *smarter* by surfacing patterns the specifics only implied.

**When and how — the compaction triggers.** *Threshold-based*: when memories about a subject exceed N, compact them (the store self-maintains). *Time-based*: periodically compact old episodic memories into semantic generalizations (last month's events → this month's understanding — mirrors how human memory consolidates episodic experience into semantic knowledge during, famously, sleep). *Redundancy-based*: when extraction (Ch 3) detects near-duplicates, compact on write. The mechanism is an LLM call (your gateway): "here are N related memories; produce the minimal set of memories that preserves their essential information" — structured output, the compacted memories replacing the originals (with provenance preserved — Ch 1's source tracking survives compaction, so you can still audit *what* got merged).

**The central tradeoff — and it's genuinely hard.** Compaction is *lossy by design* (Vol 03 Ch 15's warning, sharpened): you're deliberately destroying detail to preserve essence, and **the detail you compact away might be the detail a future query needed.** "User enjoys fast food" is useless when they later ask "what was that burger place I liked?" — the specific, compacted away, is gone. This is the memory engineer's genuine dilemma, and there's no free answer, only judgment: compact *too aggressively* and you lose retrievable specifics; compact *too little* and the store bloats (Ch 4's costs). The mitigations: *tiered compaction* (keep recent memories specific, compact only the old — recency-gated, Ch 4's decay logic applied to compaction), *archival-not-deletion* (compact into a general memory but *archive* the specifics to cold storage rather than deleting — recoverable if needed, Ch 4's archival tier), and *importance-gated* (never compact high-importance memories — a crucial specific stays specific forever). The design principle: **compact the trivial and old aggressively; preserve the important and recent faithfully** — the same optimal-relevance-not-maximal-recall philosophy, applied to consolidation.

**The connection to context management — the same skill, three scales.** Notice you've now met this operation at three scales, and seeing them as one deepens all three: *within a task* (scratchpad compaction, Vol 04 Ch 13 — distill observations), *within a session* (chat-history summarization, Vol 02 Ch 17 — compress old turns), *across sessions* (memory compaction, this chapter — consolidate the long-term store). Same fundamental move — trade detail for compactness to fit finite space — at working-memory, session-memory, and long-term-memory scales. The memory stack (Ch 2) has a compaction operation at every tier; mastering it once is mastering it everywhere.

## Why It Matters
Where this appears in real systems and jobs: keeping memory small and sharp.

## Hands-On
Build compaction, feel the tradeoff (~40 lines on your store): (1) Implement subject-based compaction: gather all memories about one subject, LLM-compact them into a minimal set, replace (preserving provenance). Run it on an over-populated subject and measure the count reduction. (2) Feel the loss: after compacting, run a query that needed one of the *specific* memories you compacted away — watch the store fail to answer it. That failure is the tradeoff, witnessed. Then implement importance-gating (never compact the high-importance specific) and re-test — the crucial detail survives. (3) Design the tiered policy: write the one-paragraph compaction policy for your store — what compacts when, what's protected, what archives vs deletes. The count reduction + the loss specimen + the tiered policy = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Distinguish summarization from compaction — what does each reduce, and how does compaction change memory *type*?
2. Name the three compaction triggers, and the human-memory analogy for time-based compaction.
3. State the central tradeoff precisely, and give the "burger place" example of its cost.
4. Recite the three mitigations, and the design principle that governs them.
5. Name the three scales at which you've met this operation, and the single move common to all.


---

## Wikilinks
[[retrieval-and-decay]]
[[long-context-strategies]]
[[scratchpads-working-memory]]
[[build-cli-chatbot]]
[[memory-extraction]]

## Status log
- Started: 2026-07-21
- Finished: null