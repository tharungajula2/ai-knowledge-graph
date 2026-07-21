---
id: langgraph-state
title: "LangGraph: Nodes & State"
domain: agents
ring: 4
cluster: "LangGraph & Patterns"
type: concept
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-agent-from-scratch", "langgraph-checkpointers", "subgraphs", "build-supervisor"]
tags: [agents]
---

## ELI5
Your Chapter 4 agent is one while-loop with one brain deciding everything each turn. Now imagine wanting: a routing step here, a tool step there, a quality-check step that can send work *back*, different paths for different intents. Bolting that onto a while-loop breeds spaghetti. **LangGraph's move: stop hiding the control flow inside a loop — draw it.** An agent becomes a *graph*: nodes are work steps, edges are "what happens next", and one shared **state** object flows through everything. The node summary calls it the graph mental model, and once it clicks, you'll see every agent system — including your frozen agent-lab — as a diagram you could draw on a napkin.

## The Real Explanation
**The three primitives — all of LangGraph in one breath.**
- **State**: a typed, shared data structure (a `TypedDict` or Pydantic model — your schema instincts apply verbatim) that every node reads from and writes to. It typically carries the message history, intermediate results, counters, flags. State is *the* single source of truth for a run.
- **Nodes**: plain Python functions with the signature `def node(state) -> dict` — take the current state, do work (call the LLM via your gateway, run a tool, pure computation), return a *partial update* to merge into state. A node is just a function; there is no magic in a node.
- **Edges**: what runs next. *Fixed edges* (`A → B`, always) encode workflow structure; **conditional edges** — a function reading state and returning the next node's name — encode decisions. Conditional edges are where agency lives in a graph: "if the model requested a tool → tool node; if it produced a final answer → END."

**Your Chapter 4 agent, redrawn.** The bare ReAct loop is a two-node graph: `reason` (LLM call) → conditional edge (parse the output: action or final?) → `act` (dispatch tools) → back to `reason`. Cycle until END. Same machine — but now *the loop is visible structure*, and extending it is drawing, not surgery: add a `route_intent` node before `reason`, a `check_quality` node after, a separate path for a different task type. Graphs turn control-flow changes from refactors into edits.

**Reducers — the one subtle primitive.** When a node returns `{"messages": [new_msg]}`, should that *replace* state's messages or *append*? LangGraph lets each state key declare its merge rule — a **reducer**. Messages append (`add_messages` is the canonical reducer); a counter might sum; a flag replaces. Reducers matter doubly in parallel execution: when two branches both write a key, the reducer defines how their writes combine — this is exactly the kind of question a while-loop never forced you to answer precisely, and graphs do. (File it: parallel specialists in Ch 12 lean on this.)

**Why graphs won the agent-framework war — four honest reasons.** (1) *Cycles are first-class*: agent loops need iteration; DAG-shaped pipeline tools can't express "go back and try again" — LangGraph's whole reason for existing over its ancestor chains. (2) *Inspectability*: the graph is drawable (literally — it renders itself), and a drawn system is a debuggable, explainable, onboardable system. (3) *Interruptibility*: because state is explicit and steps are discrete, execution can pause between any two nodes — the foundation Ch 6 (checkpointers) and Ch 7 (human interrupts) build on; a while-loop's state lives in local variables and dies with the process. (4) *Composability*: a graph can be a node in a bigger graph (Ch 10's subgraphs) — which is precisely your agent-lab's supervisor-and-specialists shape. Notice the pattern of reasons: none is "the LLM gets smarter." Frameworks buy you *engineering properties around* the model, never intelligence inside it.

**The honest cost.** A framework is a dependency with opinions: versions move, abstractions occasionally leak, and debugging sometimes means reading framework source. The mitigation is exactly what you did in Ch 4 — you can always drop below the abstraction, because you've built what's under it. That's the curriculum's bet, paying off.

## Why It Matters
Where this appears in real systems and jobs: the graph mental model.

## Hands-On
(1) *Paper*: draw your Ch 4 agent as a graph — nodes, fixed edges, the conditional edge with its two exits labeled. Then extend the drawing twice without code: add an intent-router up front; add a quality-check node that can route *back* to reason. Feel how cheap extension became. (2) *Code*: install LangGraph and rebuild the Ch 4 agent minimally — a `State` with `messages` (with the append reducer) and `steps: int`, a `reason` node calling your gateway, an `act` node calling your existing dispatch (reuse Ch 4's tools verbatim — good architecture transplants), the conditional edge, END. Run it on mock tasks 1 and 2 from Ch 4's suite; assert identical outcomes. (3) *The rendering*: have LangGraph draw your graph to an image — put it in the note beside your hand drawing. The build should take an evening precisely because Ch 4 taught you what every piece is *for*; write one sentence about which framework abstraction felt like relief and which felt like ceremony.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Define state, node, edge, and reducer, each in one sentence, each with its Ch 4 ancestor named.
2. Redraw the bare ReAct loop as a graph from memory, conditional edge labeled.
3. Why do cycles disqualify DAG pipelines from agent work?
4. Recite the four engineering properties graphs buy — and the thing frameworks never buy.
5. When two parallel branches write the same state key, what decides the outcome?


---

## Wikilinks
[[build-agent-from-scratch]]
[[langgraph-checkpointers]]
[[subgraphs]]
[[build-supervisor]]

## Status log
- Started: 2026-07-21
- Finished: null
