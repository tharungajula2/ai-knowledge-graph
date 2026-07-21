## ELI5
You've tuned a prompt to perfection (Vol 02 Ch 16). Weeks later, you tweak it to fix one edge case — and silently break three cases that used to work. You won't notice until a user does. The node summary: **freeze behavior; catch silent breakage.** Prompt regression tests are the safety net that makes prompt-editing *safe* — the same way unit tests made code-refactoring safe (Vol 01 Ch 21). This small build installs the reflex that lets you change prompts fearlessly, because breakage gets caught the instant it happens, not in production.

## The Real Explanation
**The regression problem, AI edition.** In deterministic code, a regression test asserts `f(x) == known_good` and catches any change that breaks it. Prompts have the same regression risk — a change that fixes case A breaks case B (prompt whack-a-mole, Vol 02 Ch 16, is *real* and *invisible* without tests) — but the non-determinism wall (Ch 1) means you can't `assert output == frozen_string`. So a prompt regression test *freezes behavior* differently: it asserts the output still *satisfies the same criteria* it used to (via your judge, Ch 3, or programmatic checks) on a *frozen set of cases* — catching when a change drops a previously-passing case below its bar.

**The mechanism — golden set as regression suite.** Your golden dataset (Ch 2) *is* your regression suite: (1) establish a *baseline* — run the current prompt, record which cases pass and their scores; (2) on any prompt change, *re-run the whole set*; (3) *diff* against baseline — which cases *flipped* (passing → failing is a regression; failing → passing is a fix); (4) the change ships only if the net is positive *and* no critical case regressed (a fix that breaks an important case is not a fix). The key output isn't the aggregate score — it's the *per-case flip list* (Vol 02 Ch 16's row-level diffs, now automated): "this change fixed the 2 vocabulary cases but broke the empty-input case" is the actionable sentence, and only per-case tracking surfaces it.

**Freezing behavior for the deterministic parts.** Some prompt behaviors *can* be frozen exactly (Vol 02 Ch 6): does it still return valid JSON? Does it still include the required disclaimer? Does it still refuse the out-of-scope case? These are `assert`-able (programmatic, no judge, no non-determinism at temperature 0 for the checkable structural properties) — freeze them hard as fast, cheap, deterministic regression guards. Reserve the judge (Ch 3) for the quality regressions that need it. A good regression suite is mostly cheap programmatic freezes plus a few judge-scored quality checks.

**Why this is the bridge to CI (Ch 9).** A regression suite that runs on demand is useful; one that runs *automatically on every change* is transformative — it moves quality-checking from "something you remember to do" to "something that can't be skipped" (Ch 9's CI gates). The regression suite is the *content*; CI is the *enforcement*. Build the suite here; wire it into merge-blocking next chapter. Together they're how AI systems stop silently rotting: every change is measured against frozen behavior before it can ship.

## Why It Matters
Where this appears in real systems and jobs: freeze behavior; catch silent breakage.

## Hands-On
Build it (est. half a day): baseline your research agent (or brain-chat) on the golden set — record pass/fail + scores per case → the diff tool (given a new run, show flipped cases vs baseline) → freeze the deterministic behaviors as programmatic asserts (valid output shape, required refusals, format compliance) → then *make a deliberate prompt change* that fixes one case and (likely) breaks another, run the regression, and watch the diff catch the breakage you'd have shipped blind. That caught regression is the build's proof. Tag `eval-v0.3`. The baseline + the diff tool + the caught-regression demo = the note; Ch 9 wires this into CI.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why can't a prompt regression test assert `output == frozen_string`, and what does it assert instead?
2. Walk the four-step regression mechanism, and why is the per-case flip list more valuable than the aggregate?
3. Which prompt behaviors *can* be frozen exactly, and why are they the cheap fast guards?
4. What does "a fix that breaks a critical case is not a fix" mean for the ship decision?
5. How does the regression suite relate to CI gates — content vs enforcement?


---

## Wikilinks
[[prompt-quality]]
[[python-craft-professional]]
[[build-golden-dataset]]
[[ci-gates-for-ai]]
[[failure-to-golden-loop]]

## Status log
- Started: 2026-07-21
- Finished: null