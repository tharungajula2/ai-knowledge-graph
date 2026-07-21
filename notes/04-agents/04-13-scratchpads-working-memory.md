---
id: scratchpads-working-memory
title: "Scratchpads"
domain: agents
ring: 4
cluster: "LangGraph & Patterns"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["react-by-hand", "langgraph-state", "context-windows", "reflection-patterns", "build-cli-chatbot"]
tags: [agents]
---

## ELI5
Solve a long division in your head and you'll hold intermediate digits in a fragile mental buffer; hand yourself paper and the problem becomes easy — not because you got smarter, but because *working memory moved outside the skull*. The node summary: **what the agent remembers mid-task.** The scratchpad is the agent's paper — and you've been staring at it since Chapter 2 without the name: the accumulated Thought/Action/Observation transcript *is* a scratchpad. This chapter names it, dissects its costs, and places it precisely on the memory map so Domain 06 inherits clean vocabulary.

## The Real Explanation
**What it is, mechanically.** Everything the agent has thought, done, and observed *this task*, riding in the context window and conditioning every next decision (Vol 02 Ch 5's mechanism — written tokens are retrievable working memory — scaled from one answer to a whole task). In your Ch 4 build it was the `transcript` list; in LangGraph it's the messages key in state (with its append reducer, Ch 5); in a plan-and-execute agent it's the plan plus accumulated step results (Ch 8); in Reflexion it briefly grew a sibling (the lesson store, Ch 9). One concept, many wardrobes.

**The three-horizon memory map — draw it once, own it forever.**
- **Scratchpad** (this chapter): *within one task attempt*. Lives in the context window. Dies when the task ends. "What have I found so far?"
- **Episodic / cross-attempt** (Ch 9's Reflexion lessons; Ch 6's checkpointed thread state): *across attempts or sessions of one task/conversation*. Lives in checkpoints or a lesson store. "What did last attempt teach?"
- **Long-term memory** (Domain 06's entire subject): *across tasks, forever*. Lives outside the context in stores the agent reads/writes deliberately. "What do I know about this user/domain/world?"
Confusing these horizons is the single most common muddle in agent conversations — "does your agent have memory?" means three different questions — and you now answer with a map. (Note the elegant fact: your brain-chat made the same cut in Vol 03 Ch 17 — chunks as per-turn scaffolding vs conversation history — the scaffolding/memory distinction, one ring early.)

**The scratchpad's disease — growth — and the treatment ladder.** Every step appends; nothing removes; tokens are money and attention (Vol 01, Ch 8 — and lost-in-the-middle applies to the agent's *own past* too: step 14's decision can miss step 2's crucial observation just as a RAG answer misses chunk 6 of 12). Long tasks therefore need scratchpad management, and the ladder mirrors Vol 02 Ch 17's chatbot trimming, upgraded for agency: (1) **truncate raw, keep decisions** — observations are the bulk (that 3,000-token search result) and their *usefulness decays* once distilled; the pattern: after acting on an observation, replace it in the scratchpad with the distilled finding ("search returned 5 results; relevant: X, source Y") — the thought survives, the raw dump retires; (2) **running summary** — periodically compress the oldest scratchpad into a paragraph (Vol 02 Ch 17's stretch goal, now standard equipment for long tasks); (3) **structured state over prose** — the deepest fix: move critical facts *out of the message stream into typed state fields* (`findings: list[Finding]`, `visited_urls: set[str]`) where they can't be lost-in-the-middle because nodes read them *explicitly* — LangGraph's state-first design (Ch 5) is quietly this treatment, institutionalized; the messages key is the scratchpad, the *other* keys are its disciplined exoskeleton. Design heuristic worth its own line: **facts the agent must not lose go in typed state; the narrative of how it found them can stay prose and be compressed.**

**Privacy recap, now with the full map.** Ch 10 established scratchpads-per-subgraph; the horizon map explains *why* it matters so much: the supervisor's scratchpad is routing narrative, a specialist's is task execution — merge them and every horizon muddles at once (the researcher's 40 search snippets drowning the router's clean context is lost-in-the-middle, self-inflicted, at architecture scale).

## Why It Matters
Where this appears in real systems and jobs: what the agent remembers mid-task.

## Hands-On
One instrumented experiment on your Ch 12 Researcher (~30 lines): (1) *Measure the disease* — run a 6+ step research task; log scratchpad token count per step (tokentools, forever); plot the growth curve; compute what step 10 *would* cost per-call at that slope. (2) *Apply treatment 1* — implement distill-and-replace for search observations; rerun the same task; overlay the curves; record the savings and — the honest check — whether answer quality held (your eyes, plus the citations still resolving). (3) *Apply treatment 3* — move `findings` into a typed state field the final-answer node reads explicitly; verify the answer survives even when you aggressively truncate the message stream (the exoskeleton holding what the prose lost). Two curves + the quality verdict + one paragraph placing all three horizons in your own stack (where does each live, concretely, in your codebase today?) = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Define the scratchpad mechanically and name its wardrobe across four chapters.
2. Draw the three-horizon map with each horizon's lifetime, location, and question.
3. Explain the disease with both of its costs, and recite the treatment ladder.
4. Deliver the design heuristic about typed state vs prose narrative.
5. Why is per-subgraph scratchpad privacy a memory-horizon issue, not just tidiness?


---

# PART III — REAL AGENTS
*7 chapters. The training wheels come off: a real research agent, the gate made law, the failure zoo, the bill, the agent that feeds your brain — and the ring closes.*

---

## Wikilinks
[[react-by-hand]]
[[langgraph-state]]
[[context-windows]]
[[reflection-patterns]]
[[build-cli-chatbot]]

## Status log
- Started: 2026-07-21
- Finished: null
