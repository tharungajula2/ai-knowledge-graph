## ELI5
You've built golden datasets (Ch 2), a judge (Ch 3), and trajectory/tool metrics (Chs 5–6) — all by hand, which means you *understand* them (the curriculum's bet, again). Now the node summary: **run current frameworks on my brain-chat.** Eval frameworks package everything you built into reusable tooling — and because you built it bare, you'll see exactly what each framework does, what it does *well*, and where its opinions don't fit yours. This is the build-vs-buy chapter for evals: framework as convenience, never as magic.

## The Real Explanation
**What eval frameworks provide (and you now recognize each piece).** The current landscape (scan on build day — this is frontier-adjacent; names churn: RAGAS for RAG metrics, DeepEval/promptfoo/Braintrust/LangSmith-evals and others) generally packages: *dataset management* (your golden set, Ch 2, with versioning), *built-in metrics* (faithfulness, answer-relevance, context-recall — Vol 03 Ch 18's metrics you built by hand; plus general judge-based scorers, Ch 3), *judge orchestration* (running LLM judges at scale with the biases-and-calibration machinery, Ch 3-4 — though check whether *they* calibrate or just assume), *result tracking* (scores over versions, comparison, dashboards), and *CI integration* (Ch 9). The framework's value is *not doing it yourself* for the standard cases — and its risk is the same as every framework (Vol 04 Ch 5): opinions baked in, decisions hidden, occasional leaks.

**The evaluation-of-the-evaluator — what to check (Ch 5's memory-framework axes, aimed at eval tools).** *Does its judge calibrate, or assume?* (Ch 4 — a framework that ships an uncalibrated judge is shipping fiction with a nice UI; check whether you can validate and pin its judge). *Do its metrics match what you need?* (RAGAS's faithfulness is your Vol 03 Ch 18 metric — good; but does it handle *your* trajectory/tool needs, Chs 5-6, or only answer-quality?). *Can you customize rubrics?* (the node's "customized rubrics" — a framework that only does its built-in metrics can't score *your* specific quality criteria). *Does it own your data?* (Ch 11 — where do your eval results and golden sets live?). *Does it version-pin judges?* (Ch 4 — or do your scores silently drift?). Because you built the primitives, you can *read* each framework's answers to these — you're evaluating from knowledge, not hope.

**Running it on brain-chat — the concrete task.** Take your Vol 03 brain-chat (the RAG system with its own Vol 03 Ch 18 evals) and run a current framework's RAG metrics on it: faithfulness, context-recall, answer-relevance over a golden set. Then the revealing comparison: *your hand-built Vol 03 eval scores vs the framework's scores on the same system and data*. Do they agree? Where they differ, *why*? (Different judge, different metric definition, different calibration — and understanding the difference is worth more than either number alone.) This comparison — your bare-metal understanding checking the framework's black box — is the build's real lesson: frameworks are trustworthy *exactly to the degree you can reproduce and explain their numbers*.

**The build-vs-buy verdict.** After running it: for *your* systems, does the framework earn adoption? It probably does for *standard* metrics at scale (why re-implement faithfulness scoring and result-tracking?) and probably *doesn't* replace your custom needs (trajectory evals for your specific agent, Ch 5; your node-proposer's bespoke criteria). The mature answer, as always (Vol 06 Ch 5): *frameworks for the commodity metrics and infrastructure, custom for the parts unique to your system* — and only having built it bare lets you draw that line correctly.

## Why It Matters
Where this appears in real systems and jobs: run current frameworks on my brain-chat.

## Hands-On
Build it (est. 1 day): pick a current eval framework (scan on build day) → set it up on your brain-chat with a RAG-metrics golden set → run faithfulness/context-recall/answer-relevance → **the comparison**: run your hand-built Vol 03 Ch 18 evals on the same system/data and compare scores → investigate any disagreement (judge? metric definition? calibration?). Then the evaluation-of-the-evaluator: check the framework against the five axes (calibration, metric fit, customization, data ownership, judge pinning) and write the build-vs-buy verdict for your systems. The framework-vs-handbuilt comparison + the axis evaluation + the verdict = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the pieces an eval framework packages, and which of your hand-builds each corresponds to.
2. What five things do you check when evaluating an eval framework, and why can you check them?
3. Why is the hand-built-vs-framework score comparison the build's real lesson?
4. State the framework trustworthiness principle (reproduce-and-explain).
5. Give the build-vs-buy verdict shape — commodity vs custom.


---

## Wikilinks
[[rag-evals-intro]]
[[build-eval-judge]]
[[build-chat-with-my-brain]]
[[memory-frameworks]]
[[judge-bias-pinning]]

## Status log
- Started: 2026-07-21
- Finished: null