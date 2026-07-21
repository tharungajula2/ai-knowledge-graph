## ELI5
The node summary is a manifesto: **pure-Python manual ReAct loop — raw prompt formatting, regex tool-calling parsing, tool dispatch execution loop — verified with 5 mock tasks.** No LangGraph, no framework, not even the provider's native tool-calling API. You will format the ReAct prompt yourself, parse the model's text yourself with regex, dispatch to tools yourself, and run the loop yourself — because after this build, every agent framework on Earth is a convenience over a machine you have personally assembled, and its abstractions will never once be magic to you. This is the curriculum's central pattern (Vol 03 built RAG bare-handed before naming frameworks) applied to its most important subject.

## The Real Explanation
**The system prompt — the agent's constitution.** Hand-formatted, no SDK sugar: the persona and goal framing, the ReAct format specification (exactly Ch 2's grammar, stated as law), the tool catalog *rendered as text* — you write the renderer: `render_tools(tools) -> str` producing name, description, and JSON parameter spec per tool (Ch 3's four organs, serialized — and note what you're doing: this is what provider tool-calling APIs do server-side; you're building the visible version) — and the closing laws: "one Action per turn", "Action Input must be valid JSON", "use Final Answer only when the goal is fully met."

**The parser — regex meets reality.** The model returns text; you extract structure:
```python
ACTION_RE = re.compile(r"Action:\s*(\w+)\s*\nAction Input:\s*(\{.*?\})", re.DOTALL)
FINAL_RE  = re.compile(r"Final Answer:\s*(.*)", re.DOTALL)

class Step(BaseModel):        # parse result, validated at the boundary — always
    kind: Literal["action", "final", "malformed"]
    tool: str | None = None
    args: dict | None = None
    text: str | None = None
```
And here is the build's designed lesson, so meet it with a smile: **the parser will fail**, because the model *will* freestyle — malformed JSON in Action Input, two actions in one turn, prose before the Action line, a hallucinated tool name. Each failure gets the repair treatment you've drilled since Vol 02 Ch 6: the malformed output goes back into the loop as a corrective observation (`Observation: your last response was malformed: [reason]. Follow the format exactly.`) with a bounded retry. By hour two you will understand, in your bones, *why* native tool-calling APIs and constrained decoding exist — you'll have re-derived the problem they solve. That earned understanding is the node's real payload.

**The loop — the whole machine, one function:**
```python
def run(goal: str, tools: dict[str, Tool], max_steps: int = 10) -> RunResult:
    transcript = [system_prompt(tools), f"Task: {goal}"]
    for step_n in range(max_steps):
        raw = gateway.complete(transcript, stop=["Observation:"])   # CRITICAL — see below
        step = parse(raw)
        if step.kind == "final":
            return RunResult(answer=step.text, steps=step_n, transcript=transcript)
        obs = dispatch(step, tools)          # execute, or produce the corrective/error observation
        transcript.append(raw); transcript.append(f"Observation: {obs}")
    return RunResult(answer=None, terminated="max_steps", transcript=transcript)
```
Three details that separate working from broken, each a lesson: (1) **the stop sequence** — you must halt generation at `Observation:` or the model will *hallucinate its own tool results* and sail on in a private fantasy (run it once without the stop, on purpose, and watch — the most instructive bug in the volume); (2) **dispatch validates args** against the tool's Pydantic model before executing (boundary law — the model's JSON is untrusted input), returning validation errors as observations (Ch 3's legible-error rule); (3) **max_steps is not optional** — it's the crude ancestor of Ch 17's budgets and the only thing standing between you and an infinite loop on day one.

**Verification — 5 mock tasks, per the node.** Mock tools (scripted returns — your Vol 02 Ch 11 fake-provider pattern, now for tools) so tests are deterministic and free: (1) *single-tool task* — resolves in one action + final; (2) *chained task* — tool B's input needs tool A's output (the multi-hop shape); (3) *error-recovery task* — first tool call returns an error observation; agent must adapt and still succeed; (4) *malformed-output task* — a mock *gateway* returns a broken response once, then a good one; the repair path must catch and recover; (5) *termination-honesty task* — a goal the tools cannot satisfy; the agent must conclude honestly (or hit max_steps gracefully) rather than fabricate. Pytest asserts on: final answers, step counts within bounds, specific tools called in order, and transcript shape. Five green = lit.

## Why It Matters
Where this appears in real systems and jobs: Build a pure-Python manual ReAct loop handling raw prompt formatting, regex tool-calling parsing, and a tool dispatch execution loop; verify with 5 mock tasks.

## Hands-On
Build it (est. 1–2 honest days): system-prompt renderer → parser with tests-first on canned model outputs (pure function, pleasant — Vol 01 Ch 21) → dispatch → loop → the five mock tasks → then the ceremony: **replay Ch 2's Run 1 task with real tools** and diff the machine's transcript against your own paper transcript — where did it reason better, worse, differently? One paragraph on the diff. Then the deliberate bugs, each witnessed once: no stop-sequence (fantasy observations), no max_steps with an impossible goal (the loop that never ends — kill it manually, feel the fear Ch 16 formalizes). Tag `agent-v0.1`. Keep this codebase warm: Part II rebuilds it in LangGraph, and the comparison is the point.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why build below even the native tool-calling API? What does the regex layer teach that the SDK hides?
2. What happens without the stop sequence, and why is that failure so instructive?
3. Walk the malformed-output repair path and name its Vol 02 ancestor.
4. Recite the five mock tasks and what distinct property each verifies.
5. From your diff ceremony: one place the machine out-reasoned your paper run, and one place it did worse.


---

# PART II — LANGGRAPH & PATTERNS
*9 chapters. The bare loop was one while-loop; real agent systems are graphs — with state, persistence, pause points, planning patterns, self-critique, and agents made of agents. The framework arrives — and because of Chapter 4, it arrives as convenience, never as magic.*

---

## Wikilinks
[[react-by-hand]]
[[designing-tools]]
[[tool-calling]]
[[structured-output]]
[[build-gateway]]
[[langgraph-state]]

## Status log
- Started: 2026-07-21
- Finished: null