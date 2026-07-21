---
id: cost-latency-budgets
title: "Cost & Latency Budgets"
domain: agents
ring: 4
cluster: "Real Agents"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["context-windows", "rate-limits-caching", "build-gateway", "scratchpads-working-memory", "build-token-cost-calculator", "semantic-caching"]
tags: [agents]
---

## ELI5
Your Ch 14 ledger line already told you: agents are the most expensive artifacts you've built. The node summary is blunt — **agents burn tokens; engineer the bill** — and the arithmetic is unforgiving: a chatbot turn is one call; an agent run is a *loop of calls, each re-sending a growing scratchpad*. Left unengineered, that's quadratic-flavored spend wrapped in unpredictable latency. This chapter turns Vol 01 Ch 8's economics and Vol 02's machinery into agent-shaped budget engineering — the difference between a demo that wows and a product that survives its own success.

## The Real Explanation
**The anatomy of an agent's bill — know where the money goes.** Per step: input tokens = system prompt + tool catalog + *the entire scratchpad so far* + the new observation; output = the thought/action. The scratchpad grows every step (Ch 13's curve — you plotted it), so per-step cost *climbs* through a run: a 12-step run doesn't cost 12× step one; it costs the area under your growth curve (you have literally drawn the integral — now read it as rupees). Add the pattern surcharges: reflection doubles calls per round (Ch 9's caveat), replanning adds checks (cheap) and replans (not), multi-agent adds the supervisor's calls *around* every specialist's, and reasoning-mode models multiply output tokens precisely when tasks get hard (Vol 02, Ch 5's routing economics). Latency mirrors cost, with a twist: steps are *sequential* — an agent's wall-clock is the sum of its calls plus its tools, and no streaming trick hides a 40-call run (Vol 02 Ch 8's TTFT medicine treats perceived latency of *one* call; agents need different medicine: progress visibility — stream the *thoughts and actions* as they happen, so the user watches work instead of a spinner; you've had this since Ch 4's transcripts — productize it).

**The budget stack — engineering, layer by layer (every layer already in your codebase; this chapter promotes them from guards to policy).**
- **Hard caps**: max_steps per run, max iterations per plan-step (Ch 14's nesting), max tool-calls, max total tokens, max wall-clock — *and a max spend in currency*, computed live from the ledger (tokentools' finest hour: the run halts at ₹X, gracefully, returning partial findings + gaps rather than dying — budget exhaustion as an *honest outcome*, the NOT-IN-NOTES philosophy applied to money).
- **Model routing**: the biggest lever, and you own every piece — cheap models for the router (Ch 11 — classification doesn't need a frontier model), for replan-checks and repetition-breaking, for critique rubrics; frontier models for planning and synthesis where quality compounds; the gateway (Vol 02, Ch 11) makes per-call routing a parameter, not a refactor. Typical production splits put 70–90% of calls on cheap models; measure your own split from the ledger and tune.
- **Scratchpad economics**: Ch 13's ladder *is* cost engineering — distill-and-replace and typed state don't just fight lost-in-the-middle; they flatten the growth curve you're paying the integral of. And prompt caching (Vol 02, Ch 10) applies to agents beautifully *if* you honor the prefix rule: stable system prompt + tool catalog first, volatile scratchpad last — an agent's re-sent prefix is huge and identical every step; caching it is the single cheapest large win available. Check your prompt assembly order today.
- **Parallelism for latency**: independent plan steps and parallel tool calls via gather (Vol 01 Ch 17; Ch 5's reducers making parallel writes safe) — latency falls, cost doesn't; know which problem you're solving.
- **Caching for repeats**: semantic caching (Vol 03, Ch 20) at the run level for repeated questions, and tool-result caching (same search this session? — the exact-match dict, Vol 02 Ch 10) inside runs.

**The budget as product design — the reframe that matters.** A budget isn't a limp constraint; it's a *contract with the user*: "quick answer (₹2, 30s, shallow)" vs "deep research (₹40, 8 min, cited briefing)" are different products from the same agent at different budget settings — and showing estimated cost *before* the run (the plan's previewable budget, Ch 8's promise, cashed) plus actual cost after (the ledger line) is trust-building of the same species as citations. Per-run unit economics — what does a briefing cost, what would a user pay — is the production domain's bread; the reflex starts here.

## Why It Matters
Where this appears in real systems and jobs: agents burn tokens; engineer the bill.

## Hands-On
Instrument and engineer your research agent (~half a day): (1) *The autopsy* — rerun a Ch 14 briefing with per-step ledger logging: table of step, model, input/output tokens, cost; identify the three most expensive steps and *why* (it will be scratchpad size, not output). (2) *Three interventions, measured one at a time* (the discipline): route the replan-check + repetition-breaker to your cheapest model; verify prompt assembly is cache-optimal (stable prefix first) and enable caching; tighten the scratchpad ladder one notch. Before/after cost and wall-clock per intervention. (3) *The two products* — define quick vs deep budget configs; run the same question under both; present the two briefings side by side with their price tags. (4) *The halt test* — set an absurdly low spend cap; verify graceful partial-return with gaps, not a crash. Autopsy table + three deltas + the two-product comparison = the note; total savings percentage goes in your capstone post.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why does an agent's cost curve climb within a run? Read your own curve as an integral.
2. Recite the budget stack and identify the biggest lever — with your measured split.
3. Why doesn't streaming fix agent latency, and what does? What falls with parallelism and what doesn't?
4. State the prefix rule as it applies to agent prompt assembly, and what you found when you checked yours.
5. Deliver the budget-as-product reframe with your own two products' price tags.


---

## Wikilinks
[[context-windows]]
[[rate-limits-caching]]
[[build-gateway]]
[[scratchpads-working-memory]]
[[build-token-cost-calculator]]
[[semantic-caching]]

## Status log
- Started: 2026-07-21
- Finished: null
