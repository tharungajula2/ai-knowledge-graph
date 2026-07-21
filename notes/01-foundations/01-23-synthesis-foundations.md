---
id: synthesis-foundations
title: "Synthesis: The Foundations Map"
domain: foundations
ring: 1
cluster: "Consolidation"
type: synthesis
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: []
tags: [foundations]
---

## ELI5
The Feynman test, final form: explain "how an LLM works," end to end, to a 12-year-old — no jargon unearned, no hand-waving where it counts, under five minutes. Chapters 1–13 gave you thirteen puzzle pieces; this chapter is assembling them into **one picture you can draw on a napkin** — because in interviews, on LinkedIn, and to yourself at 2 a.m., the napkin version is the one that matters.

## The Real Explanation
Text is chopped into **tokens** [4]. Each becomes a vector, and through stacked layers of **attention** — every token consulting every other token about what matters [6] — the model builds a rich in-context understanding, the mature form of the **embedding** idea, meaning-as-geometry [5]. The whole machine is billions of **weights** tuned by **gradient descent**: guess, measure the **loss**, nudge everything slightly less wrong, repeat at internet scale [2] — first in **pretraining** (predict the next token across the whole internet [3, 7]), then shaped by **fine-tuning** and **RLHF** into an assistant [7]. At runtime everything must fit the **context window**, the whiteboard that is the model's only memory [8]; the model emits probabilities and a **sampler** — temperature, top-p — picks each next token [9]. It optimizes *plausible*, not *true*, so where knowledge is thin it **hallucinates**, which is why we ground it with retrieval and tools [10]. Which model to run is a landscape question — open vs closed, frontier vs small, routed by cost [11]. And the whole edifice stands on classical ML's laws — generalization, honest evaluation, precision/recall [12] — at the end of a lineage that traded counts for meaning, meaning for context, context for parallel attention [13].

## Why It Matters
Where this appears in real systems and jobs: explain "how an LLM works" to a 12-year-old, end to end.

## Hands-On
Three renditions, escalating compression: **(a)** The 12-year-old script, written out, ≤600 words, every technical term introduced with a picture (whiteboard, bricks, blindfolded hiker...). **(b)** The napkin: one hand-drawn diagram — tokens → embeddings → attention stack → probabilities → sampler → text, with training as an arrow from above and the context window as a box around runtime. Photograph it into the note. **(c)** The 60-second version, spoken aloud to a phone recorder, jargon-free. If a real 12-year-old (or a patient non-technical friend) is available, deliver (a) live and record the questions they ask — their confusion is your map of what to re-study. Any chapter you couldn't compress: reopen it before lighting this node.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Deliver the 60-second version cold, right now.
2. Which chapter was hardest to compress, and what does that tell you?
3. A 12-year-old asks: "but where does it *keep* what it knows?" Answer in two sentences (weights vs context — the two memories).
4. A senior engineer asks the same question. Answer again, precisely, in two sentences.
5. Draw the napkin from memory.


---

## Wikilinks
[[synthesis-foundations]]

## Status log
- Started: 2026-07-21
- Finished: null
