---
id: build-eval-judge
title: "Build: LLM-as-a-Judge Scorer"
domain: evals-observability
ring: 7
cluster: "Measuring Quality"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["rag-evals-intro", "build-golden-dataset", "judge-bias-pinning", "structured-output", "reflection-patterns"]
tags: [evals-observability]
---

## ELI5
Your golden set (Ch 2) has 20 cases with rubric expectations — but who *scores* the agent's answers against those rubrics? Doing it by hand for every eval run doesn't scale (you'll run evals hundreds of times). The node summary: **build an LLM-as-a-judge scoring engine using customized rubrics, confidence metrics, and golden dataset assertions; verify by scoring 20 generated agent responses.** An LLM judges another LLM's output against your criteria — powerful, scalable, and *dangerous if you trust it blind* (Ch 4). This build makes the judge, and makes it trustworthy through calibration.

## The Real Explanation
**The judge — an LLM scoring against a rubric.** The core call (your gateway, structured output — the pattern, one more time): given the input, the agent's output, and the case's rubric, score it.
```python
class JudgeVerdict(BaseModel):
    score: float                    # e.g. 0-1 or a rubric-point tally
    per_criterion: dict[str, bool]  # which rubric criteria were met — granular, not just a number
    reasoning: str                  # WHY this score — auditable, and forces the judge to think (Vol 02 Ch 5)
    confidence: Literal["high","medium","low"]  # the node's "confidence metrics"
```
Design that matters: *per-criterion breakdown* (not a mysterious 0.7 but "cited sources: ✓, addressed all parts: ✗, honest about gaps: ✓" — granular scores are debuggable and actionable, aggregate scores are opaque); *reasoning before score* (Vol 02 Ch 5 — making the judge explain forces genuine evaluation over gut-guessing, and gives you an audit trail); *confidence* (the judge flagging its own uncertainty — low-confidence verdicts get human review, Ch 4); *rubric injected per case* (Ch 2's `expected` criteria become the judge's checklist — customized per case, the node's "customized rubrics"). Temperature 0 (Vol 01 Ch 9 — you want consistent scoring, and eval convention).

**The calibration imperative — the step that makes the judge trustworthy (and the step everyone skips).** An uncalibrated judge is a random number generator with good grammar. Before trusting *any* aggregate the judge produces, you must measure whether it agrees with *you*: (1) score N responses yourself, by hand, blind to the judge's verdicts; (2) run the judge on the same N; (3) compute agreement (exact, or within-tolerance for continuous scores). ≥80% agreement → trust the judge with eyes open; below → the judge is miscalibrated, and you fix it (tighter rubric, few-shot examples of correct scoring — Vol 02 Ch 4 aimed at judging, clearer criteria definitions) and re-calibrate until it agrees. **Report the agreement number alongside every eval** (Vol 03 Ch 18's discipline, now law) — an eval whose judge you haven't validated is a number you made up. This is the single most important idea in the chapter: *the judge is a measurement instrument, and unvalidated instruments produce fiction.*

**Golden dataset assertions — where judge meets ground truth (the node's phrase).** For cases with *objectively* checkable expectations (a required fact present, a source cited, valid JSON), skip the judge and *assert programmatically* (cheaper, objective, no judge-bias — Vol 02 Ch 16's tier 1). Reserve the LLM judge for the *quality* judgments programmatic checks can't make (is the synthesis coherent? is the tone right? is the reasoning sound?). The mature scorer is *hybrid*: programmatic assertions for the checkable, LLM judge for the qualitative, human review for the low-confidence and the high-stakes. Don't LLM-judge what a regex can verify.

**Verification — score 20 responses, per the node.** Generate 20 responses from your research agent on the golden set (Ch 2), run the judge, and: verify per-criterion breakdowns are sensible; *calibrate* (score 15 yourself, measure agreement, report it — the mandatory step); confirm programmatic assertions catch the objectively-checkable; confirm low-confidence flags surface genuinely-ambiguous cases. Then the bias probe (Ch 4 preview): give the judge two answers — one correct-but-terse, one wrong-but-eloquent — and see if it favors the eloquent one (it often does; that's Ch 4's whole subject, met early).

## Why It Matters
Where this appears in real systems and jobs: Build an LLM-as-a-judge scoring engine using customized rubrics, confidence metrics, and golden dataset assertions; verify by scoring 20 generated agent responses.

## Hands-On
Build it (est. 1 day): the `JudgeVerdict` schema → the rubric-injected judge prompt (reasoning-before-score, per-criterion, confidence) → hybrid scoring (programmatic assertions + LLM judge) → run on 20 agent responses → **calibrate** (hand-score 15, measure and report agreement, fix if <80%) → the bias probe. Then the honest artifact: your first *validated* eval score for your research agent, with its calibration number attached. Tag `eval-v0.2`. The scored results + the calibration agreement + the bias-probe result = the note; this judge scores every eval from here on, and its calibration number is its license to be trusted.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What does a good judge verdict contain beyond a score, and why does each field matter?
2. Explain the calibration procedure and the 80% threshold — what does an uncalibrated judge produce?
3. Why report the agreement number with every eval?
4. When do you use programmatic assertions vs the LLM judge? Give the hybrid rule.
5. Describe the eloquent-but-wrong bias probe and what it previews.


---

## Wikilinks
[[rag-evals-intro]]
[[build-golden-dataset]]
[[judge-bias-pinning]]
[[structured-output]]
[[reflection-patterns]]

## Status log
- Started: 2026-07-21
- Finished: null
