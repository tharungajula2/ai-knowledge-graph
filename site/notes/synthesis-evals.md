## ELI5
The node summary names the internalized discipline: **the full EDD loop, internalized.** Test-driven development (TDD) revolutionized software by writing tests *first*; eval-driven development (EDD) does the same for AI — evals *drive* the work, not decorate it. When you can articulate and *live* the full EDD loop, you've absorbed this ring's deepest lesson: that for non-deterministic systems, measurement isn't a phase — it's the *method*.

## The Real Explanation
It begins with a refusal to believe: `assert output == expected` is dead for AI, because the same input gives different outputs and "correct" is a spectrum [1] — so you replace belief with measurement. You build a **golden set** — fixed, covered, hand-authored, adversarial, made to *find* failures not confirm successes [2] — and a **judge** to score against it, calibrated against your own judgment because an unvalidated instrument produces fiction, and pinned because a drifting judge makes history meaningless [3, 4]. You measure not just answers but **trajectories** — the path, the efficiency, the reasoning [5] — and **tool use** — right tool, right args, right time, each pointing at its own fix [6]. You reach for **frameworks** where they beat hand-rolling, evaluating the evaluator against what you built bare [7]. You freeze behavior with **regression tests** so a fix for A can't silently break B [8], and enforce it with **CI gates** so quality becomes structural, unshippable-if-broken [9]. You ground it in the broader lifecycle — **experiment tracking** for reproducible runs, **data versioning** and model cards for reproducibility and honesty, **serving patterns** matched to use [10, 11, 12]. Then you see *inside*: **tracing** turns the black box into a span tree mirroring your architecture [13], **read** to debug from the trace not by guessing [14], score **production traffic** continuously for the failures your golden set never imagined and the drift no snapshot catches [15], **A/B test** changes on real users because offline is a proxy [16], and **dashboard** the money and milliseconds so the invisible economics become actionable [17]. It all unifies in **the harness** — one command, every eval, around your most important agent [18] — powered by **error analysis** that finds the pattern behind the failures [19] and the **failure→golden loop** that makes every bug a permanent guard, the ratchet that turns quality monotonically upward [20]. The internalized truth: **evals aren't a phase after building; they're how you build** — write the eval, measure the baseline, change one thing, re-measure, ship only on evidence, and let every failure permanently tighten the net.

## Why It Matters
Where this appears in real systems and jobs: the full EDD loop, internalized.

## Hands-On
Three renditions, the ritual: **(a)** The narration, written, ≤700 words, your words, every node present as part of one method. **(b)** The EDD loop diagram — the cycle: *define evals → baseline → change one thing → measure → decide by evidence → ship (CI-gated) → monitor (online) → failures feed back as golden cases → repeat* — drawn as a flywheel with each stage labeled by its chapter, the failure→golden loop as the ratchet that makes the wheel only turn forward. Photograph into the note. **(c)** The 90-second spoken version — its interview home is the ring's title question: *"how do you test software that's never the same twice?"* — a question that separates people who've *built* AI from people who've *used* it, and your layered answer (golden sets, calibrated judges, trajectory evals, CI gates, online monitoring, the failure flywheel) marks you unmistakably as the former. Record, critique, re-record.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Deliver the 90-second version cold — the "never the same twice" answer.
2. Contrast TDD and EDD, and state what "evals are how you build, not a phase" means concretely.
3. Trace one prompt change through the full EDD loop — from golden set to CI to production to failure-feedback.
4. Draw the EDD flywheel from memory, with the ratchet.
5. Draw the full loop from memory.


---

## Wikilinks
[[synthesis-evals]]

## Status log
- Started: 2026-07-21
- Finished: null