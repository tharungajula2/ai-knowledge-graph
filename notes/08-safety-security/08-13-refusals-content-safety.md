---
id: refusals-content-safety
title: "Refusals & Content Safety"
domain: safety-security
ring: 8
cluster: "The Defenses"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["guardrails-in-out", "roles-and-system-prompts", "responsible-shipping", "refusal_handling", "hallucination"]
tags: [safety-security]
---

## ELI5
The node summary is deceptively simple: **designing what my system won't do.** Every deployed AI system needs a clear, deliberate answer to "what requests will you refuse, and how?" — not as an afterthought, but as a designed behavior. Refusals are the system's *values made operational*: the harmful content it won't produce, the actions it won't take, the topics it won't engage. Getting refusals right is a genuine design skill — too lax and your system enables harm; too strict and it's uselessly timid; and the boundary is neither obvious nor static.

## The Real Explanation
**What refusals protect against.** Deployed AI can be asked to do harmful things: generate dangerous content (weapons, malware — Vol 02's harmful-code territory), produce harassment/hate, assist illegal acts, generate CSAM or exploit material (an absolute line), spread misinformation, or take harmful actions (via tools). Content safety is the system's designed refusal of these — and it's *your* responsibility as the builder (Ch 18's responsible shipping): a system with no refusal design will, when prompted (or jailbroken, Ch 4), produce whatever it can, and *you* deployed it. Refusals are where you encode the line between what your system *can* do and what it *should* do.

**The layers of refusal (where refusals live).** *Model-level* (the base model's own trained refusals — RLHF-instilled, Vol 01 Ch 7 — the model itself declines some things; but these are jailbreakable, Ch 4, and vary by model, and you don't control them). *System-prompt level* (your instructions defining scope and refusals — "you only discuss cooking; refuse other topics" — Vol 02 Ch 2; soft, injectable, but shapes default behavior). *Guardrail level* (Ch 11 — deterministic output checks that *block* harmful content the model produced despite the above — the reliable layer, because it's not the probabilistic model deciding). *Application level* (refusing certain *actions* regardless of content — the gate, Ch 9, and least-privilege, Ch 8 — the system *structurally* won't take the action). Defense in depth again: model refusals + prompt scope + guardrail enforcement + capability limits, layered, because any single layer is defeatable.

**The design tensions — refusal calibration is genuinely hard.** *Over-refusal* (the timid system): refusing benign requests because they pattern-match to forbidden ones — a medical system refusing to discuss drug interactions (it sounds like drug-seeking), a security-education tool refusing to explain attacks (it sounds like attack-enablement), a creative-writing tool refusing dark themes (it sounds like harmful content). Over-refusal makes systems *useless for legitimate use* and is a real, common failure (users hate a system that won't help). *Under-refusal* (the dangerous system): producing harmful content because the refusal was too narrow or was jailbroken. The boundary between them is *contextual* (the same request is benign from a doctor, suspicious from an anonymous user — but you often can't tell), *cultural/legal* (varies by jurisdiction and norms), and *contested* (reasonable people disagree on where lines fall). Designing refusals is choosing these boundaries deliberately for *your* system's context and users — and *measuring* both failure modes (Vol 07: over-refusal rate on benign requests, under-refusal rate on harmful ones — the same precision/recall tension, Vol 01 Ch 12, now for safety).

**Doing refusals well — the design principles.** *Refuse specifically, not broadly* (decline the harmful *specific* thing, not the whole *topic* — "I can't provide synthesis instructions" not "I won't discuss chemistry"). *Refuse gracefully* (explain briefly, offer a safe alternative where possible — a good refusal maintains usefulness and trust, not a curt wall). *Refuse consistently* (the same request should get the same refusal — inconsistency signals a jailbreakable boundary). *Refuse at the right layer* (content refusals at guardrails, action refusals at the gate/capabilities — don't rely solely on the probabilistic model to refuse). *Design for your context* (a children's product, a medical tool, and a security-research tool have *very different* correct refusal boundaries — there's no universal setting, and copying another product's refusals is how you get both over- and under-refusal). *Measure and iterate* (Vol 07 — refusal calibration is an eval target, tuned against real benign and harmful traffic, not set once).

## Why It Matters
Where this appears in real systems and jobs: designing what my system won't do.

## Hands-On
Design your system's refusals (concept node, concrete): (1) For your deployed-or-deployable system (Feynman-bot, brain-chat, research agent), write its *refusal policy*: what it won't produce (content), what it won't do (actions), and *why each line is where it is* for this system's context and users. (2) Test both failure modes: craft benign requests that might trigger over-refusal (legitimate uses near the line) and harmful requests that might slip under-refusal (Ch 4's jailbreaks) — measure both rates. (3) Fix one calibration problem: an over-refusal (make it help the legitimate use) or an under-refusal (close the gap), refusing *specifically* not broadly. The refusal policy + the both-modes measurement + the calibration fix = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What do refusals protect against, and why is the refusal design *your* responsibility?
2. Name the four layers refusals live at, and why layer them?
3. Distinguish over-refusal from under-refusal, and why is the boundary between them genuinely hard?
4. Recite the design principles for doing refusals well — specific, graceful, consistent, right-layer, context, measured.
5. Why is there no universal refusal setting, and what does copying another product's refusals cause?


---

## Wikilinks
[[guardrails-in-out]]
[[roles-and-system-prompts]]
[[responsible-shipping]]
[[refusal_handling]]
[[hallucination]]

## Status log
- Started: 2026-07-21
- Finished: null
