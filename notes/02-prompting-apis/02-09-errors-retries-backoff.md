---
id: errors-retries-backoff
title: "Errors, Retries, Backoff"
domain: prompting-apis
ring: 2
cluster: "Engineering the Call"
type: build
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["python-craft-professional", "rate-limits-caching", "build-gateway", "terminal-fluency"]
tags: [prompting-apis]
---

## ELI5
Your script worked beautifully for a week — then one Tuesday it died at 3 a.m. on a single failed network call, and the whole overnight batch was lost. The gap between demo code and production code is exactly this chapter: **assuming every API call can fail, and engineering the survival.** Networks flicker, providers overload, quotas exhaust — none of it is exceptional; all of it is Tuesday.

## The Real Explanation
**Read the status code — it tells you what to do.** The decision table to internalize:
- **400** bad request (malformed input) / **404** wrong model name → *your bug*: retrying is insanity; fix the code.
- **401 / 403** bad or unauthorized key → *config problem*: retrying is useless; check env vars, rotate keys.
- **429** rate limited → *slow down*: retry **with backoff** (Chapter 10 explains the throttle itself).
- **500 / 503** provider-side error or overload → *not your fault, usually brief*: retry with backoff.
- **Timeouts / connection errors** (no status at all) → network gremlins: retry with backoff — and always *set* a timeout; the default "wait forever" is how scripts hang for 6 hours.
The law of the table: **retry only what can transiently succeed.** Retrying a 400 hammers a wall; failing fast on a 503 wastes a working system.

**Exponential backoff + jitter — the civilized retry.** Naive retry (instantly, in a tight loop) turns you into your own DDoS — and when a provider is overloaded, a thundering herd of synchronized retries *keeps* it overloaded. The fix: wait 1s, then 2s, 4s, 8s (exponential — gives real outages room to heal), capped (e.g., 30s max), with **jitter** — a random fraction added so a thousand clients don't all retry in the same instant (`sleep = min(cap, base * 2**attempt) * random.uniform(0.5, 1.5)`). Cap the attempts (3–5), then *fail loudly* — raise, log, alert; never swallow.

```python
def call_with_retries(fn, max_attempts=4, base=1.0, cap=30.0):
    for attempt in range(max_attempts):
        try:
            return fn()
        except RETRYABLE as e:                       # 429/5xx/timeout — the table, encoded
            if attempt == max_attempts - 1:
                raise                                # loud failure, never silent
            delay = min(cap, base * 2 ** attempt) * random.uniform(0.5, 1.5)
            log.warning(f"attempt {attempt+1} failed ({e}); sleeping {delay:.1f}s")
            time.sleep(delay)
        # NON-retryable exceptions fall through and raise immediately — by design
```
This wrapper — table + backoff + jitter + cap + loud failure — is the chapter. (Libraries like `tenacity` provide it as decorators; write it by hand once so the library is a convenience, not a mystery.)

**Two production garnishes.** *Log every attempt* with status, attempt number, and delay — future-you debugging at 3 a.m. will weep with gratitude (structured logging matures in the production domain; the habit starts now). *Idempotency awareness*: retrying a *read* is free; retrying a *write* ("send the email") can double it — a deep topic for the agents/production domains, but the reflex "is this safe to retry twice?" installs today.

## Why It Matters
Where this appears in real systems and jobs: API calls that survive failure.

## Hands-On
Build `resilient.py`: the wrapper above around a fake `flaky_call()` that you script to fail on demand — raise a 429-style error twice then succeed; raise a 400-style error; raise timeouts forever. Tests (Vol 01, Ch 21 — this is a *perfect* pytest target): asserts that a twice-flaky call succeeds on attempt 3; that a 400 raises immediately with zero retries; that attempts cap and the final error propagates; that measured delays actually grow exponentially (record timestamps). Then wire the wrapper around your real Gemini call from Chapter 1 and — the satisfying part — set `max_output_tokens` aside, drop your timeout to something absurd like 0.001s, and watch your armor catch it, back off, and report properly. Green tests = lit.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Reproduce the status-code decision table from memory, with the action for each row.
2. State the law of the table and give one absurdity from each side of violating it.
3. Why exponential? Why jitter? Why a cap? One sentence each.
4. Why must the final failure be loud, and what belongs in each retry's log line?
5. What question must you ask before retrying any *write* operation?


---

## Wikilinks
[[python-craft-professional]]
[[rate-limits-caching]]
[[build-gateway]]
[[terminal-fluency]]

## Status log
- Started: 2026-07-21
- Finished: null
