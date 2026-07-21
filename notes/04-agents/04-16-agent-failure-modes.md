---
id: agent-failure-modes
title: "Agent Failure Modes"
domain: agents
ring: 4
cluster: "Real Agents"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["rag-failure-modes", "build-agent-from-scratch", "injection-first-look", "add-the-gate", "plan-and-execute", "scratchpads-working-memory"]
tags: [agents]
---

## ELI5
Vol 03 gave RAG its failure taxonomy and turned debugging into differential diagnosis; agents deserve the same, and need it more — because the loop that compounds progress compounds error (Ch 1's symmetry, now due). The node summary names the headliners: **infinite loops, tool spam, derailment — and guards.** You have personally witnessed most of this zoo already, on purpose, in your own transcripts. Today every specimen gets a name, a signature, and a guard — and agent debugging becomes a checklist, not a séance.

## The Real Explanation
**Family 1 — Loop pathologies (the agent won't stop, or stops wrong).**
- **The infinite loop**: same action (or a tight cycle of actions) repeating — classic cause: an observation the agent can't interpret as progress, so it retries the only move it knows (you met it in Ch 4's no-max-steps drill; you felt its psychological twin in Ch 2). *Signature*: repeated identical/near-identical tool calls in the transcript. *Guards, layered*: max_steps (the crude floor, Ch 4); **repetition detection** — dispatch keeps a hash-set of (tool, args) this run and on a repeat injects the observation "you have already tried this exact call; the result will not change; try a different approach" (the loop-breaker that actually works — legible feedback, Ch 3's philosophy); and per-step budgets (Ch 14's nested bounds).
- **Premature termination**: the mirror twin — the agent answers before verifying, from vibes (Ch 2's temptation, in silicon). *Signature*: Final Answer with claims no observation supports. *Guards*: the synthesizer's citation-integrity check (a claim with no Finding can't ship — Vol 03 Ch 10 as termination discipline), and a reflection pass gated on "does every claim trace?" (Ch 9, externally anchored).
- **Goal drift / derailment** (the node's word): the agent wanders — a research question about API pricing becomes a tour of API history. *Cause*: the goal dilutes in a growing scratchpad (Ch 8 named it; Ch 13 priced it). *Signature*: late-transcript actions that serve no plan step. *Guards*: plan-and-execute structure (the plan pins the goal — Ch 8's core sale), the replan-check as drift-detector ("does this action serve a remaining step?"), and scratchpad compression keeping the goal's share of attention high.

**Family 2 — Tool pathologies (the agent acts badly).**
- **Tool spam** (the node's word): calling tools when none is needed, or scattershot calls hoping something sticks — burning money and rate limits (Vol 02, Ch 10). *Cause*: usually descriptions without negative space (Ch 3 — "do NOT use for...") or a missing `none`/direct-answer path (Ch 11). *Guards*: description craft, the `none` route, and per-run tool-call budgets with the budget's remaining count *visible in the prompt* ("you have 3 tool calls remaining" — scarcity legibly stated changes behavior).
- **Wrong tool / malformed args**: Ch 3's misuse modes plus garbage JSON. *Guards*: all built — naming consistency, arg validation at dispatch with legible error observations, the repair loop.
- **Fantasy observations**: the agent hallucinates tool results instead of waiting for them — the no-stop-sequence bug (Ch 4's most instructive failure) and its subtler cousin: confidently "remembering" a result it never obtained. *Signature*: observations in the transcript that dispatch never produced (auditable — because your transcript is ground truth). *Guards*: stop sequences (mechanical), and the exoskeleton rule — synthesis only from typed Findings, never from prose memory (Ch 14's quarantine, doing double duty).

**Family 3 — Compounding pathologies (small errors, amplified by the loop).**
- **Error cascade**: one bad observation poisons every downstream decision — Vol 03 Ch 14's propagation, Ch 2's sabotage run, now at full scale. *Guards*: per-hop grounding (findings carry quotes — provenance as antibody), replan checks as circuit breakers, and the gate catching consequential actions born of poisoned reasoning before they touch the world (Ch 15 — the gate as the *last* line, which is why it's policy).
- **Context poisoning / injection**: the adversarial cascade — Vol 02 Ch 12's indirect injection meeting Ch 14's open web. *Guards*: as deployed — delimiting, quarantine, provenance requirements, the gate. (One taxonomy, two volumes, converging: injection is an *induced* error cascade; the defenses unify.)
- **Multi-agent amplification**: in supervisor systems, a specialist's confident-wrong result enters the parent's context with the *authority of a completed subtask* — the boundary that enables independence also launders uncertainty. *Guards*: `SpecialistResult` carrying confidence/gaps fields (the honesty schema — Ch 14's `gaps`, generalized), and the supervisor treating specialist outputs as observations to reason over, not facts to relay.

**The diagnostic protocol — the chapter's takeaway, mirroring Vol 03's tree.** (1) *Read the transcript* — the agent's scratchpad is ground truth; every pathology above has a transcript signature, listed. (2) Locate the *first* wrong step (not the loudest — cascades mean the visible failure is downstream of the cause; walk backward). (3) Classify by family: didn't stop right → loops; acted badly → tools; was fine then rotted → compounding. (4) Apply the named guard, *one change* (the discipline, always), rerun. And the meta-observation worth ending on: nearly every guard in this zoo is something you had already built before this chapter named it — budgets, legible errors, citations, plans, gates, quarantines. Good agent engineering isn't a safety layer bolted on; it's the same honest architecture, load-bearing twice.

## Why It Matters
Where this appears in real systems and jobs: infinite loops, tool spam, derailment — and guards.

## Hands-On
Breed the zoo — Vol 03's bestiary ritual, agent edition. Induce five specimens in your own stack, one per family minimum, each documented with {transcript excerpt, signature identified, first-wrong-step located, guard applied, rerun verdict}: (1) disable repetition detection + feed the Researcher an unanswerable query with a broken mock search → infinite loop (kill it; then re-arm the guard and watch the loop-breaker observation redirect it); (2) remove the citation-integrity check → catch one premature termination; (3) run a deliberately vague goal without a plan → document the drift, then rerun planned and diff; (4) strip a tool's negative-space clause → count the spam calls before/after restoring it; (5) replay Ch 2's sabotage as automation: script one poisoned mock observation early → trace the cascade in the transcript, then show the gate catching the consequential downstream action. Five pinned specimens = the note, and a debugging checklist you'll use for years.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Reproduce the zoo from memory: three families, ~nine specimens.
2. For infinite loops: the cause, the signature, and the three-layer guard stack — and why the legible loop-breaker outperforms a bare max_steps.
3. Distinguish derailment from premature termination by transcript signature, and name each one's structural guard.
4. Walk the diagnostic protocol on: "the briefing confidently cites a source that says the opposite."
5. Deliver the meta-observation about guards and architecture — with three examples from your own builds.


---

## Wikilinks
[[rag-failure-modes]]
[[build-agent-from-scratch]]
[[injection-first-look]]
[[add-the-gate]]
[[plan-and-execute]]
[[scratchpads-working-memory]]

## Status log
- Started: 2026-07-21
- Finished: null
