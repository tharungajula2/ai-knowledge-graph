## ELI5
The brain-chat works — you've watched it work. Now prove it, with numbers, the way Ch 16 taught: **a mini golden set, faithfulness scored** (the node summary, verbatim). This build turns last chapter's product into a *measured* product — and hands you the instrument that will referee every future change to it. From here forward, "I improved the brain-chat" is a claim with a before/after table attached, or it's weather.

## The Real Explanation
**The golden set — 20 rows, authored with care (the build's real labor).** Sources: your labeled inspection sessions (Chs 5, 7, 17 — the whole volume has been quietly composing this set; now you see why every hands-on said *keep the labels*). Composition, deliberately spread (Vol 02 Ch 16's coverage logic): ~8 straightforward single-hop across ≥4 domains, 3 vocabulary-mismatched (Ch 13's customers), 2 filter-dependent, 2 conversational follow-up pairs (the rewriter gets evaluated too — eval the *system*, not just the happy path), 3 out-of-corpus (expected: honest refusal — refusal calibration is a measured behavior, per Ch 11), 2 multi-hop-flavored (expect these to score poorly today — *baselines are allowed to have known weaknesses; unmeasured weaknesses are the sin*). Per row: question, expected-relevant chunk ids (you label them — ground-truth authorship, Ch 16's hard-won feeling), expected-answer notes or refusal flag, and history for the follow-up rows. Version the file in the repo beside the code it judges.

**The harness — `python -m braineval run`.** Per row: execute the full stack (rewrite → retrieve → generate), then compute: **context recall & precision** (retrieved ids vs your labels — pure set arithmetic, pure functions, pytest-perfect); **faithfulness** — per claim in the structured answer (Ch 10's schema, cashing in exactly as promised), an LLM-as-judge call via your gateway: *"Context: [cited chunks]. Claim: [text]. Does the context support the claim? SUPPORTED / PARTIAL / UNSUPPORTED, one line of reasoning."* — structured output, temperature 0, cheap model; faithfulness = supported/total; **refusal correctness** on the out-of-corpus rows (refused when it should = pass; answered = fail, and flag *what* it invented); **answer relevance** — judge call, 1–5 rubric. Output: per-row table + aggregate scores + per-slice breakdowns (the vocabulary-miss slice scored separately — slices localize weakness; aggregates hide it) → `eval_report.md`, timestamped, committed. Cost note in the report: an eval run is ~20×(stack + judge) calls — price it with the ledger; knowing what measurement costs is part of measurement.

**Calibrate the judge — the step that separates rigor from theater (Ch 16's iron caveat, enacted).** Before trusting any aggregate: take 15 claim-judgments from the first run, judge them *yourself* blind (cover the model's verdicts), compute agreement. ≥80% → trust with eyes open; below → tighten the judge prompt (few-shot examples of SUPPORTED vs PARTIAL — Vol 02 Ch 4, aimed at judging) and re-calibrate. Record the agreement number *in the report* — an eval that reports its own reliability is an eval an interviewer believes.

**Then: close one loop, whole.** Run the baseline → read the slice breakdowns → pick the *worst slice* → apply this volume's targeted fix (vocabulary slice weak → enable multi-query/HyDE for it; precision weak → rerank harder or k down; faithfulness weak → tighten the grounding prompt) → **change one thing** → re-run → before/after table. Whatever the numbers say — improvement, regression, nothing — you have now run the complete engineering loop this curriculum has been building toward since Vol 02 Ch 16: *measure, change once, re-measure, decide by evidence.* That loop, not any single score, is the artifact.

## Why It Matters
Where this appears in real systems and jobs: mini golden set; score faithfulness.

## Hands-On
Author the set (budget half the build here — labeling is the work) → harness → calibration → baseline run → the one-change loop → both reports committed. Tests: metric arithmetic on hand-computed fixtures; judge-output parsing; refusal-scoring both directions. Tag `brain-eval-v1.0`. In the note: the baseline table, the calibration number, the before/after table, and one honest paragraph: what your brain-chat is actually good at, weak at, and what you chose *not* to fix yet and why. That paragraph is Ch 20's capstone post, half-written.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Defend the golden set's composition — why each slice exists and what each measures.
2. Why must expected *chunks* be labeled, not just expected answers? Which metrics die without them?
3. Walk the faithfulness computation end to end, naming the Ch 10 structure it consumes.
4. What does judge calibration protect against, and why does reporting the agreement number matter?
5. Describe your one-change loop: slice, hypothesis, fix, numbers, decision. Defend the decision.


---

## Wikilinks
[[rag-evals-intro]]
[[build-chat-with-my-brain]]
[[citations-grounding]]
[[prompt-quality]]
[[classical-ml-fundamentals]]

## Status log
- Started: 2026-07-21
- Finished: null