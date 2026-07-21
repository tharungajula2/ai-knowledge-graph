## ELI5
The node summary names the ring's organizing architecture: **the layered diagram.** Defense in depth is the security principle that no single defense is trusted — instead, layers of independent controls each catch what the others miss, so that a breach requires defeating *all* of them, and a single failure is contained rather than catastrophic. When you can draw the full layered defense from untrusted input to consequential action, you own how to build AI that can't be turned against you — the ring's whole promise, in one picture.

## The Real Explanation
It starts with the map: a **threat model** — who attacks, what they want, where they get in (every input channel), and what they can do (bounded by capabilities and data access) [1]. The attacks are **injection** — direct, in the user's own message, exploiting the soft learned boundary [2]; and indirect, hidden in content the agent reads for someone else, caught by an **overlap scanner** that detects untrusted data bleeding into instruction-space [3] — plus **jailbreaks**, defeated only by the attacker's mindset turned on yourself [4], and **supply-chain** compromise of the packages, models, and servers you trust [5]. The defenses layer from outside in: **spotlighting** frames untrusted content as data-not-instructions [6]; the **lethal trifecta** discipline — private data + untrusted input + exfil paths — removes catastrophe by removing any one ingredient, the Rule of Two decomposing what would hold all three [7]; **least-privilege** scopes every capability to the minimum, making harm not-instructed-against but *impossible* [8]; the **proposal gate** intercepts consequential actions into a durable, risk-triaged, human-editable queue [9]; **idempotency and tamper-evident audit** guarantee exactly-once execution and un-forgeable accountability [10]; **guardrails** scan input and enforce output, the deterministic net around the probabilistic model [11]; **PII redaction** scrubs personal data before the model sees it, shrinking the trifecta's private-data ingredient [12]; **refusals** operationalize what the system won't do [13]; and **sandboxing** makes the trifecta and least-privilege *physical* — network-less, filesystem-confined, resource-limited environments that bound the blast even in total compromise [14]. Then the proof: **red-team** your own agent across the threat-model grid [15], **fix** what broke at the highest architectural level [16], and **lock it permanently** with an injection test suite, CI-gated, with a hard zero-exfil guarantee [17] — all in service of **responsible shipping**, the duty owed to the people you deploy to [18]. The unifying law: **no single layer is trusted; each raises the bar; together they bound the damage when — not if — one is breached.** Security is architecture, not vigilance; assume breach; contain the blast.

## Why It Matters
Where this appears in real systems and jobs: the layered diagram.

## Hands-On
Three renditions, the ritual: **(a)** The narration, written, ≤700 words, your words, every node present as a layer. **(b)** The layered diagram — the node's literal demand: concentric defensive layers from untrusted input at the outside to consequential action at the center — input layer (spotlighting, scanner, input guardrails, PII redaction), architectural layer (trifecta removal, least-privilege, sandboxing — drawn as the *structural* boundaries), decision layer (the gate, risk policy), execution layer (idempotency, audit), output layer (output guardrails, refusals) — with an attack arrow trying to reach the center and being caught/bounded at each layer, and the zero-exfil guarantee as the innermost wall. Mark which layers are *architectural* (impossible-by-design) vs *detective* (probabilistic) — the deepest distinction. Photograph into the note. **(c)** The 90-second spoken version — its interview home: *"how do you secure an AI agent?"* — where the shallow answer is "sanitize inputs" and *your* answer is the layered, trifecta-anchored, assume-breach architecture that marks you as someone who's actually attacked and defended one. Record, critique, re-record.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Deliver the 90-second version cold — the "how do you secure an agent?" answer.
2. Trace one attack (a poisoned web page trying to exfiltrate private data) through every layer that catches or bounds it.
3. Distinguish architectural defenses from detective ones on your diagram — which are impossible-by-design?
4. State the defense-in-depth law and "assume breach, contain the blast" from memory.
5. Draw the full layered diagram from memory.


---

## Wikilinks
[[synthesis-safety]]

## Status log
- Started: 2026-07-21
- Finished: null