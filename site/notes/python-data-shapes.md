## ELI5
Every AI system is plumbing for one substance: **structured data flowing as dicts and JSON**. An API request? A dict. The response? Nested dicts. A RAG chunk, an agent's tool call, your curriculum.json? Dicts, dicts, dicts. Master four shapes — list, dict, function, JSON — and you can read 90% of AI code on sight.

## The Real Explanation
**The two containers.** `list` = ordered sequence, addressed by position (`msgs[0]`, `msgs[-1]` for last). `dict` = labeled shelves, addressed by key (`msg["role"]`). Real AI data is *nested* — lists of dicts of lists — and fluency means walking nests without blinking:
```python
response = {
  "model": "claude-sonnet-4-6",
  "content": [{"type": "text", "text": "Hello!"}],
  "usage": {"input_tokens": 12, "output_tokens": 4}
}
text = response["content"][0]["text"]        # walk: dict → list → dict
cost_in = response["usage"]["input_tokens"]
safe = response.get("stop_reason", "unknown") # .get = no crash if key absent
```
**Functions as contracts.** `def cost(tokens: int, price_per_m: float = 3.0) -> float:` — read it as a contract: takes these shapes, returns that shape. Default values, keyword arguments (`cost(tokens=500)`), and returning dicts/tuples cover most real signatures you'll meet.

**JSON — the wire format.** JSON is just the universal *text* representation of dicts+lists, and every API speaks it. Two verbs, learn them cold: `json.dumps(obj)` (dict → string, to *send*) and `json.loads(s)` (string → dict, to *receive*). The classic beginner crash — `TypeError: string indices must be integers` — means you forgot `loads` and are indexing a raw string. The comprehension idiom rounds out fluency: `[m["text"] for m in messages if m["role"] == "user"]` — filter-and-extract in one line, everywhere in AI code.

## Why It Matters
Where this appears in real systems and jobs: functions, dicts, JSON — the shapes of AI data.

## Hands-On
In `vizier-floor/`, write `shapes.py`: hand-build a fake API response like the above but with 3 content blocks; write functions `extract_all_text(response) -> list[str]`, `total_tokens(response) -> int`, and `to_json_file(response, path)` + `from_json_file(path)` using `dumps/loads` (via `json.dump`/`json.load` file variants). Round-trip it: build → save → load → extract → print. Bonus that pays forward: open your real `curriculum.json` from the brain repo and count nodes per domain with a comprehension.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. When do you reach for a list vs a dict? One sentence each.
2. Read `data["items"][2]["meta"].get("tags", [])` out loud, naming each hop's type.
3. `dumps` vs `loads` — which direction is each, and which error tells you a `loads` is missing?
4. Write from memory a comprehension extracting all `"text"` values where `"type" == "text"`.
5. Why is "AI engineering is dict plumbing" only half a joke?


---

## Wikilinks
[[python-typing-pydantic]]
[[python-classes-modules]]
[[build-token-cost-calculator]]

## Status log
- Started: 2026-07-21
- Finished: null