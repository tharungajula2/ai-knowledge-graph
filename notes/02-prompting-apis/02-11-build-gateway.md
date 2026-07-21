---
id: build-gateway
title: "Build: Provider-Agnostic LLM Gateway"
domain: prompting-apis
ring: 2
cluster: "Engineering the Call"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["errors-retries-backoff", "rate-limits-caching", "structured-output", "python-classes-modules", "build-token-cost-calculator"]
tags: [prompting-apis]
---

## ELI5
A hospital doesn't depend on one power line — grid fails, generator engages, the surgery continues. Your AI product must treat model providers the same way: Gemini down at 2 a.m.? Route to Groq. Groq rate-limited? OpenRouter. Caller notices nothing. This build assembles *everything* from Chapters 1–10 into one piece of infrastructure — a mini-LiteLLM you build yourself, so tools like LiteLLM become conveniences you understand rather than magic you rent. This is the volume's engineering midterm.

## The Real Explanation
One function to rule them all: `gateway.complete(messages, schema=None, stream=False) -> Completion` — callers never know which provider answered.

**1. The provider abstraction.** A base class (Vol 01, Ch 16 — inheritance, earning its keep): `Provider` with `.complete(messages) -> Completion`; subclasses `GeminiProvider`, `GroqProvider`, `OpenRouterProvider`, each translating the *shared* message format (Ch 2's roles) into its provider's dialect and back. A Pydantic `Completion` (text, model_used, provider, input_tokens, output_tokens, latency_ms, cached: bool) is the gateway's universal currency (Ch 6 discipline). The deep lesson lives here: designing the *common interface* across dialects teaches you what's essential vs incidental in every provider's API. (Get free keys: Gemini you have; Groq's free tier is famously fast; OpenRouter fronts many models with one key.)

**2. The fallback chain.** Ordered list `[gemini, groq, openrouter]`. Per provider: attempt with Ch 9's full armor (retries, exponential backoff, jitter, the status-code table). Exhausted → log the fall, next provider. All exhausted → one clean `AllProvidersFailedError` carrying every attempt's history. Nuance that separates real from naive: *non-retryable errors skip straight to the next provider* (a 401 on Gemini won't heal — don't waste 15 seconds backing off; jump), while retryables get their full backoff *within* the provider first.

**3. Demand management.** Ch 10, encoded: per-provider `asyncio.Semaphore` (each has its own ceiling); an exact-match cache in front of everything (proper key: provider-set + messages + temperature + schema; `cached=True` completions cost 0ms and $0 — watch them appear in the report); *(stretch)* read rate-limit headers and pre-emptively skip a provider whose remaining quota is empty. Semantic caching: leave a marked TODO — it arrives with Domain 03's vectors; the gateway grows with your brain.

**4. The meter.** Every completion logs to a running ledger (JSON file is fine): timestamp, provider, model, tokens in/out, latency, cache-hit, estimated cost — priced by your `tokentools` (Vol 01 package, now production plumbing, exactly as promised). `gateway.report()` prints totals per provider, cache-hit rate, and money saved by caching. This ledger is the embryo of the observability you'll build properly in the production domain.

**5. Verification — simulated key failures, per the node's own summary.** Pytest suite with *fake* providers (subclass `Provider` with scripted behavior — your Ch 9 testing pattern, scaled up): primary throws 401 → next provider used, *no backoff wasted*; primary throws 429 twice then succeeds → same provider recovers, chain never advances; primary hard-down → full graceful fall to third; all down → `AllProvidersFailedError` with complete history; repeated request → cache hit, zero provider calls; ledger arithmetic correct across a scripted sequence. Then one *live* fire-drill: real keys, sabotage Gemini's env var (one wrong character), run 5 real prompts, watch the chain hold. The report from that run goes in your note — it's the trophy.

## Why It Matters
Where this appears in real systems and jobs: Build a LiteLLM-like gateway with fallbacks (Gemini -> Groq -> OpenRouter), retry logic, exponential backoff, semantic caching, and token/cost tracking; verify with simulated key failures.

## Hands-On
The spec is the hands-on. Suggested order: `Completion` + base class → Gemini subclass (port Ch 1) → fake-provider test harness *before* real Groq/OpenRouter (tests drive the design) → fallback chain → cache → semaphores → ledger → live fire-drill. Feature branch, tests green, merge, tag `gateway-v0.1` (Vol 01, Ch 19 ritual). Est. 1–2 honest days. Every later build in your entire brain calls *this* gateway instead of raw SDKs — you are building your own floor, again.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Sketch the class design and justify inheritance here vs the composition you used in Vol 01 Ch 16.
2. Why do non-retryable errors skip providers while retryables back off in place? Trace a 401 vs a 429.
3. What's in the cache key, and why is the schema part of it?
4. Your report shows Groq answered 30% of calls. List the possible reasons in likelihood order.
5. What did fake providers let you test that live keys never could, and why is that the Ch 21 testing philosophy in one example?


---

## Wikilinks
[[errors-retries-backoff]]
[[rate-limits-caching]]
[[structured-output]]
[[python-classes-modules]]
[[build-token-cost-calculator]]

## Status log
- Started: 2026-07-21
- Finished: null
