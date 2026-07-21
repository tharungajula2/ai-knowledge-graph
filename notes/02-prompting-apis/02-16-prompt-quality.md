---
id: prompt-quality
title: "Is My Prompt Good?"
domain: prompting-apis
ring: 2
cluster: "Engineering the Call"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["sampling-controls", "few-shot-prompting", "classical-ml-fundamentals", "build-gateway", "injection-first-look"]
tags: [prompting-apis]
---

## ELI5
You tweaked your prompt, ran it once, the answer looked better — ship it? You just committed the cardinal sin of prompt engineering: **judging on one sample**. Temperature exists (Vol 01, Ch 9); inputs vary; "looked better to me, once" is astrology. This chapter installs the discipline that upgrades prompting from vibes to engineering: fixed test inputs, defined success, counted results, changed one thing at a time. It's the seed of the entire evaluation domain — planted here, in miniature, where it's cheap.

## The Real Explanation
**The golden set — your instrument.** 10–20 *fixed* test inputs for the task, chosen to cover the space (Ch 4's spread logic): typical cases, hard cases, edge cases (empty, absurd, wrong-language), and at least one adversarial case (Ch 12 taught you how to write those). For each input, define *expected*: exact output where checkable (extraction → the true JSON), or a checklist/rubric where open-ended ("mentions X, under 100 words, no hedging"). Write the set *before* tinkering — a golden set built after seeing outputs quietly inherits the prompt's blind spots. Keep it in the repo, versioned (Ch 3 made prompts artifacts; their test sets are artifacts too).

**The loop.** Baseline prompt → run the whole set (temperature 0 for comparability — Vol 01 Ch 9's eval convention; your gateway makes batch runs one function call) → score into a simple table: pass/fail per input, plus notes → change **one thing** (reorder the skeleton, add one example, tighten FORMAT) → rerun *all* → compare *counts*, not impressions. "14/20 → 18/20" is knowledge; "feels better" is weather. When a fix breaks previously-passing cases (it will — prompt whack-a-mole is real), the table catches the regression your eye would miss; Ch 21's regression ritual, now for prompts: every production failure becomes a new golden-set row, permanently.

**Scoring open-ended outputs — three honest tiers.** *Exact/programmatic checks* wherever possible (JSON validates? Required fields present? Length in bounds? Contains the mandatory disclaimer?) — cheap, objective, automate-first. *Human rubric* for quality judgments — you, scoring against written criteria, blind to which prompt produced which output if you can manage it (label-shuffling in a spreadsheet works; your Vol 01 Ch 12 instincts should be tingling — this is inter-rater reliability's kid version). *LLM-as-judge* — a second model call scoring outputs against your rubric: scalable and surprisingly useful, but it inherits model biases (favors verbosity, favors confident tone, can prefer its own style), so calibrate it against your human scores on a sample before trusting it, and never let it be the only judge of anything that matters. All three tiers mature into full machinery in the evaluation domain; here you're building the reflex.

**A/B thinking, and its limits at this scale.** Two prompt variants, same golden set, side-by-side columns — that's an offline A/B, and at n=20, small gaps are noise: treat 15/20 vs 16/20 as a tie; act on decisive gaps or on *which specific rows* flipped (row-level diffs teach more than totals — "variant B fixed all three Hinglish cases but broke the empty-input case" is an actionable sentence). Real statistical A/B testing on live traffic belongs to the production domain; the *thinking* — controlled comparison, defined metric, humility about sample size — starts today and never leaves.

## Why It Matters
Where this appears in real systems and jobs: informal evaluation; A/B thinking begins.

## Hands-On
Formalize what Chapter 4 did informally, on a task you actually care about: your Chapter 6 extractor or your Feynman-bot prompt (Ch 18 — you'll thank yourself). Build a 15-row golden set (typical/hard/edge/adversarial mix), define pass criteria per row, and score three variants: your current prompt, a variant with one *more* few-shot example, and a variant with a tightened FORMAT bone. Produce the full table (rows × 3 variants), circle every row that *flipped* between variants, and write three sentences: which variant wins, which single row taught you the most, and one new row you're adding because this exercise exposed a blind spot. Table + sentences = the note, and the golden set stays in the repo — Chapter 18's build inherits it.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is one run worthless as evidence? Two independent reasons from Volume 01.
2. What belongs in a golden set, and why must it be written before tinkering?
3. Recite the loop, and name the discipline that makes results comparable across runs.
4. Three scoring tiers: strengths, weaknesses, and the calibration rule for the third.
5. Why is 15/20 vs 16/20 a tie, and what's more informative than the totals?


---

# PART III — FIRST SHIPS
*4 chapters. Everything assembles: a chatbot with memory, your first public product, and the ring closes.*

---

## Wikilinks
[[sampling-controls]]
[[few-shot-prompting]]
[[classical-ml-fundamentals]]
[[build-gateway]]
[[injection-first-look]]

## Status log
- Started: 2026-07-21
- Finished: null
