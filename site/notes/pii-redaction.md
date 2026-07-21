## ELI5
The node summary is a specific, high-value defense: **scrub personal data before the model sees it.** Personally Identifiable Information — names, emails, phone numbers, SSNs, addresses, card numbers — flowing into a model is a privacy liability (Vol 06 Ch 8), a compliance risk (GDPR/CCPA), and an exfiltration target (the trifecta's "private data," Ch 7). PII redaction is the input guardrail (Ch 11) that removes or masks sensitive personal data *before* it enters the model's context — reducing what can leak, what's logged in traces (Vol 07 Ch 13), and what an injection could exfiltrate. A small, focused build with outsized privacy and security value.

## The Real Explanation
**Why redact before the model.** PII that never enters the context can't be leaked by the model (Vol 01 Ch 10's hallucination-adjacent leakage), can't be stored in traces/logs (Vol 07 Ch 13 — traces contain everything the model saw, a compliance landmine), can't be exfiltrated by an injection (Ch 7 — you can't steal data that isn't there), and can't be remembered inappropriately (Vol 06 Ch 8's never-remember). Redacting at the *input boundary* is strictly safer than trusting the model not to misuse PII it received — it's the least-data principle (Vol 06 Ch 8) as an active control: the model gets the *minimum* personal data the task requires, and often the task needs *none* (you can summarize a document with names masked as `[PERSON_1]`).

**The mechanism — detect, then handle.** *Detection*: find PII in the input — via patterns (regex for structured PII: emails, phones, SSNs, card numbers have recognizable formats — high precision), NER classifiers (named-entity recognition for names, locations, organizations — the harder, unstructured PII; off-the-shelf tools like Presidio package this), and context (a number near "SSN:" is an SSN). *Handling* (the policy — choose per use): *redaction* (remove entirely — `[REDACTED]`), *masking* (partial — `****1234` for a card, preserving the last four for reference), *tokenization/pseudonymization* (replace with a consistent placeholder — `[PERSON_1]` everywhere that person appears, so the model can still *reason* about "PERSON_1" coherently without knowing who they are — the cleverest option: preserves utility while removing identity), or *hashing* (irreversible identifier). The tokenization approach is often best for agents — the model reasons over pseudonyms, and if outputs need real values, you *re-hydrate* the placeholders on the way out (map `[PERSON_1]` back to the real name in the final output, outside the model). Detect at input, pseudonymize, reason, re-hydrate at output — the full pattern.

**The honest limits (redaction isn't perfect).** *Detection recall* (Vol 01 Ch 12): you can't redact what you don't detect — novel PII formats, unusual names, PII in unexpected places slip through (a name the NER missed, an ID in a weird format). *False positives*: over-redaction destroys utility (masking every capitalized word as a "name" makes the text useless). *Context loss*: aggressive redaction can strip information the task needed (redacting a name that was the point of the query). *Re-identification*: pseudonymized data can sometimes be re-identified by combining quasi-identifiers (a known privacy-research result — "PERSON_1, a 34-year-old cardiologist in Hyderabad" may be uniquely identifying even without the name). So redaction *reduces* risk, doesn't eliminate it (the ring's refrain) — it's a layer, measured (Vol 07: what's your detection recall on a PII test set?), tuned for the utility/privacy balance the use demands, and paired with the other controls (least-privilege on who can access un-redacted data, audit on access).

**Verification.** A PII test set (text with known PII, hand-labeled — the ground truth, Vol 07 Ch 2): measure detection *recall* (what fraction of real PII was caught — misses are leaks) and *precision* (what fraction of redactions were real PII — false positives destroy utility). Test each PII type (structured: email/phone/SSN/card — should be high-recall via patterns; unstructured: names/addresses — harder, NER-dependent). Test the pseudonymize-reason-rehydrate round-trip (does `[PERSON_1]` consistently map, and re-hydrate correctly?). Test the utility preservation (can the model still do the task on redacted input?). Report recall/precision per PII type — the honest measure of the redactor's protection.

## Why It Matters
Where this appears in real systems and jobs: scrub personal data before the model sees it.

## Hands-On
Build it (est. half a day): a PII redactor (pattern detection for structured PII + an NER tool like Presidio for unstructured + a handling policy — pseudonymization with re-hydration is the richest) → wire it as an input guardrail (Ch 11) before your agent's model calls, and check your traces (Vol 07 Ch 13) now show redacted content → the PII test set with hand-labeled ground truth → measure recall/precision per type → test the round-trip and utility preservation. Then the security connection: this redactor reduces the trifecta's "private data" ingredient (Ch 7) — quantify what an injection could *no longer* exfiltrate. Tag `safety-v0.4`. The redactor + the recall/precision by type + the round-trip demo + the trifecta connection = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Why redact *before* the model — name four things input-redaction prevents.
2. Recite the detection methods and the handling options, and why is pseudonymization-with-rehydration often best?
3. What are the four honest limits of redaction, and what's re-identification?
4. Why must detection recall be measured, and what does a miss vs a false-positive each cost?
5. How does redaction reduce the trifecta's "private data" ingredient?


---

## Wikilinks
[[privacy-in-memory]]
[[guardrails-in-out]]
[[lethal-trifecta]]
[[build-tracing-instrumentation]]
[[classical-ml-fundamentals]]

## Status log
- Started: 2026-07-21
- Finished: null