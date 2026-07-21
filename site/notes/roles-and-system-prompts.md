## ELI5
A play has a script with speaker labels: DIRECTOR (instructions the audience never hears), ACTOR, AUDIENCE. An LLM conversation is a script with three labels — **system** (the director: standing instructions, persona, rules), **user** (the audience member speaking), **assistant** (the actor's lines) — and the model was *trained* to treat these labels with different authority. Whoever writes the system prompt directs the play.

## The Real Explanation
**The message array.** From now on you send not a string but a structured conversation:
```python
messages = [
    {"role": "system", "content": "You are a support agent for Vizier. Answer only from provided docs. If unsure, say so. Never discuss competitors."},
    {"role": "user", "content": "Hey, what's your refund policy?"},
    {"role": "assistant", "content": "Our policy is..."},   # prior turns get re-sent
    {"role": "user", "content": "And for annual plans?"}
]
```
(Gemini's SDK spells it `system_instruction` + a contents list with `user`/`model` roles; Anthropic takes `system` as a top-level parameter. Same three-role concept, dialect differences — part of why Chapter 11 builds a gateway.)

**Why the system prompt steers everything.** Three reasons. *Training*: in RLHF (Vol 01, Ch 7), models were explicitly rewarded for obeying system-role text over conflicting user-role text — the hierarchy is baked into the weights, not enforced by the server. *Position*: it typically sits first in the context, framing everything after. *Persistence*: your app re-sends it every turn, so it's the one voice that never scrolls away. This is where products put persona ("you are a pirate"), scope ("only cooking questions"), format rules ("always answer in Telugu"), tone, and safety policy. The entire behavioral difference between a generic model and a branded product is often *just this string* — which is why companies treat system prompts as trade secrets.

**The honest caveat that shapes Chapter 12.** The hierarchy is *learned*, therefore *probabilistic*, therefore *pressurable*. A sufficiently crafted user message can sometimes drag the model off its system instructions — that's prompt injection, the attack you'll formally meet in Chapter 12 and then defend against for the rest of your career (your agent-lab's injection scanner exists precisely because of this paragraph).

**Prefilling — the sneaky third role.** You may write words into the *assistant* role yourself and let the model continue from them (e.g., prefill `{"role": "assistant", "content": "{"` to force JSON continuation). The model believes it already started answering. Legitimate, powerful, and a preview of structured-output tricks in Chapter 6.

## Why It Matters
Where this appears in real systems and jobs: who's talking; why system prompts steer everything.

## Hands-On
One user question, four system prompts: run "Explain what an API is" under (a) no system prompt, (b) "You are a Telugu-medium school teacher; use Indian daily-life analogies", (c) "Answer only in valid JSON with keys 'answer' and 'analogy'", (d) "You refuse all technical questions; you only discuss cricket." Save all four outputs side by side in your note. Then stress-test the hierarchy: under prompt (d), try three user messages that attempt to get a technical answer anyway. Record what held and what bent — that record *is* your first injection lab data.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Name the three roles and each one's job, using the play metaphor.
2. Give the three reasons system prompts dominate — training, position, persistence — in your own words.
3. Why is the role hierarchy "probabilistic, not enforced," and which attack lives in that gap?
4. What is prefilling and one legitimate use?
5. A client wants the same model to be a strict legal assistant in one product and a playful tutor in another. What changes, and what doesn't?


---

## Wikilinks
[[first-api-call]]
[[training-pipeline]]
[[injection-first-look]]
[[prompt-skeleton]]

## Status log
- Started: 2026-07-21
- Finished: null