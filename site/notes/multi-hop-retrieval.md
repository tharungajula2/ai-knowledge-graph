## ELI5
"Which build node produced the tool my supervisor routes to for scheduling?" No chunk in your brain answers that — because the answer lives in **two** chunks connected by a fact: first find *which tool the supervisor routes to for scheduling* (hop one), *then* search for *which build produced that tool* (hop two — a query you could not have written until hop one answered). The node summary: **questions that need two lookups.** Single-shot retrieval — everything you've built — structurally cannot do this, no matter how good the ranking gets. The fix isn't a better search; it's search *in a loop*.

## The Real Explanation
**Why single-shot fails, precisely.** The query vector for the compound question is an average of both sub-questions' meanings (Ch 3's multi-topic blur, now on the query side) — it lands *between* the two relevant neighborhoods and retrieves neither well. Worse: hop two's query *contains information that doesn't exist yet* — it needs hop one's answer as input. No amount of expansion (Ch 13) fixes that; expansion rephrases what you know, it cannot inject what you've not yet learned. This is the dependency line drawn last chapter, now formal: **decomposition = independent sub-queries, parallel; multi-hop = dependent sub-queries, sequential, each hop's query built from the last hop's answer.**

**The mechanism — retrieve-read-retrieve.** The loop: (1) LLM examines the question → emits the first resolvable sub-query (structured output — Vol 02, Ch 6); (2) retrieve; (3) LLM reads the hits → extracts the bridging fact ("the supervisor routes scheduling to the Scheduler subgraph") → either emits the *next* sub-query (now writable: "which build node created the Scheduler subgraph?") or declares readiness; (4) loop until answerable or hop-budget exhausted; (5) generate the final answer over the *accumulated* evidence from all hops, cited per Ch 10 (each claim traceable to its hop's chunks — provenance across hops is where citations earn double). Now name what you just read, because you've seen this exact shape before: **an LLM deciding an action, acting, reading the result, deciding again — Vol 02 Ch 7's agent loop, with retrieval as the only tool.** Multi-hop RAG is the bridge between your RAG ring and your agents ring; Domain 04's research agent is this loop with more tools and more ambition. The rings connect here — feel the click.

**The costs and the guards (agent-loop diseases, previewed).** Each hop = ≥2 LLM calls + a retrieval → latency and money stack linearly per hop; set a **hop budget** (2–3 covers nearly all real questions). **Error propagation** is the sharp one: a wrong bridging fact at hop one poisons every later hop — the compounding-error disease Vol 02 Ch 5 warned about in reasoning chains, now with retrieval interleaved; the guard is grounding discipline *per hop* (each bridging fact must cite its chunk — Ch 10 machinery, applied mid-loop, not just at the end) plus honest per-hop refusal (a NOT-IN-NOTES at hop one should stop the loop, not send it hallucinating into hop two). **When not to loop:** most questions are single-hop, and running the loop on them wastes two LLM calls to conclude "one hop sufficed" — so production systems *route*: a cheap classifier call (or heuristics: comparative phrasing, chained possessives, "the X of the Y that Z") decides single-shot vs multi-hop. Routing-by-query-type is now a three-chapter drumbeat (Ch 9, 13, 14) — it's how retrieval ladders stay affordable.

**The horizon, one honest paragraph.** Multi-hop over a *pile of chunks* re-derives connections at query time, every time. When the connections themselves are the corpus's soul — entities and relationships, like a brain full of wikilinks — there's a structure that pre-computes them: a knowledge *graph*, walked rather than searched. That's Ch 19 (GraphRAG), and your wikilinked notes are almost comically well-shaped for it. Two chapters of patience.

## Why It Matters
Where this appears in real systems and jobs: questions that need two lookups.

## Hands-On
Paper + one manual run — no build (the automated version *is* Domain 04 material; today is mechanism-mastery): (1) Write 5 genuinely multi-hop questions about your own brain (the test: hop two's query is unwritable without hop one's answer — verify each against this test, and discard pretenders that are merely compound). (2) Pick two and run the loop *by hand*: you play the orchestrator, your pipeline plays the retrieval tool — write hop one's sub-query, run it, extract the bridging fact *with its citation*, write hop two's now-possible query, run it, compose the final cited answer. Transcribe both runs fully. (3) Sabotage drill: re-run one with a deliberately wrong bridging fact and watch hop two retrieve confident irrelevance — error propagation, witnessed personally, one paragraph in the note. (4) Write the routing heuristic you'd use to detect multi-hop questions, as three concrete textual signals.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why does single-shot fail structurally? Two independent reasons — the averaged vector and the missing information.
2. State the decomposition/multi-hop line in one sentence using "dependency."
3. Walk the retrieve-read-retrieve loop from memory, and name what it is in Vol 02's vocabulary.
4. Name the three diseases and their guards, and connect error propagation to its Vol 02 ancestor.
5. What does GraphRAG pre-compute that multi-hop re-derives, and why is your corpus special for it?


---

## Wikilinks
[[query-rewriting-hyde]]
[[tool-calling]]
[[citations-grounding]]
[[graphrag-preview]]
[[reasoning-prompts]]

## Status log
- Started: 2026-07-21
- Finished: null