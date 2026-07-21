---
id: lethal-trifecta
title: "The Lethal Trifecta & Rule of Two"
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
wikilinks: ["agent-threat-model", "least-privilege-tools", "sandboxing-isolation", "mcp-security", "subgraphs"]
tags: [safety-security]
---

## ELI5
Here is the single most important idea in agent security, and it's beautifully simple. The node summary names it: **private data + untrusted input + exfil paths.** Simon Willison's "lethal trifecta" observes that catastrophic agent breaches require *three* things present together — and if you can *remove any one*, the catastrophe becomes impossible *architecturally*. This is "security is architecture, not vigilance" at its purest and most actionable: not "detect the attack" but "design so the attack can't matter." Learn this cold; it reorganizes how you think about every agent you'll ever build.

## The Real Explanation
**The three ingredients — and why all three are required.** A catastrophic exfiltration breach needs:
1. **Access to private data** — the agent can read something sensitive (your emails, files, secrets, a database).
2. **Exposure to untrusted input** — the agent processes content an attacker can control (a web page, an email, a RAG doc — indirect injection's entry, Ch 3).
3. **A way to exfiltrate** — the agent can send data *out* (make a web request, send an email, write to an attacker-visible place, call an external tool).
The insight: *any one alone is safe-ish.* Private data with no untrusted input and no exfil = a secure vault (nothing malicious enters, nothing leaves). Untrusted input with no private data and no exfil = a harmless text processor (attacker can inject, but there's nothing to steal and nowhere to send it). Exfil ability with no private data and no untrusted input = a normal tool doing its job. **It's the *combination* that's lethal**: untrusted input injects instructions → those instructions read private data → and exfiltrate it out. Break the chain anywhere and the attack collapses.

**The defensive superpower — remove an ingredient.** Because all three are *required*, you defend by *architecturally removing one* from any given agent/flow:
- *Remove untrusted input*: an agent that only processes *trusted* content (your own vetted data, no web, no arbitrary documents) can't be injected. (Limiting, but right for high-privilege agents.)
- *Remove private-data access*: an agent that processes untrusted content but *can't read anything sensitive* has nothing to steal. (The quarantine agent — Ch 14 — handles web content with zero access to secrets.)
- *Remove exfil paths*: an agent with private data and untrusted input but *no way to send data out* (no network tools, no email, read-only) can be injected and can read secrets but *can't get them to the attacker*. (Often the easiest ingredient to remove.)
The art: for each agent, look at your threat model (Ch 1), see which of the three it has, and *remove the one that's cheapest to remove without breaking the function*. An agent rarely *needs* all three — and noticing when it does is the loudest security alarm you can install.

**The Rule of Two — the practical formulation.** A pragmatic guideline (from security practice): *an agent should have at most two of {untrusted input, private data, ability to take consequential external actions}* — never all three simultaneously in one context. If a task seems to need all three, *split it*: a quarantined agent handles the untrusted input and produces sanitized output (no private data, no exfil — Ch 14); a separate trusted agent handles the private data and actions (no untrusted input). The split *is* the defense — you've removed the lethal combination by architectural decomposition (Vol 05's multi-agent isolation, now as a security pattern; Vol 04 Ch 10's subgraph boundaries, weaponized for safety). The Rule of Two turns "how do I secure this agent?" into "how do I decompose this so no single agent holds the trifecta?" — a far more tractable question.

**Why this is the ring's keystone.** Every other defense (spotlighting Ch 6, guardrails Ch 11, the scanner Ch 3) *reduces the probability* of an attack succeeding; the trifecta discipline *removes the possibility* of catastrophe by construction. Probabilistic defenses fail sometimes (the arms race, Ch 4); architectural ones don't fail because there's nothing to fail — you can't exfiltrate private data through an agent that has no private data. This is why "security is architecture" beats "security is vigilance": vigilance is probabilistic and tiring; architecture is structural and permanent. The trifecta is the sharpest tool for turning vigilance into architecture.

## Why It Matters
Where this appears in real systems and jobs: private data + untrusted input + exfil paths.

## Hands-On
Apply the trifecta to your systems (concept node, and genuinely clarifying): (1) For each of your agents (research agent, node-proposer, brain-chat, memory-agent), assess the three ingredients: does it have private-data access? untrusted input? exfil paths? Mark which hold the *full trifecta* (those are your highest-risk systems — Ch 1's ranking, now sharpened). (2) For the riskiest one, design the removal: which ingredient can you architecturally remove or split off (Rule of Two) without breaking its function? Draw the decomposition. (3) The alarm: write the one-sentence rule you'll apply to every *future* agent — "before shipping, check the trifecta; if all three, decompose." The trifecta assessment + the removal design + the future-rule = the note; this reframes Ch 8's least-privilege and Ch 14's sandboxing.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the three ingredients of the lethal trifecta, and why is each one *alone* relatively safe?
2. Why is the *combination* lethal — walk the attack chain through all three.
3. Explain the defensive superpower — how removing any one ingredient collapses the attack.
4. State the Rule of Two, and how decomposition removes the trifecta.
5. Why does the trifecta discipline beat probabilistic defenses — architecture vs vigilance, precisely.


---

## Wikilinks
[[agent-threat-model]]
[[least-privilege-tools]]
[[sandboxing-isolation]]
[[mcp-security]]
[[subgraphs]]

## Status log
- Started: 2026-07-21
- Finished: null
