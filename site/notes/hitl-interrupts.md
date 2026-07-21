## ELI5
Your agent-lab has, since before you could explain it, a human-approval gate — an agent that *stops and asks permission* before consequential actions. This build constructs that organ from first principles: an agent that pauses mid-graph, presents its intended action to a human, waits — minutes or days — and proceeds, modifies, or aborts based on the verdict. The node summary in six words: an agent that stops and asks. In the industry's vocabulary: human-in-the-loop, the pattern that makes autonomous systems deployable in places where mistakes cost real money. In your vocabulary after today: the gate, understood.

## The Real Explanation
**The mechanism — interrupt as a first-class primitive.** LangGraph's `interrupt()`: a node calls it with a payload (the question for the human); execution **stops**, the current state checkpoints (Ch 6 is why this build is possible — the pause *is* a persisted checkpoint; no checkpointer, no interrupt), and the graph returns control to the caller carrying the payload. The human answers whenever they answer. Resumption: invoke the graph again on the same thread with the human's verdict; the interrupted node receives it and the graph continues. Understand what this architecture buys: the wait is *free* — no process blocking, no polling loop burning a server; the agent is simply *parked in the database* until the verdict arrives. A human taking three days to approve costs three days of nothing.

**The gate node — where Ch 3's safety tags cash in.** The build's core is a `gate` node placed between decision and execution:
```python
def gate(state) -> dict:
    action = state["pending_action"]                      # tool + args, decided by reason node
    if TOOLS[action.tool].safety == "read":
        return {"approved": True}                          # reads flow freely — no gate spam
    verdict = interrupt({                                  # writes and dangerous: STOP
        "proposed": action.tool,
        "args": action.args,
        "rationale": state["last_thought"],                # WHY — the scratchpad excerpt
        "options": ["approve", "edit", "reject"],
    })
    return resolve(verdict)                                # approve → pass through
                                                           # edit    → pass through with human's args
                                                           # reject  → observation: "denied: [reason]" back to reason node
```
Three design decisions, each load-bearing: (1) **selectivity** — gate only write/dangerous tools (the Ch 3 taxonomy, enforced at last); gate everything and humans rubber-stamp from fatigue within a day — *approval fatigue is the gate's real failure mode*, and selectivity is its medicine; (2) **the rationale travels with the request** — a human shown *what* without *why* can't meaningfully judge; shipping the agent's reasoning (its thought, the scratchpad excerpt) turns approval from a coin-flip into review; (3) **rejection is an observation, not an exception** — "denied: too broad, narrow the query" feeds back into the reason node and the agent *adapts* (Ch 3's legible-error philosophy — the human is, structurally, one more tool whose observations steer the loop; write that sentence down, it reorganizes how you see the whole pattern).

**The edit path — the underrated verdict.** Approve/reject is a binary gate; *edit* is a collaboration: the human corrects the args ("right tool, wrong recipient") and the corrected action executes. Implementing it forces the right data shape — the pending action must round-trip through the human as structured data (Pydantic, of course), not prose — and it changes the human's role from bouncer to co-pilot. Your agent-lab's gate supports exactly this; now you know why the shape matters.

**Verification.** Mock the human (a scripted verdict-provider — the fake-provider pattern, third appearance): pytest asserts — read tools never interrupt; write tools always do; approve executes the original args; edit executes the *edited* args; reject's reason appears in the next reason-node prompt and the agent visibly adapts (assert the retried action differs); and the durability test that proves the architecture — interrupt, **kill the process**, restart, resume same thread with a verdict, action executes. That last test is the whole chapter in one assertion.

## Why It Matters
Where this appears in real systems and jobs: an agent that stops and asks permission.

## Hands-On
Build it on your Part-II graph with a two-tool toolbox: `search_notes` (read) and `save_finding` (write) — reuse everything. CLI harness: run a task; when the interrupt surfaces, print the payload (proposed action + rationale) and prompt `[a]pprove / [e]dit / [r]eject:`. Then the full drill, transcribed: one run approving; one editing the args (change the save-path — watch the edited version execute); one rejecting with a reason (watch the agent adapt and re-propose); and the parked-agent ceremony — trigger the interrupt, kill Python, *walk away for an hour*, come back, resume, approve, done. All four transcripts in the note. Tag `agent-v0.3`. Then the homecoming paragraph: open agent-lab's gate code and read it cold — you will recognize every organ; name each one in the margin.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is a checkpointer a hard prerequisite for interrupts? What is the pause, mechanically?
2. What makes the wait free, and what is the parked-agent worth operationally?
3. Recite the three gate-node design decisions and the failure each prevents — lead with approval fatigue.
4. Defend rejection-as-observation, and deliver the "human as one more tool" reframe.
5. What does the kill-and-resume test prove that all other tests can't?


---

## Wikilinks
[[langgraph-checkpointers]]
[[designing-tools]]
[[add-the-gate]]
[[injection-first-look]]
[[structured-output]]

## Status log
- Started: 2026-07-21
- Finished: null