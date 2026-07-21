## ELI5
Throughout this ring, one phrase has recurred: *every failure becomes a permanent test*. The node summary makes it a build: **every bug becomes a permanent test.** This is the flywheel that makes your eval suite *grow toward reality* — a system where every failure you ever find (in dev, in error analysis, in production) automatically becomes a golden case that guards against that failure forever. Build this loop and your systems get *monotonically more reliable* over time, because the net only ever gets tighter. It's the mechanism that turns the whole ring into a compounding advantage.

## The Real Explanation
**The loop — the regression ritual, automated and universal (Vol 01 Ch 21's "every bug gets a test," now for AI).** The flywheel: (1) *A failure is found* — anywhere: a dev run, error analysis (Ch 19), an online eval (Ch 15), a user report, a trace you were reading (Ch 14). (2) *It becomes a golden case* — captured with its input, its (now-understood) expected behavior, and its category (Ch 2's schema — the failure, formalized as a permanent test). (3) *It enters the golden set* (Ch 2) — versioned, part of the suite forever. (4) *The regression suite now guards it* (Ch 8) — that exact failure can never silently return. (5) *CI gates on it* (Ch 9) — a change that reintroduces it can't merge. Result: **your eval coverage grows toward the shape of reality's failures**, driven by the failures themselves — and a failure fixed is a failure fixed *forever*, not a failure that quietly returns three refactors later.

**Why this is the ring's most important loop.** Every other eval technique is a *snapshot* of quality; this loop is the *ratchet* that makes quality monotonically improve. Without it: you fix a bug, it regresses months later, you fix it again (Sisyphus). With it: you fix a bug once, it's guarded forever, and every future failure adds another permanent guard — the suite *compounds*. Over a year, your golden set becomes a dense map of *your system's actual failure modes* (not the ones you imagined at launch — Ch 2's limitation, cured by reality), and passing it means genuinely not-failing in all the ways you've ever seen. This is how mature AI systems become reliable: not by being perfect at launch, but by *never repeating a failure* — the loop is the discipline that guarantees it.

**The build — automating the capture.** The friction to eliminate: turning a failure into a golden case must be *easy* or it won't happen (a loop with high friction doesn't spin). So build: a `capture_failure` tool/command that takes a failing case (from the harness, from a trace, from a manual report), helps you articulate the expected behavior (an LLM can *assist* — "here's what went wrong; what should have happened?"), formats it as a golden case (Ch 2's schema), and adds it to the versioned set — one command from "found a failure" to "permanently guarded." Plus *deduplication* (Ch 19's categorization — don't add 10 golden cases for one root cause; add one good case per distinct failure mode — the loop should grow *coverage*, not *redundancy*), and *provenance* (where did this case come from — dev/prod/analysis — Ch 11's versioning, so the golden set's growth is traceable).

**The connection to everything — the ring's integration point.** This loop *is* the ring's flywheel, and it connects every part: error analysis (Ch 19) feeds it (categorized failures become cases), online evals (Ch 15) feed it (production failures become cases), tracing (Ch 14) feeds it (a debugged failure becomes a case), the harness (Ch 18) runs the growing suite, and CI (Ch 9) enforces it. Build this loop and you've *closed the eval ring* — a self-improving quality system where reality continuously teaches your evals what to guard, and your evals continuously prevent reality's failures from recurring. That's not a testing suite; it's a learning system for reliability.

## Why It Matters
Where this appears in real systems and jobs: every bug becomes a permanent test.

## Hands-On
Build the loop (est. 1 day): the `capture_failure` command (failing case + LLM-assisted expected-behavior articulation + Ch 2 golden-case formatting + versioned-set insertion + dedup against existing cases + provenance) → wire it to your Ch 18 harness (harness-found failures → one-command capture) and your Ch 14 traces (debugged failure → capture). Then *use it*: take the 20 failures from your Ch 19 error analysis, capture the distinct-root-cause ones as golden cases (deduplicated), watch your golden set grow toward your system's real failure modes, and confirm the regression suite (Ch 8) now guards them. Tag `eval-v1.1`. The capture tool + the grown golden set (before/after case count and coverage) + one previously-recurring failure now permanently guarded = the note. The ring's flywheel, spinning.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Walk the five-step failure→golden loop, naming the chapter each step draws on.
2. Why is this the ring's most important loop — snapshot vs ratchet?
3. Why must failure-capture be low-friction, and what does the build automate?
4. Why deduplicate by root cause when adding cases, and what does the loop grow?
5. How does this loop connect error analysis, online evals, tracing, the harness, and CI into one system?


---

## Wikilinks
[[build-golden-dataset]]
[[prompt-regression-tests]]
[[error-analysis-practice]]
[[online-evals]]
[[ci-gates-for-ai]]
[[python-craft-professional]]

## Status log
- Started: 2026-07-21
- Finished: null