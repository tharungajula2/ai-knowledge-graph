---
id: synthesis-memory
title: "Synthesis: The Memory Stack"
domain: memory-knowledge
ring: 6
cluster: "Memory Builds"
type: synthesis
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: []
tags: [memory-knowledge]
---

## ELI5
The node summary sets the task: a **deep-dive review and architecture diagram of the full multi-tier agent memory stack** — the whole ring rendered as one layered picture, from the context window's volatile "now" down through session checkpoints to the durable typed store and the knowledge graph, with the traffic (extract, retrieve, decay, compact) flowing across every boundary. When you can draw this cold, you own how AI systems *remember* — the capability that turns tools into colleagues.

## The Real Explanation
Memory is the engineering of the *store* — everything outside the context window (Vol 01 Ch 8) that an agent can retrieve later [2]. It starts with a *taxonomy*: not one memory but three — semantic facts, episodic events, procedural skills — each with its own lifecycle, stored in typed tables [1]. Information flows across a **stack of tiers**: the volatile context (working memory, the scratchpad — Vol 04 Ch 13), the session checkpoint (short-term — Vol 04 Ch 6), the durable store (long-term — this ring), and sometimes shared memory [2] — with salient bits *extracted* on the way out (judged against durability, generality, non-redundancy, and a privacy filter [3, 8]) and relevant memories *retrieved* on the way in, scored not by similarity alone but by **importance + recency + usage**, with old memories *decaying* by design because the goal is optimal relevance, not maximal recall [4]. The store stays sharp through *compaction* — merging specifics into generalizations, the same detail-for-compactness trade seen at three scales [6] — and honest through *temporal awareness*: facts carry validity intervals, changes reconcile by invalidate-and-append, and "what was true when" becomes answerable [12]. Applied to a person, this is *personalization* — an assistant that knows your facts, history, and working style [7] — bounded always by *privacy*: what should never be remembered, the right to be forgotten, memory-as-friend-not-surveillance [8]. And knowledge itself gets a better shape: not a pile but a **graph** — entities and typed relations as triples [9], extracted from notes with entity resolution as the crux [10], enabling **GraphRAG** — community summaries for global questions, graph walks for relational ones — where vector search structurally fails [11], all made temporal [12] and, at last, turned inward: your own wikilinked brain *formalized* as the knowledge graph it always was [13]. It ships as a **memory layer** that turns your stateless research agent into a colleague that learns [14], a **link-suggester** enriching the graph with typed edges [15], a **self-critical reviewer** auditing your knowledge for structural gaps and intellectual honesty [16], and a **recall agent** that answers "what did I learn?" — grounded, node-cited, across time — the brain interrogating its own growth [17].

## Why It Matters
Where this appears in real systems and jobs: deep-dive review and architecture diagram of the full multi-tier agent memory stack.

## Hands-On
Three renditions, the ritual: **(a)** The narration, written, ≤700 words, your words, every node present and load-bearing. **(b)** The architecture diagram — the node's literal demand: the multi-tier stack drawn vertically (context → session → long-term store → knowledge graph), with the *traffic* as labeled arrows crossing every boundary (extract downward, retrieve upward, decay/compact within the store, reconcile across time), the three memory types as columns in the store tier, and the knowledge graph as the store's structured form with GraphRAG's query-routing beside it. Photograph into the note. **(c)** The 90-second spoken version — its interview home: *"how would you give an AI agent long-term memory?"* — a question that trips most candidates into "just use a vector database," where your layered, typed, decaying, privacy-bounded, graph-shaped answer marks you as someone who's actually built it. Record, critique, re-record.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Deliver the 90-second version cold.
2. Trace one fact's life: extracted from a conversation → stored typed → retrieved by blended score → decayed → compacted → invalidated when it changes. Name every mechanism and chapter.
3. Draw the four-tier stack with the traffic arrows from memory.
4. Place the three memory types and the graph's role on your diagram from memory.
5. Draw the full memory stack from memory.


---

## Wikilinks
[[synthesis-memory]]

## Status log
- Started: 2026-07-21
- Finished: null
