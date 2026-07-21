---
id: langgraph-checkpointers
title: "Checkpointers"
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
wikilinks: ["langgraph-state", "hitl-interrupts", "git-mastery", "errors-retries-backoff", "scratchpads-working-memory"]
tags: [agents]
---

## ELI5
Your agent is six steps into a ten-step task and the process dies — laptop sleeps, deploy restarts, API hiccup escalates. Without persistence: everything gone, start over, pay again. With a **checkpointer**: the run resumes at step seven as if nothing happened. The node summary — pause, resume, survive crashes — is the humble version. The ambitious version: checkpointing is what turns an agent from a *process* into a *durable conversation with the world*, and it's the load-bearing wall under human-in-the-loop (next chapter), long-running tasks, and time-travel debugging.

## The Real Explanation
**The mechanism — a save file after every node.** Because LangGraph state is explicit and steps are discrete (Ch 5's design, cashing in immediately), the framework can serialize the *entire state* after each node executes and store it. That's a checkpointer: a pluggable store writing `(thread_id, checkpoint_n) → state snapshot`. In-memory for dev; **SQLite/Postgres for real** — and yes, the same Postgres already running your brain (Vol 03, Ch 15) can hold your agents' checkpoints; one database, another table, the co-location argument again.

**Threads — the identity primitive.** Every run carries a `thread_id`. Same thread → the graph loads the latest checkpoint and *continues*; new thread → fresh state. This one primitive quietly delivers three products: (1) **crash recovery** — the node's headline: re-invoke with the same thread_id after any death, resume mid-graph; (2) **multi-session memory** — a conversation that picks up tomorrow where it stopped today is just a thread resumed (the statelessness you've hand-managed since Vol 02 Ch 17's chatbot — the message-list-resending ritual — is now the persistence layer's job; the API is still stateless, but your *application* no longer is); (3) **concurrent users** — thread-per-user isolates state without any code from you. Note for the homecoming file: your agent-lab's "thread state tracking" — one of its opaque phrases — is exactly this, and it just became a thing you can explain to anyone.

**Time travel — the debugging superpower.** Checkpoints form a history: you can list them, inspect state at any past step ("what did the agent believe before step 5?"), **fork** from an earlier checkpoint with edited state, and replay forward. Practically: your agent derailed at step 7 of 12 — instead of re-running (₹, minutes, nondeterminism), rewind to checkpoint 6, fix the poisoned observation in state, resume. This is the agent-debugging equivalent of Git (Vol 01, Ch 19 — snapshots, branches, reflog for your agent's mind; the metaphor is nearly exact and worth writing down).

**What checkpointing is *not* — the boundary that heads off confusion.** It persists *state*, not *side effects*. If step 4 sent an email and you rewind to step 3 and replay, the email does not unsend — and a naive replay sends it *twice*. The idempotency question (Vol 02, Ch 9 — "is this safe to retry?") returns with force: durable execution demands that write-tools be idempotent, deduplicated, or gated. File this as an open wound; Ch 15's gate and Ch 16's failure modes both press on it. Also not-this: checkpointing ≠ long-term memory — a thread remembers *its own run*; cross-thread knowledge ("what did we learn last week?") is Domain 06's subject. Scratchpad vs checkpoint vs memory — Ch 13 draws the full map.

**When to reach for it — the honest tiers.** Dev toys: in-memory, don't overthink. Anything a human waits on, anything multi-session, anything expensive mid-run, anything with an interrupt (next chapter *requires* a checkpointer — an interrupt without persistence is just a crash with manners): durable checkpointer, non-negotiable. The cost is a serialization write per node — milliseconds against the hours it insures.

## Why It Matters
Where this appears in real systems and jobs: pause, resume, survive crashes.

## Hands-On
Three experiments on your Ch 5 graph (~30 lines total): (1) *Survival* — add a SQLite checkpointer + thread_id; mid-run (drop a `breakpoint()` or sleep in a node), kill the process dead; re-invoke same thread; watch it resume mid-graph. Transcript the resume. (2) *Threads* — run tasks on threads "A" and "B" interleaved; verify total isolation; then resume thread A after restarting Python entirely — multi-session memory, witnessed. (3) *Time travel* — list thread A's checkpoints, print state-at-step-2, fork from it with one field edited, resume, and diff the two futures. Screenshot the checkpoint list. Then one paragraph in the note: which of your agent-lab's behaviors that once looked like magic is just these three experiments composed?

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What exactly is saved, when, keyed by what — and why did Ch 5's design make this possible at all?
2. Name the three products the thread primitive delivers, with one sentence each.
3. Explain time-travel debugging via the Git metaphor, and give the rewind-instead-of-rerun economics.
4. State the side-effects boundary and construct the double-send scenario it warns about.
5. Which chapter *requires* a checkpointer to even function, and why?


---

## Wikilinks
[[langgraph-state]]
[[hitl-interrupts]]
[[git-mastery]]
[[errors-retries-backoff]]
[[scratchpads-working-memory]]

## Status log
- Started: 2026-07-21
- Finished: null
