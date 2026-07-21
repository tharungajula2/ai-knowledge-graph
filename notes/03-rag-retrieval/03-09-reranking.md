---
id: reranking
title: "Reranking"
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
wikilinks: ["build-hybrid-search", "attention-transformers", "classical-ml-fundamentals", "query-rewriting-hyde"]
tags: [rag-retrieval]
---

## ELI5
Hiring: you don't deep-interview all 500 applicants — you skim resumes to a shortlist of 20, *then* interview those carefully. Retrieval so far has been resume-skimming: fast, cheap, over the whole corpus, and only roughly right. **Reranking is the interview**: a second, slower, smarter model that takes the shortlist and re-orders it properly. The node summary calls it the second pass that fixes retrieval quality — and the reason it can fix what the first pass can't is an architectural distinction worth owning cold.

## The Real Explanation
**Bi-encoder vs cross-encoder — the distinction that explains everything.** Your retrieval embeddings are a **bi-encoder**: query and document embedded *separately* (documents at ingestion, query at question time — they never meet), compared only afterward by cosine. That separation is precisely what makes million-scale search possible (documents pre-computed once) — and precisely what caps quality: each side is compressed to a single vector *with no knowledge of the other*; nuance about *this query against this document* is unrepresentable. A **cross-encoder** feeds query and document *together* into one transformer — full attention between every query token and every document token (Vol 01 Ch 6, earning its keep again) — and outputs one relevance score. It can see that the document mentions your exact identifier, answers the question's specific angle rather than its general topic, or merely name-drops the subject in passing. Dramatically better judgments — at a cost that forbids first-pass use: it must run *per query-document pair*, so scoring a million documents means a million transformer passes. Hence the two-stage architecture the whole industry converged on: **bi-encoder (or hybrid, Ch 7) casts a wide cheap net over everything → cross-encoder deep-reads the top 20–50 → final top-k goes to the LLM.** Recall first, precision second — and notice those are exactly Vol 01 Ch 12's words: stage one is engineered for high recall (don't miss the answer), stage two for precision (rank it first).

**Where rerankers earn their latency.** They fix: *near-miss ordering* (right chunk retrieved at rank 7, and rank 7 doesn't fit your top-4 prompt — the reranker promotes it; recall from Ch 5's inspection that "retrieved but badly ranked" was a whole failure category); *topical-but-useless* results (mentions your subject, answers nothing — cross-attention detects the difference); *fusion ties* (RRF consensus produces close calls; the interview breaks them with actual reading). They cannot fix: **what the net never caught** — reranking is re-ordering, and Ch 7's ceiling theorem applies with full force: no interview saves a candidate who never applied. Widen the net (retrieve 50 to rerank, not 10), fix queries (Ch 13), or fix chunks (Ch 3) for that. Practical menu, axes not brands: local open cross-encoders via `sentence-transformers` (`CrossEncoder` class — free, private, milliseconds-per-pair on CPU for small models), hosted reranker APIs (stronger, per-call cost), and LLM-as-reranker (prompt your gateway: "score each passage's relevance 0–10" — flexible, slowest, priciest; fine for experiments, rarely first choice in production; and note it's Vol 02 Ch 16's LLM-as-judge wearing a retrieval hat, biases included).

**The knobs:** how many to rerank (20–50 is the sweet spot — deep enough to catch near-misses, shallow enough to stay fast; your Ch 8 latency instincts price this exactly: N cross-encoder passes added to p95), and whether to rerank at all — for keyword-exact queries where BM25's top-1 is definitionally correct, an interview adds latency and nothing else. Retrieval quality is a ladder you climb *as far as the query needs*: hybrid → +rerank → +query-rewriting (Ch 13) — each rung paid for by evidence (Ch 16), never by fashion.

## Why It Matters
Where this appears in real systems and jobs: the second pass that fixes retrieval quality.

## Hands-On
No new build node — a surgical experiment inside your existing pipeline (~20 lines): load a small `CrossEncoder` model, add `retrieve(..., rerank=True)` that fetches hybrid top-20 and re-orders via cross-encoder before truncating to 4. Rerun your 12-query table from Ch 7 as a fourth column: rank-of-correct-chunk under {semantic, keyword, hybrid, hybrid+rerank}. Find one query where reranking *promoted a rank-5+ chunk into the top-4* — read that chunk and its displaced rival side by side, and write two sentences on what the cross-encoder saw that cosine couldn't. Time the rerank overhead per query and record it next to the quality gain. Table column + the two sentences + the ms figure = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Bi-encoder vs cross-encoder: what does each see, and what does the separation buy and cost?
2. Why can't cross-encoders be the first pass? Show the arithmetic shape of the objection.
3. Map recall and precision onto the two stages, citing Vol 01 Ch 12.
4. Three failure types reranking fixes, one it structurally cannot, and the remedy ladder for that one.
5. When would you *disable* reranking, and what evidence standard governs the whole ladder?


---

## Wikilinks
[[build-hybrid-search]]
[[attention-transformers]]
[[classical-ml-fundamentals]]
[[query-rewriting-hyde]]

## Status log
- Started: 2026-07-21
- Finished: null
