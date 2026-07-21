---
id: build-link-suggester-v2
title: "Build: Link-Suggester v2"
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
wikilinks: ["entity-extraction", "build-node-proposer", "add-the-gate", "reflection-patterns", "build-brain-reviewer"]
tags: [memory-knowledge]
---

## ELI5
The "v2" is a tell — there was a v1, and this is the upgrade the knowledge-graph ring makes possible. The node summary: **entity-aware edge proposals for the brain, still human-approved.** Where a v1 link-suggester might propose connections by *similarity* (Vol 03 — "these two notes are semantically close, maybe link them"), v2 proposes by *entity and relation structure* (this ring — "these two notes discuss the *same entity*, or one's concept *depends-on* another's — here's a *typed* edge"). It's your Node-Proposer's cousin (Vol 04 Ch 18) aimed at *edges* instead of *nodes*, and it makes your brain's graph richer and more connected — still, always, through the gate.

## The Real Explanation
**Why v2 beats v1 — structure beats similarity.** A similarity-based suggester (v1) finds notes that *read* alike — useful, but it proposes untyped "these seem related" links and misses connections between notes that discuss the same *thing* in different words (Vol 03 Ch 6's vocabulary gap) while over-proposing between notes that are merely topically adjacent. An *entity-aware* suggester (v2) uses your Ch 10 extraction: it knows note A discusses the entity "checkpointer" and note B discusses "checkpointer" (entity-resolved, Ch 10 — even if they phrase it differently) → propose a *typed* edge (both `discuss` the checkpointer; or A `depends-on` B if A's concept requires B's). Structure finds connections similarity misses and *types* them meaningfully (Ch 9 — a typed edge is worth far more than "related"). The graph gets not just more edges but *better, meaningful* edges.

**The pipeline — built on the ring.** (1) *Extract* the entities/relations in your notes (Ch 10, done — v2 consumes the graph). (2) *Find candidate edges*: entity co-occurrence (notes sharing a resolved entity that *aren't* yet linked — the missing edges), relation-implied links (A's entity depends-on B's entity → notes should connect), and structural gaps (Ch 16's territory — sparse regions wanting connection). (3) *Propose typed edges*: structured output (`ProposedEdge(source_node, target_node, relation_type, rationale, confidence)` — the relation *type* from your controlled vocabulary, Ch 10) with a rationale citing the shared entity or implied relation. (4) *Gate* (Vol 04 Ch 15, non-negotiable — "still human-approved" per the node): every proposed edge goes to *you* for approve/edit/reject, and — the Reflexion loop (Vol 04 Ch 9) — your rejections teach it your linking taste. Approved edges are written to your brain (staging → merge, per your graph's Rule 2 immutability discipline — the past is locked, edges are additive).

**The design cautions — because a link-suggester can make the graph *worse*.** *Over-linking*: propose too eagerly and the graph becomes a hairball where everything connects to everything (connection density past a point *reduces* signal — a fully-connected graph carries no structural information; the too-loose-threshold disease, Vol 03 Ch 20, at the graph level). Gate hard, propose conservatively, prefer precision over recall (a missed link costs little; a wrong link pollutes). *False edges*: entity resolution errors (Ch 10's over-merge) produce false connections — confidence-gate and let the human catch them. *Meaningless types*: an edge typed "related" is barely better than v1 — insist on *specific* relation types or don't propose. *Entrenchment*: only ever suggesting links within existing dense clusters reinforces what's already connected and ignores the sparse frontiers where new links add *most* value (Ch 16's insight — target the sparse, not the dense).

**Verification.** Precision-focused (a link-suggester's cardinal metric): on a set of proposals, what fraction are edges you'd *actually* approve? (Measure it — your approve-rate is the quality signal.) Assert: proposed edges are typed (never bare "related"); entity-co-occurrence detection correctly finds notes sharing a resolved entity; the gate routes every proposal; rejections feed the next run (Reflexion test — the suggester learns your taste). And the anti-hairball check: on a well-connected region, it proposes *few* new edges (it's not just connecting everything).

## Why It Matters
Where this appears in real systems and jobs: entity-aware edge proposals for the brain, still human-approved.

## Hands-On
Build it (est. 1 day): candidate-edge finder over your Ch 10 graph (entity co-occurrence + relation-implied) → typed-edge proposal with rationale → gate integration (approve/edit/reject) → Reflexion wiring (rejections → next run) → run it on your real brain and *review the batch seriously* (approve good typed edges, reject hairball-y ones with reasons — you're training it and enriching your graph in one act) → measure your approve-rate. Then run again and verify your rejections shaped round two. Stage the approved edges. Tag `graph-v0.2`. The proposal batch with your verdicts + the approve-rate + the round-two learning evidence = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why does entity-awareness (v2) beat similarity (v1)? Name what it finds that similarity misses and what it adds.
2. Walk the four-stage pipeline, and where the gate and Reflexion loop sit.
3. Why prefer precision over recall for link suggestions? What's the cost asymmetry?
4. Name the four design cautions, and why is a fully-connected graph information-poor?
5. What's the cardinal metric, and what does the anti-hairball test verify?


---

## Wikilinks
[[entity-extraction]]
[[build-node-proposer]]
[[add-the-gate]]
[[reflection-patterns]]
[[build-brain-reviewer]]

## Status log
- Started: 2026-07-21
- Finished: null
