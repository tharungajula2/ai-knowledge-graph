## ELI5
Everything until now, strangers couldn't touch. This build crosses the line that matters most in your 45-day mission and your whole arc: **ship something the public can use.** The product is pure Vizier soul: a bot that explains any AI term the way this textbook does — with an Indian-daily-life analogy, at Feynman depth. Your learning method, productized. Your brain, with a door.

## The Real Explanation
**The product.** User types an AI term ("embeddings", "RAG", "backpropagation") → Feynman-Bot returns a tight, structured explanation: the analogy (chai, cricket, dabbawalas, railway reservations, joint-family WhatsApp groups — *specific* Indian daily life, not generic), the real definition, why it matters, and one "check yourself" question. Sound familiar? It's this textbook's chapter template, automated. You're not copying an idea — you're shipping your own learning philosophy.

**The prompt is the product.** An L-node lives here mostly in *prompt craft*: full skeleton (Ch 3), 3–4 few-shot examples of *perfect* explanations you write by hand — they define the voice forever (Ch 4: spread them — one easy term, one hard term, one ambiguous input) — structured output for the four sections (Ch 6; schema keeps the UI clean), and guard rails: off-topic requests politely redirected ("I explain AI terms — try 'transformer'!"), injection attempts contained (Ch 12 — your first *public-facing* attack surface; the hardening you practiced is now load-bearing), unknown/misspelled terms handled honestly ("did you mean...?" — never a confident hallucinated definition of a term that doesn't exist; Vol 01 Ch 10 in production). Build the golden set *first* (Ch 16 — you already started it): 15 rows including adversarial ones; every prompt change reruns the set. This is the discipline chapter wearing product clothes.

**The serving skeleton — your first API server.** The bot needs a public face. Minimal FastAPI (it's Pydantic-native — Ch 6/18 skills transfer directly, and `async def` endpoints are Vol 01 Ch 17 paying off): one `POST /explain {term}` endpoint calling your gateway, one rate limit per IP (Ch 10's thinking, now *you're* the provider protecting *your* wallet — the free tiers you're calling have limits, so your public product must throttle its public), one tiny HTML page with an input box (keep it embarrassingly simple; the bot is the product, not the CSS). Deploy on a free tier (Render/Railway/Fly-style — pick current best free option on build day): env vars for keys (never in the repo — Ch 1's laws, now with real stakes), and a public URL that works from your phone.

**Ship it — the M3 protocol.** A public URL is necessary, not sufficient; *shipping* means telling people. The launch post (LinkedIn — the muscle from Vol 01's capstone): what it is, one screenshot, the URL, one honest sentence about what building it taught you, and the Vizier frame ("built as node 18 of ring 2 of a 228-node public journey"). Then the part nobody warns you about: strangers will type things you never imagined — keep the gateway ledger and a simple request log running, and *harvest*: every weird input becomes a golden-set row (Ch 16's regression ritual, fed by reality), every failure a fix, for at least a week post-launch. That week of tending is where the L-node's real learning lives. Milestone M3 lights when the URL is public and the post is up.

## Why It Matters
Where this appears in real systems and jobs: explains any AI term with an Indian-life analogy — ship it public. → M3

## Hands-On
The spec is the hands-on. Suggested arc across the L-node's days: golden set → prompt to 13/15 → schema + FastAPI wrapper → local end-to-end → deploy → *have two real humans use it from their phones before the post* (their confusion is free QA) → launch post → one week of log-harvesting and iteration. Artifacts for the note: the URL, the post link, the golden-set scoreboard before/after launch week, the ledger's first-week cost (it will be delightfully small — say so publicly; cost transparency is a great look), and the single weirdest thing a stranger typed.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why does the four-section output format need a schema rather than a FORMAT sentence? What breaks without it?
2. Walk your defense layers as deployed: what stops off-topic, injection, and unknown-term hallucination — cite the chapter each came from.
3. Why must the golden set precede prompt iteration, and how did launch week feed it?
4. Your bot goes mildly viral and your free-tier API key rate-limits. Which three mechanisms you built absorb this, and in what order do they engage?
5. What does M3 mean in your larger arc — answer in terms of the 45-day mission, not the tech.


---

## Wikilinks
[[prompt-quality]]
[[structured-output]]
[[injection-first-look]]
[[build-gateway]]
[[rate-limits-caching]]
[[synthesis-foundations]]

## Status log
- Started: 2026-07-21
- Finished: null