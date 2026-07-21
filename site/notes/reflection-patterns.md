## ELI5
First drafts are bad — yours, mine, and the model's. What makes good writers isn't better first drafts; it's the *second pass*: read your own work as a critic, find the flaws, revise. The node summary: **agents that critique themselves.** Reflection is the second pass, built into the loop — generate, critique, revise — and its stronger cousin Reflexion adds the twist that makes agents *improve across attempts*: remembering the lessons of failure. Cheap to implement, real quality gains, and two sharp caveats that separate practitioners from enthusiasts.

## The Real Explanation
**Basic reflection — the generate-critique-revise triangle.** Three-node pattern: *generate* (produce the draft/answer/plan), *critique* (a second LLM call examining the draft against explicit criteria — "check: factual grounding, completeness vs the goal, format compliance; list concrete flaws or say APPROVED"), *revise* (regenerate with the critique in context). Loop critique→revise until approved or budget-capped (always budget-capped — reflection loops are infinite-loop bait, Ch 16 incoming). Why it works when it works — two honest mechanisms: **evaluation is easier than generation** (recognizing a flaw is a simpler task than producing flawlessly — same reason you can hear a wrong note you couldn't have composed around), and **fresh framing** — the critique call approaches the text as *reader*, unanchored from the generator's in-flight commitments (Vol 02 Ch 5's insight that the transcript conditions everything: a new call escapes the old transcript's groove). Craft rule that makes or breaks it: **critique against explicit criteria.** "Is this good?" yields vague nodding; a rubric yields actionable flaws. Your Ch 16 golden-set discipline (Vol 02) writes the rubric — the eval mindset, turned inward.

**Reflexion — reflection with memory across attempts.** The upgrade: when a whole *attempt* fails (the task, not just the draft — tests still red, answer rejected by the gate, eval score low), a reflection call produces a **lesson**: "Attempt 1 failed because I searched too broadly and drowned in noise; next attempt: constrain the query to the specific domain first." The lesson is stored and *injected into the next attempt's context*. The agent doesn't retry blindly — it retries *informed*. Note the architecture carefully, because it clarifies a boundary you'll need in Domain 06: the lesson lives in **episodic memory across attempts within a task** — longer-lived than the scratchpad (Ch 13, one attempt), shorter-lived than true long-term memory (across tasks, Domain 06). Three memory horizons; Reflexion owns the middle one. And the trigger matters: Reflexion needs a *failure signal* — a test suite, an eval score, a gate rejection (Ch 7's rejection-as-observation is literally a Reflexion trigger you already built). No signal, no lesson; reflection without ground truth is just vibes squared.

**Where reflection pays, and the two sharp caveats.** Pays: tasks with checkable criteria (code against tests — the canonical case; structured output against schemas; grounded answers against faithfulness checks) and complex generation where first-pass quality is genuinely low (long synthesis, plans worth critiquing before execution — Ch 8's planner + a critique node is a strong marriage). Caveat one — **cost**: every round is 2× LLM calls; reflection on a task the model nails first-pass is pure waste, so gate it by task difficulty or trigger it only on failure signals (the routing drumbeat again — spend surgery where evidence says it pays, Vol 03's rule verbatim). Caveat two — **self-critique inherits self-blindness**: the critic shares the generator's weights, therefore its blind spots; a model that doesn't know a fact can't critique the fact's absence, and models are systematically gentle judges of their own fluency (Vol 02 Ch 16's LLM-as-judge biases, aimed at a mirror; Vol 01 Ch 10's "introspection is generation" ghost, returning). Mitigations, in ascending strength: rubric-anchored critique > free critique; a *different* model as critic > the same model; **external signals beat both** — tests, evals, retrieval checks, humans. The deep ordering to carry out of this chapter: *self-critique < cross-critique < ground truth* — and the best agents wire in as much ground truth as the task affords.

## Why It Matters
Where this appears in real systems and jobs: agents that critique themselves.

## Hands-On
One experiment, real code, ~40 lines on your existing stack: take a task with a checkable criterion — the natural one: generate a Pydantic model + passing pytest suite for a small spec (your Vol 01 Ch 21 skills define "pass"). Arm three variants: (a) single-shot generation; (b) reflection loop with a rubric critique, max 2 rounds; (c) Reflexion: run attempts against the *actual* pytest output as the failure signal, lesson injected between attempts, max 3 attempts. Score: pass rate, total LLM calls, total cost (ledger). Then the caveat-two probe: find one flaw variant (b)'s critic missed that pytest caught — evidence, in your own transcript, of self-blindness and the supremacy of external signals. Results table + the flaw specimen = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Draw the generate-critique-revise triangle and give the two mechanisms for why critique works.
2. What separates Reflexion from reflection — what's stored, where does it live among the three memory horizons, and what does it require to fire?
3. Which of your Ch 7 constructs is already a Reflexion trigger?
4. Recite both caveats with their mitigations, and deliver the ordering: self < cross < ground truth.
5. From your experiment: the numbers, and the flaw the critic missed.


---

## Wikilinks
[[reasoning-prompts]]
[[prompt-quality]]
[[hitl-interrupts]]
[[scratchpads-working-memory]]
[[agent-failure-modes]]

## Status log
- Started: 2026-07-21
- Finished: null