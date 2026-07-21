## ELI5
A company doesn't run as one giant brain deciding everything; it runs as teams — each with its own process, its own working memory, its own specialty — coordinated through narrow interfaces. The node summary, three words, whole idea: **agents made of agents.** A LangGraph graph can *be a node* in a bigger graph — and with that one move, everything you know about good software structure (modules, interfaces, encapsulation — Vol 01, Ch 16) applies to agent systems. This is the final concept before the big builds: the supervisor you construct next chapter is a graph whose nodes are the specialist graphs you build the chapter after. Your agent-lab's whole skeleton, in one pattern.

## The Real Explanation
**The mechanism — composition with a boundary.** A compiled graph exposes the same interface as a node function: state in, state update out. So: build a focused graph (a researcher: its own reason-act-observe cycle, its own tools), compile it, and mount it as one node inside a parent graph. When the parent's execution reaches that node, the child graph runs *its entire internal process* — however many internal steps — and returns its result as a single state update. From the parent's view: one node ran. From the child's view: a complete agent did its job.

**The state boundary — where the design lives.** Parent and child need not share a state schema — and *should not*. The child declares its own state (a researcher's internal search results, draft notes, iteration counters are its private business); the interface is a **mapping at the boundary**: parent passes in what the child needs (the task), child returns what the parent needs (the findings). This is encapsulation, exactly as Vol 01 Ch 16 taught it, and it buys exactly what it bought there: the child is *independently developable* (build it alone), *independently testable* (mock tasks against just the subgraph — the next two builds' verification strategy depends on this), *swappable* (upgrade the researcher without touching the supervisor), and *reusable* (the same specialist mounted in multiple parents). The anti-pattern to name and shun: one giant shared state that every subgraph reads and writes freely — it recreates the global-variable disease (spooky action between "independent" teams, untestable in isolation, unswappable forever). Narrow interfaces or pain; there is no third option.

**What each subgraph keeps private — the full inventory.** Its internal nodes and edges (the parent can't see them — good), its scratchpad (Ch 13 — a specialist's working memory is *per-specialist*; the researcher's messy search trail must not pollute the supervisor's clean routing context; this separation is half the reason multi-agent systems stay coherent at all), and — subtle, powerful — its own checkpoint lineage within the thread: an interrupt (Ch 7) fired *inside* a subgraph pauses the whole stack and resumes into the right depth. Gates work at any level of nesting; the Ch 15 build exploits this.

**When to reach for subgraphs — and when not.** Reach: distinct specialties with distinct toolboxes (research vs writing vs scheduling — different tools, different prompts, different failure modes); reuse across parents; team development; testability demands. Don't reach: a linear pipeline with no specialty boundaries (nodes suffice — a subgraph wrapping one node is ceremony), or premature decomposition of a system you don't understand yet (the least-autonomy principle's structural cousin: *least architecture that solves the task*). The honest cost: every boundary adds a mapping to maintain and a level of indirection to debug through — worth it exactly when the encapsulation pays, wasteful when it doesn't. Same judgment as every abstraction since Vol 01.

## Why It Matters
Where this appears in real systems and jobs: agents made of agents.

## Hands-On
Paper, then a thin slice of code: (1) *The org chart*: draw your agent-lab as a subgraph diagram from memory — supervisor as parent; Scheduler, Scribe, Researcher, Analyst as mounted subgraphs; label each boundary's mapping (what goes in, what comes out — guess where you must; next two chapters correct you). This drawing is the blueprint for Chs 11–12; draw it with care. (2) *The code slice*: take your Ch 5 mini-agent, compile it, and mount it as a single node inside a trivial two-node parent (task-in → agent-subgraph → result-out), with an explicit state mapping at the boundary. Run mock task 1 through the *parent*; assert the same outcome as running the child alone — encapsulation, demonstrated in one assertion. (3) *The anti-pattern paragraph*: write five sentences on what the shared-global-state version of your org chart would look like and the specific debugging nightmare it births. Drawing + assertion + paragraph = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What interface does a compiled graph expose, and what does that make possible?
2. Why should parent and child *not* share a state schema? Name the four properties the boundary buys.
3. Recite the privacy inventory — and why is scratchpad separation half of multi-agent coherence?
4. What happens when an interrupt fires inside a nested subgraph?
5. Give the reach/don't-reach judgment with one example each, and name the least-architecture principle.


---

## Wikilinks
[[langgraph-state]]
[[python-classes-modules]]
[[build-supervisor]]
[[build-specialists]]
[[scratchpads-working-memory]]

## Status log
- Started: 2026-07-21
- Finished: null