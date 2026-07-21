## ELI5
Ask someone "347 × 26?" and demand an instant answer — they'll blurt something wrong. Let them work it on paper and they'll nail it. Models are the same: forced to answer in one breath, they pattern-match; given room to **write out intermediate steps**, accuracy on math, logic, and multi-constraint problems jumps. That's chain-of-thought (CoT). It's real, it's cheap, and it has sharp limits you must know as well as the trick itself.

## The Real Explanation
**Why writing helps a next-token predictor.** The model computes each token from the visible context (Vol 01, Ch 6). When it writes "First, 347 × 20 = 6940...", that line *enters the context* and conditions everything after — the model's own reasoning becomes retrievable working memory instead of having to be carried implicitly in one forward pass. More generated tokens = more serial computation spent on the problem. You are literally buying thinking with tokens.

**The three grades of the technique.** (1) *Magic words*: appending "Think step by step before answering" — the famous zero-shot CoT trick; embarrassingly effective on reasoning-shaped tasks. (2) *Structured CoT*: dictate the stages — "First list the constraints. Then evaluate each option against them. Then decide." You're lending the model a *procedure*, and the skeleton's TASK bone (Ch 3) grows sub-bones. Pair it with format separation: reasoning inside `<thinking>` tags, verdict inside `<answer>` tags, so downstream code parses only the verdict. (3) *Self-consistency*: sample the same CoT prompt 5× at temperature ~0.8 and take the majority answer (Vol 01, Ch 9's "deliberate variance" — reasoning paths differ, wrong paths scatter, right paths converge). Costs 5×; buys accuracy on genuinely hard problems.

**The limits — this half is what the node summary demands.** *One:* CoT helps reasoning-shaped tasks (math, logic, planning, multi-hop) and does roughly nothing for pure recall — no amount of stepwise thinking retrieves a fact the weights don't hold; that's RAG's job (hallucinated *reasoning about* hallucinated facts just looks more convincing — extra dangerous). *Two:* **the transcript is not the process.** The visible steps are generated text — a plausible-looking rationale — not a readout of the actual computation; models can reach right answers via written steps containing errors, and wrong answers via impeccable-looking steps. Treat CoT as *performance that tends to improve results*, never as proof. *Three:* faithfulness follows — because the transcript isn't the process, "the model explained itself" is not audit-grade explanation (Vol 01, Ch 10 said the same about asking models why). *Four:* cost and latency — thinking tokens are billed output tokens, and slow. *Five:* **reasoning models changed the game's economics**: modern "reasoning" variants (Vol 01, Ch 11) run extended CoT internally, so decorating them with "think step by step" adds little — the engineering decision moved up a level: *route* hard problems to reasoning models and pay their latency, or keep fast models and prompt CoT explicitly. That's a cost/quality routing choice you now own.

## Why It Matters
Where this appears in real systems and jobs: chain-of-thought, step-by-step, and their limits.

## Hands-On
Pick 5 problems that punish one-breath answers (a multi-step word problem, a scheduling puzzle with 3 constraints, a logic riddle, a code-tracing question, and one pure-recall question as the control). Run each three ways on the same fast model: (a) direct, (b) "think step by step", (c) structured CoT with `<thinking>`/`<answer>` tags. Score the 15 answers. Expected shape of results: b and c beat a on the four reasoning tasks, nothing helps the recall control — verify against reality, and record any surprise honestly. Bonus: run self-consistency (5 samples, majority vote) on whichever problem the model kept fumbling.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Explain mechanically why generated steps improve accuracy — use "context" and "working memory."
2. Name the three grades of CoT and when you'd escalate between them.
3. State the two most important limits: what CoT can't fix, and what the transcript isn't.
4. Why is CoT + missing knowledge *more* dangerous than a plain wrong answer?
5. Describe the modern routing decision that reasoning models created.


---

## Wikilinks
[[sampling-controls]]
[[hallucination]]
[[model-landscape]]
[[prompt-skeleton]]

## Status log
- Started: 2026-07-21
- Finished: null