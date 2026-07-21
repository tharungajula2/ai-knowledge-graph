---
id: token-economics-of-teams
title: "Token Economics of Teams"
domain: multi-agent-mcp
ring: 5
cluster: "Teams"
type: concept
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["cost-latency-budgets", "when-many-beats-one", "build-gateway", "experiment-one-vs-many", "rate-limits-caching"]
tags: [multi-agent-mcp]
---

## ELI5
Every chapter in this cluster has deferred to "Ch 7's math." Here it is. The node summary is blunt: **multi-agent cost math, honestly.** Vol 04 Ch 17 taught you a single agent's bill; a team multiplies it in ways that are easy to underestimate and easy to hide behind a slick demo. This chapter makes the multiplication explicit, so that every "let's add an agent" decision comes with a number attached — which is exactly the discipline that lets you tell real teams from expensive theater.

## The Real Explanation
**Where the extra money goes — the four multipliers over a solo agent.** (1) *Coordination overhead*: the orchestrator's own calls — routing decisions, integration reasoning, replanning (Ch 2's five responsibilities each cost tokens) — pure overhead the solo agent never paid. (2) *Context re-establishment*: every handoff (Ch 3) re-packages context; every specialist starts its own scratchpad and often re-derives shared facts the orchestrator already knew (isolation's price — Ch 1); nothing is shared for free. (3) *Redundant work*: parallel researchers (Ch 5) overlap (two find the same source); debating agents (Ch 6) re-read each other's full answers every round; the team does *more total work* than the task's information content requires. (4) *The scratchpad-growth disease, multiplied*: Vol 04 Ch 13's per-agent context growth, now summed across the team and compounded by rounds — the integral you learned to read (Vol 04 Ch 17), now N integrals stacked. Rule of thumb to carry: a naive multi-agent system costs **2–5× a solo agent** for the same task; debate pushes **5–15×**. These aren't laws, they're warnings — measure your own (Ch 17's experiment does exactly this).

**The levers — every one already in your hands (this chapter is Vol 04 Ch 17's budget stack, re-aimed at teams).** *Model routing, team edition — the biggest lever*: the orchestrator's router and integration glue often don't need a frontier model (Vol 04 Ch 11 — classification is cheap-model work); cheap workers for narrow tasks, frontier only where quality compounds (planning, final synthesis); your gateway (Vol 02 Ch 11) makes per-agent model assignment a config value. A well-tiered team can cost *less* than a solo frontier agent doing everything, because most of the team's calls run on cheap models — the counterintuitive win that makes multi-agent economically viable. *Handoff distillation* (Ch 3): distilled briefs instead of flooded context cut re-establishment cost directly. *Bounded parallelism & dedup* (Ch 5): semaphores cap the burst, aggregation dedup kills redundant findings. *Caching* (Vol 02 Ch 10, Vol 03 Ch 20): shared prompt prefixes across agents cache well (identical system-prompt/tool-catalog prefixes — the prefix rule, at team scale); tool-result caching stops two agents paying for the same search. *Debate discipline* (Ch 6): fewer rounds, cheaper critics, or replace debate with grounded single-agent where evals permit.

**The unit-economics reframe — the senior-engineer move.** Stop thinking "tokens" and start thinking "**cost per completed task**" and "**cost per unit of quality**." A team that costs 3× but delivers a genuinely better outcome on a task worth 10× the cost is *correct*; a team that costs 3× for a 1.1× quality bump is *waste* — and only measurement tells you which (Domain 07's whole point, previewed). The decision to go multi-agent (Ch 1's three reasons) is *incomplete without its price*: "distinct specialties" justifies a team only if the specialization's quality gain exceeds the coordination tax. This chapter closes the Ch 1 loop: the honest criteria for multi-agent include *the honest cost*, and you now compute both sides.

**The hidden costs nobody demos.** Latency compounds even when cost doesn't hide — sequential handoffs stack wall-clock (Ch 3), and a user waiting on a five-agent relay feels every baton pass. Debugging cost is real engineering time — a multi-agent failure spans multiple agents' traces (Domain 07's trajectory evals exist partly for this). And the *operational* cost — more agents, more prompts to maintain, more failure modes to guard, more surface to secure (MCP security, Ch 13). The token bill is the visible tip; the total cost of ownership is larger, and the honest engineer prices all of it.

## Why It Matters
Where this appears in real systems and jobs: multi-agent cost math, honestly.

## Hands-On
Build the team-cost model (spreadsheet or script, ~30 lines): (1) *The decomposition* — take your Vol 04 supervisor+specialists on one real task, and from the ledger break the total cost into the four multipliers: coordination (orchestrator calls), re-establishment (handoff context tokens), redundant work (overlap you can spot), and per-agent growth. What fraction was *coordination overhead* vs actual task work? (This ratio is the honesty number — high overhead means the team is expensive relative to its value.) (2) *The routing intervention* — reassign the orchestrator's routing + integration to your cheapest model; re-measure; record the savings and whether quality held. Confirm the counterintuitive result if it appears: a tiered team beating a solo frontier agent. (3) *The unit-economics statement* — for one task, compute cost-per-completed-task for solo vs your team, and write the one-sentence verdict: is your team's premium justified by its quality gain? The cost decomposition + the routing delta + the verdict = the note, and it feeds Ch 17's experiment directly.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the four cost multipliers of teams over solos, with the rule-of-thumb ranges.
2. Why can a well-tiered team cost *less* than a solo frontier agent? Which lever makes this true?
3. Recite the levers and map each to its origin chapter.
4. Deliver the unit-economics reframe: what two ratios replace "token count," and what do they decide?
5. Name three hidden costs beyond the token bill, and how does this chapter complete Ch 1's criteria?


---

# PART II — MCP & PROTOCOLS
*7 chapters. Agents stop being solo craftsmen and learn the connective standard of the field: what MCP is, building a server and a client, the async bridge rebuilt as its author, the full spec, the new attack surface, and the shifting protocol landscape.*

---

## Wikilinks
[[cost-latency-budgets]]
[[when-many-beats-one]]
[[build-gateway]]
[[experiment-one-vs-many]]
[[rate-limits-caching]]

## Status log
- Started: 2026-07-21
- Finished: null
