## ELI5
Two support bots give the same correct answer. One says it. The other says it *and points at the policy document, section 4.2*. Only the second is shippable to an enterprise — because only the second lets a human *verify without trusting*. The node summary is the whole philosophy: **every answer points at its source.** Your Ch 5 prompt already asked for bracket-citations; this build makes citations *structural, validated, and honest* — the difference between decoration and evidence.

## The Real Explanation
**Citations as structure, not prose.** Asking for "[3]" in text was rung 1 (Vol 02 Ch 6's ladder — you know where this goes). The build: structured output with per-claim attribution.
```python
class Claim(BaseModel):
    text: str
    chunk_ids: list[int]                  # which retrieved chunks support THIS claim

class GroundedAnswer(BaseModel):
    claims: list[Claim]
    not_in_notes: bool = False            # honest-failure, promoted to a FIELD
```
Prompt: chunks delimited with visible ids and heading-paths (Ch 5's format), instruction "decompose your answer into claims; for each claim list the ids of chunks that support it; a claim with no supporting chunk must not appear." Schema-enforced via your gateway (Vol 02 Ch 6/11). The decomposition into claims isn't cosmetic — it's what makes the next part possible.

**The validation layer — where citations become trustworthy.** Model-emitted citations are model output, and the boundary law (Vol 02, Ch 6) applies: *untrusted until validated*. Three checks, escalating in strictness: (1) **referential integrity** — every cited id ∈ the ids actually retrieved this call (a hallucinated citation `[17]` when you provided 4 chunks is instantly catchable garbage — catch it, trigger the repair loop); (2) **existence** — every claim has ≥1 citation, or the answer is rejected/repaired (this is the "must not appear" rule, enforced rather than hoped); (3) **support spot-check** — the hard one, previewed here and industrialized in Ch 16: does the cited chunk *actually contain* support for the claim? A cheap heuristic now (claim keywords ∩ chunk text — crude, catches the worst offenders); the real machinery (faithfulness scoring) is two chapters away and this field structure is exactly what it will consume. Design note worth writing down: **you structured the output *so that* verification became mechanical.** That's a deep pattern — schemas aren't just parsing convenience; they're what makes downstream *checking* possible at all.

**Rendering — the human contract.** Terminal output: each claim followed by its sources as `[source.md > heading-path]` (the heading-path metadata from Ch 3, cashing in — a citation naming the *section* is verifiable in seconds; one naming just a file is homework). A `--sources` flag prints each cited chunk's full text beneath the answer: verification-without-trust, delivered. And the honest-refusal path renders proudly, not apologetically: `NOT IN NOTES — no relevant content found for this question` is a *feature* — in enterprise RAG, a system that visibly declines beats one that quietly invents, every single time, and you should be able to argue that in an interview with this build as evidence.

**Tests:** referential-integrity catch (feed a mocked model-response citing id 99 → repair loop fires); uncited-claim rejection; `not_in_notes=True` produces zero claims; rendering includes heading-paths; and the end-to-end sanity: a question whose answer you know spans two chunks yields claims citing both.

## Why It Matters
Where this appears in real systems and jobs: every answer points at its source.

## Hands-On
Build it into the pipeline (this replaces Ch 5's prose-bracket approach): schema → prompt → validation layer with repair → rendering + `--sources` → tests green → then the session that makes it real: 8 questions about your own notes, and for each, *actually click through* — read every cited chunk and grade every citation {supports | partially | doesn't}. Count the honest tally. If you find a "doesn't" (you likely will), celebrate it in the note: you've just caught, with your own instrument, the exact failure class that Ch 16's faithfulness metric measures at scale — your validation heuristic and your eyes did it first. Tag `rag-v0.3`.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why claims-with-ids instead of prose brackets? Name what the structure *enables*, not just what it tidies.
2. Recite the three validation checks in order of strictness and what each catches.
3. State the deep design pattern about schemas and verification in one sentence.
4. Why does the heading-path make citations verifiable, and which chapter's metadata habit paid for it?
5. Make the enterprise argument for visible refusal over quiet invention.


---

## Wikilinks
[[build-first-rag]]
[[structured-output]]
[[chunking]]
[[rag-evals-intro]]
[[hallucination]]

## Status log
- Started: 2026-07-21
- Finished: null