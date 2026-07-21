---
id: entity-extraction
title: "Entity Extraction"
domain: memory-knowledge
ring: 6
cluster: "Knowledge Graphs"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["knowledge-graphs-101", "ingestion-pipelines", "embeddings-hands-on", "graphrag-deep", "brain-as-knowledge-graph"]
tags: [memory-knowledge]
---

## ELI5
A knowledge graph is only as good as the triples in it — and triples don't extract themselves from prose. The node summary: **LLM pulls entities/relations from my notes.** This build is where your pile of notes starts becoming a graph: an LLM reads text and emits *(subject, predicate, object)* triples, with the two hard problems that make this an M-node not an S-node — reliable extraction and *entity resolution*. It's the ingestion pipeline (Vol 03 Ch 15) for graphs, and it directly feeds Ch 13's formalization and Ch 11's proper GraphRAG.

## The Real Explanation
**The extraction call — text to triples.** An LLM pass (gateway, structured output — the pattern, again) over a note, emitting triples against a schema:
```python
class Triple(BaseModel):
    subject: str          # entity name
    subject_type: str     # Concept | Tool | Person | Paper | ... (your schema, Ch 9/13)
    predicate: str        # the typed relation — from a controlled vocabulary, ideally
    object: str
    object_type: str
    source_note: str      # provenance — every edge traces to its note (Vol 03 Ch 10 habit)
    confidence: float     # extraction certainty (Ch 3's field, again — low-confidence triples flagged)
```
The prompt teaches the schema by example (few-shot — the entity types and relation types you want, with worked extractions) and — critically — *constrains the predicates*: free-form relations produce chaos ("depends-on," "requires," "needs," "built-on" all meaning the same thing fragments the graph), so give the model a *controlled vocabulary* of relation types and make it choose from them (structured output with an enum — Vol 02 Ch 6, aimed at graph consistency). Uncontrolled predicates are to graphs what unstemmed jargon was to keyword search (Vol 03 Ch 6) — the same fragmentation disease.

**Entity resolution — the crux, the thing that makes or breaks the graph (Vol 03 Ch 19's hard half, now yours to solve).** The problem: the same entity appears under many names — "the gate," "HITL approval," "human-in-the-loop check," "the approval gate" are *one* entity, but naive extraction creates *four* nodes, and your graph fragments into synonyms that never connect. Resolution collapses them to one canonical entity. The techniques, ascending in sophistication: *exact-match + normalization* (lowercase, strip articles — catches "The Gate"/"gate"); *alias tables* (a maintained map of known synonyms → canonical — reliable, manual); *embedding-similarity clustering* (embed entity mentions, cluster near-duplicates — your Vol 03 Ch 5 machinery, pointed at entity names; "the gate" and "approval gate" embed close → same entity — but watch the threshold, Vol 03 Ch 20's precision/recall dilemma returns: too loose merges distinct entities, too tight fragments); *LLM resolution* ("are these two mentions the same entity? here's context" — flexible, costly). And your brain's superpower, again: **wikilinks are pre-resolved entities** — `[[hitl-interrupts]]` is a canonical ID you *already assigned by hand*, so your notes hand the resolver ground truth most corpora must guess (Vol 03 Ch 19's "comically well-shaped," cashing in as real extraction leverage).

**The failure modes — the graph's version of the extraction zoo.** *Over-extraction* (spurious triples from noise — the model inventing relations the text doesn't support; Vol 01 Ch 10's hallucination, now poisoning the *graph* with false edges — confidence-gate and provenance-check these); *predicate chaos* (uncontrolled relations fragmenting — the controlled vocabulary fix); *resolution errors* — both directions: *under-merging* (synonyms stay separate, graph fragments) and *over-merging* (distinct entities collapsed — "attention" the mechanism and "attention" the cognitive concept merged, corrupting the graph with false identity — arguably worse than fragmentation because it creates *false* connections); *missing entities* (the model overlooks a real entity — recall failure). Every one is measurable (precision/recall on extracted triples against hand-labeled ground truth — Vol 01 Ch 12, the graph edition), which is how you tune the extractor rather than trusting it.

**Verification.** Hand-label the triples in ~5 notes (ground truth — the labeling *is* the work, as always). Assert: extraction precision (few false triples) and recall (few missed) against your labels; predicate values stay within the controlled vocabulary; resolution correctly merges known synonyms (test with your wikilink aliases) *and* correctly keeps known-distinct entities separate (the over-merge test). Provenance on every triple.

## Why It Matters
Where this appears in real systems and jobs: LLM pulls entities/relations from my notes.

## Hands-On
Build it (est. 1 day): the `Triple` schema + controlled predicate vocabulary → the extraction prompt with schema few-shots → entity resolution (start with normalization + your wikilink alias table, add embedding-clustering if time) → run on ~10 real notes → the ground-truth labeling of 5 → the precision/recall tests + resolution tests. Then the reveal: visualize the extracted graph (even a simple node-edge print or a quick graphviz) and *look at it* — your notes, as a connected structure. Find one triple that's wrong (over-extraction) and one entity that fragmented or over-merged — those specimens are the lesson. Tag `graph-v0.1`. The precision/recall numbers + the graph visualization + the error specimens = the note; this feeds Ch 13 directly.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why must predicates be a controlled vocabulary? Name the disease uncontrolled ones cause and its Vol 03 analog.
2. State the entity-resolution problem and recite the four techniques, ascending.
3. Why are your wikilinks a resolution superpower?
4. Distinguish under-merging from over-merging, and argue why over-merging may be worse.
5. How do precision and recall apply to triple extraction, and what's ground truth?


---

## Wikilinks
[[knowledge-graphs-101]]
[[ingestion-pipelines]]
[[embeddings-hands-on]]
[[graphrag-deep]]
[[brain-as-knowledge-graph]]

## Status log
- Started: 2026-07-21
- Finished: null
