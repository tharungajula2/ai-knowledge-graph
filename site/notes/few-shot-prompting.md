## ELI5
Try describing your company's exact email tone in words: "professional but warm, concise but not curt..." — hopeless. Now paste three real emails and say "write like these." Instantly perfect. That's few-shot prompting: **when describing is hard, demonstrate.** Three examples beat three hundred words of description, because models are pattern-continuers before they are instruction-followers.

## The Real Explanation
**Why it works — remember what the machine is.** An LLM is a next-token predictor (Vol 01, Ch 3). Show it a run of input→output pairs and the overwhelmingly plausible continuation of the pattern is *another conforming pair*. You're not explaining the task; you're laying down rails. Zero-shot = instructions only; few-shot = instructions + 2–5 worked examples; the jump in reliability is often the cheapest quality win in this entire volume.

**Where few-shot is the right tool:** format contracts that must hold exactly (examples pin format harder than any description); classification with fuzzy boundaries (your labeled examples *define* the boundary — show the model borderline cases, not easy ones); tone/style transfer; consistent handling of edge cases (include an example of "input is garbage → output is `null`" and watch robustness appear); and domain-specific conventions no general description captures.

**Craft rules that separate pros from dabblers.** (1) *Format examples exactly like the real turn* — same delimiters, same labels, so the pattern is unmistakable. (2) *Cover the space*: include a normal case, a hard case, and a null/edge case; the model generalizes from the spread. (3) *Order matters at the margin* — models weight later examples slightly more; put your most representative example last. (4) *Beware copying disease*: too-similar examples teach surface features ("answers are always ~20 words") instead of the rule — vary the incidentals, hold the rule constant. (5) *Mind the meter*: examples ride in the context window on every call and are billed every call (Vol 01, Ch 8 economics) — few-shot is a *cost you pay per request*, which is exactly why: (6) when you find yourself needing 20+ examples for acceptable quality, you've left prompting territory and entered fine-tuning territory (Vol 01, Ch 7's decision map, now with a concrete trigger).

**In the message array**, examples can live in the system prompt as text, or — often stronger — as *fake conversation history*: alternating user/assistant turns showing ideal exchanges. The model treats prior turns as established pattern; you're literally forging a track record. (This is prefilling's cousin from Chapter 2.)

## Why It Matters
Where this appears in real systems and jobs: when 3 examples beat 300 words.

## Hands-On
Build a sentiment classifier for *Hinglish/Telugu-English code-mixed* product reviews — a real case where zero-shot wobbles. First zero-shot: instructions only, run 8 test reviews (write them yourself, include 2 genuinely ambiguous ones and 1 that's not a review at all). Record accuracy. Then few-shot: add 4 examples following every craft rule (spread of cases, null example, best one last, exact format). Re-run the same 8. Put the two accuracy numbers side by side in your note — you've just run your first informal A/B eval, three chapters before Chapter 16 makes it official.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Explain *mechanically* why few-shot works, using the phrase "pattern continuation."
2. Name four situations where demonstrating beats describing.
3. Recite three craft rules and the failure each prevents.
4. What's the economic cost of few-shot, and what's the trigger that says "stop prompting, start fine-tuning"?
5. What is the fake-conversation-history technique and why is it strong?


---

## Wikilinks
[[prompt-skeleton]]
[[what-is-a-language-model]]
[[prompt-quality]]
[[training-pipeline]]

## Status log
- Started: 2026-07-21
- Finished: null