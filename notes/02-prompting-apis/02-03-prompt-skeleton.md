---
id: prompt-skeleton
title: "The Prompt Skeleton"
domain: prompting-apis
ring: 2
cluster: "Speaking to Models"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["roles-and-system-prompts", "hallucination", "few-shot-prompting", "prompt-quality"]
tags: [prompting-apis]
---

## ELI5
Bad briefs get bad work — from humans and models alike. "Write something about our product" fails everywhere; a good brief names *who you are, what you're given, what exactly to do, and what the deliverable looks like*. The Prompt Skeleton is that brief, as a reusable four-part pattern: **Role + Context + Task + Format**. Stop writing prompts; start filling skeletons.

## The Real Explanation
**The four bones, and what each is for:**
- **ROLE** — who the model should be. "You are a senior Python reviewer with strong security instincts." Role sets vocabulary, depth, and priorities in one line (it biases which regions of the training distribution the model writes from).
- **CONTEXT** — what the model needs to know: the input data, background, constraints. This is the whiteboard (Vol 01, Ch 8) being loaded deliberately. Delimit it clearly — triple quotes, XML-ish tags like `<document>...</document>` — so instructions and data can't smear together (a habit that also blunts injection, Ch 12).
- **TASK** — the verb, precisely. "Review for security issues; classify each as critical/warning/nit; suggest a fix for each." Precise scope beats vague ambition; several small clauses beat one foggy sentence.
- **FORMAT** — the shape of the deliverable. "Return markdown: a table of issues, then a rewritten function." Or "JSON matching this schema." Uncontrolled format is the #1 source of "the model rambled"; the fix was always one missing sentence.

**A filled skeleton, annotated:**
```
[ROLE]    You are a meticulous data-extraction engine.
[CONTEXT] Below is a raw customer email between <email> tags. Today's date is 2026-07-18.
          <email> ...pasted email... </email>
[TASK]    Extract the customer's name, the product mentioned, and the sentiment
          (positive/neutral/negative). If a field is absent, use null — do not guess.
[FORMAT]  Respond with only a JSON object: {"name":..., "product":..., "sentiment":...}
          No prose before or after.
```
Notice the anti-hallucination clause riding inside TASK ("if absent, use null — do not guess") — skeleton discipline is where Vol 01's hallucination chapter becomes daily practice.

**Where the bones live in real apps.** ROLE and standing FORMAT rules go in the *system prompt*; per-request CONTEXT and TASK arrive in the *user message*, often via a **prompt template** — a skeleton with `{placeholders}` filled by code. The moment prompts become templates, they become *versioned artifacts* (commit them, diff them, A/B them — Chapter 16 formalizes this). Every framework's "PromptTemplate" class is just this idea with packaging.

## Why It Matters
Where this appears in real systems and jobs: role + context + task + format — the reusable pattern.

## Hands-On
Take three deliberately lazy prompts — "summarize this article", "fix this code", "write a LinkedIn post about my project" — and rebuild each as a full four-bone skeleton for a concrete scenario of yours (use real inputs: a real article, your actual code, your Vizier project). Run lazy vs skeleton for each and paste both outputs into your note. The delta you observe is the entire argument for this chapter — and the LinkedIn one, keep: it feeds Chapter 24's capstone post.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the four bones and each one's one-line job.
2. Why delimit CONTEXT with tags — give both the quality reason and the security reason.
3. Which bone kills rambling, and which clause kills guessing?
4. Where do the bones live across system vs user messages in a production app?
5. What turns a prompt into an engineering artifact, and what does that let a team do?


---

## Wikilinks
[[roles-and-system-prompts]]
[[hallucination]]
[[few-shot-prompting]]
[[prompt-quality]]

## Status log
- Started: 2026-07-21
- Finished: null
