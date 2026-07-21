---
id: ci-gates-for-ai
title: "CI Gates for AI"
domain: evals-observability
ring: 7
cluster: "Measuring Quality"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["prompt-regression-tests", "git-mastery", "build-eval-judge", "judge-bias-pinning", "build-eval-harness"]
tags: [evals-observability]
---

## ELI5
Your regression suite (Ch 8) catches breakage — *if you remember to run it*. The node summary removes the "if": **evals as merge blockers.** CI gates make eval-passing a *requirement* for shipping — a bad change literally cannot merge. This is how mature software teams enforce quality on deterministic code (tests must pass to merge), adapted to the non-deterministic reality of AI. It's the discipline that turns "we should test our prompts" into "we can't ship untested prompts," and it's a hallmark of a serious AI engineering team.

## The Real Explanation
**What a CI gate is.** Continuous Integration (Vol 01 Ch 19's Git world, extended): every proposed change (a pull request) automatically triggers a pipeline of checks, and the change can only merge if they *pass*. For normal code: run the tests, run the linter, check types — green or no merge. For AI: run the *evals* — the regression suite (Ch 8), the golden-set scores (Ch 2-3), the trajectory/tool metrics (Chs 5-6) — and gate the merge on the results. A prompt change that drops faithfulness below threshold, or regresses a critical case, *fails the gate and cannot ship*. Quality becomes structural, not optional (the "security is architecture" lesson, Vol 04 Ch 15, now "quality is pipeline").

**The AI-specific challenges — why this isn't just "run tests in CI".** *Non-determinism vs pass/fail* (Ch 1): a deterministic test is green or red; an eval produces a *score*, so the gate needs a *threshold* ("faithfulness ≥ 0.85 to merge") — and thresholds need judgment (too strict blocks good changes on noise; too loose lets regressions through; set them from your baseline + a noise margin, Vol 02 Ch 16's "15/20 vs 16/20 is a tie" wisdom, encoded). *Cost*: evals cost money (judge calls — Vol 04 Ch 17) and time (LLM latency); running the full eval suite on every commit can be slow and expensive, so teams *tier* — fast cheap programmatic checks (Ch 8's frozen behaviors) on every commit, the full judge-scored suite on PRs or nightly (the routing instinct, applied to CI). *Flakiness*: non-determinism means an eval can fail once and pass on retry (sampling variance) — gates need noise-tolerance (run at temperature 0, average multiple runs for critical metrics, or use statistical thresholds — not a single flaky number deciding a merge). *Judge drift* (Ch 4): a floating judge makes the gate's threshold meaningless over time — pin it.

**What to gate on — the pragmatic tiers.** *Hard gates* (block merge): critical-case regressions (a previously-passing important case now fails — Ch 8's flip list), structural failures (invalid output, missing refusals — the cheap programmatic freezes), and metric floors (faithfulness/quality below the established threshold). *Soft gates* (warn, don't block): minor score dips within noise, non-critical case flips — surface them for human judgment rather than auto-blocking (over-strict gates train people to bypass them — the approval-fatigue lesson, Vol 04 Ch 7, at the CI layer). *Informational* (report, no gate): full metric dashboards on the PR so the reviewer *sees* the eval impact of the change. The art is gating hard on what must not break while not blocking the whole team on noise.

**Why this is the senior culture signal.** A team with CI eval gates *cannot* silently ship a regression — the discipline is structural. A team without them ships on vibes and discovers regressions from user complaints. Building CI gates (even for your solo project) demonstrates you think about AI quality the way senior teams do: *systematically, enforced, at the pipeline level*. It's also the capstone of the "measure, don't believe" mindset (Ch 1) — the gate is that mindset made unskippable, and putting "eval-gated CI for prompt changes" on your work is a loud senior signal.

## Why It Matters
Where this appears in real systems and jobs: evals as merge blockers.

## Hands-On
Design and prototype (concept node, concrete): (1) Wire your Ch 8 regression suite into a real CI pipeline (GitHub Actions is the natural choice — Vol 01 Ch 19's world) that runs on every push to a branch: the fast programmatic freezes as hard gates, the judge-scored golden set on PRs. (2) Set thresholds from your baseline + noise margin, and *test the gate*: make a change that regresses a critical case, open a PR, watch the gate *block the merge* — the enforcement, witnessed. (3) Design the tiering: write which checks are hard gates vs soft vs informational, and the cost/time budget for each tier (fast-on-commit vs full-on-PR vs nightly). The working gate + the blocked-merge demo + the tiering design = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What is a CI eval gate, and how does it make quality structural?
2. Name the four AI-specific challenges (thresholds, cost, flakiness, judge drift) and one mitigation each.
3. Distinguish hard/soft/informational gates, and why does over-strict gating backfire?
4. How do you set a threshold, and why is "15/20 vs 16/20 is a tie" relevant?
5. Why is eval-gated CI a senior culture signal?


---

# PART II — MLOPS & MODEL LIFECYCLE
*3 chapters. The broader ML engineering context: experiment tracking, data versioning, and serving patterns — the classical MLOps foundations your LLM work sits on.*

---

## Wikilinks
[[prompt-regression-tests]]
[[git-mastery]]
[[build-eval-judge]]
[[judge-bias-pinning]]
[[build-eval-harness]]

## Status log
- Started: 2026-07-21
- Finished: null
