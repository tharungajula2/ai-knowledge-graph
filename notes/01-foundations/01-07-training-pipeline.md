---
id: training-pipeline
title: "Pretraining → Fine-tuning → RLHF"
domain: foundations
ring: 1
cluster: "How AI Works"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["what-is-a-language-model", "how-machines-learn", "hallucination", "model-landscape"]
tags: [foundations]
---

## ELI5
How do you make a helpful assistant? Same way you make a doctor. **Step 1:** twenty years of general education — read everything, absorb the world (pretraining). **Step 2:** med school — focused training on the specific job (fine-tuning). **Step 3:** residency with feedback — senior doctors watch your bedside manner and correct you until your behavior is right (RLHF). Every chatbot you've ever used went through exactly these three stages.

## The Real Explanation
**Stage 1 — Pretraining.** Next-token prediction (Chapter 3) on trillions of tokens of internet text, books, and code. Months on thousands of GPUs; the tens-of-millions-of-dollars stage. Output: a **base model** — a magnificent autocomplete containing compressed world-knowledge, but with no manners and no sense of dialogue. Ask a base model "What is the capital of France?" and it may reply "What is the capital of Germany? What is the capital of Italy?" — because quiz lists are a likely continuation of quiz questions. Knowledge: vast. Assistant behavior: absent.

**Stage 2 — Supervised Fine-Tuning (SFT).** Take the base model and continue training — same gradient descent, tiny data: tens or hundreds of thousands of *hand-crafted examples* of ideal assistant behavior ("User asks X → a great assistant answers Y"). The model's weights shift from "continue any document" to "play the assistant character." Cheap relative to pretraining (days, not months). The same technique aimed at a domain (fine-tune on legal Q&A, on your company's tone) is how specialists are made — you'll do this with your own hands with QLoRA in a later domain.

**Stage 3 — RLHF (Reinforcement Learning from Human Feedback).** SFT teaches format; RLHF teaches *taste*. Generate multiple answers per prompt; humans rank them (A better than B). Train a separate **reward model** to predict those human preferences. Then optimize the chatbot against the reward model: nudge weights toward high-scoring behavior. This is the stage that produces "helpful, harmless, honest" — and also the stage blamed for sycophancy and over-refusal when the reward signal is imperfect. (A widely used simpler alternative, DPO, skips the separate reward model and optimizes on preference pairs directly — same goal, lighter machinery.)

**Why you must know the recipe as an engineer.** Because it tells you which tool fixes which problem: model lacks *knowledge*? → that's pretraining-scale (you won't fix it; use RAG instead). Model has wrong *format/style/domain voice*? → fine-tuning territory. Model has wrong *judgment/values*? → preference-training territory. Choosing among RAG vs fine-tuning vs prompting is a recurring interview question and a weekly real-job decision, and this three-stage map is the answer key.

## Why It Matters
Where this appears in real systems and jobs: the three-stage recipe behind every chatbot.

## Hands-On
Write the three-stage biography of any assistant as a 6-line story for a 12-year-old ("First it read the whole library... then it did homework with a tutor... then audiences clapped or booed..."). Then answer for yourself: your company's model keeps answering in English when customers write in Telugu — which stage's problem is that, and what's the cheapest fix?

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What does a base model excel at and hilariously fail at? Why does the failure make perfect sense?
2. What changes between pretraining and SFT: the algorithm, the data, or both? Be precise.
3. Explain the reward model's role in RLHF in two sentences.
4. Map each problem to the right stage-fix: missing recent knowledge / wrong tone / unsafe judgment.
5. Roughly compare the cost of the three stages, and say why that ordering matters for a startup.


---

## Wikilinks
[[what-is-a-language-model]]
[[how-machines-learn]]
[[hallucination]]
[[model-landscape]]

## Status log
- Started: 2026-07-21
- Finished: null
