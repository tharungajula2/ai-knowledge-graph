---
id: vizier-v2-gate-safety
title: "Build: v2 Gate & Security"
domain: frontier-capstone
ring: 10
cluster: "VIZIER v2 — The Final Masterpiece"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["build-proposal-gate", "build-overlap-scanner", "build-idempotency-audit", "lethal-trifecta", "least-privilege-tools", "build-redteam-my-agent", "synthesis-safety"]
tags: [frontier-capstone]
---

## ELI5
v2 can now think, remember, and read. Which means v2 can now be *dangerous* — it has private data (memory), consumes untrusted input (retrieval, email), and wants write-actions (the whole point). That's the lethal trifecta assembling itself in your own codebase (Vol 08). Today you install the two organs that make autonomy trustworthy: the **HITL proposal gate** at the dispatch chokepoint, and the **injection overlap scanner** on the untrusted-input paths. In v1 these were the system's crown jewels, built by an agent. In v2 they're yours — and this time, the whole Vol 08 arsenal arrives with them.

## The Real Explanation
**The gate.** Per your Vol 08 build, integrated at the socket Chapter 15 left waiting: every consequential action (keyed on the tool safety-tags from birth — the Vol 04 Ch 3 investment, paying out) becomes a **proposal row** in a database-backed queue — action type, payload (your schema; your fine-tuned adapter's native tongue), risk tier, provenance of the triggering input. Execution blocks on human verdict: approve / **edit** (payload editable before execution — the feature that makes the gate a collaboration, not a speed bump) / reject *with reason* (the reason is training data — Vol 04 Ch 18's learning loop, and Chapter 13 taught you it's also a preference pair). Downstream of approval: the idempotency guard and append-only audit log (Vol 08's Ch 10 build — exactly-once execution, tamper-evident history). Batch approval for plans, deviation tripwire if execution drifts from the approved plan (Vol 04 Ch 15's policy promotions, all present).

**The scanner.** On every untrusted ingress — retrieved documents, fetched web content, email bodies — before the model reasons over it: the overlap scanner (Vol 08 Ch 3's build): override-keyword parsing plus the sharper trick, *correlating thread state* — does this "user request" actually originate from content the thread just ingested? Flagged content gets quarantine treatment: provenance-marked, spotlighted with delimiters (Vol 08 Ch 6), never silently trusted. And the deepest defense wired in structurally: **least privilege** (Vol 08 Ch 8) — specialists get only their tools; nothing reaches email-send capability except through the gate. Detection can fail; capability design shouldn't have to.

**Defense in depth, assembled.** This chapter is Vol 08's synthesis diagram made executable: minimize (privilege) → detect (scanner) → contain (gate) → record (audit) → verify (next chapter's suite). Know the layers by heart; you built each one twice now.

## Why It Matters
Where this appears in real systems and jobs: Connect the human-in-the-loop proposal queue and injection overlap scanner (taught by build-proposal-gate & build-overlap-scanner).

## Hands-On
Build to acceptance (est. 1–2 honest days): proposal schema + queue + verdict flow with editable payloads (mock email/task proposals per the taught node's verify clause); idempotency + audit integration with the duplicate-run test; scanner on the retrieval and email paths; then the **assault**: replay your entire Vol 08 red-team payload set (Ch 15's arsenal — it exists for exactly this moment) against v2 — direct injections, indirect payloads planted in retrievable notes and mock emails, the exfil attempts. Acceptance: zero ungated writes, zero exfil, every attack visible in the audit log. Record the attack run for the film — an on-camera injection attempt dying at the gate is the single best demo your system owns. Tag `v2-gate-0.1`. In the note: the assault scorecard, one attack that got *further* than expected and the fix, and the defense-in-depth diagram redrawn from memory with v2's file paths on it.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Assemble the lethal trifecta from v2's actual components, then dismantle it layer by layer.
2. Why is the gate at the dispatch chokepoint rather than per-tool? Which Vol 04 chapter made that argument?
3. Editable payloads and rejection reasons: name the two downstream systems each one feeds.
4. Walk the scanner's two techniques, and the quarantine treatment for flagged content.
5. Your assault scorecard from memory — and the one fix it forced.


---

## Wikilinks
[[build-proposal-gate]]
[[build-overlap-scanner]]
[[build-idempotency-audit]]
[[lethal-trifecta]]
[[least-privilege-tools]]
[[build-redteam-my-agent]]
[[synthesis-safety]]

## Status log
- Started: 2026-07-21
- Finished: null
