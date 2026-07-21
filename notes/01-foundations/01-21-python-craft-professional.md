---
id: python-craft-professional
title: "Build: Professional Python Craft"
domain: foundations
ring: 1
cluster: "The Engineer's Floor"
type: build
size: M
status: charging
version: 1.0.0
created: 2026-07-21
updated: 2026-07-21
lit_date: null
revisions: 0
artifact: null
wikilinks: ["python-typing-pydantic", "python-environments", "build-token-cost-calculator"]
tags: [foundations]
---

## ELI5
Everything so far taught you to write code that *runs*. This chapter is the jump to code a *team* can trust: organized as a package, typed, **tested**, measured, and installable. This is the single loudest difference between "I did a course" and "I've worked on real software" — and it's what makes every build node after this one land at professional grade by default.

## The Real Explanation
**Layout — the standard skeleton** (recognize it in every serious repo):
```
tokentools/
├── pyproject.toml          # the project's ID card + dependencies + metadata
├── README.md
├── src/tokentools/
│   ├── __init__.py         # marks the package; exports the public API
│   ├── counter.py
│   └── pricing.py
└── tests/
    └── test_counter.py
```
`pyproject.toml` (name, version, dependencies, `requires-python`) is modern Python's single config file; with it, `pip install -e .` installs your package *editable* into your venv — imports work from anywhere, edits apply instantly. That one command is how professionals work on their own libraries.

**Testing with pytest — the heart of the chapter.** A test is a tiny function that *asserts* the truth:
```python
# tests/test_counter.py
from tokentools.counter import estimate_tokens
import pytest

def test_english_rule_of_thumb():
    assert estimate_tokens("hello world, how are you") == 6   # ~4 chars/token

def test_empty_string():
    assert estimate_tokens("") == 0

def test_rejects_non_string():
    with pytest.raises(TypeError):
        estimate_tokens(1234)
```
Run `pytest` — it auto-discovers `test_*.py` files and prints green dots or precise failures. Internalize the trio every test suite needs: the happy path, the *edge cases* (empty, huge, unicode), and the *expected failures* (`pytest.raises`). Then the habit that changes how you build: **the regression ritual** — every bug you ever fix gets a test that reproduces it first, so it can never sneak back. Tests aren't bureaucracy; they're the safety net that makes you *brave* — you'll refactor fearlessly in ten minutes because `pytest` will catch anything you break. (This mindset scales all the way up: model evals in your evaluation domain are "pytest for AI behavior.")

**Profiling — measure, never guess.** When code is slow, humans guess wrong about why. `python -m cProfile -s cumtime main.py` prints where the time actually went, sorted by cumulative time; `time.perf_counter()` around a suspect block is the quick manual version. The law: optimize *only* what profiling proves is hot.

**The craft checklist** that turns any script into a professional artifact: package layout ✓ · type hints on every public function ✓ (Chapter 18) · docstrings saying *what and why* ✓ · tests covering happy/edge/failure ✓ · `pip install -e .` works in a fresh venv ✓ · README with a 5-line usage example ✓.

## Why It Matters
Where this appears in real systems and jobs: Build a modular package using typing conventions, unit tests with pytest, execution profiling, and metadata packaging; verify with test passes.

## Hands-On
Build the `tokentools` package exactly as laid out: `estimate_tokens(text)` (chars÷4 heuristic, TypeError on non-strings) and `estimate_cost(tokens, price_per_million)` in `pricing.py`, both typed and docstringed. Write ≥6 tests covering the trio for both functions. `pip install -e .` it, get all-green `pytest`, then profile a run that processes a 100k-word string 1,000 times and record the hot line in your note. All green = node lightable. (Keep this package — Chapter 22 imports it.)

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What belongs in `pyproject.toml`, and what does `pip install -e .` do that plain scripts can't?
2. Name the test trio and write a `pytest.raises` block from memory.
3. What is the regression ritual, and what emotional change do tests buy an engineer?
4. Why "profile, never guess," and which command answers "where did the time go?"
5. Recite the craft checklist.


---

## Wikilinks
[[python-typing-pydantic]]
[[python-environments]]
[[build-token-cost-calculator]]

## Status log
- Started: 2026-07-21
- Finished: null
