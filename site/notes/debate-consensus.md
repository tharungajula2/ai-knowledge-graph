## ELI5
Put three experts in a room, have them argue a hard question, and the answer that survives the argument is often better than any one expert's first take — *sometimes*. The node summary: **agents arguing their way to better answers.** Multi-agent debate is a real technique with real gains on specific problems — and a real cost, a real failure mode (confident agreement on a shared delusion), and a specific domain of usefulness you must know precisely, because used wrong it's expensive theater.

## The Real Explanation
**The mechanisms — three flavors of structured disagreement.**
1. *Debate proper*: N agents independently answer, then see each other's answers and *critique and revise* over rounds — the hope being that flaws get exposed and answers converge on truth. It's Vol 04 Ch 9's reflection, socialized: instead of one agent critiquing itself (and inheriting its own blind spots), *different* agents critique each other (escaping some blind spots — the "different model as critic beats same model" insight, Ch 9, scaled to a panel). The mechanism that makes it work when it works: *independent errors*. If agents fail differently, their disagreements surface the failures; the truth is the fixed point they converge toward because it's the one answer none of them can successfully attack.
2. *Consensus/voting (self-consistency, socialized)*: N agents answer independently; take the majority (Vol 02 Ch 5's self-consistency, now across agents rather than samples). Cheaper than debate (no rounds of cross-critique), and it works for the same reason — independent errors scatter, correct answers concentrate — but only when there's a *checkable convergence point* (a final answer to vote on), which is why it shines on math/logic/classification and flails on open-ended generation (what does "majority vote" mean across five essays?).
3. *Role-based adversarial*: assign *opposing* roles — a proposer and a skeptic, a red team and a blue team — to force examination that same-minded agents skip. The generator-critic (Ch 15's build) is the two-agent case; a full adversarial panel is its generalization.

**The killer failure mode — and it's the whole reason to be careful.** *Correlated errors → confident consensus on a shared delusion.* The entire premise is *independent* errors; but agents built on the same base model share the same blind spots, the same training biases, the same hallucination attractors — so they can *agree, confidently, on the same wrong answer*, and debate then does something worse than nothing: it *manufactures false confidence*, three agents nodding along to a shared mistake, producing a consensus that *looks* more trustworthy than a lone answer while being no more correct. This is Vol 04 Ch 16's multi-agent amplification at its purest (uncertainty laundered into authority) and Ch 9's self-blindness caveat, multiplied. The mitigations, in ascending strength: *diversity* (different models, different prompts, different framings — genuine independence is the only real cure, and it's hard to achieve); *ground truth* (Ch 9's lesson, undefeated — a debate refereed by tests/retrieval/a verifier beats a debate refereed by vibes; the best "consensus" mechanism is often "check reality," not "count votes"); and *honest uncertainty* (agents reporting confidence and disagreement being *surfaced* rather than smoothed — Vol 04 Ch 16's `gaps`/confidence fields, at panel scale).

**The cost reckoning — why this is often the wrong tool.** Debate is *expensive*: N agents × R rounds × cross-critique context (each round, each agent re-reads everyone's answers — the scratchpad-growth disease, Vol 04 Ch 13, multiplied by the panel) — easily 5–15× a single answer's cost (Ch 7's math at its most brutal). It buys accuracy on *specific* problems (hard reasoning where independent-error convergence genuinely operates, high-stakes decisions where the cost is justified) and buys *nothing but a bigger bill* on problems a single good agent nails or on generation tasks with no convergence point. The doctrine, consistent with every ladder in this curriculum: **spend debate only where evidence (Domain 07's evals) proves the accuracy gain justifies the multiplied cost** — and suspect, always, that a grounded single agent or cheap voting beats an ungrounded expensive debate.

## Why It Matters
Where this appears in real systems and jobs: agents arguing their way to better answers.

## Hands-On
The honest experiment (~40 lines, and a genuine surprise generator): pick 6 hard reasoning questions with *checkable* answers (tricky math, logic puzzles, questions with a false premise — Vol 01 Ch 10's territory). Run three ways, scoring accuracy and cost each: (a) single agent; (b) consensus — 5 independent answers, majority vote; (c) debate — 3 agents, 2 rounds of cross-critique. Then the crucial probe for the failure mode: find a question where all three agents *agreed and were all wrong* (correlated error — it will happen; when it does, you've witnessed manufactured false confidence in your own transcript) and one where debate *fixed* a single-agent error (independent-error convergence working). The accuracy/cost table + both specimens + one paragraph on when you'd actually pay for debate = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the three mechanisms, and explain the "independent errors" premise that all three depend on.
2. Why does voting shine on math but flail on essays? Tie it to "checkable convergence point."
3. State the killer failure mode precisely, and why debate makes it *worse* than a lone answer.
4. Recite the mitigations in ascending strength, ending with the undefeated one.
5. Give the cost multiplier and the doctrine for when debate is worth it — with your experiment's evidence.


---

## Wikilinks
[[reflection-patterns]]
[[sampling-controls]]
[[agent-failure-modes]]
[[token-economics-of-teams]]
[[build-writer-critic]]

## Status log
- Started: 2026-07-21
- Finished: null