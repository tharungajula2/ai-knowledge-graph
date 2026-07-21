---
id: add-the-gate
title: "Build: Add the Gate"
domain: agents
ring: 4
cluster: "Real Agents"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["hitl-interrupts", "designing-tools", "build-research-agent", "build-node-proposer", "reflection-patterns"]
tags: [agents]
---

## ELI5
The research agent works — and it writes. `save_finding` today; tomorrow (Ch 18) it proposes changes to your brain itself. Before any agent earns write access to things you care about, the law arrives: **HITL approval before it saves anything** — the node summary, and the direct descendant of your agent-lab's most important organ. You built the mechanism in Ch 7 as a technique; today it becomes *policy*, wired into a real agent, with the audit trail that makes autonomy trustworthy.

## The Real Explanation
**From technique to policy — the promotion.** Ch 7 built *an* interrupt; this build makes gating a **property of the system**: a single gate layer through which *every* write-tagged tool call must pass, on every agent, with no specialist able to opt out. Implementation shape: the gate is not a node you remember to add per graph — it's wired into **dispatch itself** (the one chokepoint every tool call already crosses, Ch 4's architecture paying off): dispatch checks the tool's safety tag; reads pass; writes trigger the Ch 7 interrupt with the full payload (proposed action, args, rationale from the scratchpad, *and the step's findings context* — the human sees what the agent saw). One chokepoint, one policy, zero exceptions — security as architecture, not discipline (the Vol 02 Ch 12 lesson: capability design beats prompt design; an agent whose writes *structurally cannot* skip the gate is safe in a way no instruction can make it).

**The audit trail — approval's other half.** Every gated decision writes a ledger row: timestamp, thread, agent, proposed action, rationale shown, verdict (approve/edit/reject), the human's edit or reason, and execution result. Postgres table beside your checkpoints (the co-location habit). Why this matters beyond tidiness, three arguments to own: (1) *trust is built on reviewability* — "what has this agent actually done with its write access?" must be a query, not a vibe; (2) *rejections are training data* — the reasons humans reject are precisely the lessons a Reflexion loop (Ch 9) or a future fine-tune (Vol 01 Ch 7's behavior territory) would learn from; the trail is the dataset accumulating for free; (3) *edits reveal calibration* — a high edit-rate on one tool means its args-construction needs work (a Ch 3 description fix, found by data). The gate isn't just a brake; it's an instrument.

**Batch approval — the fatigue medicine at scale.** Ch 7 warned: approval fatigue kills gates. The research agent's shape offers the cure Ch 8 predicted: **gate the plan, not each action** where the plan enumerates its writes — "this run will save ~4 findings to scratch storage" approved once up front, with per-action gating reserved for *dangerous*-tagged tools and for writes that *deviate from the approved plan* (a save the plan didn't forecast re-triggers the gate — deviation detection as the tripwire). Implement both modes: `gate_mode: per_action | plan_level` in config; the deviation check compares proposed writes against the approved plan's declared writes. This two-tier design — coarse consent plus fine-grained exception — is how real production systems keep humans meaningfully in loops they'd otherwise rubber-stamp; it's also, notice, exactly how your Ch 18 Node-Proposer must work (propose a *batch* of nodes; the human reviews the batch).

**Verification.** All Ch 7 tests re-run against the dispatch-level gate (the promotion must not break the mechanism); no-bypass test — *every* specialist's write path interrupts (iterate the toolbox, attempt each write, assert interrupts fire — the policy test); plan-level mode: declared writes flow after one approval, an undeclared write trips per-action gating (the deviation tripwire test — the suite's crown); audit rows written correctly for all verdict types; kill-and-resume through a pending gate (durability, always).

## Why It Matters
Where this appears in real systems and jobs: HITL approval before it saves anything.

## Hands-On
Build it (est. 1 day): safety-tag audit across the full toolbox (every tool declares; untagged = build error — make the type system enforce the policy) → gate-in-dispatch → audit table + writer → batch mode + deviation check → tests green. Then live fire: run the research agent in per-action mode on a real question and *feel the fatigue yourself* within one run (the design lesson no reading delivers); switch to plan-level; run again; write the comparison paragraph. Then query your own audit trail: `SELECT verdict, count(*) ...` — read your first agent-governance report. Tag `agent-v0.7`. Homecoming: agent-lab's gate, read cold, one last time — annotate its policy scope (what does it gate?), its payload (what does the human see?), its trail (what does it record?) against today's build. The comparison table goes in the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What distinguishes policy from technique, and where does the gate live architecturally? Why that chokepoint?
2. Deliver the capability-design-beats-prompt-design argument in this build's terms.
3. Three arguments for the audit trail — trust, training data, calibration — one sentence each.
4. Explain two-tier gating and the deviation tripwire; connect it to Ch 18's coming shape.
5. From your live-fire: the fatigue paragraph's conclusion, and one number from your governance query.


---

## Wikilinks
[[hitl-interrupts]]
[[designing-tools]]
[[build-research-agent]]
[[build-node-proposer]]
[[reflection-patterns]]

## Status log
- Started: 2026-07-21
- Finished: null
