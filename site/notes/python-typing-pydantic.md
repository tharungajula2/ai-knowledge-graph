## ELI5
Python happily lets you pass a string where a number belongs — and crashes at 2 a.m. in production instead of at noon in development. **Type hints** are labels that catch mistakes early; **Pydantic** turns those labels into an enforced border checkpoint: data that doesn't match the schema *does not enter*. And here's the twist that makes this chapter secretly huge: schemas are also how you make *LLMs* return reliable structured output. The schema mindset runs through your entire brain.

## The Real Explanation
**Type hints** — documentation that tools can check: `def chunk(text: str, size: int = 500) -> list[str]:`. Modern syntax to recognize on sight: `list[dict]`, `str | None` (maybe-a-string), `Optional[str]` (older spelling of the same). Python doesn't enforce hints at runtime — editors and checkers (mypy/pyright) do — which is exactly why Pydantic exists for the borders of your system.

**Pydantic** — classes that *validate*:
```python
from pydantic import BaseModel, Field

class NodeNote(BaseModel):
    node_id: str
    status: str = "charging"                       # default
    xp: int = Field(ge=0)                          # constraint: ≥ 0
    wikilinks: list[str] = []

note = NodeNote(node_id="tokens", xp="150")        # "150" → coerced to int 150 ✅
bad  = NodeNote(node_id="tokens", xp="lots")       # ❌ ValidationError, loud & precise
```
Three superpowers: **validation** (garbage stops at the border with an error message pointing at the exact field), **coercion** (sensible conversions like `"150"` → `150` happen for you), and **serialization** (`note.model_dump()` → dict, `NodeNote.model_validate_json(s)` ← JSON string — the dict-plumbing of Chapter 15, now with a bouncer). The professional pattern: define Pydantic models at every *boundary* — API in, API out, file load, DB row — so the messy outside world is validated once, and everything inside works with guaranteed-clean objects.

**The AI payoff (why this tiny chapter echoes everywhere):** a Pydantic model auto-exports **JSON Schema** (`NodeNote.model_json_schema()`), and JSON Schema is the language of structured LLM output — "respond matching this schema" — and of tool definitions in agent frameworks. Define the shape once in Pydantic: validate your data with it, *and* hand it to the model as the contract, *and* validate what the model sends back. FastAPI is built on exactly this. Domain 02's structured-output nodes will feel like a reunion.

## Why It Matters
Where this appears in real systems and jobs: the schema mindset.

## Hands-On
Write `schema.py`: a `CurriculumNode` Pydantic model matching your real node format (id, title, type with allowed values, size, summary, status with default "ghost"). Load your actual `curriculum.json`, validate every node through the model, and print a count of valid nodes — if any fail, read the error and feel how precisely it points. Then print `CurriculumNode.model_json_schema()` and stare at it: that JSON is what you'll one day hand an LLM as an output contract.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What do type hints do and — importantly — *not* do at runtime?
2. Pydantic's three superpowers, one sentence each.
3. What is the "validate at the boundary" pattern and why does it beat validating everywhere?
4. How does one Pydantic model serve both your code and an LLM's output contract?
5. Read aloud: `def f(x: list[str | None]) -> dict[str, int]:`


---

## Wikilinks
[[python-data-shapes]]
[[python-classes-modules]]
[[python-craft-professional]]

## Status log
- Started: 2026-07-21
- Finished: null