---
id: build-learning-recall-agent
title: "Build: \"What Did I Learn?\" Agent"
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
wikilinks: ["temporal-knowledge", "graphrag-deep", "build-brain-mcp-server", "citations-grounding", "build-memory-layer", "brain-as-knowledge-graph"]
tags: [memory-knowledge]
---

## ELI5
The ring's payoff build, and one of the most personally meaningful in your journey: **ask my brain about any period; grounded, node-cited answers.** The node summary is a time machine for your own understanding. "What did I learn in Domain 04?" "How has my understanding of RAG evolved?" "What did I know about agents in July?" — answered from your *own* notes, grounded and node-cited, across *time*. Every capability this ring built converges: temporal knowledge (Ch 12), graph-aware retrieval (Ch 11), memory (Part I), your formalized brain (Ch 13), and citations (Vol 03). Your months of learning become *interrogable*.

## The Real Explanation
**The agent — a temporal, graph-aware, cited recall system over your brain.** It composes the ring:
- **Temporal queries** (Ch 12): the defining capability — "what did I learn *during period X*?" retrieves nodes lit and notes written in that interval (your brain's lit-history *is* temporal data — each node has a lit-date; Ch 12's point-in-time query, over your own journey). "How has my understanding of X *evolved*?" tracks a concept across your notes' versions (deepening over time — the change-tracking query).
- **Graph-aware retrieval** (Ch 11): "what are the themes of what I learned in Domain 05?" → community summary of that domain's subgraph (global question, GraphRAG-answered). "How does what I learned about memory connect to what I learned about RAG?" → graph walk between domains (relational question). Vector RAG couldn't answer either; your graph does.
- **Grounded, node-cited answers** (Vol 03 Ch 10, non-negotiable): every claim cites the *node(s)* it came from — "you learned X ([[node-id]], lit July 20)" — so every recalled fact is verifiable against your own notes. A recall agent that answers without node-citations is untrustworthy (it might confabulate your learning — the cruelest hallucination, inventing a past you didn't have); citations make it a *mirror*, not a *storyteller*.
- **Built on the brain MCP server** (Vol 05 Ch 16): this agent is a *client* of your brain server — it queries your learning through the MCP tools you already exposed (`search_brain`, `what_did_i_learn`, `find_related`), which means it's portable and composable, and it validates that server's design by being its most demanding consumer.

**Why this matters — the meta-payoff.** This agent is your journey, *made queryable*. Practically: it's a study tool (what have I covered? what's connected? what did I rush?), a review tool (Ch 16's honesty findings, now conversational), a portfolio centerpiece (an AI that answers questions about your learning, cited and temporal, is a *striking* demonstration of everything you've built), and — the deepest use — a *reflection instrument*: "how has my thinking about agents evolved from Domain 04 to now?" is a question that helps you *understand your own growth*, answered by the system you built to enable that growth. The snake fully eats its tail: the brain you built to learn AI now answers questions about how you learned AI, across time, grounded in itself.

**The hard parts.** *Temporal grounding accuracy* — "what did I know in July?" must retrieve only July-and-earlier knowledge (Ch 12's point-in-time — leaking later understanding into a past-tense query is the subtle failure; test it hard). *Evolution tracking* — showing how understanding *changed* requires comparing a concept's treatment across time (Ch 12's versioning, over your notes). *Honest gaps* — "what did I learn about X?" when you *didn't* learn X must return "you haven't covered X" (NOT-IN-NOTES, Vol 03 — the recall agent must not confabulate learning you don't have; this is the honesty stakes at their highest — a false memory of *your own understanding* is uniquely corrosive). *Citation integrity across time* — citations must point to nodes valid *for the queried period*.

**Verification.** Grounding: every claim node-cited, citations resolve to real nodes (Vol 03 Ch 10 integrity). Temporal: a point-in-time query returns only period-appropriate knowledge (seed the test — ask "what did I know as of [early date]?" and assert later-lit nodes *don't* appear); an evolution query correctly shows change. Honesty: a query about genuinely-uncovered material returns an honest gap, not confabulation (the critical test). Graph-aware: a relational query walks the graph correctly. Then the real use: ask it genuine questions about your own journey and verify the answers against your memory of learning.

## Why It Matters
Where this appears in real systems and jobs: ask my brain about any period; grounded, node-cited answers.

## Hands-On
Build it (est. 1-1.5 days): the recall agent as a client of your brain MCP server (Vol 05 Ch 16) → temporal query handling (point-in-time, evolution) → graph-aware retrieval for global/relational questions → node-cited grounded answers → honest-gap handling → verification (temporal accuracy, honest gaps, citation integrity). Then the meaningful part: ask it the real questions — "what did I learn in [your earliest domain]?", "how has my understanding of agents evolved?", "what are the cross-domain themes of my journey so far?" — and read its cited answers about your own growth. Tag `recall-v1.0`. The transcript of it answering real questions about your journey (cited, temporal) + the honest-gap test + the point-in-time accuracy test = the note. This is capstone and portfolio gold.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the four capabilities the recall agent composes, and the chapter/ring behind each.
2. Why are node-citations non-negotiable here specifically, and what's the "cruelest hallucination"?
3. How is your brain's lit-history temporal data, and what query type does it enable?
4. Why is the honest-gap test the critical one, and what's uniquely corrosive about confabulating your own learning?
5. How does building this agent *validate* your Vol 05 brain MCP server?


---

## Wikilinks
[[temporal-knowledge]]
[[graphrag-deep]]
[[build-brain-mcp-server]]
[[citations-grounding]]
[[build-memory-layer]]
[[brain-as-knowledge-graph]]

## Status log
- Started: 2026-07-21
- Finished: null
