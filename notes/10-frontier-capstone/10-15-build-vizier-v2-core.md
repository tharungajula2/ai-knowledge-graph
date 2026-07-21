---
id: build-vizier-v2-core
title: "Build: v2 Core ReAct Loop"
domain: frontier-capstone
ring: 10
cluster: "VIZIER v2 — The Final Masterpiece"
type: build
size: L
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-agent-from-scratch", "build-supervisor", "build-specialists", "build-mcp-bridge", "langgraph-state", "define-vizier-v2"]
tags: [frontier-capstone]
---

## ELI5
The heart first. In Vol 04 you built an agent from bare Python (Ch 4), then a LangGraph supervisor routing four specialists (Ch 11–12). Those were exercises with training wheels: mock tasks, my chapter text at your elbow. Today you build v2's execution core **from your own spec, from scratch, from memory-plus-notes** — and the training wheels' absence is the entire point. If you have to peek, peek at *your own Feynman notes*, not at v1's code and not at this textbook. The notes were always the real curriculum; now they get to prove it.

## The Real Explanation
**The ReAct execution framework.** The loop from first principles: typed state (Pydantic schemas for messages, scratchpad, budgets — Vol 04 Ch 13), the reason step through your gateway (never a raw SDK — the floor from Vol 02 still holds), structured action emission (Vol 02 Ch 6's schemas — and here your Chapter 12 adapter is *available as a routing option* for payload emission; whether it's default or fallback is a spec decision you already made), tool execution with the safety-tag taxonomy from birth (Vol 04 Ch 3 — tags are what the gate will key on in Chapter 17), observation append, termination logic (goal-met, max-steps, budget-exceeded — all three, tested).

**The graph-based supervisor.** State machine over the loop: supervisor node classifying intent via enforced schema (`none` is first-class — Vol 04 Ch 11's lesson), conditional edges to specialist subgraphs (each a narrow-interface, private-scratchpad citizen — Vol 04 Ch 10), checkpointing on durable storage so any run can die and resume (Vol 04 Ch 6 — and your acceptance criterion says *prove it with a kill test*), and interrupt points wired where the gate will attach (Vol 04 Ch 7 — the sockets exist now; the appliance arrives in Chapter 17). The async bridge (Vol 05 Ch 3) goes in *now*, at the foundation — v1 learned its necessity the hard way at integration time; v2 learns from v1.

**What "from scratch" means, precisely.** Not "no libraries" — LangGraph, Pydantic, your gateway are tools, and per Vol 04's manifesto you already built the bare-Python version once; frameworks are convenience, never magic, and you've earned the convenience. "From scratch" means: **no copying from v1, no IDE-agent authorship of core logic.** Coding assistants may review and critique (Chapter 5 gave you their anatomy); the architecture and the code are yours. The line you must be able to say in any interview, truthfully: *"I wrote this."*

## Why It Matters
Where this appears in real systems and jobs: Rebuild the ReAct execution framework and graph-based supervisor from scratch (taught by build-agent-from-scratch & build-supervisor).

## Hands-On
Build to your acceptance criteria (est. 3+ honest days — it's an L): repo scaffold with the professional floor (venv, typing, pytest, CI stub — Vol 01's craft cluster, Vol 09's pipeline waiting); state schemas first; bare loop with two mock tools until green; supervisor + two specialists (research and brain-ops are the natural pair — retrieval and curriculum tools mount from Vol 03/Vol 04 Ch 18 work); checkpointing + the **kill test** (kill -9 mid-run, resume, complete — record the terminal session for the demo film, Chapter 21 will want it); async bridge + concurrent-tool test; then the full acceptance run: 10/10 routing, all three termination paths, budget caps enforced. Tag `v2-core-0.1`. In the note: the delta ledger — five concrete things v2's core does better than v1's, and the one place you had to reread your own note to proceed (that note earned its keep; say which).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Walk your core's execution path for one real request, naming every schema it passes through.
2. Where exactly do the interrupt sockets sit, and why were they placed *before* the gate exists?
3. Why does the async bridge go in at the foundation? Tell it as the v1 story it comes from.
4. Defend your "from scratch" line: what was allowed, what wasn't, and why the line sits there.
5. Your kill test: what state survived, what resumed, and which Vol 04 chapter is that demo?


---

## Wikilinks
[[build-agent-from-scratch]]
[[build-supervisor]]
[[build-specialists]]
[[build-mcp-bridge]]
[[langgraph-state]]
[[define-vizier-v2]]

## Status log
- Started: 2026-07-21
- Finished: null
