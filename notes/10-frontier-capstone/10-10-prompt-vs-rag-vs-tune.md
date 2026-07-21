---
id: prompt-vs-rag-vs-tune
title: "Prompting vs RAG vs Fine-Tuning"
domain: frontier-capstone
ring: 10
cluster: "Fine-Tuning & Model Adaptation"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["training-pipeline", "why-rag", "prompt-engineering-craft", "golden-sets", "build-qlora-finetune"]
tags: [frontier-capstone]
---

## ELI5
Three ways to change what a model does: *tell it* (prompting), *show it the facts at answer time* (RAG), or *change its brain* (fine-tuning). Juniors reach for fine-tuning first because it sounds serious. Seniors reach for it **last**, and can say exactly why. This chapter is the decision matrix — the buy-vs-tune judgment that interviewers probe and real projects live or die by. You've been accumulating the answer since Vol 01 Ch 4's three-stage training recipe; today it becomes a matrix you can defend.

## The Real Explanation
**The diagnosis question — what is actually wrong?** From Vol 01 Ch 4, the tool-per-disease map: the model lacks **knowledge** → RAG (weights are not a database — Vol 03's one-sentence thesis; facts change, retrieval updates instantly, citations ground everything). The model has wrong **behavior/format/style/domain-voice** → fine-tuning territory (a fine-tune can't teach the model your Q3 numbers, but it *can* teach it to always speak your schema, your tone, your task shape). The task is simply **under-specified** → prompting (and 80% of "we need to fine-tune" cases die here, killed by a better prompt with few-shot examples — Vol 02's whole craft). Wrong **judgment/values** → preference-tuning territory (Chapter 13's world).

**The escalation ladder — cheapest lever first, evidence to climb.** (1) Better prompt + few-shot → measure on the golden set (Vol 02 Ch 16 — no golden set, no verdict, no exceptions). (2) Structured output enforcement (Vol 02 Ch 6) if it's a format problem. (3) RAG (Vol 03) if it's a knowledge problem. (4) Fine-tune only when: the behavior gap survives 1–3 *with numbers proving it*, the target behavior is demonstrable in a few hundred examples, and the payoff recurs (a permanent task, not a one-off). The hidden costs that justify last place: data curation (the real work — Chapter 12 makes this visceral), a training/eval loop to build, a model artifact to *version, serve, and maintain* (Vol 07's MLOps cluster exists for this), and staleness (the tuned model doesn't improve when the base provider ships a better one — you've frozen a fork).

**And the senior answer is usually: compose.** Fine-tune for *form*, RAG for *facts*, prompt for *task framing* — the three attack different layers and stack cleanly. A tuned model that speaks your proposal-gate JSON natively, fed by retrieval over live data, steered by a lean prompt: that's the architecture, and you'll build exactly the first leg of it next chapter.

## Why It Matters
Where this appears in real systems and jobs: The buy-vs-tune decision matrix; when context injection beats model tuning and vice-versa.

## Hands-On
The decision memo, on a real case: your own proposal-gate JSON task (natural-language request → structured action payload — the exact task Chapter 12 fine-tunes). Walk the ladder honestly *before* you're allowed to tune: current prompt performance on a 20-case golden set; add few-shot, re-measure; strict schema enforcement, re-measure. Write the memo: where the ladder stalled, the residual gap with numbers, and the verdict "fine-tuning is/isn't justified because…". This memo is Chapter 12's entry ticket — the build is only honest because this chapter earned it.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Reproduce the disease→tool map from memory, with one example each.
2. Why can't fine-tuning teach the model your Q3 numbers? Which volume's thesis is that?
3. Recite the escalation ladder and the evidence rule for climbing each rung.
4. Name the four hidden costs of fine-tuning that juniors forget.
5. Give the compose answer in three sentences, for your own v2 stack specifically.


---

## Wikilinks
[[training-pipeline]]
[[why-rag]]
[[prompt-engineering-craft]]
[[golden-sets]]
[[build-qlora-finetune]]

## Status log
- Started: 2026-07-21
- Finished: null
