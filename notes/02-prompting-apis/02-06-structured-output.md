---
id: structured-output
title: "Structured Output"
domain: prompting-apis
ring: 2
cluster: "Speaking to Models"
type: build
size: S
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["python-typing-pydantic", "sampling-controls", "few-shot-prompting", "tool-calling"]
tags: [prompting-apis]
---

## ELI5
Your code needs `{"sentiment": "negative"}`. The model offers: "Great question! After careful analysis, I'd say the sentiment leans negative. 😊" — useless to a parser. The gap between *chat* and *software component* closes exactly here: **forcing models to emit machine-readable JSON, and parsing it defensively.** This build is small and utterly load-bearing — every agent, every pipeline, every tool call in your future is structured output wearing different clothes.

## The Real Explanation
**The escalation ladder, weakest to strongest:**
1. *Ask nicely* — FORMAT bone: "Respond with only a JSON object, no prose, no code fences." Works ~90% at temperature 0. The famous failure: replies wrapped in ```json fences, or a cheerful "Here's your JSON:" preamble.
2. *Ask + demonstrate* — add a few-shot example of exact desired output (Ch 4 pins format hard). Also: temperature 0 for extraction, per Vol 01 Ch 9's settings table.
3. *Prefill* — start the assistant turn with `{` (Ch 2's trick); the model continues the JSON it "already started." Kills preambles dead.
4. *Native structured output / JSON mode* — the real solution: modern APIs accept a **JSON Schema** and enforce it during generation (Gemini: `response_mime_type="application/json"` + `response_schema`; other providers have equivalents — constrained decoding masks invalid tokens at sampling time, so output *cannot* violate the schema). And where does a schema come from? **Your Pydantic model** — `model_json_schema()` — exactly as promised in Vol 01, Ch 18. The SDKs even accept Pydantic classes directly. Define shape once: it documents your code, validates your data, and constrains the model. One schema, three jobs.

**Parse defensively anyway — the law of the boundary.** Even with native modes, the model boundary is an *untrusted input* boundary (values can be wrong even when shape is right; older paths and fallback providers may not enforce). The professional pattern, memorize it as a shape:
```python
def extract(text: str, retries: int = 2) -> Review | None:
    for attempt in range(retries + 1):
        raw = call_model(EXTRACT_PROMPT, text)
        cleaned = strip_code_fences(raw)             # tolerate the classic failure
        try:
            return Review.model_validate_json(cleaned)   # Pydantic = the bouncer
        except ValidationError as e:
            text_feedback = f"Your last reply failed validation: {e}. Reply with ONLY corrected JSON."
            raw = call_model(EXTRACT_PROMPT + text_feedback, text)   # self-repair loop
    return None                                       # explicit failure > silent garbage
```
Validate → on failure, *show the model its own error* and let it repair → cap retries → fail loudly. This validate-and-repair loop is a pattern you will write a hundred times; agents (Domain 04) are this loop with verbs.

**Schema design tips that raise hit-rate:** flat beats deeply nested; enums for closed choices (`"sentiment": "positive"|"neutral"|"negative"` — constrains better than free strings); `null` allowed for absent data with a "do not guess" instruction (Ch 3's anti-hallucination clause); field *descriptions* in the schema — the model reads them as instructions.

## Why It Matters
Where this appears in real systems and jobs: force clean JSON out of a model; parse safely.

## Hands-On
Build `extractor.py`: a Pydantic `Review` model (product: str, sentiment: enum, complaint: str|None, rating_guess: int 1–5 with `Field(ge=1, le=5)`). Feed it 6 messy real-world-ish reviews (include one in Hinglish, one with no product named, one that's spam). Implement the full defensive ladder: rung-1 prompt first — record its failure rate; then native schema mode; then the validate-and-repair loop with `strip_code_fences`. Deliberately break it: ask for rating 7 in a review, watch Pydantic catch it, watch the repair loop fix it. Tests (Vol 01, Ch 21): happy path, null-field case, and a `pytest.raises`/returns-None case. Green = lit.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Recite the escalation ladder and what each rung fixes.
2. How does constrained decoding make invalid JSON *impossible* — at what stage of generation does it act?
3. One Pydantic model, three jobs — name them.
4. Write the validate-and-repair loop's steps from memory, including why it caps retries and fails loudly.
5. Four schema-design tips and the failure each prevents.


---

## Wikilinks
[[python-typing-pydantic]]
[[sampling-controls]]
[[few-shot-prompting]]
[[tool-calling]]

## Status log
- Started: 2026-07-21
- Finished: null
