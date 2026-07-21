## ELI5
Every defense in Part II is a hypothesis until you *attack* and see if it holds. The node summary: **attack my own agent with injection payloads.** This is red-teaming (Ch 4) as a build — a systematic, documented adversarial campaign against your *own* most capable agent, using everything you've learned about attacks (Part I) to find where your defenses (Part II) actually fail. It's the moment of truth for the ring: not "I built defenses" but "I attacked my defenses and here's what I found." And it will find things — it always does.

## The Real Explanation
**The target and the campaign.** Aim at your most capable, highest-blast-radius agent (the research agent with memory and tools, or the node-proposer — the ones your Ch 1 threat model ranked riskiest). The campaign is *systematic* (Ch 4's "not random"): work the threat model — for each entry point (user message, web content, RAG docs, memory, MCP, tool results), each attack class (direct injection Ch 2, indirect injection Ch 3, jailbreaks Ch 4), and each objective (exfiltrate data, take unauthorized action, escalate privilege, cause cost/denial), craft and launch attacks. The goal is *coverage* — attack every square of the threat-model grid — and *creativity* — the attacks that find real holes are the ones the builder didn't anticipate (so combine techniques, iterate on near-misses, think like the adversary who wants *in*).

**The high-value attack scenarios (where real breaches live).** Prioritize the *lethal-trifecta* scenarios (Ch 7 — the catastrophic ones): can you plant content (in a web page the agent fetches, a document it retrieves, a memory it holds) that makes it *read private data and exfiltrate it*? That's the crown-jewel attack — if it works, you've found a genuine vulnerability; if your architecture prevented it (you removed an ingredient), you've *validated* your trifecta defense empirically. Also high-value: *confused deputy* (Vol 05 Ch 13 — make the agent misuse its legitimate authority), *gate bypass* (Ch 9 — get a consequential action to execute without approval), *idempotency violation* (Ch 10 — cause a double-execution), *guardrail evasion* (Ch 11 — get harmful content past the output check), *PII exfiltration* (Ch 12 — extract personal data the redactor missed), and *persistent compromise* (Vol 06 — plant a malicious memory that affects future sessions). Each targets a specific defense; each success is a specific fix (Ch 16).

**Documentation — the campaign's real product.** Every attack, recorded (Ch 4's discipline): the attack (payload, technique, entry point, objective), the result (succeeded / partially / blocked), and *why* (which defense caught it, or which assumption it violated). Successes become fixes (Ch 16) and permanent tests (Ch 17); blocks validate defenses (and tell you which layers are working — evidence your architecture holds). The output: a *red-team report* — the attack grid with results, the successful breaches with severity, the validated defenses, and the attack-success-rate (Ch 4's metric — your baseline, which Ch 16 will drive down). This report is the ring's centerpiece artifact and, honestly, a striking portfolio piece: "I systematically attacked my own AI agent and here's the vulnerability report" is rare, senior, and credible in a way no feature demo is.

**The mindset check — adversarial honesty.** The hardest part isn't technical; it's *psychological* (Ch 4, Vol 06 Ch 16): the temptation to not-really-try, to test the attacks you know will fail, to protect your baby. Resist it. The red-team that finds nothing either has a perfect agent (you don't) or a lazy red-teamer (don't be). *Try to break it.* A successful attack against your own agent isn't a failure — it's the whole point; it's a vulnerability found *by you* instead of by an attacker in production. Celebrate the breaches; they're the ring working.

## Why It Matters
Where this appears in real systems and jobs: attack my own agent with injection payloads.

## Hands-On
Run the campaign (est. 1-1.5 days, genuinely valuable): (1) Systematic attack across the threat-model grid — aim for *30+ documented attacks* spanning entry points, attack classes, and objectives, prioritizing the lethal-trifecta and gate-bypass scenarios. (2) For each: payload, technique, result, why. Be adversarially honest — *try* to break it. (3) The red-team report: the attack grid with results, the successful breaches ranked by severity, the validated defenses, and the baseline attack-success-rate. (4) Triage the breaches for Ch 16 (fix priority by severity). Tag `safety-v0.5`. The red-team report + the ranked breaches + the baseline success-rate = the note; Ch 16 fixes what this found, Ch 17 makes it permanent.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. How is the campaign *systematic* — what grid do you work, and why coverage plus creativity?
2. What are the crown-jewel attack scenarios, and why does a lethal-trifecta success (or prevention) matter most?
3. Why is documentation the campaign's real product — what does each result become?
4. Why is adversarial honesty the hardest part, and why is a successful self-attack a *success*?
5. What's in the red-team report, and why is it a rare, credible portfolio artifact?


---

## Wikilinks
[[jailbreaks-redteaming]]
[[agent-threat-model]]
[[lethal-trifecta]]
[[fix-what-broke]]
[[build-injection-suite]]

## Status log
- Started: 2026-07-21
- Finished: null