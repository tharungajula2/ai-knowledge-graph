---
id: rate-limits-caching
title: "Rate Limits & Caching"
domain: prompting-apis
ring: 2
cluster: "Engineering the Call"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["errors-retries-backoff", "python-async", "context-windows", "build-gateway", "embeddings-intuition"]
tags: [prompting-apis]
---

## ELI5
A free buffet still limits your plates — otherwise one visitor empties the kitchen. Every LLM provider meters you the same way: so many requests per minute, so many tokens per minute. Hit the ceiling → **429** → Chapter 9's backoff kicks in. This chapter is the other half of survival: understanding the meter, and the art of **not making the call at all** — caching, the cheapest and fastest API call in existence.

## The Real Explanation
**The meter's dials.** Providers enforce several simultaneously: **RPM** (requests/minute), **TPM** (tokens/minute — input + output; the one that actually binds for long-context work), often RPD (requests/day) on free tiers, and concurrency caps. Free tiers throttle hard not from stinginess but arithmetic: inference burns real GPU-seconds, and free tiers exist to let you *learn* (exactly what you're doing) — the moment you batch-process anything serious, TPM is the wall you meet. Know thy tier: limits live in the provider console, and responses carry rate-limit headers (remaining quota, reset time) — production code *reads* them and self-throttles instead of blindly bouncing off 429s. Client-side, the tool you already own: Vol 01 Ch 17's `asyncio.Semaphore` — cap your own concurrency below the provider's ceiling, fire in controlled waves. Proactive beats reactive: Semaphore first, backoff as the safety net.

**Caching layer 1 — exact-match, yours.** Same input → same call → same bill, forever repeated, is pure waste. A dict in memory, or Redis later, keyed on `hash(model + system_prompt + messages + temperature)` — note what's in the key: *everything that changes the answer* (a cache ignoring temperature serves creative answers to extraction requests). Two honest caveats: at temperature > 0 a cache *changes behavior* (users get identical answers where they'd have gotten variety — often fine, sometimes not; decide per feature), and every cache needs an *invalidation story* (TTL, or explicit bust when the system prompt ships a new version — Ch 3 made prompts versioned artifacts precisely so this is possible).

**Caching layer 2 — prompt caching, the provider's.** The one Vol 01 Ch 8 promised: providers can cache the *processed internal state* of a prompt's stable prefix (your long system prompt, your few-shot examples, that 50-page document) so re-sends skip re-processing — typically ~90% off the cached portion and faster TTFT. The engineering it rewards: **structure prompts stable-prefix-first** — system prompt and examples at the top, volatile per-user content last, because caching works on *prefixes*; one volatile line at the top breaks the whole cache. This single layout habit routinely cuts real bills by half.

**Caching layer 3 — semantic caching, the preview.** "What's your refund policy?" and "how do refunds work?" are different strings, identical questions. Embedding similarity (Vol 01, Ch 5) can match them and serve the cached answer. It's a Domain 03 topic (`semantic-caching` node) once vectors are in your hands — today, know the ladder: exact-match → prefix → semantic.

**The unified mental model.** Rate limits and caching are one subject: *demand management*. Semaphores shape when calls happen; backoff survives the ceiling; caches delete calls entirely. Chapter 11 assembles all of it — plus fallbacks — into one gateway, which is why these two chapters immediately precede it.

## Why It Matters
Where this appears in real systems and jobs: why free tiers throttle; how caching saves you.

## Hands-On
Three experiments. (1) *Meet the wall*: fire 30 rapid free-tier calls via a bare `asyncio.gather`, collect the 429s; re-run under `Semaphore(2)` — record failures and total time for both runs. (2) *Exact cache*: wrap your Chapter 9 resilient caller with a dict cache (proper key!); run 20 queries where 8 are repeats; print hits, misses, calls saved, and estimated money saved using your `tokentools` prices. (3) *Prefix audit*: take your Chapter 6 extractor's prompt and reorder it stable-first; write two sentences in your note on what became cacheable. Numbers from all three → the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the meter's dials, and which one binds for long-context batch work — why?
2. Proactive vs reactive throttling: which tool is each, and why do you want both?
3. What belongs in an exact-match cache key, and what breaks if temperature is omitted?
4. Explain prompt caching's prefix rule and the layout habit it rewards.
5. Recite the caching ladder and where each rung gets built in your curriculum.


---

## Wikilinks
[[errors-retries-backoff]]
[[python-async]]
[[context-windows]]
[[build-gateway]]
[[embeddings-intuition]]

## Status log
- Started: 2026-07-21
- Finished: null
