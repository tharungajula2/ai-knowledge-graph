## ELI5
For most of this curriculum, a model's ability was fixed at training time: whatever the weights learned, that's what you get, one forward pass per token. Then the field found a second dial: let the model *think longer* at answer time — generate extended internal reasoning before committing, explore branches, check its own work — and hard-problem performance climbs *without touching the weights*. Models that think longer, not just bigger: that's test-time compute, and it quietly rewrites several rules you've been living by.

## The Real Explanation
**The core move.** You met the ancestor in Vol 02 Ch 5: chain-of-thought — "think step by step" buying accuracy with tokens. Reasoning models bake that in: trained (largely via reinforcement learning on verifiable problems — math, code, exactly the ground-truth-rich habitats Chapter 5 celebrated) to produce long internal deliberation before answering. The permanent principle: **inference compute is a quality dial.** More thinking tokens → better answers on hard problems → more latency and cost. A dial, not a switch.

**What it rewrites in your stack.** (1) **Routing** (Vol 02 gateway): "which model" becomes "which model *and how much thinking*" — easy queries deserve zero deliberation, hard ones deserve seconds of it; effort becomes a routable parameter. (2) **Cost math** (Vol 04 Ch 17, tokentools): reasoning tokens are often billed but unseen — your cost ledger must count them or lie to you. (3) **Latency** (Vol 02 Ch 8): thinking time crushes TTFT — reasoning models and voice agents (Chapter 3) are natural enemies; know which paths can never afford deliberation. (4) **Agent design** (Vol 04): some of your orchestration — plan-then-execute, reflection — is the model deliberating *externally*; as models internalize deliberation, the boundary between "agent pattern" and "model capability" moves inward. Scan that boundary on light-day; it's the fastest-moving line in the field. (5) **Evals** (Vol 07): trajectory evals meet a wrinkle — the trajectory may be partly hidden inside the model.

**The permanent question it answers.** "Why not always use maximum reasoning?" is the same shape as "why not always use the biggest model" (Chapter 2): because *sufficiency at minimum cost* is the engineering objective, and your golden sets define sufficiency. The portfolio just gained a dimension.

## Why It Matters
Where this appears in real systems and jobs: models that think longer, not just bigger.

## Hands-On
A measurement session. Take 10 problems in two flavors — 5 trivial (formatting, extraction), 5 genuinely hard (multi-step math or logic, a gnarly debugging question). Run them against a standard model and a reasoning-capable model (or the same model with reasoning effort low vs high, if your provider exposes the dial). Table: accuracy, visible tokens, total billed tokens, latency, cost via tokentools. The two findings to hunt for: the hard-problem accuracy jump (the dial working) and the trivial-problem waste (the dial mis-set). Close with a one-paragraph routing amendment for your gateway: which of your workloads earn deliberation?

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. "Inference compute is a quality dial" — unpack it for a 12-year-old (a student allowed more scratch-paper time on hard exam questions works).
2. Which Vol 02 chapter is the ancestor of reasoning models, and what did training add to the trick?
3. Name the five things test-time compute rewrites in your stack, and the one you measured today.
4. Why are reasoning models and voice agents natural enemies? Which metric is the battlefield?
5. Why does "agent pattern vs model capability" deserve a fresh scan every time you touch this ring?


---

## Wikilinks
[[reasoning-and-cot]]
[[build-gateway]]
[[cost-latency-budgets]]
[[voice-agents]]
[[trajectory-evals]]

## Status log
- Started: 2026-07-21
- Finished: null