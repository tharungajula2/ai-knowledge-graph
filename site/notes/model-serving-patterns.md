## ELI5
A model that works in your notebook is worthless until it *serves* — until something can send it inputs and get outputs, at the latency, cost, and scale the use demands. The node summary: **batch inference vs real-time REST endpoints vs token streaming; latency, cost, and resource tradeoffs.** How you serve a model is an engineering decision with real consequences, and the right pattern depends entirely on the use case. This chapter is the serving-patterns landscape — the bridge from "the model works" to "the model is a product."

## The Real Explanation
**The three serving patterns — matched to their use cases.**
1. **Batch inference**: process a large set of inputs *offline*, all at once, results stored for later use. No latency pressure (nobody's waiting in real-time), so you optimize purely for *throughput and cost* — big batches, cheap compute, run overnight. Use cases: scoring a database of records, generating embeddings for a corpus (Vol 03 Ch 15's ingestion!), nightly report generation, your eval runs (Chs 2-9 — evals are batch inference over a golden set). The Ch 10 build's batch inference was this. Cheapest per-item, highest latency-to-result — perfect when nobody's waiting.
2. **Real-time REST endpoints**: a request/response API (Vol 02 Ch 18's FastAPI) — send one input, get one output, *now*, synchronously. Latency matters (a user or system waits), so you optimize for *low per-request latency* — smaller batches or single-item, warm models, autoscaling. Use cases: interactive apps, an agent's tool call, anything user-facing. Higher cost per item (less batching efficiency), low latency. The workhorse of interactive AI.
3. **Token streaming**: for generative models specifically (Vol 02 Ch 8 — you built this) — stream tokens as generated rather than waiting for the full response. Doesn't reduce total latency but collapses *perceived* latency to time-to-first-token (Vol 02 Ch 8's exact lesson). Use cases: any user-facing generation (chat, long answers). It's a serving *mode* layered on real-time endpoints, not a separate pattern — but a crucial one for UX.

**The tradeoff axes — the decision framework.** Every serving choice trades among: *latency* (how fast a result comes — batch: slow; real-time: fast; streaming: fast-perceived), *cost* (batch: cheapest via batching efficiency and cheap off-peak compute; real-time: pricier per item; the GPU-utilization question — batch keeps GPUs busy, real-time has idle-then-spike patterns), *throughput* (batch: highest; real-time: limited by concurrency), and *resource/scaling* (real-time needs autoscaling for traffic spikes — Vol 02 Ch 10's rate limits, from the serving side now; batch runs on scheduled fixed resources). The engineer's job: match the pattern to the use case's actual requirements — using a real-time endpoint for a nightly batch job wastes money (paying for low-latency you don't need); using batch for a user-facing feature fails the UX (users won't wait for the overnight run).

**LLM-specific serving realities (bridging to your world).** For LLMs, serving is often *someone else's problem* (you call an API — Vol 02 Ch 1 — the provider serves the model; your gateway, Vol 02 Ch 11, is your serving-side abstraction over their endpoints). But the patterns still shape *your* architecture: *batch* your embedding generation and eval runs (cheap, no rush — Vol 03 Ch 15); use *real-time* for user requests; *stream* user-facing generation. And when you self-host (open-weights, Vol 01 Ch 11), *you* become the server, and these patterns plus serving frameworks (vLLM and kin — the throughput-optimized LLM servers) are your concern directly — batching strategies, KV-cache management, GPU utilization become *your* tradeoffs. Knowing the patterns means you can architect serving whether you're calling an API or running the metal.

## Why It Matters
Where this appears in real systems and jobs: Batch inference vs real-time REST endpoints vs token streaming; latency, cost, and resource tradeoffs.

## Hands-On
Map serving to your systems (concept node, concrete): (1) Classify every inference in your six rings of builds by serving pattern: your embedding generation (batch), your agent's LLM calls (real-time), your brain-chat's responses (real-time + streaming), your eval runs (batch) — and for each, note the latency/cost/throughput requirement that dictates the pattern. (2) The mismatch hunt: find one place you *could* optimize by changing serving pattern (are you making real-time calls for something that could be batched? e.g., pre-computing embeddings vs on-demand). (3) The self-hosting thought experiment: if you had to self-serve your brain-chat's LLM (open-weights), sketch the serving architecture — batch vs real-time, streaming, the resource tradeoffs. The serving-pattern map + the optimization opportunity + the self-hosting sketch = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the three serving patterns and the use case + optimization target of each.
2. Why is token streaming a mode rather than a separate pattern, and what does it optimize?
3. Recite the four tradeoff axes, and give a mismatch example (wrong pattern for the use).
4. For LLM API users, how do serving patterns still shape architecture?
5. What becomes your concern when you self-host, and what tooling addresses it?


---

# PART III — SEEING INSIDE
*5 chapters. Observability: tracing what your agents actually do, reading traces to debug, scoring production traffic, A/B-testing prompts, and dashboarding the money and the milliseconds.*

---

## Wikilinks
[[streaming-responses]]
[[build-gateway]]
[[rate-limits-caching]]
[[ingestion-pipelines]]
[[model-landscape]]

## Status log
- Started: 2026-07-21
- Finished: null