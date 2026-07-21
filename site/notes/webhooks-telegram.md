## ELI5
Your system needs to *reach you* — to notify you when a proposal needs approval, when a job fails, when the briefing is ready. The node summary: **wire a real notification path.** Webhooks are how systems talk to each other in real time (one system pings another's URL when something happens), and Telegram is a dead-simple, free way to get those notifications on your phone. This small build closes a real loop: your agent-lab can now *tap you on the shoulder* when it needs you or has something for you.

## The Real Explanation
**Webhooks — the reverse API call.** A normal API call: *you* call *someone else's* server. A webhook: *someone else's* server calls *yours* (a URL you register) when an event happens — "when a payment succeeds, POST to this URL," "when a message arrives, POST to this URL." It's the push model (Ch 9's realtime, generalized to cross-system): instead of you polling "did anything happen?" (Ch 13), the other system *notifies* you the instant it does. Webhooks power most cross-service integration (Stripe → your server on payment, GitHub → your server on push, Telegram → your server on message). Your server exposes a webhook endpoint (a FastAPI route, Ch 1) that receives and handles these event-POSTs.

**Telegram as the notification path (the concrete build).** Telegram bots are the easiest real notification channel: create a bot (via BotFather, get a token), and your backend can *send* you messages (`POST` to Telegram's API → a message appears on your phone) and *receive* your messages (Telegram webhooks your endpoint when you message the bot → you can *command* your agent-lab from your phone). The two directions: *outbound* (the agent-lab notifies you — "proposal pending approval," "briefing ready," "job failed" — Ch 15's alerting, delivered) and *inbound* (you command it — "approve the pending proposal," "run the briefing now" — a mobile control surface for your system). For a solo builder, this is a genuinely delightful capability: your agent-lab in your pocket.

**The security realities (webhooks are an inbound attack surface — Vol 08 returns).** A webhook endpoint is a *public URL anyone can POST to* — which means it's an entry point (Vol 08 Ch 1's threat model): *verify the sender* (webhooks include a signature — verify it, so you only act on genuine Telegram/Stripe events, not an attacker POSTing fake ones — Vol 08 Ch 10's authenticity); *validate the payload* (Vol 02 Ch 6 — it's untrusted input, Vol 08 Ch 3); *rate-limit* (Ch 28 — a public endpoint can be flooded); *and critically for Telegram-commanding* — *authenticate the commander* (only *you* should be able to command your agent-lab — verify the Telegram user ID, or an attacker who finds your bot can drive your system; this is authn, Ch 30, on the notification path). A command channel to your agent-lab is a powerful capability and therefore a guarded one (Vol 08 Ch 8's least-privilege — the bot commands only what it should, gated Vol 08 Ch 9).

**Verification.** Outbound: your backend sends a Telegram message, it arrives on your phone. Inbound: you message the bot, Telegram webhooks your endpoint, your backend receives and handles it. Security: signature verification rejects a forged webhook; commander-authentication rejects a command from a non-you user; the payload is validated. Test the real loop: the agent creates a proposal → you get a Telegram notification → you reply "approve" → the proposal is approved (the full pocket-control loop).

## Why It Matters
Where this appears in real systems and jobs: wire a real notification path.

## Hands-On
Build it (est. half a day, delightful): a Telegram bot (token via BotFather) → outbound notifications (backend → Telegram → your phone: proposal-pending, job-failed, briefing-ready) → a webhook endpoint (FastAPI, Ch 1) receiving inbound messages → inbound command handling (you → bot → your backend) → **security** (signature verification, commander authentication, payload validation) → test the full loop (proposal → notification → phone-approval → executed). Wire it to the gate (Ch 10, Vol 08 Ch 9) and monitoring (Ch 15). Tag `prod-v0.10`. The working notification + the pocket-approval demo + the security checks (forged-webhook rejected, non-you-command rejected) = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What is a webhook, and how does it differ from a normal API call (push vs pull)?
2. Describe the two Telegram directions (outbound notify, inbound command) and their value.
3. Why is a webhook endpoint an attack surface, and what four security measures guard it?
4. Why must the Telegram commander be authenticated, and what breaks without it?
5. Walk the full pocket-control loop from agent-proposal to phone-approval.


---

## Wikilinks
[[monitoring-alerting]]
[[build-proposal-gate]]
[[authn-vs-authz]]
[[injection-first-look]]
[[build-fastapi-backend]]

## Status log
- Started: 2026-07-21
- Finished: null