## ELI5
You don't need to *write* clever object-oriented code to be an AI engineer — but every codebase you'll open (LangChain, the OpenAI SDK, your own agent-lab) is built from classes and modules, so you must *read* them like plain English. A class is a blueprint bundling data with the functions that operate on it; a module is just a file you can import. That's 90% of the mystery.

## The Real Explanation
```python
class Agent:
    def __init__(self, name: str, model: str):   # runs at creation
        self.name = name                          # self = THIS instance
        self.history: list[dict] = []
    def ask(self, prompt: str) -> str:
        self.history.append({"role": "user", "content": prompt})
        return f"[{self.name}] would call {self.model} here"

bot = Agent("vizier", "claude-sonnet-4-6")        # instantiate → __init__ fires
bot.ask("hello")                                   # method call; self is bot
```
Decoder ring for reading real code: `__init__` = constructor; `self` = "this particular object"; `bot.ask(...)` = function that lives on the object and can touch its data; `class ChatAgent(Agent):` = inheritance — ChatAgent *is an* Agent plus overrides (this is how LangChain's hundred retriever/LLM variants all share one interface — recognizing "subclass overriding a base method" unlocks that whole codebase style). You'll also constantly see `@dataclass` (auto-writes `__init__` for data-holding classes) and `@property` — recognize, don't memorize.

**Modules & imports.** Every `.py` file is a module; a folder with `__init__.py` is a package. `from agent import Agent` runs `agent.py` and pulls the name in. Two things that bite beginners: imports resolve relative to where you *run* from (hence running as `python -m package.module` from the project root), and the `if __name__ == "__main__":` block means "run this only when executed directly, not when imported" — it's how one file is both a library and a script.

## Why It Matters
Where this appears in real systems and jobs: reading real codebases.

## Hands-On
Split the Agent example across files: `agent.py` (the class), `memory.py` (a `Memory` class the agent holds — composition), and `main.py` importing both, creating two agents, and printing their separate histories (proving instance isolation). Then the reading rep that matters most: open your frozen `agent-lab/`, find one class, and write a 5-line plain-English summary: what data it holds (`__init__`), what it can do (methods), what it inherits.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What is `self`, and how do two instances of one class not collide?
2. What does `__init__` do and when does it run?
3. Read `class RetrievalAgent(BaseAgent):` aloud — what does it promise about RetrievalAgent's abilities?
4. What is the `if __name__ == "__main__":` idiom for?
5. Why does an AI engineer need to *read* classes fluently even if they rarely write them?


---

## Wikilinks
[[python-data-shapes]]
[[python-typing-pydantic]]
[[python-craft-professional]]

## Status log
- Started: 2026-07-21
- Finished: null