---
id: memory-extraction
title: "Memory Extraction"
domain: memory-knowledge
ring: 6
cluster: "Agent Memory"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-memory-taxonomy", "hallucination", "compaction-summarization", "temporal-knowledge", "privacy-in-memory"]
tags: [memory-knowledge]
---

## ELI5
Ch 1 built a classifier; this chapter makes it *wise*. The node summary: **conversations → durable facts.** The hard part of memory isn't storing or retrieving — it's *deciding what's worth remembering in the first place*, and doing it without either hoarding trivia or missing what matters. A human friend remembers that you're job-hunting and forgets what you had for lunch; an extractor that can't make that distinction produces a store that's simultaneously bloated and useless.

## The Real Explanation
**The extraction judgment — the four questions every candidate memory must pass.** (1) *Is it durable?* — a fact true beyond this moment (your career goal) vs an ephemeral detail (today's weather); only durable things earn long-term storage. (2) *Is it general?* — useful beyond the immediate context vs a one-off (your name vs "the third item in that list"). (3) *Is it about a stable subject?* — the user, their projects, their preferences (worth tracking) vs a transient entity that won't recur. (4) *Is it non-redundant?* — not already stored (Ch 12's update problem: a "new" memory that contradicts or duplicates an existing one triggers *reconciliation*, not blind insertion — the junk drawer's cause of death). An extractor encoding these four questions in its prompt hoards far less than one told merely "extract important facts."

**When to extract — the timing decision.** Three strategies, each with a trade: *per-turn* (extract after every exchange — freshest memory, highest cost: an LLM call per turn on top of the conversation itself, doubling your bill — Vol 04 Ch 17 economics); *end-of-session* (extract once when a conversation closes — cheaper, but memory is stale mid-session and lost if the session never cleanly "ends"); *triggered* (extract when something notable happens — a decision made, a preference stated, a correction given — smartest, hardest to detect reliably). Most production systems use end-of-session or a hybrid (lightweight per-turn candidate-flagging, batched extraction at session end). The choice is a cost/freshness trade you now recognize on sight.

**The extraction prompt — craft that separates signal from junk.** Beyond the taxonomy (Ch 1), the prompt needs: *explicit worth-remembering criteria* (the four questions, stated), *the existing relevant memories as context* (so the model can reconcile rather than duplicate — "here's what I already know about the user; extract only what's new or changed" — this single addition slashes redundancy), *self-contained output* (every memory must resolve its own references — "the user prefers X" not "he prefers that"; a memory retrieved months later has no conversation around it, Ch 2's store-is-context-free property), and *confidence scoring* (uncertain extractions flagged — Ch 1's field — so low-confidence memories can be held tentatively or verified before trusting). And a hard rule that connects to Ch 8: the extractor is *reading conversations*, which may contain things that should *never* be stored (secrets, sensitive data) — extraction is the first line of privacy defense, filtering before storage, not after.

**The failure modes — the extractor's own zoo.** *Over-extraction* (the junk drawer — everything stored, retrieval drowns in trivia, precision collapses); *under-extraction* (real facts missed, the agent stays ignorant, recall collapses); *stale duplication* (the same fact re-stored every session because the extractor doesn't check existing memory — the redundancy that bloats stores); *reference danglers* (memories that don't resolve their own subjects — useless on retrieval); *false extraction* (hallucinated facts the user never stated — the model inferring "the user is frustrated" from neutral text; Vol 01 Ch 10's hallucination, now poisoning the *store* permanently, which is worse than a one-time bad answer because it *persists and compounds*). This last one is why confidence scoring and provenance (Ch 1) matter: a memory you can trace to its source snippet is a memory you can audit and correct.

## Why It Matters
Where this appears in real systems and jobs: conversations → durable facts.

## Hands-On
Upgrade your Ch 1 extractor into a wise one (~40 lines): (1) Add the four-question criteria and the existing-memories-as-context to the prompt; rerun on your real transcript and measure the redundancy drop (how many fewer duplicates?). (2) Implement end-of-session extraction on a multi-turn conversation, then compare against per-turn on the same conversation — cost and freshness, tabulated (Vol 04 Ch 17 habit). (3) Hunt the zoo: deliberately feed it a conversation containing a dangling reference, a should-never-store secret, and a neutral statement it might over-interpret — check whether it produces a dangler, stores the secret (it shouldn't — Ch 8 preview), or hallucinates an emotion. Document what it caught and missed. The redundancy delta + the timing table + the zoo specimens = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the four worth-remembering questions and what each filters out.
2. Compare the three extraction-timing strategies on cost and freshness.
3. Why include existing memories in the extraction prompt — what failure does it prevent?
4. Why must memories be self-contained, given Ch 2's store properties?
5. Name the five extraction failure modes, and why is false extraction the worst?


---

## Wikilinks
[[build-memory-taxonomy]]
[[hallucination]]
[[compaction-summarization]]
[[temporal-knowledge]]
[[privacy-in-memory]]

## Status log
- Started: 2026-07-21
- Finished: null
