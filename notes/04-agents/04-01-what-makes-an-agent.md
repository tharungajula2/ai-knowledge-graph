---
id: what-makes-an-agent
title: "What Makes an Agent"
domain: agents
ring: 4
cluster: "The Loop"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["map-of-ai", "tool-calling", "multi-hop-retrieval", "agent-failure-modes"]
tags: [agents]
---

## ELI5
A chatbot is a brilliant consultant on a phone call: it can only *talk*. An agent is that consultant given hands, eyes, and permission to keep working: it can *do* something, *see* what happened, and decide what to do next — again and again until the job is done. The node summary is four words and it is the entire field: **reason, act, observe, repeat.** Everything else in this volume — frameworks, patterns, supervisors, gates — is scaffolding around those four words.

## The Real Explanation
**The loop, formally.** You've held all the pieces for two volumes; now assemble them into the canonical cycle:
1. **Reason** — the model examines the goal plus everything gathered so far and decides the next move (a thought, in ReAct vocabulary — Vol 02 Ch 5's chain-of-thought, now aimed at *action selection* rather than answer production).
2. **Act** — the model emits a structured action: a tool call with arguments (Vol 02, Ch 7's mechanic, verbatim — the model *requests*; your code executes).
3. **Observe** — the tool's result is appended to the context. The world has now *talked back*, and this is the line that separates agents from everything before: a chatbot's context grows only with human turns; an agent's context grows with *reality's responses*.
4. **Repeat** — reason again, with the observation in view — until the model decides the goal is met and emits a final answer instead of an action.

**Where you've already run this loop.** Vol 03 Ch 14's multi-hop retrieval *was* this loop with a single tool (retrieval): reason about what to look up → look it up → read the result → form the next query. You played the orchestrator by hand. This volume automates the orchestrator and hands it a toolbox.

**What makes it an agent — the honest boundary.** Formulas float around ("model + tools + loop + goal = agent" — Vol 01, Ch 1); the load-bearing ingredient is **the loop closing through the world**. One tool call and done is a *function with an LLM inside* (your Vol 02 extractor). Tools available but never looped — a chatbot with plugins. The agent property emerges when *the model's own outputs determine what the model sees next*, iteratively, without a human between iterations. That autonomy is the source of everything this ring celebrates (multi-step competence) and everything it fears (Ch 16's failure zoo — the same loop that compounds progress compounds error; note the symmetry now, formally later).

**The spectrum, not the binary.** Real systems sit on a dial of autonomy: a *workflow* (fixed sequence of LLM calls your code orders — reliable, rigid), an *agentic workflow* (code-defined structure, model-decided branches — Part II's graphs live here), a *full agent* (model decides everything each iteration — flexible, unpredictable). The engineering wisdom the whole industry converged on, and the single most useful sentence for interviews: **use the least autonomy that solves the task.** Agents are what you reach for when the path genuinely cannot be known in advance — research, debugging, open-ended synthesis — not a fashion statement to wrap around a three-step pipeline.

**One vocabulary landmine, defused.** "Agent" is used by marketing for everything from a prompt template to a robot. Your test, portable to any conversation: *does the model's output feed back into the model's next input via the world?* If yes — loop through reality — agent. If no — however clever — not yet.

## Why It Matters
Where this appears in real systems and jobs: reason, act, observe, repeat.

## Hands-On
Three exercises on paper: (1) Dissect four systems along the four verbs — your Vol 02 Feynman-Bot, your Vol 03 brain-chat, Vol 03's multi-hop loop, and your frozen agent-lab's supervisor — for each, which verbs exist, which are missing, and where it sits on the autonomy dial. (2) Take one task you do weekly (say, triaging job postings against your profile) and script it three ways: as a workflow, as an agentic workflow, as a full agent — one paragraph each, noting what each gains and risks. (3) Write your own one-sentence agent test, then attack it with the nastiest edge case you can invent (a chatbot that searches the web once? a cron job calling an LLM?) and refine until it survives. The refined sentence opens your note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the four verbs and what each consumes and produces.
2. State the load-bearing ingredient — what exactly closes the loop, and why "through the world" matters.
3. Where had you already run this loop by hand, and with what single tool?
4. Draw the autonomy spectrum and place three of your own systems on it.
5. Deliver the least-autonomy principle and defend it in two sentences.


---

## Wikilinks
[[map-of-ai]]
[[tool-calling]]
[[multi-hop-retrieval]]
[[agent-failure-modes]]

## Status log
- Started: 2026-07-21
- Finished: null
