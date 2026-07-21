## ELI5
The fastest, cheapest LLM call is the one you don't make. The node summary names the layers: **response cache, semantic cache, CDN.** Caching — storing results so you can reuse them instead of recomputing — is one of the highest-leverage optimizations in production AI, because LLM calls are slow (Vol 02 Ch 8) and expensive (Vol 04 Ch 17), and much of what users ask *overlaps*. You've met caching pieces (Vol 02 Ch 10's prompt caching, Vol 03 Ch 20's embedding cache); this chapter unifies the layers into a coherent strategy.

## The Real Explanation
**The caching layers, from exact to semantic to static.**
1. *Response cache (exact-match)*: store the full response for an exact input (same prompt → cached response, no LLM call). Trivial to build (a key-value store keyed by the input hash — Vol 03 Ch 15's content-hashing), enormously effective when inputs *repeat exactly* (common questions, retried requests). Limit: only catches *identical* inputs — "what's the capital of France?" and "what is France's capital?" miss each other (different strings, same meaning).
2. *Semantic cache*: store responses keyed by *meaning* (embedding — Vol 03 Ch 5), so *similar* queries hit the cache — "what's France's capital?" retrieves the cached "what is the capital of France?" answer (embed the query, nearest-neighbor against cached query-embeddings, and if close enough, return the cached response). This catches the paraphrases exact-match misses (Vol 03 Ch 6's vocabulary gap, solved for caching), dramatically raising hit rates for natural-language inputs. The tradeoff (Vol 03 Ch 20's threshold dilemma, returning): too loose a similarity threshold returns a cached answer to a *different* question (a correctness bug — the semantic cache's characteristic danger); too tight and it misses. Tune and *measure* (Vol 07).
3. *CDN (Content Delivery Network)*: for *static* content (Ch 25's static sites, assets, cached API responses) — servers distributed globally that serve content from the *edge* (near the user), cutting latency and offloading your backend. Not LLM-specific, but essential for the static parts of your product (the dashboard's assets, Ch 11).

**Where each layer lives (the cache hierarchy).** A request flows through the layers: CDN (static content served from the edge, never touches your backend) → response cache (exact-match hit → return instantly, no LLM) → semantic cache (meaning-match hit → return cached, no LLM) → and only on a *full miss* does the expensive LLM call happen (and its result populates the caches for next time). Each layer catches what the cheaper layer above missed, and only the residue reaches the model — a funnel that dramatically cuts cost and latency (Vol 04 Ch 17's levers, systematized; Ch 24's cost engineering depends on this).

**The invalidation problem (the hard part of all caching).** "There are only two hard things in computer science: cache invalidation and naming things." Cached data goes *stale* — the cached answer was right when computed, but the underlying data changed (Vol 06 Ch 12's temporal problem, for caches). Strategies: *TTL* (time-to-live — cache expires after N minutes; simple, but serves stale data within the window); *event-based invalidation* (invalidate when the underlying data changes — precise, harder to wire); *versioned keys* (Vol 03 Ch 20 — include a data-version in the cache key, so a data change naturally misses the old cache). The judgment: cache aggressively what's *stable* (Vol 03's embeddings, static content), cautiously what *changes* (personalized or time-sensitive responses — a stale personalized answer, Vol 06 Ch 7, is worse than a slow fresh one), and *never* cache what must always be fresh (a real-time balance, a just-changed fact). And a security note (Vol 08): never let one user's cached response leak to another (cache keys must scope to the user where responses are personal — a cross-user cache leak is a privacy breach).

## Why It Matters
Where this appears in real systems and jobs: response cache, semantic cache, CDN.

## Hands-On
Design and build your cache stack (concept node, concrete): (1) Add an exact-match response cache to your brain-chat or agent (hash the input, store/retrieve the response) — measure the hit rate and the cost/latency saved on repeated queries. (2) Add a semantic cache (embed the query, nearest-neighbor against cached queries, threshold-gated) — measure the *additional* hits it catches over exact-match, and *find the danger*: tune the threshold too loose and catch it returning a cached answer to a genuinely-different question (the semantic-cache correctness bug, witnessed). (3) Design the full hierarchy and invalidation policy for your system: what's cached at each layer, TTL vs event-based, what's never cached, and the user-scoping (Vol 08). The hit-rate measurements + the semantic-cache danger demo + the invalidation policy = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Distinguish exact-match, semantic, and CDN caching — what does each catch, and what does each miss?
2. Walk the cache hierarchy as a funnel — what reaches the LLM, and why is that the cost win?
3. What is the semantic cache's characteristic danger, and how does the threshold cause it?
4. Recite the invalidation strategies, and the judgment for what to cache aggressively vs never.
5. What's the cross-user cache security risk, and how do you prevent it?


---

## Wikilinks
[[rate-limits-caching]]
[[embeddings-hands-on]]
[[cost-latency-budgets]]
[[caching-layer-depth]]
[[static-sites-cdns]]

## Status log
- Started: 2026-07-21
- Finished: null