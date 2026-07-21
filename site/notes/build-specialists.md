## ELI5
The supervisor routes into stubs; today the stubs become organs. The node summary names the roster and the boss fight: **build Scheduler, Scribe, Researcher, and Analyst subgraphs, integrating local API tools and bridging async event loops with sync supervisor threads — verified with mock task completions.** The roster is your agent-lab's, name for name. And the boss fight is *the* hurdle — the async bridge, one of your frozen system's two "greatest hurdles," the thing that once defeated understanding. You've held the weapon since Vol 01 Ch 17. Today it lands.

## The Real Explanation
**The four organs — each small, each shaped by its specialty (Ch 10's argument: different tools, different patterns, different states).**
- **Scheduler** — tools: `read_calendar`, `find_free_slots`, `create_event` (mock a local calendar API — a JSON file behind a thin async client; the *shape* is what matters). Pattern: mostly a short plan-and-execute (Ch 8 — check constraints, find slot, propose) — scheduling is decomposable and stable. `create_event` is a **write**: safety-tagged now, gated in Ch 15.
- **Scribe** — tools: `read_note`, `draft_text`, `save_note` (pointed at a scratch notes dir — *not* your real brain yet; Ch 18 earns that). Pattern: generate-critique-revise (Ch 9 — writing is the canonical reflection customer; rubric: matches the brief, cites sources given, under length). `save_note`: write, tagged.
- **Researcher** — tools: `search_notes` (your Vol 03 retrieval, mounted as a tool — the rings physically connect here: brain-search becomes an agent capability), `search_web` (stub or real per keys). Pattern: ReAct proper (Ch 1–4 — research is the reactor's home turf: next query genuinely depends on last result). Findings returned *with citations* (Vol 03 Ch 10 discipline crosses rings intact).
- **Analyst** — tools: `run_calculation` (a sandboxed `eval`-free math tool — parse with a safe expression library), `summarize_data`. Pattern: reason-heavy ReAct with a reflection pass on numeric claims (Ch 9's external-signal rule: recompute before asserting).
Each: own state schema, own scratchpad (Ch 13 vocabulary arriving next — but build the separation now: internal mess stays internal), boundary mapping to the supervisor's `task_brief` in / structured `SpecialistResult` out (Pydantic: `result: str, artifacts: list[str], citations: list[str], steps_taken: int`).

**The boss fight — bridging async tools with sync graph execution.** The collision, stated plainly at last: your tool clients are `async def` (as all IO should be — Vol 01, Ch 17), but graph node functions in the common execution path are plain sync functions, and *you cannot `await` inside a sync function*. Naive attempts produce the two classic wounds — calling `asyncio.run()` inside a node works until the day something upstream already has an event loop running, then dies with the infamous `RuntimeError: asyncio.run() cannot be called from a running event loop`; and calling the coroutine without awaiting produces the never-awaited warning and a tool that silently *does nothing* (Vol 01 Ch 17's bug #1, now inside an agent where it's ten times harder to spot). The clean resolutions, in order of preference — learn all three, choose deliberately: (1) **go async end-to-end**: LangGraph supports `async def` nodes and `graph.ainvoke()` — if every node is async, tools `await` naturally and there is no bridge because there is no boundary; this is the modern answer and your default; (2) **a dedicated background loop**: when a sync context is *forced on you* (a sync framework, a thread-based server — your agent-lab's actual situation: sync supervisor threads, per the node title), run one event loop forever in a daemon thread and submit coroutines to it via `asyncio.run_coroutine_threadsafe(coro, loop).result()` — the bridge: sync code blocks on a future while the loop-thread does the async work; (3) **`asyncio.to_thread` / executor wrapping** for the inverse problem (a stubborn *sync* tool inside your async world). Build the bridge (option 2) as a small utility class — `AsyncBridge` with `submit(coro) -> result` — test it in isolation (submit a sleep-and-return coroutine from a plain thread; assert result and timing), *then* use it in exactly one specialist while the others go async-native: you'll have implemented both worlds and earned the right to an opinion. And then the homecoming sentence, which you should write the moment it becomes true: *the hurdle that froze agent-lab is now a 30-line utility with a test suite.*

**Verification — mock task completions, per the node.** Per specialist, in isolation (Ch 10's testability dividend — this is why the boundary exists): 2 mock tasks each with scripted tool returns, asserting the `SpecialistResult` shape, citations where promised, steps within bounds, and the pattern's signature visible in the transcript (the Scribe's critique round happened; the Researcher's second query differed from its first). Then integration: 4 end-to-end runs — supervisor routes a real utterance → specialist completes → `finalize` returns — one per organ, checkpointed, on threads. Plus the bridge's isolation tests. All green = the lab lives.

## Why It Matters
Where this appears in real systems and jobs: Build Scheduler, Scribe, Researcher, and Analyst subgraphs, integrating local API tools and bridging async event loops with sync supervisor threads; verify with mock task completions.

## Hands-On
Build it (est. 2 honest days — the M-node earning its size): AsyncBridge + tests first (slay the boss in isolation before the melee) → Scheduler (simplest — plan-and-execute on a JSON calendar) → Researcher (the ring-connector — feel the moment your Vol 03 stack answers an agent's call) → Scribe (reflection wiring) → Analyst → boundary mappings → isolation suites → integration runs → tag `agent-v0.5`. Then the ceremony this whole volume has been walking toward: open agent-lab's specialist code and its async bridge, side by side with yours. Read its bridge *line by line* — you will now recognize every choice, including the ones you'd make differently. Write the comparison paragraph: what it did that yours does better, what it did that you now want to steal. The freeze is officially a mirror; say so in the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. For each organ: its pattern, why that pattern fits its specialty, and its write-tagged tools.
2. State the async collision precisely, and name both classic wounds with their symptoms.
3. Recite the three resolutions in preference order, and defend when option 2 is *forced*.
4. Sketch `AsyncBridge` from memory — the thread, the loop, the submit call, what blocks where.
5. From the side-by-side ceremony: one thing frozen-you got right, one thing present-you would change.


---

## Wikilinks
[[python-async]]
[[build-supervisor]]
[[subgraphs]]
[[reflection-patterns]]
[[plan-and-execute]]
[[build-chat-with-my-brain]]

## Status log
- Started: 2026-07-21
- Finished: null