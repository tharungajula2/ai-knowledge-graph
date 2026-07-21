---
id: hallucination
title: "Hallucination"
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
wikilinks: ["what-is-a-language-model", "training-pipeline", "context-windows", "sampling-controls"]
tags: [foundations]
---

## ELI5
Ask a model for a citation and it may invent a paper — plausible authors, plausible journal, plausible year — that has never existed. It isn't lying; lying requires knowing the truth. The model is doing the *only thing it ever does*: producing the most plausible-sounding continuation. Usually plausible and true coincide. **Hallucination is what happens in the gap between them.**

## The Real Explanation
**The mechanical cause — no lookup, only vibes.** Recall Chapter 3's closing sentence: an LM has no database and no truth-checker, only "likely next in text like this." Facts seen thousands of times in training (capital of France) are burned so deeply into the weights that the plausible continuation *is* the truth. Facts seen rarely — or your company's internals, or anything after training ended — have weak or no imprint, but the model *still must emit a next token*, and the objective rewards *fluent* over *silent*. So it interpolates: text shaped exactly like a real answer, unmoored from reality. Crucially, the generation process feels identical from the inside whether the fact is solid or invented — which is why confidence and correctness are uncorrelated, and why "it sounded so sure" is worth nothing.

**The high-risk zones — learn to smell them:** specific citations/URLs/case law; niche or private-domain facts; anything post-cutoff; precise numbers and dates; long chains of reasoning (one early confabulation poisons everything downstream); and questions with false premises ("Why did X buy Y?" — the model would rather explain a fictional acquisition than push back). Also: asking a model *why it* answered something — its introspection is itself a plausible-sounding generation.

**Grounding — the preview of half your brain.** You cannot train hallucination away entirely; the honest fix is architectural: **stop asking the weights to be the database.** Put the true facts *into the context window* and instruct: answer from these documents; if absent, say "not found." Grounded generation transforms the task from "recall from vibes" to "read and synthesize" — which models are dramatically better at. Retrieval-then-generate is exactly Domain 03 (RAG); tool-use ("search instead of guessing") is Domain 05; verifying and measuring groundedness is the evaluation domain; and citations-with-answers is why enterprises will hire you. One concept, four rings of your brain.

**The engineer's posture.** Never ship raw model output as fact in high-stakes flows. Ground it, cite it, verify it, or human-gate it. Your own agent-lab already contains a human-approval gate — you built the posture before you had the vocabulary.

## Why It Matters
Where this appears in real systems and jobs: why models confidently make things up; grounding preview.

## Hands-On
Induce hallucination deliberately (harmless and instructive): ask any model for "5 academic papers on [some hyper-specific niche], with authors and years," then try to find them — expect casualties. Then ask a false-premise question about a fictional event. Finally, re-ask the first question but paste in a real reference text and instruct "only from this document; say NOT FOUND otherwise." Write down the behavioral difference — that difference *is* the RAG value proposition, witnessed personally.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Explain mechanically why hallucination is not a bug but the objective working as designed.
2. Why is the model's confidence uncorrelated with correctness? Use "feels identical from the inside."
3. List five high-risk zones from memory.
4. Define grounding in one sentence, and name the domains of your brain it previews.
5. What does "stop asking the weights to be the database" mean for system design?


---

## Wikilinks
[[what-is-a-language-model]]
[[training-pipeline]]
[[context-windows]]
[[sampling-controls]]

## Status log
- Started: 2026-07-21
- Finished: null
