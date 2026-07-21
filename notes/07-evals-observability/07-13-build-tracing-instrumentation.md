---
id: build-tracing-instrumentation
title: "Build: Tracing & Instrumentation"
domain: evals-observability
ring: 7
cluster: "Seeing Inside"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-supervisor", "subgraphs", "cost-latency-budgets", "trajectory-evals", "reading-traces", "privacy-in-memory"]
tags: [evals-observability]
---

## ELI5
Evals (Part I) tell you *whether* your system is good; tracing tells you *what it actually did* — the difference between a thermometer and an X-ray. The node summary: **build a tracing integration that tracks agent executions, span latency, and nested subgraphs using OpenTelemetry SDKs/Langfuse; verify by generating nested run traces.** An agent is a black box until you can *see inside* a run — every step, every LLM call, every tool invocation, every subgraph, with timing and cost. This build gives you the X-ray, and trajectory evals (Ch 5), debugging (Ch 14), and dashboards (Ch 17) all depend on it.

## The Real Explanation
**The core concept — spans and traces.** A **trace** is the complete record of one run (one request through your system); it's composed of **spans** — nested timed units of work. A span wraps an operation (an LLM call, a tool execution, a subgraph run) and records: start/end time (→ *latency*), inputs and outputs, metadata (model, tokens, cost), and *parent-child relationships* (this LLM call happened *inside* this agent step *inside* this subgraph — the *nesting* the node emphasizes). A trace is thus a *tree* of spans mirroring your system's actual execution structure — and for your multi-agent system (Vol 05) with supervisor → specialists → subgraphs (Vol 04 Ch 10), that tree *is* your architecture, made visible per-run. This is the same mental model as OpenTelemetry (the industry-standard observability framework — spans, traces, context propagation), which is why the node names it: you're learning the universal observability vocabulary, not a bespoke one.

**Instrumentation — how spans get created.** Two approaches: *automatic* (frameworks like Langfuse or LangSmith, and OpenTelemetry auto-instrumentation, hook into your LLM calls and LangGraph nodes to create spans *for* you — minimal code, broad coverage) and *manual* (you wrap operations in span context explicitly — `with tracer.start_span("research_step"):` — more work, precise control). The pragmatic mix: auto-instrument the standard stuff (LLM calls, tool calls — the framework catches these), manually instrument your *domain-specific* operations (a "retrieval" span, a "gate-decision" span — the operations that are meaningful to *your* system's logic). The nesting happens via *context propagation*: a span created inside another span's context becomes its child automatically — which is how the tree assembles itself to mirror your subgraph structure (Vol 05 Ch 4's message-passing context, now carrying trace context).

**What to capture — the instrumentation design.** Per span: *timing* (the latency contribution — Ch 17's dashboards aggregate these; the slow span is the optimization target), *tokens and cost* (your ledger, Vol 04 Ch 17, now per-span — so you see *which step* cost what), *inputs/outputs* (for debugging — Ch 14 reads these; but *privacy*, Vol 06 Ch 8 — traces contain user data, so sensitive fields get redacted/scoped), *model and config* (which model, which version — Ch 4's pinning, observable), *the agent's reasoning* (the scratchpad/thoughts — Vol 04 Ch 13 — so trajectory evals, Ch 5, and debugging, Ch 14, can read the *why*). A well-instrumented trace lets you reconstruct *exactly* what happened in a run without re-running it — the observability payoff.

**Verification — nested run traces, per the node.** Instrument your multi-agent system (or research agent) and generate a trace of a real run. Verify: the span tree correctly nests (supervisor span contains specialist spans contain LLM/tool spans — the structure matches your architecture); latencies sum sensibly (child spans within parent duration); tokens/cost captured per span and aggregate to the run total (reconcile against your ledger — Vol 04 Ch 17); the reasoning is captured; sensitive data is redacted. View it in the tracing UI (Langfuse and kin render the span tree visually — *see* your agent's execution as a timeline/tree). The nested-trace visualization is the build's trophy — your agent's inner life, made visible.

## Why It Matters
Where this appears in real systems and jobs: Build a tracing integration that tracks agent executions, span latency, and nested subgraphs using open telemetry SDKs/Langfuse; verify by generating nested run traces.

## Hands-On
Build it (est. 1 day): set up a tracing tool (Langfuse free tier, or OpenTelemetry — scan on build day) → auto-instrument your research/multi-agent system's LLM and tool calls → manually instrument your domain spans (retrieval, gate-decision, subgraph boundaries) → run a real multi-step task → verify the nested span tree, per-span timing/cost, and reasoning capture → view it in the UI. Then the reconciliation: confirm the trace's total cost matches your Vol 04 Ch 17 ledger for the same run (two instruments agreeing validates both). Redact one sensitive field (Vol 06 Ch 8). Tag `observability-v0.1`. The nested-trace screenshot + the per-span cost breakdown + the ledger reconciliation = the note; Chs 14 and 17 consume these traces.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Define trace and span, and why is a trace a *tree*?
2. How does the span tree mirror your multi-agent architecture, and via what mechanism does nesting happen?
3. Distinguish auto vs manual instrumentation, and the pragmatic mix.
4. What should each span capture, and what privacy concern applies?
5. What does a well-instrumented trace let you do without re-running, and which later chapters depend on it?


---

## Wikilinks
[[build-supervisor]]
[[subgraphs]]
[[cost-latency-budgets]]
[[trajectory-evals]]
[[reading-traces]]
[[privacy-in-memory]]

## Status log
- Started: 2026-07-21
- Finished: null
