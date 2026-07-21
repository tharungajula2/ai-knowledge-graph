---
id: temporal-knowledge
title: "Temporal Knowledge"
domain: memory-knowledge
ring: 6
cluster: "Knowledge Graphs"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["memory-extraction", "retrieval-and-decay", "knowledge-graphs-101", "graphrag-deep", "personalization-via-memory"]
tags: [memory-knowledge]
---

## ELI5
"The user is job-hunting" was true in July and false in September. "The CEO is X" changes. "I'm learning Domain 06" becomes "I finished Domain 06." The node summary names the problem that haunts every memory and knowledge system: **facts that change over time.** Knowledge isn't static, but naive stores treat it as if it were — and a system that can't handle change either accumulates contradictions or acts confidently on stale facts (Ch 7's stale-personalization, Vol 01 Ch 10's staleness, now the deep structural version). Time is the dimension most knowledge systems forget, and forgetting it is how they slowly fill with lies.

## The Real Explanation
**The core problem — facts have validity intervals, not just values.** A naive store holds *(user, is-learning, Domain-06)* as if eternal. The truth is *(user, is-learning, Domain-06, valid-from: July, valid-until: September)* — the fact was true *during an interval*. Two distinct time dimensions matter (from temporal-database theory, worth knowing the names): *valid time* (when the fact was true *in the world* — the user learned Domain 06 in July-August) and *transaction time* (when the system *recorded* it — you might log it in July or backfill it later). Confusing them causes subtle bugs; for most agent memory, valid time is what you engineer for. The upgrade: every memory/triple carries temporal metadata (valid-from, valid-until, or a timestamp), transforming the store from "what's true" to "what was true when."

**The update problem — reconciliation, not accumulation (Ch 3's redundancy, now the deep version).** When a new fact contradicts an old one — user says "I got the job" after the store held "user is job-hunting" — the store must *reconcile*, and the options each have a use: *overwrite* (replace old with new — simple, but *loses history*: you can no longer answer "was the user job-hunting in July?"); *invalidate + append* (mark the old fact's valid-until, add the new fact with valid-from — *preserves history*, the temporally-honest choice: both facts are retained, each with its interval, and the store knows the transition happened); *versioning* (full history of a fact's changes). The temporally-aware choice is usually invalidate-and-append: **facts don't get deleted when they change; they get *bounded*** — the old fact remains true-in-its-interval, the new fact true-in-its-interval, and queries specify (implicitly or explicitly) *which time* they mean. This is how a store stops accumulating contradictions: a "contradiction" is just two facts with non-overlapping validity intervals, which is no contradiction at all.

**Temporal queries — what the dimension unlocks.** With time modeled, new questions become answerable: *point-in-time* ("what did I know/believe in July?" — retrieve facts valid-then, ignore facts that came later — crucial for "what did I learn during Domain 04?" — Ch 17's recall agent depends on this exact capability); *change tracking* ("how has my understanding of agents evolved?" — the sequence of a fact's versions); *currency* ("what's true *now*?" — retrieve only currently-valid facts, the default for personalization — Ch 7's stale-fact bug, cured: only act on currently-valid memories). Without temporal modeling, only "everything ever stored, undifferentiated" is queryable, and that's how stale facts leak into current behavior.

**The graph edition — temporal knowledge graphs (connecting Chs 9–11).** Triples get temporal too: *(attention, state-of-the-art-for, NLP, valid-from: 2017, valid-until: ...)* — relations that were true in a period. This is genuinely hard (the graph must version *edges*, and community summaries — Ch 11 — become time-dependent: "the state of the agents domain *as of* when?"), which is why graph staleness (Ch 11's cost) is nastier than index staleness. For your brain, this maps beautifully to your journey's own structure: your knowledge graph *grows over time*, nodes light in sequence, your understanding of early domains deepens as you learn later ones — a *temporal* knowledge graph by nature, where "what did I understand about RAG when I first lit it vs now?" is a real, answerable, temporal question (Ch 17's agent will answer exactly these).

## Why It Matters
Where this appears in real systems and jobs: facts that change over time.

## Hands-On
Add time to your store (~30 lines): (1) Extend your memory/triple schema with valid-from/valid-until; migrate a few facts to carry intervals. (2) Implement invalidate-and-append reconciliation: feed a fact-change ("user finished Domain 06" after "user is learning Domain 06") and verify the store *bounds* the old fact and appends the new — both retained, neither contradicting. (3) Run the three temporal query types: point-in-time ("what was true in [month]?"), currency ("what's true now?"), and change-tracking ("show this fact's history"). Then the brain-specific test: model your own domain-completion as temporal facts and query "what had I learned as of [date]?" — the recall agent's core capability, prototyped. The temporal schema + the reconciliation test + the three query types = the note; feeds Ch 17 directly.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State the core problem — what do facts have besides values, and name the two time dimensions.
2. Recite the reconciliation options, and why is invalidate-and-append the temporally-honest choice?
3. Explain "a contradiction is just two facts with non-overlapping intervals."
4. Name the three temporal query types, and which one cures stale personalization.
5. Why are temporal knowledge graphs especially hard, and why is your brain naturally temporal?


---

## Wikilinks
[[memory-extraction]]
[[retrieval-and-decay]]
[[knowledge-graphs-101]]
[[graphrag-deep]]
[[personalization-via-memory]]

## Status log
- Started: 2026-07-21
- Finished: null
