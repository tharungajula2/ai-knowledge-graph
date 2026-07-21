---
id: coding-agents
title: "Coding Agents"
domain: frontier-capstone
ring: 10
cluster: "The Moving Edge (baseline guesses — expect replans)"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["what-makes-an-agent", "reflection-patterns", "designing-tools", "sandboxing-isolation", "define-vizier-v2"]
tags: [frontier-capstone]
---

## ELI5
There's a beautiful loop hiding in your own origin story: VIZIER v1 was built *by* coding agents — the IDE agent writing supervisor.py while you watched, before you had the vocabulary. Ten rings later, you have the vocabulary, and this chapter closes the circle: how do the tools that built VIZIER actually work? Spoiler: they are Vol 04's loop, pointed at code — and code turns out to be the *perfect* agent habitat, for one reason you already know intimately.

## The Real Explanation
**Why code is the perfect habitat: verifiable ground truth.** Most agent outputs are judged by fuzzy rubrics (Vol 07's LLM-judge, with all its biases). Code *executes*. Tests pass or fail. Compilers object with line numbers. The observe step of the loop returns **hard signal** — and everything you learned about agents says quality scales with observation quality. That's the whole secret: coding agents look magical because their environment grades their homework instantly.

**The anatomy — every organ is one you've built.** Tools: read_file, edit_file, run_command, search_codebase (Vol 04 Ch 3's tool-design craft — and edit tools are *write actions*, which is why serious coding agents show diffs for approval: the proposal gate pattern, in an IDE costume). Context strategy: codebases dwarf context windows, so retrieval over code (Vol 03, different corpus) plus the scratchpad discipline (Vol 04 Ch 13) decide what the model *sees* — most coding-agent failures are context failures, not intelligence failures. The loop: write → run tests → read errors → fix → repeat, i.e., Reflexion (Vol 04 Ch 9) with the critic played by ground truth itself — the *best possible* critic per your own ordering. Guardrails: sandboxed execution (Vol 08 sandboxing — an agent running arbitrary shell commands is maximal blast radius), scoped file access, human review as the final gate.

**The permanent skill shift for you.** As these tools strengthen, the engineer's leverage moves up the stack: from writing lines to *specifying, decomposing, reviewing, and verifying* — writing the tests and acceptance criteria that give the agent its ground truth. Which is, not coincidentally, exactly the skill VIZIER v2's spec chapter (Ch 14) demands of you. You've felt this from the receiving end all year; now you can name the machinery.

## Why It Matters
Where this appears in real systems and jobs: how the tools that built VIZIER actually work.

## Hands-On
An archaeology session on your own history. Take one surviving artifact built by the IDE agent during v1 (any module you still have at tag `pre-brain-simplification`). Read it with ring-10 eyes and annotate: which tool calls the agent must have made, where its context strategy shows (or fails — copied boilerplate, redundant code smells), where it verified vs guessed. Write the one-page "how my house was built" note. Then the forward-looking half: write the three acceptance criteria you *would have* given the agent for that module, knowing what you know now — that's spec-writing practice for Chapter 14.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is code the perfect agent habitat? One sentence, naming the loop step it supercharges.
2. Map three coding-agent organs to the exact nodes where you built the same organ.
3. Why are most coding-agent failures context failures? What are the two context tools that fight this?
4. Diffs-for-approval is which Vol 08 pattern in disguise? Why is it non-negotiable for edit tools?
5. State the permanent skill shift, and name where this volume makes you practice it.


---

## Wikilinks
[[what-makes-an-agent]]
[[reflection-patterns]]
[[designing-tools]]
[[sandboxing-isolation]]
[[define-vizier-v2]]

## Status log
- Started: 2026-07-21
- Finished: null
