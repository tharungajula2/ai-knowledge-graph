---
id: realtime-subscriptions
title: "Build: Realtime Postgres Approvals UI"
domain: production
ring: 9
cluster: "The Platform"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["supabase-deep-dive", "build-proposal-gate", "add-the-gate", "build-command-center", "the-bridge"]
tags: [production]
---

## ELI5
Your agent proposes consequential actions through a gate (Vol 08 Ch 9's queue) — but you need to *see* those proposals appear and approve them *live*. The node summary: **build a Next.js Approvals UI that subscribes to PostgreSQL changes via Supabase realtime channels and updates the cockpit layout dynamically; verify by simulating database inserts.** This is the human-in-the-loop gate (Vol 04 Ch 15, Vol 08 Ch 9) made *visible and interactive* — the moment the agent wants to act, a proposal card appears in your dashboard instantly, and you approve, edit, or reject with a click. The gate becomes a cockpit.

## The Real Explanation
**The realtime approval loop — the whole point.** The flow: (1) the agent decides to take a consequential action → creates a proposal row in the queue table (Vol 08 Ch 9); (2) Supabase Realtime (Ch 9) *pushes* that insert to the subscribed UI *instantly*; (3) a proposal card *appears* in your approvals dashboard without any refresh; (4) you review it (the payload, the rationale, the risk — Vol 08 Ch 9), and approve/edit/reject with a click; (5) your verdict updates the proposal row; (6) the backend (watching for the verdict — Ch 12's poller, or a realtime subscription) executes the approved/edited action (idempotently — Vol 08 Ch 10). The realtime subscription is what makes this *feel* like a live cockpit rather than a form you refresh — the proposal appears the instant the agent thinks of it.

**Next.js and the frontend reality (your first real frontend build).** Next.js is the React framework for production web UIs (server-rendering, routing, API routes). This build is your entry into real frontend engineering — and the Supabase realtime client makes the hard part (live updates) tractable: `supabase.channel('proposals').on('postgres_changes', {event: 'INSERT', ...}, handleNewProposal).subscribe()` — a subscription that fires `handleNewProposal` every time a proposal row is inserted, and your React state updates, and the UI re-renders with the new card (Vol 05 Ch 4's message-passing → UI). The "updates the cockpit layout dynamically" means the UI *reacts* to database state — new proposals appear, resolved ones move to history, the layout reflects live system state.

**The design of a good approval UI (HITL UX — Vol 04 Ch 15's edit-rate, made usable).** A proposal card shows: *what* the agent wants to do (the action, human-readable), *why* (the rationale), *the risk* (Vol 08 Ch 9's triage — color-coded: green auto-approvable, yellow needs-review, red dangerous), *the editable payload* (Vol 08 Ch 9's payload editing — the recipient field, the amount, editable inline before approving), and *the actions* (approve / edit-and-approve / reject-with-reason). Good HITL UX makes the *right* decision easy and the *dangerous* decision deliberate (Vol 08 Ch 9's selectivity — you don't want to fatigue-click "approve" on a red proposal). This UI is where the human stays meaningfully in the loop (Vol 04 Ch 7's approval-fatigue lesson, solved with design).

**Verification — simulating database inserts, per the node.** Without running the full agent, *simulate* proposals by inserting rows into the queue table directly (Ch 16's demo mode helps): assert the UI *receives the realtime push* and the card *appears without refresh* (the core realtime test); assert approve/edit/reject *update the row correctly*; assert the risk color-coding renders; assert the payload editing round-trips (Vol 08 Ch 9). Test the realtime resilience (connection drops → reconnects → catches missed changes). The simulated-insert-appears-live test is the crown.

## Why It Matters
Where this appears in real systems and jobs: Build a Next.js Approvals UI that subscribes to PostgreSQL changes via Supabase realtime channels and updates the cockpit layout dynamically; verify by simulating database inserts.

## Hands-On
Build it (est. 1.5 days — your first real frontend): a Next.js app → Supabase realtime subscription to the proposals table (Vol 08 Ch 9) → proposal cards that appear live on insert → the card UI (action, rationale, risk color-coding, editable payload, approve/edit/reject) → verdict-writes-back-to-DB → test via simulated inserts (card appears live, verdicts persist, editing round-trips). This is the RESURRECTION dashboard's heart (Ch 34) and THE BRIDGE's approval surface (Ch 35). Tag `prod-v0.7`. The live-updating approvals UI + the simulated-insert demo + the edit-and-approve flow = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Walk the realtime approval loop from agent-proposal to executed-action — where does realtime fit?
2. How does a Supabase realtime subscription make the UI update without refresh?
3. What does a good proposal card show, and how does its design keep the human meaningfully in the loop?
4. Why does risk color-coding and deliberate-dangerous-actions matter (Vol 08 Ch 9's selectivity)?
5. What does the simulated-insert test prove, and why test realtime reconnection?


---

## Wikilinks
[[supabase-deep-dive]]
[[build-proposal-gate]]
[[add-the-gate]]
[[build-command-center]]
[[the-bridge]]

## Status log
- Started: 2026-07-21
- Finished: null
