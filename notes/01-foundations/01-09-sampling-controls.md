---
id: sampling-controls
title: "Temperature & Top-p"
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
wikilinks: ["what-is-a-language-model", "hallucination", "tokens"]
tags: [foundations]
---

## ELI5
Chapter 3 said the model outputs *probabilities* for the next token — but a probability list isn't a word. Someone must *pick*. The picking rule is called sampling, and its two main dials are **temperature** and **top-p**. Same prompt, different dial settings → a lawyer or a poet. This is why the same question gives different answers on different runs.

## The Real Explanation
**The choice at every single token.** Suppose after "The sky is" the model says: "blue" 60%, "clear" 20%, "dark" 10%, "falling" 2%, ...thousands more tiny ones. Options: always take the top token (**greedy**, temperature 0-ish) — maximally predictable, but repetitive and bland, and one early bad pick can lock in a bad path. Or sample randomly according to the probabilities — livelier, riskier.

**Temperature** reshapes the distribution before sampling. Low temperature (0–0.3) sharpens it — the rich get richer, "blue" climbs toward certainty; output becomes focused and deterministic-ish. High temperature (1.0–1.5) flattens it — underdogs like "falling" get real chances; output becomes creative, surprising, and increasingly unhinged. Mnemonic: cold = crystallized, hot = molecules bouncing everywhere.

**Top-p (nucleus sampling)** is a different philosophy: instead of reshaping, *cut the tail*. Sort tokens by probability, keep the smallest set whose probabilities sum to p (e.g., 0.9), sample only within that nucleus. Its virtue is adaptivity: when the model is confident (one token holds 95%), the nucleus is 1–2 tokens and output stays tight; when the model is genuinely uncertain (flat distribution), the nucleus widens and creativity is allowed *exactly where uncertainty is real*.

**Engineer's settings table (commit to memory):** extraction, classification, code, JSON output, math → temperature 0–0.2 (you want the most probable answer, and you want reruns to agree). General assistant → ~0.5–0.7. Brainstorming, fiction, naming → 0.8–1.2. Convention: tune temperature *or* top-p, not both aggressively. And the fine print that bites people: **temperature 0 still doesn't guarantee bit-identical outputs** across runs on real serving stacks (batching and floating-point nondeterminism) — "deterministic-ish," not notarized.

**Why this matters beyond style.** Reliability engineering (Domain on evaluation) begins here: flaky agent behavior is often just sampling variance; eval suites run at temperature 0 to reduce noise; and "run it 5 times and vote" (self-consistency) is a real technique built on *deliberate* variance.

## Why It Matters
Where this appears in real systems and jobs: why the same prompt gives different answers.

## Hands-On
Get any chat interface with dial access (Google AI Studio's sliders are perfect). One prompt: "Describe the moon in one sentence." Run it 3× at temperature 0, then 3× at 1.2. Record all six outputs in your note. Then one JSON-extraction prompt at both settings — watch high temperature occasionally break your JSON. You now have personal evidence for the settings table.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What exactly does the sampler receive from the model, and what does it return?
2. Explain temperature's effect on the distribution using the rich-get-richer picture.
3. How does top-p adapt to model confidence in a way fixed temperature can't?
4. Fill in from memory: code extraction → T=? · brainstorm → T=? Why does rerun-agreement matter for the first?
5. Why can two temperature-0 runs still differ, and what does that mean for your test suites?


---

## Wikilinks
[[what-is-a-language-model]]
[[hallucination]]
[[tokens]]

## Status log
- Started: 2026-07-21
- Finished: null
