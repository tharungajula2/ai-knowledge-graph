## ELI5
The node summary is a discipline disguised as an exercise: **categorize 20 failures; find the pattern.** Individual failures are noise; *patterns* in failures are signal — and the highest-leverage thing you can do to improve any AI system is not to fix failures one by one, but to *categorize* them, find the dominant pattern, and fix the *cause* behind the whole cluster. This is error analysis, the most underrated skill in ML (senior practitioners swear by it), and this build makes it a habit.

## The Real Explanation
**Why error analysis beats whack-a-mole.** Fixing failures individually is O(n) effort for O(n) fixes and misses the forest — you patch symptom after symptom while the underlying cause keeps generating new failures. Error *analysis* is different: collect a bunch of failures, *categorize* them by cause, and the distribution reveals that (say) 60% share one root cause — fix *that*, and 60% of your failures vanish at once. It's the Pareto principle (Vol 04 Ch 17's "optimize what profiling proves is hot," now for quality): most failures cluster into a few causes, and finding the dominant cluster is where the leverage is. Andrew Ng famously calls manual error analysis the highest-ROI activity in ML — and it's *manual* on purpose: you have to *read the failures* to see the pattern.

**The method — the error analysis protocol.** (1) *Collect failures* — from your eval runs (Ch 18's harness surfaces them), production (Ch 15's online evals), or a deliberate hard-case run — gather ~20 real failures (enough to see patterns, few enough to read every one). (2) *Read every one* — actually read the failing case, its trace (Ch 14), what went wrong. No shortcuts; the reading *is* the analysis. (3) *Categorize by root cause* — not by symptom ("wrong answer") but by *cause* ("retrieval missed the relevant chunk," "tool selection error," "reasoning drift," "prompt ambiguity," "hallucination") — the taxonomies of Vol 03 Ch 11 and Vol 04 Ch 16 are your starting categories, but let the *data* suggest new ones. (4) *Count and rank* — the distribution: which category dominates? (5) *Fix the dominant cause* — target the biggest cluster's root, not the individual failures. (6) *Re-measure* (Ch 18's harness) — did fixing the dominant cause move the aggregate? This is Vol 03 Ch 18's "close one loop" and Vol 02 Ch 16's "one change at a time," now driven by *pattern* rather than by individual case.

**What error analysis reveals — the insights whack-a-mole misses.** *The dominant cause* (fix once, fix many). *Miscategorized effort* (you thought the problem was reasoning; error analysis shows 70% is retrieval — you were about to optimize the wrong thing). *Systematic vs random* (a *pattern* is fixable at the cause; scattered one-offs might be irreducible noise — Vol 01 Ch 9's sampling variance — and knowing which is which saves wasted effort). *New failure categories* (patterns you didn't have a name for — the data teaching you your system's specific weaknesses, Vol 04 Ch 16's zoo, extended by evidence). *The improvement roadmap* (the ranked cause-distribution *is* your prioritized fix list — data-driven prioritization, not vibes). Error analysis converts a pile of failures into a prioritized, causal improvement plan — which is why it's the senior move.

## Why It Matters
Where this appears in real systems and jobs: categorize 20 failures; find the pattern.

## Hands-On
Do the practice for real (est. half a day, high-ROI): (1) Collect 20 real failures from your research agent or node-proposer (via the Ch 18 harness, or a hard-case run) — actual failures, not hypotheticals. (2) *Read every one* with its trace (Ch 14) — no skipping. (3) Categorize by root cause (start with Vol 03 Ch 11 / Vol 04 Ch 16 taxonomies, add categories the data demands) → build the distribution. (4) Identify the dominant cause and the fix it points to. (5) Fix it, re-run the harness (Ch 18), and measure whether the aggregate moved. The 20-failure categorization table + the dominant-cause finding + the fix-and-re-measure result = the note. This is a *repeatable practice* — you'll do it on every system, forever; this build installs the habit.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why does error analysis beat fixing failures one by one — the Pareto argument?
2. Recite the six-step error analysis protocol, and why is reading every failure non-negotiable?
3. Why categorize by root cause, not symptom? Give an example of the difference.
4. Name four insights error analysis reveals that whack-a-mole misses.
5. How does the cause-distribution become an improvement roadmap?


---

## Wikilinks
[[rag-failure-modes]]
[[agent-failure-modes]]
[[reading-traces]]
[[build-eval-harness]]
[[failure-to-golden-loop]]

## Status log
- Started: 2026-07-21
- Finished: null