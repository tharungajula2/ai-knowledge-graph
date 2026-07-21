---
id: map-of-ai
title: "The Map of AI"
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
wikilinks: ["how-machines-learn", "what-is-a-language-model", "classical-ml-fundamentals"]
tags: [foundations]
---

## ELI5
Imagine a set of Russian nesting dolls. The biggest doll is **AI**: any machine doing something that looks smart. Open it and you find **Machine Learning**: machines that get smart by *studying examples* instead of following hand-written rules. Inside that, **Deep Learning**: machine learning done with huge layered networks loosely inspired by brains. Inside that, **Generative AI**: deep learning models that don't just *classify* things but *create* things — text, images, code. And the smallest, newest doll is **Agentic AI**: generative models that can *take actions* — call tools, browse, write files — in a loop, to pursue a goal.

## The Real Explanation
The distinctions that actually matter to an engineer:

**Rules vs learning.** Classical AI (1950s–1990s flavor) is `if/else` at heroic scale: chess engines with hand-coded evaluation, expert systems with thousands of human-written rules. It breaks the moment the world presents a case nobody wrote a rule for. Machine Learning flips the arrow: instead of *rules + data → answers*, you feed the machine *data + answers → rules*. The machine derives the rules itself, as numbers.

**Why deep learning ate everything.** Pre-deep-learning ML required humans to design "features" — a human decided that for spam detection, the useful signals are "number of exclamation marks" and "mentions of money." Deep learning's superpower is that the network *learns its own features* from raw data. Feed it raw pixels or raw text; the early layers discover edges or word-parts, middle layers discover shapes or phrases, late layers discover faces or meaning. Nobody designs the ladder — it emerges from training.

**What makes a model "generative."** A classifier maps input → label (spam / not spam). A generative model learned the *distribution* of the data deeply enough to produce new samples from it. For language models: given text so far, produce a plausible next piece — repeated, this *writes*.

**What elevates a generative model to an "agent."** One thing: **the loop**. A chatbot is one pass: prompt in, text out, done. An agent takes the model's output, treats parts of it as *actions* (call this API, run this search), executes them, feeds the *results* back in, and asks the model again — until the goal is met. Model + tools + loop + goal = agent. You will spend all of Domain 05 inside that loop.

The nesting is strict: every agent uses GenAI, all serious GenAI is deep learning, all deep learning is ML, all ML is AI. The reverse directions are all false.

## Why It Matters
Where this appears in real systems and jobs: AI vs ML vs DL vs GenAI vs Agentic — the family tree.

## Hands-On
Open your Vizier dashboard (you built the perfect artifact for this chapter). Hover the rings from `foundations` outward and narrate out loud where each domain sits in the nesting dolls: which rings are "just ML," where generation enters, where agency enters. Then draw the nested-circles diagram on paper, from memory, with one real product example living in each band (e.g., a thermostat rule, a spam filter, image recognition, ChatGPT, an autonomous coding agent).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What is the fundamental difference between classical rules-based AI and Machine Learning?
2. How does Deep Learning bypass manual feature engineering?
3. Define "next-token prediction" in the context of Generative AI.
4. What is the key characteristic that elevates a generative model to an "agent"?
5. Sketch the nested relationship of AI, ML, DL, GenAI, and Agents.


---

## Wikilinks
[[how-machines-learn]]
[[what-is-a-language-model]]
[[classical-ml-fundamentals]]

## Status log
- Started: 2026-07-21
- Finished: null
