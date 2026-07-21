## ELI5
You have two prompt versions and offline evals say B is slightly better — but offline evals use *your* golden set and *your* judge; the real question is whether B is better for *real users on real traffic*. The node summary: **shipping prompt changes like features.** A/B testing brings the rigor of product experimentation to prompt changes — ship both versions to real users, measure which performs better on real outcomes, decide by data. It's the production complement to offline evals: offline says "B looks better on my tests," A/B says "B *is* better for users," and the gap between those two is where humility lives.

## The Real Explanation
**Why A/B test when you have offline evals — the gap they fill.** Offline evals (Part I) are *proxies* — your golden set approximates real traffic, your judge approximates real quality. Good proxies, but proxies: a change that improves golden-set faithfulness might *hurt* real user satisfaction (users found the more-faithful answers too terse, say — a real dynamic offline evals miss). A/B testing measures the *real outcome* on *real users* — closing the proxy gap. It's the same offline-vs-online complementarity (Ch 15): offline to decide *what to ship*, A/B to *verify it actually helped* in production. Ship prompt changes like features because they *are* features — they change user-facing behavior, and features get A/B tested.

**The mechanism — controlled online experiment (product rigor, applied to prompts).** *Split traffic*: randomly assign users (or requests) to variant A (control, current prompt) or B (treatment, new prompt) — randomization is essential (Ch 4's position bias lesson at experiment scale: non-random assignment confounds the result). *Define the metric* before running (the outcome you care about: task-completion rate, user satisfaction, acceptance rate, downstream conversion — pick it *first*, or you'll cherry-pick after). *Run until significant*: collect enough data to distinguish real difference from noise (statistical significance — the "15/20 vs 16/20 is a tie" wisdom, Vol 02 Ch 16, now with actual statistics: small samples can't detect small effects; you need enough traffic and enough time). *Decide by data*: B ships only if it *significantly* beats A on the pre-defined metric. This is the scientific method (Vol 05 Ch 17's experiment rigor) applied to prompt shipping.

**The AI-specific subtleties.** *Non-determinism as noise* (Ch 1): the same prompt gives varying outputs, adding variance that A/B tests must see through — more reason for adequate sample sizes. *Metric choice is hard*: "quality" isn't directly observable in production (Ch 15's no-ground-truth problem) — so A/B metrics are often *implicit* (acceptance, retry, engagement) or *guardrail-based*, and choosing a metric that actually reflects quality (not just engagement — the filter-bubble trap, Vol 06 Ch 7: optimizing engagement can degrade actual helpfulness) is a genuine design challenge. *Interaction effects*: a prompt change might help new users and hurt power users (segment your analysis — Vol 03 Ch 18's slices, at the A/B level). *Guardrails on the experiment*: a bad B variant is harming *real users* while the test runs — cap the exposure (small % first), monitor for harm, and kill a clearly-bad variant early (don't let an experiment damage users for statistical purity).

**Where A/B fits the whole eval stack — the full picture.** The mature pipeline: *offline evals* (Part I) filter changes before they ship (cheap, fast, catch obvious regressions — CI-gated, Ch 9); *A/B testing* verifies the survivors actually help real users (expensive, slow, real outcomes); *online evals* (Ch 15) monitor the winner continuously for drift. Offline → A/B → online monitoring is the full lifecycle of a prompt change from idea to verified-in-production — and it's how serious teams ship AI changes: not "it looked good, ship it," but "it passed offline evals, won its A/B test, and is monitored in production." That pipeline *is* eval-driven development at production scale (Ch 21).

## Why It Matters
Where this appears in real systems and jobs: shipping prompt changes like features.

## Hands-On
Design the A/B layer (concept node, concrete): (1) Design an A/B test for a real prompt change to your brain-chat or research agent: the two variants, the randomization scheme, the *pre-defined* metric (and why that metric reflects real quality, not just engagement), the sample size / duration for significance, and the guardrails (exposure cap, early-kill criteria). (2) The metric-choice hard part: for your system, what *observable production signal* would actually reflect quality? Wrestle with the proxy problem honestly. (3) Place A/B in your full eval stack: draw offline → A/B → online for one prompt change's journey from idea to verified-shipped. The A/B design + the metric-choice reasoning + the full-lifecycle diagram = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why A/B test when you have offline evals — what proxy gap does it close?
2. Recite the A/B mechanism's four parts, and why is pre-defining the metric essential?
3. Name three AI-specific A/B subtleties and how each is handled.
4. Why is metric choice a genuine design challenge, and what's the engagement trap?
5. Draw the offline → A/B → online lifecycle and what each stage verifies.


---

## Wikilinks
[[prompt-quality]]
[[online-evals]]
[[experiment-one-vs-many]]
[[personalization-via-memory]]
[[ci-gates-for-ai]]

## Status log
- Started: 2026-07-21
- Finished: null