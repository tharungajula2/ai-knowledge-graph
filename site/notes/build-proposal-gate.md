## ELI5
You built the gate as a technique (Vol 04 Ch 7) and promoted it to policy (Vol 04 Ch 15); this build hardens it into production-grade security infrastructure. The node summary: **build a database-backed proposal queue that intercepts agent actions, checks risk policies, and supports user editing of payloads before execution; verify with mock email/task proposals.** This is the gate as a *durable, policy-driven, audited* control — the last line of defense (Ch 7's "when the frame is crossed") that catches the consequential action *before it touches the world*, even when every earlier defense failed.

## The Real Explanation
**From gate to proposal queue — the architectural upgrade.** Vol 04's gate paused execution and asked; this build makes gating a *durable, database-backed queue* — a fundamentally more robust design. When an agent wants to take a consequential action, it doesn't execute; it *creates a proposal* in a database table (the queue): the intended action, its arguments, the agent's rationale, a risk assessment, and a status (`pending`). Execution is *decoupled* from decision: the proposal sits durably in the queue (surviving crashes, waiting indefinitely — Vol 04 Ch 6's checkpointing insight, now as a first-class action-queue) until a human reviews it. This decoupling is the security win: *no consequential action executes without passing through the queue*, and the queue is a durable, auditable, policy-enforced chokepoint (Vol 04 Ch 15's dispatch-chokepoint, now database-backed and production-grade).

**Risk-policy checking — automated triage.** Not every action needs human review (approval fatigue kills gates — Vol 04 Ch 7). So the queue *checks risk policies* to triage: *auto-approve* low-risk actions (reads, reversible actions, actions within pre-approved bounds — they execute without human friction); *require review* for medium/high-risk (writes, external sends, irreversible actions — they wait for a human); *auto-reject* forbidden actions (policy violations — an action to a blocked recipient, an amount over a hard limit — rejected without even asking, because policy already decided). The risk policy is *configurable rules* (Vol 04 Ch 3's safety tags, now as a policy engine): action-type risk, argument-based risk (send-to-external-domain is riskier than send-to-internal), amount thresholds, recipient allowlists. This turns the gate from "ask about everything" (fatigue) into "ask about what genuinely needs judgment" (sustainable) — the selectivity that keeps humans meaningfully in the loop.

**Payload editing — the human as collaborator (the node's "user editing of payloads").** The reviewer isn't just approve/reject — they can *edit the payload before execution*: the agent proposed emailing the wrong recipient, or a task with a typo, or an amount that should be adjusted — the human corrects it, and the *corrected* action executes (Vol 04 Ch 7's edit-path, now first-class). This requires the payload to round-trip as *structured, editable data* (Pydantic, Vol 02 Ch 6 — the proposal is a validated object the human modifies, not prose), and it changes the human's role from bouncer to co-pilot — catching not just *malicious* actions but *mistaken* ones (the agent's honest errors, Vol 04 Ch 16, caught before they land). Edit-rate becomes a signal (Vol 04 Ch 15): high edit-rate on an action type means the agent's generating that action badly — a fix pointer.

**Verification — mock email/task proposals, per the node.** Mock consequential tools (`send_email`, `create_task` — scripted, no real sends): (1) an agent proposing an email creates a *pending proposal*, doesn't send; (2) risk policy correctly triages (a low-risk internal task auto-approves; an external email requires review; a policy-violating action auto-rejects); (3) approve executes the original; (4) *edit* executes the *edited* payload (change the recipient, verify the edited version sends); (5) reject blocks and feeds back (Vol 04 Ch 7's rejection-as-observation); (6) durability — a proposal survives a process restart (database-backed — the whole point) and can be reviewed later; (7) the audit trail (Ch 10's build) records every proposal and verdict. The durability + edit tests are the crown.

## Why It Matters
Where this appears in real systems and jobs: Build a database-backed proposal queue that intercepts agent actions, checks risk policies, and supports user editing of payloads before execution; verify with mock email/task proposals.

## Hands-On
Build it (est. 1 day): the proposal queue table (action, args, rationale, risk, status, timestamps) → the intercept (consequential actions create proposals, not executions — wire into dispatch, Vol 04 Ch 15) → the risk-policy engine (configurable auto-approve/review/auto-reject rules) → the review interface (approve/edit/reject with structured payload editing) → mock email/task tools → the verification battery (triage, approve, edit, reject, durability, audit). Then the trifecta connection: this gate is your *exfil-path control* (Ch 7) — an action that would exfiltrate gets queued and caught before it sends. Tag `safety-v0.2`. The queue + the risk-policy triage results + the edit-path demo + the durability test = the note; pairs with Ch 10's audit logger.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why is a database-backed proposal queue more robust than Vol 04's in-line gate? What does decoupling buy?
2. Explain risk-policy triage — the three tiers and why selectivity prevents approval fatigue.
3. Why must payloads round-trip as structured data, and what does the edit-path catch beyond malice?
4. How is this gate an exfil-path control in trifecta terms?
5. Which verification tests are the crown, and what does each prove?


---

## Wikilinks
[[hitl-interrupts]]
[[add-the-gate]]
[[build-idempotency-audit]]
[[lethal-trifecta]]
[[structured-output]]

## Status log
- Started: 2026-07-21
- Finished: null