## ELI5
The node summary names a bidirectional defense: **input scanning, output enforcement.** Guardrails are the checkpoints on both sides of the model — scanning what goes *in* (catch attacks, bad inputs before the model sees them) and enforcing what comes *out* (catch harmful, leaked, or policy-violating content before it reaches the user or the world). They're the programmable safety layer wrapped around the unpredictable model — the place you enforce the deterministic rules that the probabilistic model can't be trusted to follow on its own.

## The Real Explanation
**The two directions — and why you need both.** *Input guardrails* (before the model): scan incoming content for attacks (injection patterns — your Ch 3 scanner is an input guardrail), policy violations (requests for forbidden content), PII to redact (Ch 12), off-topic/abuse, and malformed input — *reject, sanitize, or flag before the model processes it*. The value: stop bad input from ever reaching the model (cheaper and safer than catching problems after). *Output guardrails* (after the model, before delivery): scan the model's output for harmful content (Ch 13's refusals), leaked data (system prompt, PII, secrets — Vol 06 Ch 8), policy violations, hallucinated citations (Vol 03 Ch 10's integrity check as a guardrail), injection *success* (did the output do something the input tried to make it do?), and format/safety violations — *block, redact, or regenerate before it ships*. The value: the model is probabilistic and can produce anything (Vol 01 Ch 10); output guardrails are the *deterministic* net that catches what the model shouldn't have said. You need both because input guardrails can't catch everything that gets through (the arms race, Ch 4) and output guardrails are the last check before harm reaches reality.

**How guardrails work — the implementation spectrum.** *Rule-based / pattern* (regex, keyword lists, allowlists — fast, cheap, deterministic, but brittle to novel phrasings — Ch 3's layer 1). *Classifier-based* (a trained model detecting toxicity, PII, injection, off-topic — more robust than patterns, some cost; many off-the-shelf guardrail classifiers exist). *LLM-based* (an LLM judging "is this input an attack?" / "is this output safe?" — flexible, handles nuance, but slower, pricier, and *itself* injectable — Vol 07 Ch 4's judge biases apply; a guardrail LLM can be jailbroken too, so it's a layer, not a guarantee). *Hybrid* (fast patterns catch the obvious, classifiers/LLMs catch the subtle — the tiering instinct, Vol 07 Ch 9). The choice per guardrail: match the mechanism to the threat's cost and subtlety.

**The design tensions (guardrails aren't free).** *False positives vs false negatives* (Vol 01 Ch 12, everywhere in security): a too-strict guardrail blocks legitimate use (a medical chatbot's toxicity filter refusing to discuss symptoms; a security-topic query flagged as an attack — the false-positive tax degrades the product); a too-lax one lets harm through. *Latency* (Vol 02 Ch 8, Vol 07 Ch 17): every guardrail adds a check before/after the model — input guardrails delay the response, output guardrails delay delivery, and LLM-based guardrails add whole model calls (a guardrail can double your latency). *Cost*: LLM-based guardrails on every request add up (Vol 04 Ch 17). *The guardrail-is-injectable problem*: an LLM guardrail is itself an LLM, so it can be attacked (a payload that jailbreaks the *guardrail*) — which is why guardrails are *defense in depth*, not a single trusted wall. The mature stance: guardrails enforce the *deterministic, high-confidence* rules (this must never ship, this pattern is always an attack) cheaply and reliably, while the probabilistic subtleties get layered defenses — and every guardrail's false-positive/false-negative/latency cost is *measured* (Vol 07), not assumed.

**Where guardrails fit the whole ring.** Input guardrails are the *first* line (with spotlighting Ch 6 — spotlighting frames, guardrails scan); output guardrails are the *last* line (with the gate Ch 9 — the gate stops actions, output guardrails stop content). Together they bracket the model, and combined with the trifecta discipline (Ch 7) and least-privilege (Ch 8), they form the layered defense (Ch 19). Guardrails are where you encode "the deterministic rules my system will *always* enforce regardless of what the model does" — the programmable safety floor beneath the probabilistic model.

## Why It Matters
Where this appears in real systems and jobs: input scanning, output enforcement.

## Hands-On
Build guardrails for your agent (concept node, concrete): (1) Design the input and output guardrail set for your brain-chat or research agent: what input checks (injection — your Ch 3 scanner, PII, off-topic), what output checks (leaked-prompt, PII, hallucinated-citation, harmful content), and the mechanism for each (pattern/classifier/LLM). (2) Implement one input and one output guardrail, and *measure* them (Vol 07): false-positive rate on benign traffic, false-negative rate on your attack battery (Ch 4), and latency added. (3) Find the tension: tune one guardrail and watch false-positives trade against false-negatives — the defender's dilemma (Vol 01 Ch 12), lived. The guardrail design + the measured guardrails + the tuning-tension demo = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why do you need both input and output guardrails — what does each catch that the other can't?
2. Recite the implementation spectrum (pattern → classifier → LLM → hybrid) with each one's trade.
3. Why is an LLM-based guardrail itself a vulnerability, and what does that imply about its role?
4. Name the design tensions, and why must every guardrail's costs be measured not assumed?
5. Where do input and output guardrails fit relative to spotlighting and the gate?


---

## Wikilinks
[[build-overlap-scanner]]
[[pii-redaction]]
[[refusals-content-safety]]
[[classical-ml-fundamentals]]
[[build-eval-judge]]

## Status log
- Started: 2026-07-21
- Finished: null