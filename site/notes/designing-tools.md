## ELI5
Hand a new intern a drawer of unlabeled instruments and vague gestures, and they'll grab wrong tools for wrong jobs. Label the drawer well — clear names, one-line purposes, what goes in, what comes out, when *not* to use each — and the same intern performs. The agent is that intern forever: it chooses tools **by reading their descriptions and nothing else** (Vol 02, Ch 7 planted this; this chapter grows it into a craft). The node summary: schemas, descriptions, why naming matters. Tool design is prompt engineering aimed at a decision-maker, and it's where most real-world agent failures are actually born.

## The Real Explanation
**The anatomy of a tool, and who reads each part.** A tool definition has four organs: the **name** (read at decision time — the first and sometimes only signal), the **description** (read at decision time — the full advertisement), the **parameter schema** with per-field descriptions (read at call-construction time — how the model fills arguments; Pydantic → JSON Schema, the Vol 02 Ch 6/18 machinery, verbatim), and the **return shape** (read at observation time — what the model must make sense of afterward). Design all four *for the reader*: three of the four readers are the model itself.

**Naming — the cheapest quality lever.** Names carry verb-object semantics the model pattern-matches hard: `search_notes` vs `query_execution_engine` for the same function changes selection behavior measurably. Rules: verb_noun, specific over general (`get_weather` not `get_data` — a general name invites general misuse), consistent verb vocabulary across the toolbox (all reads are `get_*`/`search_*`, all writes are `create_*`/`update_*` — consistency lets the model infer safety class from name alone, which Ch 15's gate will exploit), and never two names a reasonable reader could confuse (`search_notes` + `find_notes` in one toolbox is a coin-flip generator).

**Descriptions — the advertisement with boundaries.** The template that works: *what it does* (one sentence) + *when to use it* + *when NOT to use it* + *what it needs* + *what it returns*. The negative space is the part amateurs skip and the part that prevents the two classic misuse modes (Vol 02, Ch 7): wrong-tool-chosen and tool-called-when-none-needed. "Searches the user's personal notes. Use for questions about the user's own knowledge or past writing. Do NOT use for general world knowledge — answer those directly. Requires a specific topic, not a vague theme. Returns up to 5 chunks with sources." Every clause is steering. Parameter descriptions steer equally: `city: "Exact city name, e.g. 'Hyderabad'. Never a country or region."` is the difference between clean calls and garbage arguments.

**Granularity — the architectural decision.** Too fine (one tool per micro-operation: `open_file`, `read_line`, `close_file`) → the model orchestrates plumbing it shouldn't see, burning iterations and inviting error. Too coarse (`do_research(topic)` — a tool that is itself an agent) → the model can't steer or recover mid-operation, and observations become opaque blobs. The heuristic: **a tool should be one meaningful decision's worth of action** — sized so that choosing it is a sensible reasoning step and its observation is a sensible reasoning input. When you find the model making the same 3-call sequence repeatedly, fuse it into one tool; when one tool's failures are opaque, split it.

**Returns and errors — designing the observation.** The tool's output becomes model context (token-priced! — return the 5 fields the agent needs, not the 300-field raw API dump; Vol 01 Ch 8 economics apply to observations too), so shape it: structured, compact, self-describing keys. And errors are observations too — the single most load-bearing rule in this chapter: **a failing tool must return a legible, actionable error string, never raise into the void.** `"error: city 'Hyd' not found — did you mean 'Hyderabad'?"` lets the loop self-correct (Vol 02, Ch 7's error-feeding); an unhandled exception kills the run. Design every tool's failure modes as carefully as its success mode — the agent's resilience *is* the sum of its tools' error messages.

**Safety class — the seed of the gate.** Tag every tool at design time: *read* (safe to call freely), *write* (changes the world — idempotency question from Vol 02 Ch 9 applies), *dangerous* (irreversible or external: send, delete, pay). The tag does nothing today; Ch 15 builds the gate that consults it, and your agent-lab's approval gate is this taxonomy, enforced. Designing safety class in from day one is the difference between adding a gate and retrofitting one.

## Why It Matters
Where this appears in real systems and jobs: schemas, descriptions, why naming matters.

## Hands-On
Design the toolbox your Ch 14 research agent will actually use — on paper, full definitions (name, description with negative space, Pydantic param model, return shape, error strings, safety tag) for five tools: `search_web`, `fetch_page`, `search_notes` (wrapping your Vol 03 retrieval!), `save_finding`, `read_scratchpad`. Then two drills: (1) *the confusion audit* — show just the five names+descriptions to a friend (or a fresh LLM session) and ask "which tool for: [six tasks, two deliberately ambiguous]?" — every hesitation is a description bug; fix and re-test. (2) *the error rehearsal* — for each tool, write its two most likely failure observations verbatim, and check each answers "what should the agent do next?" The audited toolbox goes in the note and rides straight into Ch 14.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the four organs and who reads each, when.
2. Recite three naming rules and construct one confusion-pair that violates them.
3. What is the negative-space clause, and which two misuse modes does it prevent?
4. State the granularity heuristic and both failure directions with symptoms.
5. Why are error strings load-bearing, and what taxonomy seeds Ch 15's gate?


---

## Wikilinks
[[tool-calling]]
[[structured-output]]
[[hitl-interrupts]]
[[build-research-agent]]
[[python-typing-pydantic]]

## Status log
- Started: 2026-07-21
- Finished: null