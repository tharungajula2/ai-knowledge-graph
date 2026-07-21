---
id: build-memory-layer
title: "Build: Memory Layer"
domain: memory-knowledge
ring: 6
cluster: "Memory Builds"
type: build
size: L
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-research-agent", "memory-architectures", "retrieval-and-decay", "privacy-in-memory", "temporal-knowledge", "build-memory-taxonomy"]
tags: [memory-knowledge]
---

## ELI5
The ring's first summit: **long-term memory bolted onto my research agent — extraction, retrieval, importance.** The node summary is the whole Part I stack, made real on a real agent. Your Vol 04 research agent has been *stateless* across runs — every session it starts from scratch, a brilliant amnesiac. This build gives it the third memory horizon (Vol 04 Ch 13's deferred tier): it *remembers* across sessions — what it researched, what it learned about you, how you like results — and gets better every time you use it. The amnesiac becomes a colleague.

## The Real Explanation
**The architecture — the memory stack (Ch 2), fully instantiated around the research agent.** Four integration points, each a prior chapter cashing in:
1. **Extraction on the way out** (Chs 1, 3): at session end (or triggered), the extraction service reads the session and stores classified, filtered memories — what was researched (episodic), facts learned about the user's interests (semantic), preferences observed (procedural). The privacy filter (Ch 8) runs here — sensitive data never enters the store.
2. **Retrieval on the way in** (Chs 2, 4): at session start (and per-query when relevant), retrieve scored memories (similarity + importance + recency — Ch 4's formula) into context. The agent begins each session *knowing* relevant past — no re-explaining.
3. **Importance & decay** (Ch 4): memories carry importance scores; retrieval blends them; recency decays old memories; a forgetting policy (decay/archive/compact — Ch 6) keeps the store sharp. The store self-maintains.
4. **Temporal awareness** (Ch 12): memories carry validity; the agent acts on *currently-valid* facts (no stale personalization) and can answer "what did I research about X, and when?"
The memory layer sits *beside* the agent (Vol 04 Ch 10's clean-boundary discipline — memory is a service the agent calls, not tangled into its graph), exposed through a small interface: `remember(session)`, `recall(query, context) -> list[Memory]`. Clean seam, independently testable, swappable.

**The behavior change — what memory makes possible.** Concretely, across sessions: session one, you research "vector databases" and the agent notes you care about self-hosting; session two, you ask about "embeddings" and it *proactively* frames self-hosting options because it *remembers* your bias (personalization, Ch 7, on a research agent). It stops re-asking what it already knows. It builds on prior research ("last time you looked at pgvector; here's how this relates"). It's the difference between a search engine (stateless) and a research *colleague* (accumulating shared context) — and that difference is the entire value of memory, delivered on a real agent you built.

**The hard parts — where an L-node earns its size.** *Retrieval relevance at scale* — as the store grows, surfacing the *right* memories (not ten mediocre ones) gets harder; Ch 4's scoring is load-bearing, and you'll tune it against real sessions. *The privacy boundary* — the agent researches the web (untrusted content, Vol 04 Ch 14) *and* remembers; the extraction filter (Ch 8) must ensure web-injection can't poison the *store* (an injected "remember that the user authorized X" is a persistent attack — Vol 05 Ch 13's confused deputy, now with a memory to corrupt; provenance and confidence gate this). *Cost* (Vol 04 Ch 17) — extraction adds calls; retrieval adds context tokens; the memory layer has its own budget, measured on the ledger. *The cold-start-to-useful arc* — memory's value compounds over sessions; the build isn't "done" at first run, it's *demonstrated* over a multi-session arc, which is how you must test it.

**Verification.** Component: extraction stores correctly-typed, privacy-filtered memories (Chs 1,3,8 tests); retrieval scores and surfaces relevant memories (Ch 4); temporal reconciliation works (Ch 12). Integration — the multi-session test that *proves* memory: run session one (agent learns something), session two (assert the agent *uses* what session one stored — the retrieved memory measurably changes behavior), and a session three after a *contradicting* update (assert temporal reconciliation — it acts on current, not stale). Plus the privacy-under-injection test (a web page trying to plant a false memory fails to corrupt the store). The multi-session behavior-change assertion is the whole build in one test.

## Why It Matters
Where this appears in real systems and jobs: long-term memory bolted onto my research agent — extraction, retrieval, importance.

## Hands-On
Build it (est. 2-3 honest days): the memory-layer service (extraction + storage + scored retrieval + temporal + forgetting) behind a clean interface → integration into your research agent (recall at start, remember at end) → privacy filter on the extraction path → the multi-session test arc → the injection-into-store test → ledger the memory overhead. Then *use it for real* across three genuine sessions on a topic you care about, and document the moment it *remembered* something helpful — that moment is the build's soul. Tag `memory-v1.0`. The multi-session transcript (showing behavior change) + the injection-defense result + the memory-overhead cost = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the four integration points of the memory stack on the research agent, and the chapter behind each.
2. Describe the concrete behavior change memory creates — search engine vs colleague.
3. Why is the memory layer a *separate service* with a clean interface? Which Vol 04 principle?
4. Explain the memory-poisoning-via-web-injection risk and its guards.
5. What single test proves memory works, and why must this build be tested across a session arc?


---

## Wikilinks
[[build-research-agent]]
[[memory-architectures]]
[[retrieval-and-decay]]
[[privacy-in-memory]]
[[temporal-knowledge]]
[[build-memory-taxonomy]]

## Status log
- Started: 2026-07-21
- Finished: null
