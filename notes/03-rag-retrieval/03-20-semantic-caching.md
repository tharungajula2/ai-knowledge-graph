---
id: semantic-caching
title: "Semantic Caching"
domain: rag-retrieval
ring: 3
cluster: "RAG on My Own Brain"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["rate-limits-caching", "embeddings-hands-on", "citations-grounding", "ingestion-pipelines", "build-gateway"]
tags: [rag-retrieval]
---

## ELI5
Volume 02, Chapter 10 left a rung of the caching ladder deliberately empty: exact-match caching answers *identical* questions for free, but "what's the refund policy?" and "how do refunds work?" — different strings, same question — miss it entirely. You lacked the tool then. You are now sixteen chapters deep into that tool. **Semantic caching = the caching ladder's top rung, built from this ring's machinery: cache lookups by embedding similarity.** The node summary: answering repeat questions for free. The gateway TODO you left in Vol 02 Ch 11 comes due today.

## The Real Explanation
**The mechanism — vector search pointed at yourself.** Store: past `(query, response)` pairs, query embedded. Lookup: embed the incoming query, nearest-neighbor against cached queries; similarity above threshold τ → serve the cached response, zero LLM calls, near-zero latency; below → miss, generate, cache the new pair. Recognize every part: an embedding model (Ch 2), a vector store (Ch 4 — the same pgvector can host a `semantic_cache` table), nearest-neighbor with a threshold. The only new idea is *what's being searched*: not documents — **your own past conversations**. (Ch 4's quiet superpower — "the machine is nearest-neighbor; text search is merely its most famous customer" — this is customer number two.)

**τ — the whole game, and it's precision/recall again.** Too low (loose): "refund policy?" matches "referral policy?" → **false hit** — a *wrong answer served confidently from cache*, the worst failure in caching (worse than any miss; the user got stale-wrong for free). Too high (tight): only near-identical strings match → the cache degenerates toward exact-match; all cost, no savings. This is Vol 01 Ch 12's tradeoff wearing cache clothes — false hits are precision failures, missed savings are recall failures — and the threshold is set the way this volume sets every dial: **empirically, on labeled pairs** (Ch 2 warned you never to trust folklore thresholds; here's the highest-stakes instance). Build a small paraphrase-pair set (true-duplicates and near-miss traps — "refund/referral", negations, entity swaps: "gateway retry logic" vs "gateway fallback logic"), sweep τ, pick the point where false-hit rate is acceptably near zero — *precision-first, always*, because a false hit is served silently while a miss merely costs a normal call.

**Invalidation — three clocks, not one.** Exact-match caching had TTL and prompt-version busts (Vol 02, Ch 10). Semantic caching over a *RAG* system adds the sharp one: **the corpus clock.** A cached answer about checkpointers is stale the moment the checkpointer note changes — even though the *query* space didn't move. The clean design: cached entries carry the source chunk-ids they were built from (your Ch 10 citations, cashing in *again* — structure enabling verification enabling invalidation); the Ch 15 sync pipeline, on updating chunks, purges cache entries citing them. Follow the dependency chain and admire it: citations → invalidation-by-provenance → a cache that heals itself on `/sync`. Systems built from honest parts compose like this; that's the meta-lesson.

**Where it lives, and where it doesn't.** Placement: in the gateway (Vol 02 Ch 11's architecture anticipated it — the marked TODO), checked *before* the whole RAG stack (a hit skips rewrite, retrieval, rerank, generation — the full ~4-call, multi-hundred-ms turn → ~10ms). What to cache: the final answer (and its citations, for rendering and invalidation). What *not* to cache — the judgment half: personalized or filter-dependent answers (same words + different active filters = different correct answers — the filter state must join the cache key or those queries must bypass), time-sensitive queries, and anything under a session where the *conversational rewrite* differs (cache on the *rewritten standalone* query, never the raw follow-up — "what about its memory?" must not collide across conversations about different "its"). That last rule is subtle, load-bearing, and exactly the kind of thing that separates a cache that works from a cache that lies.

## Why It Matters
Where this appears in real systems and jobs: answering repeat questions for free.

## Hands-On
Design document + threshold experiment (concept node — the full build lands when the gateway TODO is closed, and this doc will be its spec): (1) write the one-page design — schema for `semantic_cache` (query, query_embedding, answer, cited_chunk_ids, filters_fingerprint, created), lookup flow diagram showing placement before the RAG stack, the three invalidation clocks, the rewrite-first rule; (2) run the τ experiment for real (~30 lines with Ch 2's lab): author 15 paraphrase pairs — 8 true duplicates, 7 traps (near-miss vocabulary, one negation, one entity swap, one filter-dependent twin) — embed, score, and find *your* corpus's τ: the highest threshold catching ≥6 of 8 true pairs with zero trap hits. Report the number and the pair that nearly fooled it; (3) estimate the payoff with your ledger: at your Ch 17 per-turn cost and a guessed 20% repeat-rate, monthly savings in rupees — small today, and the *shape* of the argument is the production-domain skill. Doc + τ + estimate = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Describe the mechanism and name what's being vector-searched — why is this Ch 4's "customer number two"?
2. Map false hits and missed savings onto precision and recall, and defend precision-first with the silent-failure argument.
3. Recite the three invalidation clocks, and walk the citations→provenance→self-healing dependency chain.
4. Why cache on the rewritten query, never the raw follow-up? Construct the collision that rule prevents.
5. Name three query classes that must bypass or key-extend the cache, and why each.


---

## Wikilinks
[[rate-limits-caching]]
[[embeddings-hands-on]]
[[citations-grounding]]
[[ingestion-pipelines]]
[[build-gateway]]

## Status log
- Started: 2026-07-21
- Finished: null
