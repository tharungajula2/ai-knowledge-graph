## ELI5
Chapter 12 taught a model *what to do*: emit this schema for that request — supervised, right-answer-exists learning. But most of what makes an assistant *good* has no single right answer: helpful vs sycophantic, thorough vs bloated, honest-refusal vs over-refusal. You can't write the correct output; you can only compare two and say *this one's better*. Learning from comparisons is preference tuning — the RLHF/DPO world you first glimpsed in Vol 01 Ch 4, Stage 3 — and beside it sits distillation, the teacher-student trick from Chapter 2, now formalized. Together they complete your map of the model-adaptation landscape.

## The Real Explanation
**RLHF — the three-piece machine.** Generate multiple answers per prompt; humans rank them; train a separate **reward model** to predict the rankings (a learned taste function); then optimize the policy (the actual model) against the reward model with reinforcement learning, constrained (a KL leash) so it doesn't drift far from its SFT starting point. Powerful; famously fiddly — three models in flight, RL instability, and **reward hacking**: the policy finds outputs that score high on the reward model while being worse for humans (longer answers scoring "thorough," confident tone scoring "helpful" — the taste function's biases, farmed). You've met this exact pathology wearing a different coat: Vol 07's judge biases. *A reward model is an LLM-judge whose scores become gradients* — every bias you learned to pin and calibrate there, here gets baked into the weights. Sycophancy and over-refusal in commercial assistants are widely attributed to imperfect reward signals; you feel alignment's fingerprints daily.

**DPO — the same goal, lighter machinery.** Direct Preference Optimization skips the reward model and the RL loop: a loss applied directly on preference pairs (chosen, rejected) that raises the chosen answer's likelihood relative to the rejected one, with the same drift-leash effect achieved implicitly. One training run, standard fine-tuning infrastructure, dramatically simpler — which is why it (and its descendants; scan on light-day) became the practical default for preference-tuning open models. The permanent trade: RLHF's explicit reward model can generalize taste beyond the collected pairs; DPO is bounded by its pair set but far easier to run honestly. And note the composition: preference tuning is a *stage after* SFT — your Chapter 12 adapter could itself be DPO'd with pairs of (better payload, worse payload). You won't build that here, but you can now spec it.

**Distillation — formalized.** Teacher (large) → student (small), two lanes: **hard-label** distillation — teacher generates outputs, student does ordinary SFT on them (your Chapter 12 pipeline *was* this: a frontier model generated the pairs, an 8B student learned them — you've already done distillation without the badge); and **soft-label** — student trains on the teacher's full probability distributions, richer signal, needs logit access (mostly open-model territory). Why it works: the teacher's outputs are a *cleaner curriculum* than raw internet text. Why it's everywhere: Chapter 2's economics. The honest edges: students inherit teacher errors and biases wholesale, compress away tail capability, and provider ToS often restricts distilling from commercial APIs — know the rule before you build the pipeline.

**Evaluating tuned models — the closing discipline.** Task metrics alone lie about adapted models. The full sweep, all Vol 07 machinery: task performance (your golden set), general retention (the forgetting probe), preference winrate (judge-based A/B of tuned vs base — with judge pinning, because now you *really* know why), and safety regression (Vol 08's injection suite against the tuned model — tuning can dent refusal behavior, and nobody checks until you make it a gate).

## Why It Matters
Where this appears in real systems and jobs: DPO, RLHF, reward models, model distillation techniques, and evaluating tuned model alignment.

## Hands-On
Two artifacts, no GPU. (1) **The landscape map** — one diagram, drawn by hand: base model → SFT → {RLHF | DPO} → deployed, with distillation as the teacher arrow feeding SFT data from a larger model, each edge labeled with what it changes and what it costs; this diagram is the interview answer to "walk me through how models get aligned." (2) **The preference dataset seed** — write 10 real preference pairs for your own proposal-gate task: for each, one *better* and one *plausible-but-worse* payload (worse ≠ broken: over-eager tool use, wrong risk tier, verbose fields — the subtle failures a validator passes but a human rejects). Realize as you write them what your gate has been quietly producing all along: every approve/edit/reject with a reason (Vol 08's gate, Vol 04 Ch 18's rejection-reason loop) *is a preference pair with provenance*. Close the note with three sentences on that: your system was collecting alignment data before you knew the word.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Walk RLHF's three pieces and name where reward hacking enters the machine.
2. "A reward model is an LLM-judge whose scores become gradients" — unpack it, and name the Vol 07 disciplines that transfer.
3. DPO vs RLHF: what's removed, what's kept, what's the permanent trade?
4. In what precise sense was your Chapter 12 build already distillation? Hard-label or soft-label, and why?
5. The four-part eval sweep for any tuned model — recite it, with the Vol 07/Vol 08 node each part reuses.


---

# PART III — VIZIER v2: THE FINAL MASTERPIECE
*6 chapters. The graduation proof your graph's own Prompt-2 rewrite demanded: the learner REBUILDS the entire agent system from scratch — supervisor, memory, gate, evals, deploy — each subsystem mapped to the nodes that taught it. v1 was built by an IDE agent while you watched. v2 is built by you while the whole curriculum watches. This is M5.*

---

## Wikilinks
[[training-pipeline]]
[[build-qlora-finetune]]
[[judge-bias-pinning]]
[[small-distilled-models]]
[[build-proposal-gate]]
[[build-injection-suite]]

## Status log
- Started: 2026-07-21
- Finished: null