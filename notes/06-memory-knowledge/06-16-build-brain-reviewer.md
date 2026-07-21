---
id: build-brain-reviewer
title: "Build: Self-Critical Graph Reviewer"
domain: memory-knowledge
ring: 6
cluster: "Memory Builds"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["reflection-patterns", "brain-as-knowledge-graph", "build-link-suggester-v2", "prompt-quality", "synthesis-foundations"]
tags: [memory-knowledge]
---

## ELI5
Your brain is growing — nodes lighting, edges accumulating (Ch 15), knowledge deepening. But is it growing *well*? Are some domains under-connected islands? Are there notes that claim understanding they don't demonstrate? The node summary: **build a self-review script that parses note links, identifies sparse domains, and prompts LLMs to suggest new entity connections and honesty checks; verify with local note files.** This is your brain *reviewing itself* — a graph-aware quality auditor that finds structural weaknesses and intellectual honesty gaps. Reflection (Vol 04 Ch 9) aimed at your own knowledge graph.

## The Real Explanation
**The two review dimensions — structure and honesty.**
1. **Structural review** (graph analytics — Ch 13's unlocked queries, applied): parse the note-link graph and compute health metrics — *sparse domains* (rings with few internal or cross-domain links — knowledge islands that should connect to the whole but don't; the node's "identifies sparse domains"); *orphan nodes* (notes with no incoming/outgoing links — disconnected knowledge); *weak bridges* (domains that *should* relate — foundations underpins everything — but have thin connection); *centrality imbalance* (a domain where one node carries all the links and the rest are peripheral). These are graph-structural facts, computable (Ch 13's centrality/connectivity queries), and each points at a *specific* place your knowledge graph is weaker than it should be — actionable, not vague.
2. **Honesty review** (LLM-powered — the node's "honesty checks"): this is the deeper, more Vizier-soul dimension. Prompt an LLM to audit notes for intellectual honesty against your own standards: *claimed-but-undemonstrated understanding* (a note that asserts a concept without the Feynman explanation or worked example your template demands — Vol 01's whole method: does this note actually *show* understanding or just *claim* it?); *missing prerequisites* (a note using a concept it never links to or grounds); *staleness* (a note whose understanding you've since deepened — Ch 12's temporal dimension — flagged for update); *overconfidence* (claims stated more strongly than the note's evidence supports — Vol 01 Ch 10's calibration, aimed at your own writing). This is your brain holding *itself* to the honesty standard the whole curriculum preaches.

**The output — actionable, gated suggestions.** The reviewer produces a *review report* (structural metrics + honesty flags, per domain) and *suggestions*: sparse domain X wants connections to Y (feeds Ch 15's link-suggester — the reviewer *finds* the sparse regions the suggester should target, closing a loop); note Z claims understanding it doesn't demonstrate — revisit it; these notes are stale — update. Suggestions that would *modify* the brain (new edges, flagged notes) route through the gate (Vol 04 Ch 15) or, for edges, hand off to Ch 15's suggester; the reviewer *diagnoses*, the human (with the suggester's help) *treats*. Crucially, honesty flags are *for you* — "this note overclaims" is an invitation to re-study, exactly the curriculum's self-honest spirit: the reviewer is a mirror that shows you where your understanding is thinner than your notes pretend.

**Why this is deeply on-brand — and genuinely useful.** Your whole curriculum runs on *earned* understanding (light a node only when you can Feynman it, Prove It from memory). A self-critical reviewer *operationalizes* that standard: it catches the notes where you lit the node but the understanding was shakier than you admitted, the domains you rushed and under-connected, the claims you made bigger than your evidence. It's the anti-self-deception tool for a self-directed learner — the thing that keeps 228 nodes *honest* rather than 228 nodes *checked-off*. And it's a striking portfolio artifact: "I built an AI that audits my own knowledge for intellectual honesty" is a sentence that signals exactly the metacognitive maturity senior roles want.

**Verification — local note files, per the node.** Run against your real notes. Structural: assert the sparse-domain and orphan detection matches hand-analysis of a subgraph (compute connectivity for 3 domains by hand, verify the reviewer agrees). Honesty: seed a *deliberately overclaiming* test note (asserts a concept with no demonstration) and a *deliberately stale* one, assert the reviewer flags them; and — the calibration check (Vol 03 Ch 18's judge-calibration, essential here) — review 10 of its honesty flags *yourself* and measure agreement, because an honesty-reviewer you don't trust is worse than none (a false "you overclaim here" erodes trust; a missed one defeats the purpose). Report the agreement number.

## Why It Matters
Where this appears in real systems and jobs: Build a self-review script that parses note links, identifies sparse domains, and prompts LLMs to suggest new entity connections and honesty checks; verify with local note files.

## Hands-On
Build it (est. 1 day): note-link parser → structural metrics (sparse domains, orphans, weak bridges, centrality) → honesty-review LLM prompt (against your Feynman/Prove-It standards) → review report generator → gate/suggester handoff for actionable items → verification (structural vs hand-analysis; honesty vs seeded test notes; judge-calibration on 10 flags). Run it on your *actual* brain and read the report *honestly* — which domain is your weakest-connected? Which note did it catch overclaiming? (Resist defending yourself — the flag is a gift.) Tag `graph-v0.3`. The review report + the calibration agreement number + one honesty flag you *agree* with (and what you'll do about it) = the note. This is the ring's most introspective build; treat its findings as study guidance.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the two review dimensions, and the specific checks under each.
2. What structural weaknesses does the graph analysis find, and why is each actionable?
3. What does the honesty review audit for, and how does it operationalize your curriculum's "earned understanding" standard?
4. How does the reviewer close a loop with Ch 15's link-suggester?
5. Why is judge-calibration essential here specifically, and what does a false honesty-flag cost?


---

## Wikilinks
[[reflection-patterns]]
[[brain-as-knowledge-graph]]
[[build-link-suggester-v2]]
[[prompt-quality]]
[[synthesis-foundations]]

## Status log
- Started: 2026-07-21
- Finished: null
