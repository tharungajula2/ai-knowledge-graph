## ELI5
You've now built memory from first principles (Chs 1–4) — which means you're finally qualified to *evaluate* the frameworks that package it, because you know what they're packaging. The node summary hedges honestly: **the current landscape when I light this node.** This chapter isn't a product review (those rot in months); it's the permanent set of questions to ask any memory framework, so that whatever won by the time you read this, you can judge it against what you'd build yourself.

## The Real Explanation
**Axis 1 — What does it actually abstract, and did you need the abstraction?** Every memory framework claims to handle extraction, storage, retrieval, and decay for you. The question (having built all four): does its abstraction *match* the architecture you now understand, or does it hide decisions you need to control? Good frameworks expose the knobs (which extraction strategy, which scoring weights, which decay policy — Chs 3–4); opinionated ones make the choices for you (convenient until their choice is wrong for your case). The curriculum's recurring bet pays off here: *because you built it bare, no framework can be magic, and you can read exactly what each one decided for you.*

**Axis 2 — Where does it store, and do you own it?** Memory is *your users' data* (or your own — your brain). Questions: does it use your infrastructure (your Postgres — you own it, you can audit/delete/comply) or a managed service (convenient, but your users' memories live on someone else's servers — a privacy and compliance question, Ch 8)? Can you inspect and export the stored memories, or are they opaque? Lock-in matters more for memory than for most things, because migrating a populated memory store is far harder than swapping a stateless library.

**Axis 3 — What's its memory model, and does it match the taxonomy?** Some frameworks are just "vector store + auto-extraction" (semantic memory only — Ch 1's three types collapsed to one); others model episodic/procedural distinctions, temporal facts (Ch 12), or graph relationships (Part II). Evaluate against the taxonomy you built: does its model capture what your use needs, or force everything into one shape? A framework that only does semantic facts can't remember *how* you like things done (procedural) — a real limitation for a personalized assistant.

**Axis 4 — How does it handle the hard problems you now know are hard?** The tells that separate serious frameworks from demos: Does it *reconcile* conflicting/updating memories or just accumulate (Ch 3's redundancy, Ch 12's temporal problem)? Does it *forget* — decay, compaction, deletion (Ch 4)? Does it support *hard deletion for privacy* (Ch 8 — a "forget me" that actually works)? Does it handle *retrieval scoring beyond similarity* (Ch 4's importance/recency)? A framework silent on these is a junk drawer with a nice API. You know to ask because you built the answers.

**Axis 5 — Maturity, adoption, and the build-vs-buy honest call.** Memory frameworks are young; APIs churn, some are thin wrappers, some are genuinely deep. The senior judgment (Vol 05 Ch 14's protocol instinct, Vol 01 Ch 11's benchmark skepticism): is this shipped-and-adopted or announced-and-hyped? And the build-vs-buy call *you're now equipped to make honestly*: you've built a working memory system in four chapters — for many uses, *your own* Postgres-backed memory (Chs 1–4) is simpler, more controllable, and more private than any framework, and the framework earns adoption only when it does something genuinely hard (scale, sophisticated graph memory, battle-tested reconciliation) better than you'd build in reasonable time. Sometimes the right answer is "I already built what I need"; sometimes it's "this does the temporal-graph reconciliation I don't want to build" — and only having built the basics lets you tell which.

## Why It Matters
Where this appears in real systems and jobs: the current landscape when I light this node.

## Hands-On
Run the frontier-scan (Rule 7): (1) Search the *current* memory-framework landscape — the leading libraries/services now, what each claims, who's adopting. (2) Build the evaluation table with the five axes as columns and each live framework as a row — abstraction fit, storage/ownership, memory model vs taxonomy, hard-problem handling, maturity. (3) The build-vs-buy verdict for *your* systems: does any framework beat your Chs 1–4 memory layer for your research agent, and *specifically what* would it have to do better to be worth adopting? Date-stamp it (this snapshot rots; the next reader may be you, re-scanning at a replan). (4) The honest self-check: list three things your hand-built memory does *well* and two things a mature framework would likely do *better* — the boundary of your build-it-yourself competence, named.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the five evaluation axes as questions to ask any memory framework.
2. Why does having built memory bare make you a *better* framework evaluator?
3. Why does storage ownership matter more for memory than for stateless libraries?
4. Name three "hard problem" tells that separate serious frameworks from demos, and why you know to ask.
5. Frame the build-vs-buy call honestly — when is your own layer the right answer?


---

## Wikilinks
[[build-memory-taxonomy]]
[[retrieval-and-decay]]
[[temporal-knowledge]]
[[model-landscape]]
[[build-memory-layer]]

## Status log
- Started: 2026-07-21
- Finished: null