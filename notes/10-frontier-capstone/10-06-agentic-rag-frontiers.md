---
id: agentic-rag-frontiers
title: "Agentic RAG Frontiers"
domain: frontier-capstone
ring: 10
cluster: "The Moving Edge (baseline guesses — expect replans)"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["multi-hop-retrieval", "build-chat-with-my-brain", "graphrag-deep", "build-research-agent", "rag-evals"]
tags: [frontier-capstone]
---

## ELI5
In Vol 03 you built RAG as a *pipeline*: query in → retrieve → stuff context → answer out. One shot, fixed shape. But you also, without ceremony, built its successor: Vol 03 Ch 14's multi-hop, where the *model* decided what to look up next. Agentic RAG is that idea graduated into a worldview: **retrieval stops being a pipeline and becomes a tool inside the loop** — called when the agent decides, as many times as needed, with queries the agent writes and rewrites, against sources the agent chooses.

## The Real Explanation
**The inversion.** Classic RAG: the *system designer* decides when retrieval happens (always, once, up front). Agentic RAG: the *agent* decides — whether to retrieve at all (some questions need no lookup — save the latency and cost), what to ask (query rewriting, decomposition into sub-questions), where to ask (vector store vs keyword vs web vs the knowledge graph — your Vol 06 GraphRAG becomes one more tool in the box), whether the results *suffice* (self-assessed relevance → re-retrieve with a better query), and when to stop. Every one of those decision points is a place quality can rise — and a place cost, latency, and failure can enter. There's no free lunch; there's a trade you now know how to measure.

**The permanent frame: retrieval strategies as a portfolio.** You own the whole portfolio already — dense (Vol 03), hybrid/BM25 (Vol 03 Ch 7), reranking, GraphRAG (Vol 06), web search with provenance quarantine (Vol 04 Ch 14), memory retrieval (Vol 06). Agentic RAG is a *router over the portfolio* — and routing-by-query-type was the drumbeat of Vol 03 (Ch 9, 13, 14, 19) that set up the supervisor. Same music, bigger orchestra. The engineering discipline that keeps it honest is unchanged: golden sets and retrieval metrics (Vol 03 Ch 16, Vol 07). An agentic RAG system without evals is a slower, costlier way to be uncertain.

**The frontier axis to scan on light-day.** The moving debates: how much retrieval logic migrates *into* the model itself (models trained to search natively) vs stays in your orchestration; long-context models "killing" RAG (they don't — cost, freshness, and citation-grounding keep retrieval alive, per Vol 02 Ch 15's long-context strategies — but the boundary moves); and standardized retrieval interfaces (MCP resources — Vol 05 — as the retrieval plug). Scan fresh; the axes will still be these.

## Why It Matters
Where this appears in real systems and jobs: retrieval as a tool inside the loop.

## Hands-On
Upgrade one real path in your own stack: take the brain-chat (Vol 03 Ch 17's build) and wrap its retrieval as a *tool* the agent may call zero, one, or many times, with query rewriting allowed. Run your existing brain-chat golden set (Vol 03 Ch 18) against both variants. The honest table: quality delta, cost delta, latency delta, plus one trace (Vol 07 instrumentation) of a multi-retrieve run annotated by hand — where did the second retrieval *earn its cost*? Verdict paragraph in the note: for your corpus, when does agentic retrieval pay?

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the inversion in one sentence, and list the five decision points the agent takes over.
2. Which Vol 03 chapter was secretly agentic RAG already? What was missing that this chapter adds?
3. Name your retrieval portfolio (five entries minimum) and what the router routes on.
4. Why doesn't long context kill RAG? Three permanent reasons.
5. From your table: did the agentic variant clear its own cost? Defend the verdict with numbers.


---

## Wikilinks
[[multi-hop-retrieval]]
[[build-chat-with-my-brain]]
[[graphrag-deep]]
[[build-research-agent]]
[[rag-evals]]

## Status log
- Started: 2026-07-21
- Finished: null
