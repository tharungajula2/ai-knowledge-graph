## ELI5
Before you automate a machine, you crank it by hand — you did this with gradient descent (Vol 01, Ch 2's number-guessing), attention (Vol 01, Ch 6's weight-assigning), and vector search (Vol 01, Ch 5's paper map). Today you *are* the agent. The node summary: run the loop manually on paper with a real task. You will play the model, an accomplice plays the tools, and every joint of the ReAct pattern — and three of its classic failures — will be felt in your own hands before any code exists.

## The Real Explanation
**ReAct — the name and the format.** The pattern (from the paper of the same name: *Reasoning + Acting*) interleaves explicit thought with action in a rigid textual format — and the rigidity is the point, because Ch 4 will *parse* this format with regex:
```
Thought: I need to find out X before I can answer.
Action: search_web
Action Input: {"query": "..."}
Observation: [tool result appears here]
Thought: That tells me Y. Now I need Z.
Action: ...
...
Thought: I now have everything needed.
Final Answer: ...
```
Why thoughts are written at all — recall Vol 02 Ch 5's mechanism: generated text enters the context and conditions everything after; a written thought is the agent's working memory made visible (Ch 13 gives this a formal name: the scratchpad). Why the format is rigid: the orchestrator (today: your accomplice; Thursday: your Python) must mechanically distinguish *thought* (append and continue) from *action* (stop generation, execute, return observation) from *final answer* (stop the loop). ReAct is a *protocol* between model and orchestrator, and protocols live or die on parseability.

**The rules of the manual run — play it honest.** You (the model) may only write Thought / Action / Final Answer lines. Your accomplice (the tools + orchestrator) executes actions *literally* — answering exactly what was asked, never helpfully more, including realistic imperfections (a search returns titles and snippets, not neat answers; a calculator returns a number, not an interpretation). You may not use knowledge you realistically wouldn't have — if the task needs today's data, you *must* act for it. And you write every line down; the transcript is the artifact.

**What the manual run is engineered to make you feel.** Three sensations, each one a future chapter: (1) *The observation quality problem* — when the search tool returns junk snippets, you feel the urge to re-search with better terms; that urge is query surgery (Vol 03, Ch 13) and it lives inside agents too. (2) *The termination temptation* — around step 4 you'll feel the pull to just answer from vibes rather than verify; that pull, in a model, is premature termination, and its opposite (endless verifying) is the infinite loop — Ch 16's twin diseases, previewed in your own psychology. (3) *Context growth* — watch your paper fill; every thought, action, and observation rides in the context forever (token arithmetic from Vol 01, Ch 8 — agents are context-hungry, and Ch 17 prices it).

## Why It Matters
Where this appears in real systems and jobs: run the loop manually on paper with a real task.

## Hands-On
Two full manual runs, transcribed. **Run 1 — with an accomplice** (or honestly split-brained solo): a real multi-step task needing 3+ tool calls — good candidates: "plan which three brain nodes I should light this week given my calendar" (tools: `read_calendar`, `read_curriculum`, `check_prerequisites`) or "find the cheapest decent mechanical keyboard under ₹5k available today" (tools: `search_web`, `fetch_page`). Play it fully honest; expect 6–10 loop iterations. **Run 2 — sabotage**: same task, but your accomplice returns one *misleading* observation mid-run (a wrong price, a stale date) — feel how the error propagates through your subsequent thoughts (Vol 03 Ch 14's error propagation, now in first person), and note where a verification step *would* have caught it. Then annotate both transcripts: mark every point where you (a) wanted to re-query, (b) felt the termination temptation, (c) would have looped forever without discipline. The two annotated transcripts go in the note — Ch 4 will replay Run 1's task in code, and the comparison is the lesson.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Write the ReAct format from memory and name what each line type signals to the orchestrator.
2. Why must the format be rigid? What breaks if the model free-styles its actions?
3. What is a written Thought, mechanically, in Vol 02 Ch 5's terms — and what will Ch 13 call the accumulation?
4. Name the three engineered sensations and the chapter each previews.
5. From your sabotage run: where did the bad observation's influence surface, and what discipline would have caught it?


---

## Wikilinks
[[reasoning-prompts]]
[[what-makes-an-agent]]
[[scratchpads-working-memory]]
[[agent-failure-modes]]
[[build-agent-from-scratch]]

## Status log
- Started: 2026-07-21
- Finished: null