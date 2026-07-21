---
id: protocol-futures
title: "Protocol Futures"
domain: frontier-capstone
ring: 10
cluster: "The Moving Edge (baseline guesses — expect replans)"
type: frontier
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["mcp-fundamentals", "protocol-landscape", "mcp-security", "build-brain-mcp-server", "agent-threat-model"]
tags: [frontier-capstone]
---

## ELI5
This node is marked `frontier` in your graph — one of the five explicit placeholders Rule 7 protects. Its job is not to tell you where protocols *are* (that answer rots in months) but to arm you with the permanent questions that let you read *any* protocol landscape, this year or in five. In Vol 05 you learned MCP as "the USB-C of AI" — one standard for model↔tool connectivity. The frontier question is: what else is getting a USB-C?

## The Real Explanation
**Axis 1 — What layer is being standardized?** Model↔tool (MCP's territory — Vol 05); agent↔agent (delegation, discovery, task lifecycle between *peers* — the A2A-shaped problem: how does one agent find another, trust it, hand off work, get results back?); agent↔payment/identity (who is this agent acting for, and can it spend money?); agent↔web (how sites signal what agents may do — the browser-agent world of Chapter 4 begging for rules). Each layer will attract competing standards; layers, not logos, are the permanent map.

**Axis 2 — The adoption physics.** Protocols win by network effects, not elegance (worse-but-adopted beats better-but-lonely — the permanent lesson of every standards war in computing). Read the signals you'd read for MCP: who ships servers/clients, which big platforms commit, does an open governance body exist, is there a killer integration. **Axis 3 — The security surface.** Every new protocol layer is a new Vol 08 chapter waiting to be written: MCP brought tool poisoning and confused deputies (Vol 05 Ch 6); agent↔agent brings impersonation and delegation-chain attacks; payments bring the obvious. The permanent rule: *a protocol's security model matters more than its feature list*, because you'll be plugging it into systems holding your private data. **Axis 4 — What it means for VIZIER.** Your brain already speaks MCP (Vol 05's brain-MCP-server). Each new layer is a question: would v2 expose itself there, and what would the gate guard?

## Why It Matters
Where this appears in real systems and jobs: where MCP/A2A and successors are heading — live view.

## Hands-On
Run the frontier-scan *now*, as the node demands: 60–90 minutes of current reading (official specs and announcements over commentary — Vol 04 Ch 14's provenance discipline applies to your own research too). Produce the one-page **Protocol Landscape Memo**, structured by the four axes: what layers have live standards today, adoption signals per contender, the security surface you'd fear, and one concrete v2 decision this scan informs. Date-stamp it. That memo *is* the node's artifact — and per Rule 7, if months pass before you light this, scan again and diff.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the four permanent axes without looking.
2. Why do layers beat logos as the map? What happened to your memo the day a new protocol launched — did it survive?
3. State the adoption-physics rule and the three signals you weight most.
4. For one protocol from your scan: its security surface in two sentences, and the Vol 08 concept it rhymes with.
5. The one v2 decision your memo informed — what, and why now rather than later?


---

## Wikilinks
[[mcp-fundamentals]]
[[protocol-landscape]]
[[mcp-security]]
[[build-brain-mcp-server]]
[[agent-threat-model]]

## Status log
- Started: 2026-07-21
- Finished: null
