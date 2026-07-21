## ELI5
Every organ so far — graphs, checkpointers, subgraph boundaries — assembles today into the pattern that runs your agent-lab and half the production multi-agent systems in industry: **the supervisor**. One coordinator that reads the incoming task, decides *which specialist team handles it*, dispatches, tracks the thread, and returns the result. The node summary is the spec: a supervisor that routes to 4 specialist subgraphs by intent using structured LLM output, persistence checkpointers, and thread state tracking — verified with 10 routing tests. Today you build the brain-stem; next chapter, the organs it routes to.

## The Real Explanation
**The routing decision — structured output or nothing.** The supervisor's core is one LLM call whose *only* job is classification:
```python
class Route(BaseModel):
    specialist: Literal["scheduler", "scribe", "researcher", "analyst", "none"]
    task_brief: str            # the task, restated cleanly for the specialist
    reasoning: str             # one line — audit trail, not decoration

def route_node(state) -> dict:
    route = gateway.complete(ROUTER_PROMPT, state["messages"], schema=Route)   # enforced!
    return {"route": route}
```
Design decisions, each earned by a past chapter: **schema-enforced** (Vol 02, Ch 6 — a router that can emit "hmm, maybe the researcher?" is not a router; constrained decoding makes invalid routes *impossible*); **`none` is a first-class destination** (the routing analog of NOT-IN-NOTES, Vol 03 — "just answer directly, no specialist needed" for smalltalk and trivia; without it, every "hello" convenes a committee — the least-autonomy principle enforced at the front door); **`task_brief` restates the task** (the specialist receives a clean brief, not the parent's whole conversational sludge — the Ch 10 boundary mapping, made concrete: this string *is* the interface); **`reasoning` is logged** (when routing goes wrong — it will — the one-line why turns debugging from archaeology into reading). The router prompt itself is a classification prompt, and everything from Vol 02 applies: crisp per-specialist descriptions (these are *tool descriptions* in spirit — Ch 3's craft, aimed at teams; the confusion-audit drill applies verbatim), few-shot examples covering the ambiguous boundaries (Vol 02, Ch 4 — show it borderline cases, not easy ones), temperature 0.

**The graph shape.** `route_node` → conditional edge reading `state["route"].specialist` → one of four subgraph nodes (this chapter: **stub specialists** — trivial one-node graphs that echo "scheduler received: {brief}"; real organs arrive next chapter, and the stubs are why the two builds can proceed independently — the Ch 10 boundary, cashing in as project management) or → `direct_answer` node (the `none` path) → `finalize` node (collect the specialist's result into the response) → END. Persistence: **Postgres checkpointer, thread-per-conversation** (Ch 6, non-negotiable per the node spec) — which delivers *thread state tracking*: multi-turn conversations where turn 3's "actually make that 4 PM" routes correctly because the thread's state carries what turn 1 scheduled. Track in state: the route history (`routes: list[Route]` with an append reducer — Ch 5) so the thread knows its own dispatch record.

**The 10 routing tests — per the node, and how to make them mean something.** Mock the router's gateway (fake-provider pattern, fourth appearance — scripted `Route` objects make tests deterministic and free) for the *plumbing* tests, and use the real router for the *judgment* tests with a small routing golden set (Vol 02 Ch 16, applied to classification — this is precision/recall on a 5-class problem; your Vol 01 Ch 12 vocabulary finally meets an agent): (1–4) one clean-cut case per specialist routes correctly; (5) smalltalk → `none`; (6) an ambiguous case (schedule-flavored research: "find a time when both papers' authors are speaking") — assert it routes to your *documented* choice, whichever you decide, because the decision being *deliberate* is the point; (7) thread continuity — follow-up turn routes consistently with thread history; (8) the brief-cleanliness test — `task_brief` contains the task, not the greeting sludge (string assertions on the mapping); (9) checkpointer survival — kill mid-route, resume, dispatch completes; (10) the routes-history reducer appends correctly across turns. Ten green = the brain-stem works.

## Why It Matters
Where this appears in real systems and jobs: Build a LangGraph supervisor that routes to 4 specialist subgraphs by intent using structured LLM output, persistence checkpointers, and thread state tracking; verify with 10 routing tests.

## Hands-On
Build it (est. 1 day, thanks to the stubs): router schema + prompt with few-shots → graph with stub specialists → Postgres checkpointer wired → the routing golden set (~15 utterances across the 5 destinations, ambiguous cases included, expected routes labeled — *write it before tuning the prompt*, per the iron law) → the 10 tests green → then the tuning loop you already know: run the golden set, read the misroutes, fix the prompt (usually a description clause or one more few-shot), rerun, *one change at a time*. Record the before/after routing accuracy in the note. Tag `agent-v0.4`. Homecoming: open agent-lab's supervisor and read its routing prompt cold — annotate which of today's design decisions it makes, which it skips, and one improvement you'd now make to your own frozen code. That annotation goes in the note; it's the freeze becoming a mirror.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why must the route be schema-enforced, and why is `none` a first-class destination? Name both principles at work.
2. What is `task_brief`, in Ch 10's vocabulary, and what does the sludge test verify?
3. What does thread state tracking deliver in user-visible terms? Give the turn-3 example.
4. Which tests use mocked routing and which use the real router — and why does the split matter?
5. Your ambiguous case: which way did you route it, and why is documenting the choice more important than the choice?


---

## Wikilinks
[[subgraphs]]
[[structured-output]]
[[langgraph-checkpointers]]
[[prompt-quality]]
[[build-specialists]]

## Status log
- Started: 2026-07-21
- Finished: null