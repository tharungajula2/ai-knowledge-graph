---
id: build-hybrid-search
title: "Build: Hybrid Search & RRF"
domain: rag-retrieval
ring: 3
cluster: "Retrieval, Seriously"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["keyword-fulltext-search", "build-first-rag", "reranking", "prompt-quality"]
tags: [rag-retrieval]
---

## ELI5
Two scouts searched your library: one hears *meaning*, one sees *exact words*. Each returned a ranked list; each is blind where the other is sharp. The naive merge — compare their scores — fails immediately: cosine's 0.83 and BM25's 12.4 live on incommensurable scales; averaging them is adding rupees to kilometers. The elegant fix, and this build's namesake: **ignore scores entirely, fuse the *rankings*.** Reciprocal Rank Fusion — a formula small enough to memorize in ten seconds and strong enough to run inside serious production search engines.

## The Real Explanation
**RRF, whole and entire.** For each document, sum over every ranked list it appears in:
**RRF(d) = Σ 1/(rank_in_list + k)**, with k ≈ 60 by convention.
Rank 1 in one list contributes 1/61; rank 5 contributes 1/65; absent contributes 0. Sort by total; done. Why it works, three properties worth internalizing: (1) *scale-free* — only positions matter, so any two (or five) retrieval systems can fuse without score-normalization gymnastics; (2) *consensus-rewarding* — a document ranked #3 by both scouts typically beats one ranked #1 by a single scout and invisible to the other, which is exactly the behavior you want when each scout has blind spots; (3) *the k constant is a diplomacy dial* — it flattens the difference between adjacent ranks (1/61 vs 1/62 is tiny), preventing any single list's #1 from steamrolling the consensus; smaller k = trust top ranks harder, larger k = flatter, more democratic. Convention says 60; your build will test that convention instead of inheriting it.

**The build — the spec, per the node summary.** Upgrade your Ch 5 pipeline's `retrieve` into a three-path engine:
1. **Semantic path**: your existing cosine top-20 (deliberately deep — fusion wants long lists to find consensus in; you'll truncate *after* fusing).
2. **Keyword path**: BM25 top-20 over the same chunks (Ch 6's duel code, promoted to production; apply your stemming-vs-jargon decision here, deliberately, in a comment that explains it).
3. **Fusion**: `rrf_fuse(lists: list[list[ChunkId]], k: int = 60) -> list[Scored]` — pure function, no I/O, dead simple, *perfectly testable*.
Then `retrieve(query, mode="hybrid" | "semantic" | "keyword")` — keeping all three modes callable is the point: every future debugging session and Ch 8's benchmark will want to ask "which path found this / missed this?" A retrieval system you can't decompose is a retrieval system you can't debug.

**Verification — against test queries, as the node demands.** Your Ch 6 duel table is the seed: those 8 rigged queries, plus 4 new *mixed* queries (jargon + paraphrase in one question: "how does the checkpointer thing let agents survive crashes?" — queries where *neither* scout alone suffices and hybrid should shine). For each of the 12: run all three modes, record rank-of-the-correct-chunk under each. Success criteria, stated before running (golden-set discipline, Vol 02 Ch 16): hybrid's correct-chunk rank ≤ the better single mode on ≥10 of 12, and strictly better than *both* on the mixed queries. Then turn the diplomacy dial: rerun at k=10 and k=200, watch rankings shift, write two sentences on what k trades. Pytest the pure function hard: known toy lists → hand-computed RRF scores; consensus-beats-single-champion case; absent-document handling; k monotonicity.

**Two honest footnotes for the note.** Hybrid isn't free: two searches per query (though both are fast and parallelizable — `asyncio.gather`, Vol 01 Ch 17, if the paths ever grow network calls). And fusion quality is capped by candidate quality — RRF re-orders what the scouts brought; it cannot summon a chunk neither found. Fixing *that* requires better queries (Ch 13) or a second-pass judge (Ch 9) — the ladder continues.

## Why It Matters
Where this appears in real systems and jobs: Build a hybrid retrieval system merging semantic vector results (using cosine similarity/pgvector) with keyword full-text matches, re-ranked using Reciprocal Rank Fusion (RRF); verify against test search queries.

## Hands-On
The spec is the hands-on: BM25 path → pure `rrf_fuse` with tests-first (feel how pleasant testing a pure function is — Vol 01 Ch 21's philosophy vindicated) → three-mode retrieve → the 12-query verification table with success criteria written down beforehand → the k experiment → `--show-work` upgraded to display *both paths' ranks plus fused rank* per chunk (the inspection window grows with the system — permanent habit) → tag `rag-v0.2`. The 12×3 table and the k-sentences go in the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is score-averaging across retrievers broken, and what does RRF use instead?
2. Write the RRF formula from memory and walk one document's score through two lists.
3. Name the three properties, and explain the diplomacy dial's tradeoff with your k-experiment evidence.
4. What can fusion never do, and which two future chapters address that ceiling?
5. Why keep all three modes callable forever?


---

## Wikilinks
[[keyword-fulltext-search]]
[[build-first-rag]]
[[reranking]]
[[prompt-quality]]

## Status log
- Started: 2026-07-21
- Finished: null
