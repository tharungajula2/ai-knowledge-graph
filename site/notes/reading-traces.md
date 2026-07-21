## ELI5
Having traces (Ch 13) is useless if you can't *read* them — and reading a trace to find why an agent failed is a distinct, learnable skill. The node summary: **debug a real agent failure from its trace.** This is the observability payoff in action: an agent misbehaves, and instead of guessing or re-running blindly, you open the trace and *find the exact span where it went wrong*. It's differential diagnosis (Vol 03 Ch 11, Vol 04 Ch 16) powered by the X-ray — and it's one of the most practical skills in this entire ring.

## The Real Explanation
**The trace-reading protocol (the failure taxonomies, now trace-powered).** When an agent produces a bad result: (1) *Open the trace, don't re-run* — re-running a non-deterministic system may not reproduce the bug and wastes money; the trace *captured* the actual failing run (Ch 13's "reconstruct without re-running" payoff). (2) *Find the first wrong span* — walk the span tree and locate where reality diverged from intent (Vol 04 Ch 16's "first wrong step, not the loudest" — cascades mean the visible failure is downstream of the cause; the trace lets you walk *backward* through the tree to the origin). (3) *Read that span's inputs and outputs* — what did this step receive, what did it produce, and where's the mismatch? (Vol 03 Ch 11's "look at the chunks first," generalized: look at the *span's data* first.) (4) *Classify the failure* — is it a bad LLM decision (the reasoning in the span is flawed — a prompt problem), a bad tool result (the tool span returned garbage — a tool problem), a bad input (this span was poisoned by an upstream span — walk further back), or an orchestration error (wrong span ran, or in wrong order — a graph-logic problem)? Each classification points at a different fix — the taxonomies of Vol 03 Ch 11 and Vol 04 Ch 16, now *located precisely* in the trace rather than inferred from the output.

**What traces reveal that outputs hide.** The final output shows *that* it failed; the trace shows *where and why*: the retrieval span that returned the wrong chunks (Vol 03's retrieval failure, *seen*); the tool span with malformed args (Ch 6's arg failure, *located*); the reasoning span where the agent drifted (Vol 04 Ch 8's derailment, *timestamped*); the subgraph that returned a confident-wrong result (Vol 05's multi-agent amplification, *traced to its source*); the step where latency spiked (Ch 17's slow span). The trace turns "the agent gave a bad answer" (unactionable) into "the research subgraph's second search span returned irrelevant results because the query was over-broad" (a specific, fixable diagnosis). This is why observability is a *senior* skill: it's the difference between debugging by guessing and debugging by *seeing*.

**The common failure signatures in traces (a field guide).** *The wandering trajectory* (Vol 04 Ch 16 derailment): many spans, drifting further from the goal — visible as a long, meandering span tree. *The loop* (Vol 04 Ch 16): the same span (same tool, same args) repeating — a visual stutter in the tree. *The poisoned cascade* (Vol 04 Ch 16, Vol 03 Ch 14): one wrong span, then every downstream span building on the error — walk back to the *first* wrong one. *The silent tool failure*: a tool span returned an error or empty result that the agent didn't handle (Vol 04 Ch 3's error-handling gap, exposed). *The latency culprit*: one span dominating the run's wall-clock (Ch 17's target). *The cost spike*: one span (usually a bloated-context LLM call — Vol 04 Ch 13's scratchpad growth) dominating the bill. Learning to spot these signatures at a glance is the fluency this build develops.

## Why It Matters
Where this appears in real systems and jobs: debug a real agent failure from its trace.

## Hands-On
Debug for real (est. half a day, and genuinely useful): (1) *Induce a real failure* in your traced agent (reuse Vol 04 Ch 16's zoo — a derailment, a loop, a poisoned cascade — or just run it on a hard case until it genuinely fails) and capture the trace. (2) *Debug it from the trace alone* — without re-running, walk the span tree, find the first wrong span, read its I/O, classify the failure, and identify the fix. Write up the diagnosis: "the failure was in [span], caused by [reason], fixed by [change]." (3) *Verify* — apply the fix, re-run, confirm the trace now shows the correct path. Do this for *two* different failure types so you practice spotting different signatures. The two trace-debugging writeups (failure → diagnosis → fix → verification) = the note; this is the practical skill that makes all your agents maintainable.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the trace-reading protocol's four steps, and why "open the trace, don't re-run."
2. Why walk *backward* to the first wrong span rather than fixing the visible failure?
3. Give three things a trace reveals that the final output hides.
4. Name four failure signatures and their visual appearance in a span tree.
5. Why is trace-reading a senior skill — the difference it makes to debugging?


---

## Wikilinks
[[build-tracing-instrumentation]]
[[agent-failure-modes]]
[[rag-failure-modes]]
[[trajectory-evals]]
[[cost-latency-dashboards]]

## Status log
- Started: 2026-07-21
- Finished: null