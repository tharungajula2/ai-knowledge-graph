---
id: build-golden-dataset
title: "Build: Golden Dataset"
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
wikilinks: ["prompt-quality", "rag-evals-intro", "build-research-agent", "build-eval-judge", "failure-to-golden-loop"]
tags: [evals-observability]
---

## ELI5
An eval is only as good as its dataset — and a bad dataset lies *confidently*, which is worse than no eval. The node summary: **20 golden cases for my research agent.** This build creates the measuring stick every other eval in this ring uses: a curated, versioned set of test cases with known-good expectations, covering the space of what your research agent must handle. You've built golden sets before (Vol 02 Ch 16, Vol 03 Ch 18); this makes it a rigorous, reusable, permanent artifact — the foundation the whole ring stands on.

## The Real Explanation
**What a golden case contains.** Each case is a structured record:
```python
class GoldenCase(BaseModel):
    id: str
    input: str                      # the research question
    category: str                   # the slice this tests (Ch 19's error analysis uses these)
    expected: ExpectedResult        # what good looks like — see below
    difficulty: Literal["easy","medium","hard","adversarial"]
    notes: str                      # why this case exists, what it probes
```
The `expected` is the subtle part, because your agent's output has no single right answer (Ch 1): rather than an exact string, `expected` holds *checkable criteria* — required facts the answer must contain, sources it should cite, a quality rubric ("addresses all parts of the question / cites sources / honest about gaps"), and for the research agent specifically, *trajectory* expectations (should use web search; should consult notes; Ch 5). Some cases check exact things (a factual query with a verifiable answer), most check *rubric satisfaction* — and mixing both is right (Vol 02 Ch 16's scoring tiers).

**Coverage — the design that makes the dataset honest (Vol 02 Ch 16's spread logic, formalized).** 20 cases chosen to *cover the space*, not to be easy: *typical cases* (the bread-and-butter queries — most of the set), *hard cases* (multi-hop, ambiguous, requiring synthesis), *edge cases* (empty/malformed input, questions outside the agent's scope — should refuse honestly), *adversarial cases* (injection attempts in the question, false-premise questions, Vol 01 Ch 10 — the agent must not be manipulated or led). And critically, *category-tagged* (Ch 19's error analysis needs these slices — "vocabulary-mismatch queries," "multi-source synthesis," "temporal questions"): a dataset where you can score *per category* localizes weakness (aggregate scores hide which *kind* of query fails — Vol 03 Ch 18's slice lesson). Build it to *find* your agent's failures, not to confirm its successes — a golden set that your agent aces on day one is too easy to be useful.

**The authorship discipline — where the real work is.** *Build it before optimizing* (Vol 02 Ch 16's iron law — a golden set built after seeing outputs inherits the system's blind spots). *Author expectations by hand* (you decide what "good" is for each case — this is human judgment, slow and irreplaceable, and the reason golden sets are precious; you *are* the ground truth). *Source cases from reality* — your labeled inspection sessions across six rings (you've been told to keep them since Vol 03!), real questions you've asked your agents, and known failures (each past bug becomes a case — Ch 20's loop, seeded). *Version it in the repo* (it's an artifact that evolves — Ch 20 grows it; changes are tracked; Ch 11's data-versioning applies to golden sets too). *Keep it honest about difficulty* — label each case's difficulty so scores are interpretable (80% on easy cases ≠ 80% on adversarial ones).

**Verification.** A golden dataset's own quality checks: every case has checkable expectations (no "expected: a good answer" hand-waves — if you can't say what good means, you can't score it); coverage across all categories and difficulties (count them — gaps are blind spots); no duplicates; expectations are *achievable* (a case demanding the impossible is a broken case); and the meta-check — run your *current* agent against it and confirm it *fails some cases* (a golden set nothing fails isn't measuring anything).

## Why It Matters
Where this appears in real systems and jobs: 20 golden cases for my research agent.

## Hands-On
Build it (est. 1 day — the labeling *is* the work): the `GoldenCase` schema → gather ~20 cases from your six rings of real questions and known failures → author checkable expectations by hand for each (the slow, irreplaceable part) → tag category and difficulty → ensure coverage (typical/hard/edge/adversarial, multiple categories) → version in repo → the quality checks, including confirming your current agent fails some. Then the honest read: run your research agent against all 20, eyeball the results (Ch 3 automates scoring), and note which cases it fails — those failures are your ring's target list. Tag `eval-v0.1`. The dataset + the coverage table + the current-agent failure list = the note; every subsequent eval build consumes this dataset.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What does a golden case contain, and why is `expected` checkable-criteria rather than an exact string?
2. Recite the four coverage categories and why category-tagging matters for later analysis.
3. Why build the dataset *before* optimizing, and why author expectations by hand?
4. Why must a good golden set make your current agent *fail* some cases?
5. Where do your cases come from, and why have you been told to keep inspection labels since Vol 03?


---

## Wikilinks
[[prompt-quality]]
[[rag-evals-intro]]
[[build-research-agent]]
[[build-eval-judge]]
[[failure-to-golden-loop]]

## Status log
- Started: 2026-07-21
- Finished: null
