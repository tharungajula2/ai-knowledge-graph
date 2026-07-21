---
id: experiment-one-vs-many
title: "Experiment: One vs Many"
domain: multi-agent-mcp
ring: 5
cluster: "Team Builds"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["when-many-beats-one", "token-economics-of-teams", "build-writer-critic", "build-golden-dataset", "cost-latency-budgets"]
tags: [multi-agent-mcp]
---

## ELI5
This entire volume has been building toward one honest question, and this node finally answers it with data: **same task, single vs multi; publish the honest finding.** The node summary is a research protocol, not a build spec — and its most important word is *honest*. Most multi-agent content is advocacy; you're going to run the actual experiment, on your own systems, and report whatever the numbers say — including if they embarrass the multi-agent hype (which, on many tasks, they will). This is the scientific spine of the whole ring, and the capstone's centerpiece.

## The Real Explanation
**The hypothesis under test** (Ch 1's null, formalized): *for a given task, does a multi-agent system deliver enough quality gain to justify its cost multiple (Ch 7) over a single well-built agent?* Note the framing — not "is multi-agent better?" (meaningless without a task and a cost budget) but "does the gain beat the cost, *on this task*?" You're testing the Ch 1 criteria empirically.

**The experimental design (real methodology — this is Domain 07's rigor, previewed).** (1) *Pick tasks that span the spectrum* — some that *should* favor multi-agent (genuinely distinct specialties, e.g., "research three products and write a comparative analysis" — research + writing + analysis) and some that *should* favor solo (a focused task with one specialty, e.g., "answer this technical question from my notes"). Testing both is what makes it science, not advocacy — if multi-agent wins everywhere or loses everywhere, you've mis-designed the task set. (2) *Build both systems fairly* — the single agent must be *genuinely good* (well-designed tools, reflection, the works — not a strawman; the most common lie in multi-agent advocacy is a crippled solo baseline), and the multi-agent system genuinely reasonable (your Vol 04 supervisor+specialists, your Ch 15 writer-critic). (3) *Measure both dimensions* — quality (rubric-scored, ideally blind — your Vol 03 Ch 18 / Domain 07 eval discipline) *and* cost (tokens/money/latency from the ledger). (4) *Control variables* — same models where possible, same task inputs, temperature 0 for repeatability (Vol 01 Ch 9), enough runs to see past noise (Vol 02 Ch 16 — n matters; a single run per condition proves nothing).

**The analysis — quality-per-cost, the honest frontier.** For each task: plot or tabulate quality vs cost for solo and multi. The findings usually cluster into a real pattern you should *expect but verify*: multi-agent earns its cost on genuinely-decomposable, multi-specialty tasks (the Ch 1 reasons operating) and *loses* — same or worse quality at multiplied cost — on focused tasks (coordination overhead buying nothing). The senior insight this produces: **"use multi-agent" is not a stance, it's a task-dependent decision with a measurable answer** — and you'll have the measurements. Report the null and negative results *prominently*: "on 4 of 7 tasks, the single agent matched the team at a fifth of the cost" is a *more valuable* finding than any win, because it's the finding nobody publishes and everybody needs.

**Publishing — the node says "publish the honest finding."** This is real proof-of-work (the 45-day mission's currency) and rare content: an *honest, measured* one-vs-many comparison stands out precisely because the internet is full of unmeasured advocacy. The writeup: the methodology (fair baselines, both dimensions, controlled variables — the rigor *is* the credibility), the results table, the quality-per-cost analysis, and the honest conclusion including where multi-agent lost. This is Domain 07's eval mindset producing publishable work one ring early, and it's a portfolio piece that signals "this person measures instead of believes" — exactly the senior signal your target roles want.

**Verification.** The experiment's own validity: fair baselines (document why the solo agent isn't a strawman), controlled variables (list them), sufficient runs (state n), blind scoring where feasible (Domain 07's judge discipline). A methodologically sloppy experiment publishes a lie confidently — the verification here is *of the methodology itself*, which is the deepest version of this curriculum's measurement discipline.

## Why It Matters
Where this appears in real systems and jobs: same task, single vs multi; publish the honest finding.

## Hands-On
Run it (est. 1.5–2 days): design the task set (3–7 tasks spanning the spectrum, documented rationale for each placement) → ensure a genuinely-strong solo baseline (upgrade it if it's a strawman) → run both systems, n≥3 per condition, ledger logging throughout → rubric-score quality (blind if you can) → build the quality-vs-cost analysis → write the honest publication. Then actually publish it (LinkedIn/blog — the capstone will point at it). Tag `experiment-v1.0`. The results table + the quality-per-cost frontier + the honest conclusion (especially the losses) = the note, and the published link is capstone ammunition of the highest caliber.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the hypothesis in its correct, cost-aware framing — why is "is multi-agent better?" the wrong question?
2. Why must the task set span the spectrum, and what does it mean if multi-agent wins everywhere?
3. What's the most common lie in multi-agent advocacy, and how does your design avoid it?
4. Why are null and negative results the *more* valuable findings here?
5. What is being verified in this build, and why is that the deepest form of the curriculum's measurement discipline?


---

## Wikilinks
[[when-many-beats-one]]
[[token-economics-of-teams]]
[[build-writer-critic]]
[[build-golden-dataset]]
[[cost-latency-budgets]]

## Status log
- Started: 2026-07-21
- Finished: null
