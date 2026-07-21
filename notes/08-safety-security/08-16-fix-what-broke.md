---
id: fix-what-broke
title: "Build: Fix What Broke"
domain: safety-security
ring: 8
cluster: "Prove It"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-redteam-my-agent", "lethal-trifecta", "error-analysis-practice", "build-injection-suite", "add-the-gate"]
tags: [safety-security]
---

## ELI5
Red-teaming (Ch 15) found the holes; this build closes them. The node summary: **patch the holes; document each fix.** This is where attack becomes defense — for each vulnerability your campaign found, you diagnose the root cause, choose the *right* fix (architectural where possible, not just a patch), implement it, and *verify* the attack no longer works. And you *document* each fix — because the documentation is what turns a one-time patch into institutional knowledge and, via Ch 17, a permanent guard. This is the satisfying half: watching your attack-success-rate drop as your architecture hardens.

## The Real Explanation
**Root-cause fixing, not symptom-patching (the eval-ring lesson, Vol 07 Ch 19, in security).** For each breach, resist the urge to patch the *specific payload* (block that exact string) — that's whack-a-mole (a paraphrase evades it). Instead, find the *root cause* (why did this class of attack succeed?) and fix *that*: the payload exfiltrated data → the root cause is the agent had the lethal trifecta (Ch 7) → the fix is architectural (remove an ingredient: sandbox the untrusted-content processing, Ch 14, or remove the exfil path, Ch 8), not "block that payload." Error analysis (Vol 07 Ch 19) applies: your 30 attacks cluster into a few root causes, and fixing the *dominant cause* closes many breaches at once. The hierarchy of fixes (best to worst): *architectural* (remove the trifecta ingredient, scope the privilege — the attack becomes impossible, Ch 7/8/14); *detection* (the scanner Ch 3, guardrails Ch 11 — the attack is caught, probabilistically); *patch* (block the specific pattern — brittle, last resort). Always reach for the highest fix the vulnerability allows.

**The fix categories mapped to defenses (the ring, cashing in).** Injection succeeded → spotlighting (Ch 6) + scanner (Ch 3) + the architectural trifecta fix (Ch 7). Data exfiltrated → remove exfil path or private-data access (Ch 7/8), sandbox (Ch 14), PII-redact (Ch 12). Unauthorized action → the gate (Ch 9), least-privilege (Ch 8). Gate bypassed → fix the chokepoint (Ch 9 — ensure *all* consequential actions route through it). Double-execution → idempotency (Ch 10). Harmful output → guardrails + refusals (Ch 11/13). Persistent compromise → memory privacy/validation (Vol 06 Ch 8). Each breach from Ch 15 maps to a Part-II defense you now *apply specifically* — the campaign found *where* the general defenses were missing or weak, and this build installs them exactly there.

**Documentation — the fix log (the node's "document each fix").** For each fix: the vulnerability (what Ch 15 found), the root cause (why it worked), the fix (what you changed, at which layer of the hierarchy), the verification (the attack now fails — re-run it, confirm), and any *residual risk* (honestly: did the fix fully close it, or just raise the bar? — the ring's refrain, applied per-fix). This fix log is *institutional knowledge* (why does this defense exist? — the log answers, so future-you doesn't remove a defense not understanding its purpose), *portfolio evidence* (paired with the red-team report: "found these vulnerabilities, fixed them thus, here's the verification" — the full responsible-security narrative), and the *input to Ch 17* (each fix's verifying attack becomes a permanent regression test).

**Re-measure — prove the hardening.** After fixing: re-run the *entire* Ch 15 campaign (not just the fixed attacks — a fix can open new holes, the security version of Vol 07 Ch 8's regression) and measure the new attack-success-rate. The drop (from Ch 15's baseline) is the build's quantified result — "reduced attack-success-rate from X% to Y% via Z architectural fixes" is the evidenced security claim (Vol 07's measure-don't-believe, in security). And honestly report what *remains* — the attacks that still partially work, the residual risks accepted, the defense-in-depth layers that bound (not eliminate) the survivors. A security posture is honest about its limits (Ch 18's responsible shipping).

## Why It Matters
Where this appears in real systems and jobs: patch the holes; document each fix.

## Hands-On
Fix and verify (est. 1-1.5 days): (1) Triage Ch 15's breaches by severity; root-cause them (error-analysis cluster them — many share a cause). (2) Fix each at the *highest* hierarchy level it allows (architectural > detection > patch), documenting the fix log per breach (vulnerability → root cause → fix → verification → residual risk). (3) Re-run the *full* campaign; measure the new success-rate; confirm no fix opened new holes. (4) Report the drop and the honest residuals. Tag `safety-v0.6`. The fix log + the before/after attack-success-rate + the honest residual-risk statement = the note; Ch 17 makes these fixes permanent.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why root-cause fixing over symptom-patching, and how does error analysis apply?
2. Recite the fix hierarchy (architectural > detection > patch) and why architectural is best.
3. Map three breach types to their Part-II defense fixes.
4. What's in the fix log, and why is it institutional knowledge, not bureaucracy?
5. Why re-run the *full* campaign after fixing, and why report residual risks honestly?


---

## Wikilinks
[[build-redteam-my-agent]]
[[lethal-trifecta]]
[[error-analysis-practice]]
[[build-injection-suite]]
[[add-the-gate]]

## Status log
- Started: 2026-07-21
- Finished: null
