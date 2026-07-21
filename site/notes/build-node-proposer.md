## ELI5
Every build in this ring served the curriculum; this one *joins* it. The node summary: **an agent that proposes brain nodes for my approval — the seed of The Bridge.** M2's definition, from your own milestone list: *the deployed agent proposes new brain nodes through its own human-approval gate — agent and brain become one nervous system.* Today you build the nervous system's first synapse: an agent that reads your brain, researches the frontier, finds what your map is missing, and — through the gate, always through the gate — proposes new nodes in your curriculum's own format. The system that teaches you begins to grow itself. Meta, glorious, and entirely real.

## The Real Explanation
**The pipeline — four phases, every organ from this ring in harness.**
1. **Survey (know the brain)**: tools `read_curriculum` (parse your actual curriculum file — the node-line format your graph's parser already defines: `- id — Title (type · size): summary`; the proposer must speak it natively) and `search_notes` (Vol 03 retrieval — what have you *actually written*, as against what's planned). Output to typed state: the map of what exists — domains, clusters, lit/ghost status, and (from notes) where your written understanding runs deeper or shallower than the plan.
2. **Scan (know the frontier)**: the research agent (Ch 14 — *as a subgraph*; Ch 10's reuse dividend, cashed in full) runs targeted scans: "what's new in [domain] since [date]" per domain flagged in the survey — this is your graph's own `frontier-scan` concept (Rule 7!), automated. Findings arrive cited, quarantined, gap-honest — because that's what the researcher does now.
3. **Propose (the synthesis)**: findings × existing map → `list[ProposedNode]`, schema-enforced to your format: `id (kebab, unique against existing), title, type (concept|build|deep-dive|synthesis|frontier), size (S|M|L), summary (one line, your curriculum's voice), domain, cluster (existing or proposed-new), rationale (why this node, citing findings), suggested_edges (wikilinks to existing nodes)`. Craft rules encoded in the prompt: proposals must *connect* (a node with no suggested edges is an orphan — reject in validation), must not duplicate (semantic check against existing summaries — your Vol 03 Ch 20 threshold work, reused: embed the proposal, nearest-neighbor against existing nodes, flag high-similarity collisions for the rationale to address), and must respect Rule 6's spirit (the rationale *is* the written reason a replan demands).
4. **The gate (the point)**: the full Ch 15 machinery, batch mode — the *batch of proposals* presented for review: per node, approve / **edit** (the underrated verdict — you'll tune summaries and sizes constantly; the round-trip must preserve your edits exactly) / reject-with-reason. Approved nodes are written to a **staging file** in curriculum format — never directly into the live curriculum; your existing tooling (and Rule 2's immutability guarantees) governs the final merge; the agent proposes, the human disposes, the graph's own laws hold. Every verdict lands in the audit trail — and here the trail earns its Ch 15 promise: *your rejection reasons become the proposer's Reflexion lessons* (Ch 9 — "rejected: too broad for an S-node" injected into the next run's context; the agent learns your curatorial taste from the record of your judgments). The Bridge isn't just agent→brain; it's brain-keeper→agent, both directions, one nervous system. That's why this is M2's seed.

**Verification.** Format fidelity: proposed nodes parse with the *same parser* your dashboard uses (round-trip test — propose, write to staging, parse, compare; the agent must be a native speaker); uniqueness + orphan + duplicate-collision validators; gate batch flow with edits preserved verbatim; rejection-reason injection appears in next-run context (the learning-loop test); and the end-to-end: a scripted frontier-finding produces a valid, connected, gated, staged proposal. Plus the budget: this is a multi-subgraph L-build — Ch 17's caps and routing throughout, and a per-run price on the ledger.

## Why It Matters
Where this appears in real systems and jobs: an agent that proposes brain nodes for my approval — the seed of The Bridge.

## Hands-On
Build it (est. 2–3 honest days): curriculum parser + survey → researcher-as-subgraph mounting (feel the reuse — this step is a *mapping*, not a build) → proposal schema + validators + collision check → gate batch integration → Reflexion wiring → tests → then the inaugural real run: aim it at one domain you know has moved since your plan froze (the frontier nodes exist because fields move — let it find what moved). Review the batch *seriously*: approve what's genuinely good, edit what's close, reject what's off *with real reasons* — you are training your proposer and exercising Rule 6 in one act. Stage the approved nodes. Run it once more and verify your rejection reasons shaped round two. Tag `agent-v1.0` — the version number is earned. In the note: the inaugural batch with your verdicts, the round-two evidence of learning, the run's price, and one paragraph on M2: what remains between this seed and the full Bridge (deployment — the production domain's business — and the live merge tooling), written as next-milestone reconnaissance.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Walk the four phases, naming which prior build powers each.
2. Why staging-file-plus-human-merge rather than direct writes? Cite the graph's own rules.
3. How does the collision check work, and which Vol 03 machinery does it reuse?
4. Trace one rejection reason from your verdict to round two's changed behavior — the full learning loop.
5. State M2's definition from memory, and name precisely what this seed lacks that the milestone requires.


---

## Wikilinks
[[build-research-agent]]
[[add-the-gate]]
[[reflection-patterns]]
[[subgraphs]]
[[semantic-caching]]
[[cost-latency-budgets]]

## Status log
- Started: 2026-07-21
- Finished: null