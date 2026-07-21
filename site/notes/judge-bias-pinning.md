## ELI5
Your judge (Ch 3) is an LLM — which means it has all the biases and unreliability of an LLM, now pointed at *grading*. The node summary names both problems: **when the judge is wrong; version-pin the judge.** A judge you trust blindly will confidently mis-measure your whole system, sending you optimizing in the wrong direction — and worse, if the judge *itself* changes (a model update), your eval scores shift for reasons that have nothing to do with your system. This chapter is the skepticism and the discipline that keep the judge honest.

## The Real Explanation
**The judge's biases — the known failure modes (calibrate against these specifically).** *Verbosity bias*: judges favor longer, more detailed answers even when a terse answer is better (Ch 3's probe — the eloquent-but-wrong winner). *Position bias*: when comparing two answers, judges favor whichever comes first (or last) regardless of quality — so A/B comparisons must randomize order or the position decides the winner. *Self-preference*: a judge favors outputs in its own style / from its own model family (a GPT judge subtly prefers GPT answers — a real problem when judge and system share a model). *Sycophancy toward confidence*: confidently-stated wrong answers score higher than hedged correct ones (Vol 01 Ch 10's calibration failure, now in the *grader* — doubly dangerous). *Formatting bias*: nice markdown scores higher than plain text of equal substance. *Leniency/scale compression*: judges cluster scores in the middle or skew generous, compressing the range you're trying to measure. Each is a *systematic* error (not random noise), which means it *biases your optimization* — if the judge rewards verbosity, you'll "improve" your system by making it verbose, measuring the bias instead of the quality.

**Mitigations — how to judge the judge.** *Calibration* (Ch 3, the foundation — measure agreement with humans, which surfaces bias as disagreement patterns). *Bias-aware rubrics* (explicitly instruct: "penalize unnecessary length," "ignore formatting," "reward calibrated uncertainty" — name the bias to counter it). *Order randomization* (for comparisons — kill position bias mechanically). *Different judge model* (don't judge a model with itself — cross-model judging reduces self-preference; Vol 04 Ch 9's "different critic" insight, at eval scale). *Multiple judges / ensemble* (for high-stakes evals, several judges vote — expensive, Vol 05 Ch 6's debate economics, but reduces single-judge bias). *Ground truth wherever possible* (the undefeated move, Vol 04 Ch 9 — a programmatic check has no bias; prefer it over any judge when the thing is checkable). The meta-principle: **the judge is a fallible instrument; treat its scores as measurements-with-error, not truth, and characterize the error before trusting the measurement.**

**Version-pinning — the reproducibility discipline (the node's second theme, and the subtler one).** Here's the trap that ruins eval programs: your judge is `gemini-2.5-flash` (or whatever); the provider silently updates the model behind that name; suddenly your eval scores shift — and you *cannot tell* whether your *system* got worse or the *judge* changed. Your entire measurement baseline has moved under you, invisibly. The fix: **pin the judge's version** (use a specific dated model snapshot where the provider offers one — Vol 01 Ch 11), record *which judge version* produced *which scores* (in the eval report — provenance for measurements, Vol 03 Ch 10's habit at the eval layer), and when you *must* upgrade the judge, *re-baseline* (re-run past evals with the new judge to establish the offset, so old and new scores are comparable). Unpinned judges make eval history meaningless — a score from March and a score from June aren't comparable if the judge changed between them. This is Ch 11's data-versioning/reproducibility, applied to the most important variable in your eval: the grader itself.

## Why It Matters
Where this appears in real systems and jobs: when the judge is wrong; version-pin the judge.

## Hands-On
Interrogate your Ch 3 judge (concept node, concrete): (1) The bias battery — construct paired test cases probing each bias: verbose-vs-terse (equal substance), correct-first vs correct-second (position), confident-wrong vs hedged-right (sycophancy), pretty-vs-plain (formatting). Run your judge on each pair; document which biases it exhibits and how strongly. This is your judge's *bias profile* — know your instrument's systematic errors. (2) Apply mitigations to the worst bias you found (bias-aware rubric clause, or order randomization) and re-test — measure the improvement. (3) The pinning audit: check whether your judge model is pinned or floating; write the pinning + re-baselining policy for your eval program. The bias profile + the mitigation result + the pinning policy = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name five judge biases, and why does each *systematically* mislead optimization (vs random noise)?
2. Why is sycophancy-toward-confidence doubly dangerous in a judge?
3. Recite the mitigations, ending with the undefeated one.
4. Explain the version-pinning trap: what shifts, and why can't you tell what caused it?
5. What is re-baselining, and why does an unpinned judge make eval history meaningless?


---

## Wikilinks
[[build-eval-judge]]
[[hallucination]]
[[reflection-patterns]]
[[data-versioning-reproducibility]]
[[model-landscape]]

## Status log
- Started: 2026-07-21
- Finished: null