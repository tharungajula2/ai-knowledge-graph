## ELI5
The most senior act in engineering isn't writing code — it's writing the document that makes the code *inevitable*: the spec. v1 never had one; it had a conversation with an IDE agent and whatever emerged. v2 begins the opposite way: you, alone, writing the complete specification of a unified agent+brain system — every subsystem, every interface, every acceptance test — **mapped back to the modules that taught it**. Chapter 5 told you the skill shift: specify, decompose, verify. This chapter is where you prove you've made it.

## The Real Explanation
**1. The mission sentence.** One sentence, no commas doing heavy lifting: what v2 *is*. Draft to react against: *"VIZIER v2 is a deployed agent system that manages my knowledge graph and my communications through a human-approval gate — specified, built, evaluated, secured, and operated entirely by me."* Fight with it until it's yours.

**2. The architecture map.** One diagram, your hand: the supervisor and specialists (Vol 04), the MCP connections (Vol 05), the memory layer (Vol 06), retrieval (Vol 03), the gateway underneath every call (Vol 02), the gate and scanner athwart every write (Vol 08), tracing and evals around everything (Vol 07), the deployment envelope (Vol 09). Every box carries two labels: what it does, and **the node that taught it** — this teacher-mapping is the node's explicit demand, and it's what makes v2 a graduation proof rather than a rewrite.

**3. Scope, and the harder list.** In-scope subsystems = the five build chapters ahead (core loop, memory+RAG, gate+safety, evals+traces, deploy+ship). The **out-of-scope list with reasons** is where senior judgment shows: what v1 had that v2 drops (anything you can't defend from first principles doesn't ship), what Part I frontier ideas you're *deliberately deferring* (voice mode: deferred, latency budget unproven for your stack; local-model routing: in, it's one gateway provider entry — your calls, argued in writing).

**4. Interfaces before implementations.** For each subsystem pair, the contract: state schemas (typed, Vol 04 Ch 13 discipline), the gate's proposal format (now also your fine-tune's output language — Chapter 12 joins the spec), MCP surfaces (which tools/resources the brain exposes — Vol 05; informed by your Chapter 8 memo), eval hooks (every subsystem ships with its golden set — Vol 07's EDD, specified in, not bolted on).

**5. Acceptance criteria per subsystem.** Written as *tests*, before any build: "the supervisor routes 10/10 test intents correctly", "a killed process resumes mid-gate from checkpoint", "the injection suite passes with zero exfil", "cold deploy from clean clone ≤ 30 minutes, documented." These criteria are the ground truth that Chapter 5 said great specs give their builders — and the builder is you.

**6. The build order and the risk register.** Sequence the five builds with reasons (the order of the next five chapters is the default; justify or amend it), and name the top three risks with mitigations (the async bridge bit you once — Vol 05 Ch 3 exists because of it; what bites v2?).

## Why It Matters
Where this appears in real systems and jobs: spec the unified agent+brain rebuilt from scratch by ME, mapped back to the modules that taught it. → M5

## Hands-On
Write `VIZIER_V2_SPEC.md` (3–6 pages, in the repo, versioned). Then two quality gates before it counts: (1) the **teacher audit** — every subsystem in the spec names its teaching node(s); any subsystem you can't map means either scope creep (cut it) or a ghost node you skipped (light it first — the graph is the prerequisite checker); (2) the **red-team read** — reread your own spec wearing Vol 08 goggles and Vol 07 goggles, one paragraph each on what the adversary and the evaluator would say is underspecified. Fix, commit, tag `v2-spec-1.0`. Lighting this node lights the fuse on M5.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite your mission sentence, then defend its three most load-bearing words.
2. Why interfaces before implementations? Name the v1 pain this rule answers.
3. Pick any subsystem: name its teacher nodes and its acceptance criteria, from memory.
4. Defend one out-of-scope decision like a senior engineer being challenged in review.
5. What are your top three risks, and which prior node taught you each mitigation?


---

## Wikilinks
[[coding-agents]]
[[synthesis-production]]
[[capstone-agents]]
[[build-node-proposer]]

## Status log
- Started: 2026-07-21
- Finished: null