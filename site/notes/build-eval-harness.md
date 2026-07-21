## ELI5
This ring built eval *pieces* — golden sets, judges, trajectory metrics, tool metrics, regression, tracing. The node summary unifies them: **trajectory + judge + regression around the node-proposer, one command.** An eval harness is the *integrated system* that runs all your evals on a target system with a single command and produces a complete quality report. This is the ring's engineering summit — the harness that makes evaluating your node-proposer (Vol 04 Ch 18, the M2 seed) as easy as running a test suite, and the infrastructure that makes eval-driven development (Ch 21) *practical* rather than aspirational.

## The Real Explanation
**Why the node-proposer as the target.** The node-proposer (Vol 04 Ch 18) is your most complex agent — it surveys your brain, scans the frontier, and proposes nodes through a gate. It's *also* the highest-stakes to get right (it shapes your curriculum's growth — M2, The Bridge). And it's never been rigorously evaluated (you built it before this ring). Perfect target: complex enough to need every eval type, important enough to justify the harness, and un-measured enough that the harness will *find real problems*. Evaluating it also protects your brain's integrity — a node-proposer that proposes bad nodes, un-caught, degrades your curriculum.

**The harness architecture — integration of the ring (every piece cashing in).** `python -m evalharness run --target node-proposer` executes:
1. *Load the golden set* (Ch 2 — for the node-proposer: golden cases of "given this brain state + frontier findings, good proposals look like this," with expected proposal properties — connected, non-duplicate, correctly-formatted, well-scoped).
2. *Run the target* on each case, *with tracing* (Ch 13 — capture full trajectories: survey → scan → propose → gate).
3. *Score with the judge* (Ch 3 — calibrated, pinned per Ch 4 — proposal quality against rubrics: is the proposal well-connected? correctly-sized? genuinely novel? well-justified?).
4. *Trajectory + tool metrics* (Chs 5-6 — did it survey efficiently? use the researcher-subgraph correctly? did the frontier scan run? — the *path* quality, not just the proposals).
5. *Regression check* (Ch 8 — diff against the last baseline: did this change to the node-proposer improve or regress proposal quality?).
6. *Report* — a unified quality report: per-case scores, aggregate metrics, per-slice breakdowns, trajectory/tool scorecards, regression diff, cost/latency (Ch 17), and the judge's calibration number (Ch 4 — the report certifies its own trustworthiness). One command → complete picture.

**The engineering standards — L-node rigor.** Every eval component behind a clean interface (swap judges, add metrics without rewiring — Vol 04 Ch 10's boundaries); config-driven (which golden set, which judge version, which thresholds — one config, Vol 01 Ch 21); reproducible (pin everything — Ch 11: prompt version, judge version, golden-set version, all logged in the report so the eval is itself reproducible — evaluating the evaluator's reproducibility, the deepest rigor); fast enough to run often (tier the checks — Ch 9 — fast programmatic on every run, full judge-scored on demand); and *itself tested* (the harness's metric computations get pytest — an eval harness with buggy math produces confident lies, so the meta-tests matter most). This is your Vol 03 Ch 18 brain-eval, generalized into reusable infrastructure that any of your systems can plug into.

**Verification.** Run it on the node-proposer end to end: the report generates in one command; all metric types appear and compute correctly (reconcile against hand-computation on a case); the regression diff works (baseline, change, re-run, diff); the trajectory captures the proposer's full path; the judge's calibration is reported. Then the payoff: the harness *finds a real problem* with your node-proposer (it will — un-evaluated complex agents always have issues: maybe it over-proposes, or its proposals cluster in one domain, or its frontier scan is weak) — and *that finding* is the harness proving its worth. Fix the problem, re-run, watch the report confirm. Tag `eval-v1.0` — the harness is your permanent quality infrastructure.

## Why It Matters
Where this appears in real systems and jobs: trajectory + judge + regression around the node-proposer, one command.

## Hands-On
Build it (est. 2-3 honest days): the harness skeleton with pluggable eval components → golden set for the node-proposer → integrate judge (Ch 3), trajectory+tool metrics (Chs 5-6), regression (Ch 8), tracing (Ch 13), cost/latency (Ch 17) → the unified report generator → config-driven, reproducible, meta-tested → run on the node-proposer → *find and fix a real problem it surfaces*. Tag `eval-v1.0`. The one-command report + the real problem it found + the fix-and-reverify = the note. This harness evaluates every system you build from here forward.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is the node-proposer the right harness target — complexity, stakes, and un-measured-ness?
2. Walk the harness's six stages, naming the chapter each integrates.
3. What does "the report certifies its own trustworthiness" mean — which numbers appear?
4. Why must the harness itself be tested, and what does buggy eval math produce?
5. What real problem did the harness find in your node-proposer, and how did you fix it?


---

## Wikilinks
[[build-node-proposer]]
[[build-golden-dataset]]
[[build-eval-judge]]
[[trajectory-evals]]
[[build-tracing-instrumentation]]
[[failure-to-golden-loop]]

## Status log
- Started: 2026-07-21
- Finished: null