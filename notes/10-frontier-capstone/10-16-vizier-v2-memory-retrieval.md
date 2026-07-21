---
id: vizier-v2-memory-retrieval
title: "Build: v2 Memory & RAG"
domain: frontier-capstone
ring: 10
cluster: "VIZIER v2 — The Final Masterpiece"
type: build
size: L
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-memory-layer", "build-hybrid-search", "build-memory-taxonomy", "privacy-in-memory", "citations-grounding", "build-ingestion-pipeline", "agentic-rag-frontiers"]
tags: [frontier-capstone]
---

## ELI5
A core loop with no memory is a brilliant amnesiac: every conversation starts at zero, every fact must be re-fed. Today v2 gets its hippocampus and its library card: **long-term memory extraction** (conversations distilling into durable facts that shape future behavior — Vol 06) and **hybrid retrieval** (dense + keyword + fusion over your corpus — Vol 03 Ch 7) — integrated as first-class organs of the core you built last chapter, not bolted-on afterthoughts.

## The Real Explanation
**The memory layer.** The Vol 06 pipeline, productionized into v2: extraction (post-conversation, an LLM pass distills candidate memories, classified by your taxonomy — semantic/episodic/procedural, the Vol 06 Ch 1 build's schema, stored in Postgres), **write-path discipline** (memories about you are consequential writes — extraction proposals flow through the same review pattern as actions; Vol 06's privacy chapter gets a concrete enforcement point: the *never-remember* list is checked at write time, not read time), retrieval-and-decay (importance × recency scoring at recall — Vol 06 Ch 4), and injection into context via the scratchpad discipline (Vol 04 Ch 13's three-horizon map, now fully inhabited: in-context working memory, checkpointed thread state, and this — the durable store).

**The retrieval layer.** Hybrid search per your Vol 03 build: dense embeddings + keyword/BM25, RRF fusion, over pgvector (the benchmark from Vol 03 Ch 8 already told you what the alternatives buy; your spec chose accordingly). Mounted into the core *as tools* (Chapter 6's inversion, implemented: the agent decides when to retrieve, with query rewriting allowed), with citations structural (Vol 03 Ch 10 — every retrieved claim carries provenance, which Chapter 18's faithfulness evals will compute against), and the ingestion pipeline idempotent by content-hash (Vol 03 Ch 15 — re-running ingestion is always safe).

**The integration test that matters.** Memory and retrieval are different organs answering different questions — *"what do I know about the user"* vs *"what does the corpus say"* — and the classic integration bug is blurring them (user preferences leaking into document answers, document text stored as "memories"). Your spec's interface contracts keep them distinct; your tests prove it.

## Why It Matters
Where this appears in real systems and jobs: Integrate long-term memory extraction and hybrid vector retrieval (taught by build-memory-layer & build-hybrid-search).

## Hands-On
Build to acceptance (est. 3+ honest days): memory tables + extraction service + the never-remember enforcement test (plant a forbidden fact in a test conversation; assert it's absent from the store — this test is the privacy chapter, executable); decay-scored recall with a fixture clock (time-travel tests for recency); ingestion pipeline over your notes corpus + hybrid search + citations; mount both as tools in the core; then the two demos that go straight to the film: (1) the **memory demo** — tell v2 a preference in conversation A, watch it shape behavior in conversation B tomorrow; (2) the **grounding demo** — ask a brain question, get a node-cited answer, then `/sync` a new note mid-conversation and watch the answer update (the Vol 03 Ch 17 flex, now running on a system you wrote entirely). Run the Vol 03 golden set against v2's retrieval; numbers in the note next to the v1-era numbers. Tag `v2-memory-0.1`.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Draw the three-horizon memory map and place every v2 component on it.
2. Why do memory writes flow through review, and which two taught nodes merge in that decision?
3. Walk hybrid retrieval end to end: two searchers, the fusion, the citation, the eval that watches it.
4. The memory-vs-retrieval boundary: state it, name the classic bug, and the test that catches it.
5. Your golden-set numbers, v2 vs the Vol 03 build — and the honest explanation of any delta.


---

## Wikilinks
[[build-memory-layer]]
[[build-hybrid-search]]
[[build-memory-taxonomy]]
[[privacy-in-memory]]
[[citations-grounding]]
[[build-ingestion-pipeline]]
[[agentic-rag-frontiers]]

## Status log
- Started: 2026-07-21
- Finished: null
