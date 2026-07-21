---
id: memory-architectures
title: "Memory Architectures"
domain: memory-knowledge
ring: 6
cluster: "Agent Memory"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["context-windows", "langgraph-checkpointers", "scratchpads-working-memory", "build-memory-taxonomy", "why-rag"]
tags: [memory-knowledge]
---

## ELI5
You've built the filing cabinet (Ch 1); now understand where it sits in the whole machine. The node summary is the organizing frame of the entire ring: **context vs store; the memory stack.** Every memory system on Earth is an answer to one question — *what lives in the limited context window right now, versus what lives in an unlimited store to be retrieved when needed?* — and the architecture is the machinery that moves information across that boundary intelligently.

## The Real Explanation
**The fundamental divide — context vs store (Vol 04 Ch 13's line, now the whole subject).** *Context* is the model's working memory: everything in the window right now (Vol 01 Ch 8), fast to use, expensive per token, hard-capped, and *volatile* (gone when the window rolls). *Store* is everything outside the context: databases, vector stores, files — unlimited, cheap to hold, *durable*, but *invisible to the model until retrieved*. The entire art of memory is managing traffic across this boundary: what to *promote* from store into context (retrieval — Vol 03's whole skillset, re-aimed), what to *demote* from context into store before it's lost (extraction — Ch 1, Ch 3), and what to simply drop.

**The memory stack — the full architecture, tier by tier.** Layer them from most-immediate to most-durable, and notice you've built pieces of every tier already:
1. **Working memory (the context window itself)**: the current turn's messages, the scratchpad (Vol 04 Ch 13). Immediate, volatile. The model's "now."
2. **Short-term / session memory (the checkpoint)**: the current conversation/thread's state (Vol 04 Ch 6 — checkpointers). Survives within a session or task; the message-list-you-resend, now persisted. Horizon two of the three-horizon map.
3. **Long-term memory (the store — this ring's subject)**: durable facts, events, and skills (Ch 1's typed tables) that persist *across* sessions and tasks. Horizon three, finally built. Retrieved into context when relevant.
4. **(Sometimes) shared/organizational memory**: knowledge shared across users or agents (a team's blackboard, Vol 05 Ch 4, made durable; or a shared knowledge base). Not always present.

The **flow** across tiers is the architecture: information enters as working memory → salient bits get *extracted* to long-term store (Ch 3) as the session proceeds or ends → future sessions *retrieve* relevant long-term memories back into working memory → the cycle repeats, the agent accumulating knowledge it can carry forever. That loop — extract on the way out, retrieve on the way in — is what makes an agent *learn* rather than merely *run*.

**The two hard problems the architecture must solve** (previewing the ring). *What to promote into context, and when* — you can't retrieve *all* memories every turn (context is finite, and irrelevant memories are noise that degrades performance — the lost-in-the-middle tax, Vol 01 Ch 8, and the retrieval-precision problem, Vol 03). So memory retrieval needs relevance scoring, and often more: importance, recency, not just similarity (Ch 4). *What to keep vs forget* — an ever-growing store gets slow, expensive, and noisy; deliberate forgetting (Ch 4) and compaction (Ch 6) keep it sharp. These two problems — surfacing the right memory and pruning the wrong ones — are the engineering the rest of Part I builds.

**Where memory retrieval *is* RAG — and where it isn't.** The retrieval half is your Vol 03 stack pointed at memories instead of documents (embed the query/context, nearest-neighbor against stored memories — same machinery). But memory adds what document-RAG lacks: *writing* (extraction — documents are given; memories are *created* from interaction), *lifecycle* (memories update, decay, expire — documents are static), and *typing* (Ch 1's three types — documents are undifferentiated). Memory is RAG plus a write path plus a lifecycle plus a taxonomy. Recognizing the shared retrieval core (you already own it) while respecting the additions (this ring) is the right mental model.

## Why It Matters
Where this appears in real systems and jobs: context vs store; the memory stack.

## Hands-On
Map the stack onto your own systems (concept node, concrete): (1) Draw the four-tier stack and, for each tier, name *exactly which piece of your code* implements it today (working = your agent's message state; short-term = your LangGraph checkpointer; long-term = Ch 1's tables; shared = your brain MCP server, arguably). The gaps you can't fill are what this ring builds. (2) Trace the flow for a concrete scenario: your research agent (Vol 04) learns your preferences over three sessions — draw information entering as working memory, extracting to long-term, retrieving back next session. Mark every promote/demote/drop decision. (3) Write the paragraph: how is memory retrieval the same as Vol 03 RAG, and what three things does it add? The stack-with-code-map + the flow trace + the RAG-comparison paragraph = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the context-vs-store divide and the three traffic decisions across the boundary.
2. Recite the four-tier memory stack, and which of your existing builds implements each.
3. Describe the extract-out / retrieve-in loop and why it's what makes an agent *learn*.
4. Name the two hard problems the architecture must solve, and which chapters address each.
5. How is memory retrieval RAG, and what three things does memory add that documents lack?


---

## Wikilinks
[[context-windows]]
[[langgraph-checkpointers]]
[[scratchpads-working-memory]]
[[build-memory-taxonomy]]
[[why-rag]]

## Status log
- Started: 2026-07-21
- Finished: null
