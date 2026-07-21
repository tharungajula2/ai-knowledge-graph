## ELI5
Vector search (Vol 03) finds things *similar* to your query; it cannot find things *related* to each other (Vol 03 Ch 19's diagnosis). The node summary names the structure that can: **entities, relations, triples.** A knowledge graph represents knowledge the way your brain actually does — as *things* connected by *relationships* — and once knowledge has that shape, it answers questions no pile of text ever could. Your wikilinked notes have been a knowledge graph in disguise this whole time; this chapter gives you the formal vocabulary to see it.

## The Real Explanation
**The triple — the atom of knowledge.** A knowledge graph is built from **triples**: *(subject, predicate, object)* — *(Tharun, is-learning, AI-engineering)*, *(the-checkpointer, persists, agent-state)*, *(attention, was-introduced-in, "Attention Is All You Need")*. Each triple is one fact, one edge. Subjects and objects are **entities** (nodes — the *things*: people, concepts, tools, papers); predicates are **relations** (edges — the *connections*, and crucially they're *typed*: "persists," "was-introduced-in," "depends-on" — the relationship's *meaning* is first-class, not just "these are linked"). A knowledge graph is a set of triples, which is a graph of typed entities and typed relations. That's the whole data model — deceptively simple, profoundly expressive.

**Why this shape unlocks new questions.** Because relationships are explicit and typed, you can *traverse* and *reason over structure* in ways flat text forbids: *multi-hop by walking edges* ("what did the tool my supervisor routes to depend on?" — follow routes-to, then depends-on — Vol 04 Ch 14's multi-hop, now a *graph walk* instead of an expensive per-query retrieval loop); *relational queries* ("how are X and Y connected?" — find the path between two nodes — impossible for vector search, Vol 03 Ch 19); *aggregate/global queries* ("what are all the tools in the agents domain?" — query by entity type and relation — the global questions the pile couldn't answer); *pattern queries* ("find all concepts that depend on something in the foundations domain"). The structure *is* the capability: knowledge shaped as a graph answers connection-questions natively.

**The vocabulary landscape — orient without drowning.** *Ontology / schema*: the *types* allowed — what entity types exist (Concept, Tool, Person, Paper), what relation types connect them (depends-on, introduced-by, part-of). A schema makes a graph queryable and consistent (your curriculum *has* one implicitly: nodes have types, domains, wikilinks — Ch 13 formalizes it). *RDF and property graphs*: two main technical traditions — RDF (triples, the semantic-web lineage, SPARQL query language) and property graphs (nodes/edges with properties, Cypher query language, Neo4j the famous engine) — you don't need to master either now; know they exist and that property graphs are the more common modern choice for LLM-era knowledge graphs. *Knowledge graph vs vector store*: not rivals — *complements* (GraphRAG, Ch 11, uses both: the graph for structure, vectors for semantic entry points). The mature system has both, each doing what it's best at.

**The honest costs — why not everything is a graph.** Graphs are powerful and *expensive to build well*: extracting reliable entities and relations from text is hard (Ch 10 — LLM extraction, error-prone), *entity resolution* is the crux ("the gate," "HITL approval," "the human check" must resolve to *one* entity or the graph fragments — Vol 03 Ch 19's hard half), schemas require design and maintenance, and keeping a graph current as knowledge changes (Ch 12) is genuinely hard. For many uses, vector RAG's "pile of chunks" is simpler and sufficient (Vol 03 Ch 19's adoption judgment). Graphs earn their cost when *relationships and structure are the value* — which, for a wikilinked brain built by someone who thinks in connections, they emphatically are.

## Why It Matters
Where this appears in real systems and jobs: entities, relations, triples.

## Hands-On
See the graph you already have (concept node, concrete): (1) Take five of your linked notes and write out their knowledge as *explicit triples* — every fact as (subject, predicate, object), every wikilink as a typed relation (not just "links-to" but *what kind* of link — "depends-on," "part-of," "contrasts-with"). Count how many triples five notes contain — the density will surprise you. (2) Now query your triples by hand: pick a multi-hop question and *walk the edges* to answer it; pick two distant entities and find the *path* between them. Feel structure answering what similarity couldn't. (3) Sketch the implicit *schema* of your brain: what entity types exist (Concept, Build, Tool, Person, Milestone...), what relation types (depends-on, part-of, introduced-in...). This sketch is Ch 13's formalization, started. The triples + the by-hand graph queries + the schema sketch = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Define the triple and its three parts, and why typed relations are the key feature.
2. Name four question-types a graph answers that vector search structurally cannot, with an example each.
3. Distinguish ontology/schema, RDF vs property graphs, and graph-vs-vector (rivals or complements?).
4. Why is entity resolution the crux, and what breaks without it?
5. When do graphs earn their cost, and why is your brain an especially strong case?


---

## Wikilinks
[[graphrag-preview]]
[[multi-hop-retrieval]]
[[entity-extraction]]
[[brain-as-knowledge-graph]]
[[why-rag]]

## Status log
- Started: 2026-07-21
- Finished: null