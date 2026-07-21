---
id: rag-failure-modes
title: "RAG Failure Modes"
domain: rag-retrieval
ring: 3
cluster: "Retrieval, Seriously"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-first-rag", "chunking", "context-windows", "reranking", "rag-evals-intro", "ingestion-pipelines"]
tags: [rag-retrieval]
---

## ELI5
Your RAG answered wrong. Where do you even look? A RAG system is a chain of six-plus stages, any of which can silently fail while every other stage works perfectly — and the final answer looks identical in all cases: fluent, confident, wrong. This chapter is the **diagnostic taxonomy**: every named failure, its symptom, its stage, its fix. You've already *met* half of these in your own inspection windows; today they get names, and debugging RAG stops being archaeology and becomes differential diagnosis.

## The Real Explanation
**Ingestion failures — poisoned at birth.** *Bad parsing*: PDFs mangling tables into token soup, headers merged into body text, code blocks shattered — garbage entered the index looking like content; no downstream stage can un-mangle it. Symptom: retrieved chunks that are visibly broken text. Fix: parse-stage QA — eyeball chunks at ingestion (Ch 3's thirty-second rule), format-aware parsers. *Stale index* (the node names it): the document changed; the index didn't. Symptom: answers correct *for last month* — uniquely insidious because nothing looks wrong; the citation checks out against the old chunk. Fix: re-indexing as a *process* — on-change triggers or scheduled sweeps, index versioning/timestamps in metadata so staleness is at least *visible* (Ch 15 implements exactly this; and note the disease is Vol 01 Ch 10's staleness, reborn one layer up — RAG cured weight-staleness and created index-staleness; every cure breeds its own disease at the new layer).

**Retrieval failures — the right page never arrived.** *Vocabulary miss*: query words ≠ corpus words; semantic search papers over some of this gap, but jargon-vs-layman phrasing still sinks queries (your Ch 5 session met this; Ch 13 is its dedicated medicine). *Bad chunks* (the node names it): the fact exists but was severed mid-thought or buried in a multi-topic chunk whose averaged embedding matches nothing well — Ch 3's tension, materialized. Symptom: retrieval returns the right *document's* wrong *pieces*. Fix: re-chunk (overlap, structure-aware, parent-child). *Ranked-out*: retrieved at rank 7, prompt takes top-4 — present, then discarded. Fix: Ch 9's reranker, or widen k. *Filter misfire* (preview): a metadata filter (Ch 12) excludes the very partition holding the answer. Symptom: great answers without the filter, NOT-IN-NOTES with it.

**Generation failures — right page, wrong reading.** *Lost-in-the-middle* (the node names it; Vol 01 Ch 8 predicted it): the answer sat in chunk 6 of 12 stuffed chunks — retrieval succeeded, *attention* failed. Symptom: the inspection window shows the fact plainly present in context, and the answer ignores it. Fixes: fewer/better chunks (rerank then truncate hard), order-by-relevance with best chunks first and last, and resist the "just stuff more" reflex — more context is not more attention. *Unfaithful generation*: the model answers from its weights *despite* the provided context, or blends context with confabulation — grounding instructions reduce this; only measurement (Ch 16) catches it reliably; your Ch 10 citation-validation already catches its crudest form. *Refusal miscalibration*: over-refusal (context was sufficient; model said NOT-IN-NOTES anyway — usually a too-strict prompt) and under-refusal (context insufficient; model winged it — the worse sin, per Ch 10's enterprise argument).

**The diagnostic protocol — the chapter's takeaway, order matters:** (1) *Look at the chunks first* (Ch 5's habit — this single step splits the tree: fact present in retrieved context, or absent?). (2) Absent → walk upstream: is it in the *index* at all (search the raw store directly)? In the index but not retrieved → which path missed it, semantic or keyword (Ch 7's decomposable modes, cashing in)? Not in the index → ingestion/staleness. (3) Present → walk downstream: ranked where? Cited? Faithfully used? Each branch terminates in a named failure with a named fix. Debugging RAG is this tree, walked calmly. Write it once on paper and it's yours forever.

## Why It Matters
Where this appears in real systems and jobs: lost-in-the-middle, bad chunks, stale indexes.

## Hands-On
Build your failure bestiary — *induce* five failures deliberately in your own pipeline, one per family, and document each with {symptom transcript, diagnosis path you walked, fix applied or named}: (1) edit a source note and *don't* re-ingest → ask about the changed content → catch the stale answer citing the old chunk; (2) re-chunk one note at 100 tokens no overlap → find a severed-fact retrieval; (3) ask a question in deliberately layman phrasing about your most jargon-heavy note → vocabulary miss; (4) stuff k=12 unranked chunks with the answer planted mid-pack → hunt for lost-in-the-middle (it may take a few tries — its intermittency is itself the lesson); (5) soften your grounding prompt to a mere suggestion → catch one unfaithful blend. Five specimens, pinned and labeled, in the note. You will never fear a RAG bug again — you've bred them all in captivity.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Reproduce the taxonomy from memory: three stages, ~nine named failures.
2. Why is stale-index uniquely insidious, and what's the every-cure-breeds-its-disease observation?
3. Distinguish vocabulary-miss, bad-chunks, and ranked-out by their inspection-window signatures.
4. What is lost-in-the-middle's exact signature, and why is "stuff more context" the wrong reflex?
5. Walk the diagnostic protocol for: "answer is wrong, chunks look right." Then for: "NOT-IN-NOTES on a question you know is covered."


---

## Wikilinks
[[build-first-rag]]
[[chunking]]
[[context-windows]]
[[reranking]]
[[rag-evals-intro]]
[[ingestion-pipelines]]

## Status log
- Started: 2026-07-21
- Finished: null
