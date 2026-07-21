## ELI5
MCP standardized *agent-to-tool*. But how do *agents* talk to *other agents* across systems, vendors, organizations? That layer is younger, hotter, and unsettled. The node summary names one contender and hedges honestly: **A2A and whatever is current when I light this node.** This chapter gives you the permanent axes to evaluate any protocol claim — so that whatever won by the time you read this, you can place it, judge it, and not be sold hype.

## The Real Explanation
**Axis 1 — What layer does it standardize?** The stack has distinct connectivity problems, and protocols target different ones: *agent-to-tool* (MCP's won territory — how an agent uses a capability); *agent-to-agent* (how independent agents, possibly across vendors/orgs, discover each other, delegate tasks, and exchange results — the contested frontier; Google's A2A was an early named entrant, designed for agents to advertise capabilities and hand off work across organizational boundaries); *agent-to-user* and *orchestration* layers. When you meet a new protocol, first question: *which layer, and is that layer already won?* (Betting against MCP for tools is likely foolish; the agent-to-agent layer is genuinely open.)

**Axis 2 — What problem does it actually solve vs. what could be a library?** The protocol test (echoing Ch 1's hype-detection instinct): does this need to be a *protocol* (a shared standard enabling interop between parties who don't coordinate) or is it a *framework/library* wearing protocol clothes? Real protocols solve *interop across trust/vendor boundaries* — the M+N problem (Ch 8) at some layer. If everyone using it is already in one system, it's a library. A2A's premise is genuinely cross-boundary (your agent delegating to a vendor's agent it's never met); judge each contender by whether its problem is truly cross-boundary.

**Axis 3 — Adoption dynamics (why protocols win or die).** Protocols win on *incentive and network effects*, not technical merit (Ch 8: MCP won because M+N economics were overwhelming and big players adopted fast). Questions: who's backing it (a lone vendor's "standard" is a product; multi-vendor backing is a protocol)? Is there a reference implementation and an ecosystem (servers/clients/adopters)? Does adopting it *reduce* your integration work (real incentive) or add lock-in (anti-incentive)? Most proposed protocols die not from bad design but from insufficient network effect — the graveyard is large.

**Axis 4 — How does it compose with what won?** New protocols don't replace MCP; they layer with it. A2A-style agent-to-agent protocols and MCP are *complementary* (agents talk to each other via one, to tools via the other) — the well-designed ones declare their compositional boundary. When evaluating: does this fit *alongside* the won standards, or does it fight them (fighting a won standard is a death sentence)?

**Axis 5 — Maturity and the honest "not yet."** The agent-to-agent layer may still be pre-standardization when you read this — multiple contenders, no clear winner, or an emerging one. The senior move (Vol 01 Ch 11's benchmark skepticism, Vol 04 Ch 17's measurement discipline): distinguish *shipped and adopted* from *announced and hyped*, and be comfortable concluding "no winner yet; MCP for tools, bespoke or wait-and-see for agent-to-agent." Not every layer has a standard yet, and pretending otherwise is how you adopt a dead protocol.

## Why It Matters
Where this appears in real systems and jobs: A2A and whatever is current when I light this node.

## Hands-On
Run the frontier-scan (Rule 7): (1) Search the *current* state of agent protocols — MCP's status (still winning tools? evolved how?), the agent-to-agent contenders (A2A's trajectory, any new entrants, any consolidation), and who's backing what *now*. (2) Build the landscape table with the five axes as columns and every live protocol as a row — layer, real-problem-vs-library, backers/adoption, composition with MCP, maturity. Date-stamp it (per Rule 7, this snapshot rots; the next reader of this node may be you in a replan, re-scanning). (3) The verdict paragraph: for *your* systems today, which protocols do you adopt, which do you watch, which do you ignore — and the honest "not yet" where it applies. (4) Update your Vol 04 agent-lab reflection: does the current protocol landscape suggest your lab's MCP foundation was well-chosen, and what would you add now?

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the five permanent axes as evaluation questions.
2. What distinguishes a real protocol from a library-in-protocol-clothes? Apply it to one contender.
3. Why do protocols win on incentive over merit? Give MCP as the worked example.
4. How should a new agent-to-agent protocol compose with MCP, and what's the death sentence?
5. Why is this a frontier node — what rots here, what doesn't, and what's the honest "not yet"?


---

# PART III — TEAM BUILDS
*5 chapters. The cluster where it all ships: two agents improving a draft, the brain exposed to the world as MCP, the honest one-vs-many experiment, and the ring's close.*

---

## Wikilinks
[[mcp-fundamentals]]
[[when-many-beats-one]]
[[model-landscape]]
[[handoffs-routing]]

## Status log
- Started: 2026-07-21
- Finished: null