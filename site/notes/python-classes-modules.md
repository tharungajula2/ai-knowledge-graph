<!-- PASTE MASTERCLASS NOTE BELOW THIS LINE. Then set status to charging (pasted) or lit (mastered), bump version, update the updated date. -->


---

## PHASE 0 — CANON DECOMPRESSION

Here is our contract. Every item on this list comes directly from your mentor’s chapter, and I will ensure you master every single one of them by the time we are done.

* **Concepts & Terms:** Object-oriented code, classes, modules, LangChain, OpenAI SDK, agent-lab, blueprint bundling data with functions, instances, `__init__` (constructor), `self`, methods, inheritance, subclass overriding, interfaces, `@dataclass`, `@property`, packages (`__init__.py`), imports, relative imports, instance isolation, composition.
* **Code Elements:**
* `class Agent:`
* `def __init__(self, name: str, model: str):`
* `self.name = name`
* `self.history: list[dict] = []`
* `def ask(self, prompt: str) -> str:`
* `self.history.append({"role": "user", "content": prompt})`
* `return f"[{self.name}] would call {self.model} here"`
* `bot = Agent("vizier", "claude-sonnet-4-6")`
* `bot.ask("hello")`
* `class ChatAgent(Agent):`
* `class RetrievalAgent(BaseAgent):`
* `@dataclass`
* `@property`
* `from agent import Agent`
* `python -m package.module`
* `if __name__ == "__main__":`


* **Artifact:** `agent.py`, `memory.py`, `main.py`, plus the reading rep on your frozen `agent-lab/`.
* **Questions:** 5 exact "Prove It" questions.
* **Wikilinks:** `[[python-data-shapes]]`, `[[python-typing-pydantic]]`, `[[python-craft-professional]]`.

⚡ **RECAP:** The canon is decompressed and the roadmap is locked. We drop nothing.

---

## PHASE 1 — ABSOLUTE ZERO (Concept & Intuition)

Buddy, imagine you are running a massive AI factory. You have hundreds of AI agents talking to different models, remembering different conversations, and doing different jobs.

If you just had a massive pile of random variables—`agent_1_name`, `agent_1_memory`, `agent_2_name`, `agent_2_memory`—your factory would instantly collapse into chaos. You need a way to organize this.

This is exactly why **classes** exist.

The chapter gives you the perfect framing: **A class is a blueprint bundling data with the functions that operate on it.**
Think of a class as the factory's blueprint for an "Agent". The blueprint itself isn't a physical robot; it's just the design. When you actually build a robot from that blueprint, you get an **instance**.

* **The Blueprint (Class):** Tells the factory, "Every agent needs a name, a memory, and the ability to ask a question."
* **The Physical Robot (Instance):** The actual, working agent. You can build one named "vizier" and another named "jarvis", both from the exact same blueprint.

A **module** is simply how you organize these blueprints into different filing cabinets. Every single `.py` file on your computer is a module. It's just a file you can import. If you put a blueprint in `agent.py`, you can open `main.py` and say, "Go look in the agent file and grab that blueprint."

Without classes and modules, you cannot build AI systems. Period. LangChain, the OpenAI SDK, and your own `agent-lab` are entirely constructed out of these blueprints and files. We aren't learning this to be clever; we are learning this to survive the codebase.

⚡ **RECAP:** A class is a blueprint that combines data and actions; an instance is the actual object built from it; a module is just a file where blueprints live.

---

## PHASE 2 — THE ESCALATOR (Syntax, Micro-Steps)

We assume zero background. We are going to build your syntax muscle line by line before we ever touch the God-Mode artifact. Read the code, read the output, read the mental trace. Do not skip a single step.

**1. Variables and Strings**
In Python, we store information in variables. A string is just text, wrapped in quotes.

```python
agent_name = "vizier"
print(agent_name)

```

**[OUTPUT]**
vizier
**[MENTAL TRACE]** Python creates a box named `agent_name`. It puts the text `"vizier"` inside it. The `print` command looks inside the box and pushes its contents to the screen.

**2. Lists, Dictionaries, and `.append()**`
A list `[]` is an ordered line of items. A dictionary `{}` is a collection of key-value pairs. You can add items to a list using the `.append()` action. The syntax `list[dict]` is a **type hint**—it tells other engineers, "This is a list that contains dictionaries." It doesn't change how the code runs, it just documents it.

```python
history: list[dict] = []
history.append({"role": "user", "content": "hello"})
print(history)

```

**[OUTPUT]**
[{'role': 'user', 'content': 'hello'}]
**[MENTAL TRACE]** Python creates an empty list called `history`. The type hint `list[dict]` notes it will hold dictionaries. We use `.append()` to push a new dictionary `{"role": "user", "content": "hello"}` into that list. Printing it shows the list now holds one dictionary.

**3. Functions (`def`, `->`) and f-strings (`f"..."`)**
A function is a reusable block of code. We define it with `def`. The `-> str:` is another type hint promising the function will give back a string. An f-string (`f"..."`) lets you inject variables directly into text using curly braces `{}`.

```python
def greet(name: str) -> str:
    return f"[{name}] is online."

message = greet("vizier")
print(message)

```

**[OUTPUT]**
[vizier] is online.
**[MENTAL TRACE]** Python memorizes a function named `greet` that expects a `name`. We call `greet("vizier")`. Inside the function, the f-string replaces `{name}` with `"vizier"`, creating `"[vizier] is online."`. The function returns this string to the `message` variable, which is then printed.

**4. The `class` Keyword**
Now we create a blueprint using `class`. By convention, class names start with a capital letter.

```python
class SimpleBlueprint:
    pass

thing = SimpleBlueprint()
print(thing)

```

**[OUTPUT]**
<**main**.SimpleBlueprint object at 0x...>
**[MENTAL TRACE]** Python reads `class SimpleBlueprint:` and registers the empty blueprint (the `pass` keyword just means "do nothing"). We use `SimpleBlueprint()` to build an instance (an object) and assign it to `thing`. Printing it shows it is an object residing at a specific memory address in the computer.

**5. The Constructor (`__init__`) and `self**`
This is the core of object-oriented code. `__init__` (short for initialize) is a special function called a **constructor**. It fires automatically the exact millisecond an instance is created. `self` is the master key—it refers to "THIS particular instance." It is how the object remembers its own data.

```python
class BasicAgent:
    def __init__(self, name: str):
        self.name = name

bot = BasicAgent("jarvis")
print(bot.name)

```

**[OUTPUT]**
jarvis
**[MENTAL TRACE]** We define a class `BasicAgent`. We instantiate it with `bot = BasicAgent("jarvis")`. This instantly triggers `__init__`. The word `"jarvis"` gets passed as `name`. Inside `__init__`, `self.name = name` executes. Since `self` means "this specific object," the bot permanently attaches the name "jarvis" to itself. We print that attached data.

**6. THE CANON CHAPTER SNIPPET (Unchanged)**
Here is the exact code from your primary mentor. Read it carefully.
*(Note: As we run this in our mental trace, pay attention to `self.model`. The blueprint takes `model` in the constructor, but it doesn't attach it to `self` before trying to use it later. In our final artifact, we will add that attachment to ensure the code executes perfectly).*

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

**[OUTPUT]**
AttributeError: 'Agent' object has no attribute 'model'
**[MENTAL TRACE]** Python memorizes the `Agent` class. We instantiate `bot = Agent("vizier", "claude-sonnet-4-6")`. The `__init__` constructor fires. It attaches `"vizier"` to `self.name`, and sets up an empty list for `self.history`. Notice it does *not* save the `model` argument to `self.model`. Next, we call the **method** `bot.ask("hello")`. The method adds the prompt to the history list. Then, it attempts to return an f-string using `{self.model}`. Because `self.model` was never saved during `__init__`, Python throws an `AttributeError` and crashes. We will explicitly patch this in Phase 3 by adding `self.model = model` to the constructor.

**7. Inheritance (`class ChatAgent(Agent):`)**
Inheritance is how we say "I want a new blueprint that is exactly like the old blueprint, but with a few extra features." The new class goes in parentheses.

```python
class Animal:
    def speak(self) -> str:
        return "noise"

class Dog(Animal):
    def speak(self) -> str:
        return "bark"

pet = Dog()
print(pet.speak())

```

**[OUTPUT]**
bark
**[MENTAL TRACE]** We make an `Animal` class with a `speak` method. We make a `Dog` class that inherits from `Animal` by writing `class Dog(Animal):`. The `Dog` has its own `speak` method, which is called **subclass overriding**—it overwrites the parent's default behavior. We make a `Dog` instance, call `speak`, and get "bark". This is exactly how LangChain creates hundreds of AI variants from one base interface!

**8. Decorators: `@dataclass` and `@property**`
A decorator (starts with `@`) is a magic tag placed above a function or class that modifies its behavior.

* `@dataclass`: Auto-writes the `__init__` method for you so you don't have to type `self.x = x` repeatedly.
* `@property`: Turns a method into something that looks and acts like a piece of data.

```python
from dataclasses import dataclass

@dataclass
class User:
    username: str

    @property
    def url(self) -> str:
        return f"site.com/{self.username}"

u = User("buddy")
print(u.username)
print(u.url)

```

**[OUTPUT]**
buddy
[site.com/buddy](https://www.google.com/search?q=https://site.com/buddy)
**[MENTAL TRACE]** We import the `dataclass` tool. We tag the `User` class with `@dataclass`, which automatically builds an `__init__` that expects a `username`. We tag the `url` method with `@property`. We instantiate `u = User("buddy")`. We print `u.username`. Because of `@property`, we can print `u.url` without parentheses `()`, treating the method as if it were just a piece of data.

**9. Modules, Imports, and Instance Isolation**
Every `.py` file is a module. If I have a file named `tools.py` with a class in it, I can bring it into my current file using `from tools import ClassName`. When you build two different objects from the same class, they are completely isolated.

```python
# Imagine this is happening after importing a blueprint
class Counter:
    def __init__(self):
        self.count = 0

a = Counter()
b = Counter()
a.count = 5
print(f"a is {a.count}, b is {b.count}")

```

**[OUTPUT]**
a is 5, b is 0
**[MENTAL TRACE]** Python creates the `Counter` blueprint. We build two totally separate instances: `a` and `b`. The `__init__` constructor gives each one its own isolated `count` variable starting at 0. We change `a`'s count to 5. We print both. `b`'s count remains 0. This is **instance isolation**.

**10. The Execution Guard (`if __name__ == "__main__":`)**
When you import a file, Python quietly runs the entire file from top to bottom just to load everything into memory. If that file had `print("hello")` in it, it would print just from being imported! We use this block to say, "run this code ONLY when I execute this file directly, NOT when someone else imports it."

```python
def main():
    print("Script is running directly!")

if __name__ == "__main__":
    main()

```

**[OUTPUT]**
Script is running directly!
**[MENTAL TRACE]** Python defines the `main` function. Then it reaches the `if` statement. A hidden Python variable called `__name__` tracks how the file is being used. If the file is run directly from the terminal, `__name__` is set to the string `"__main__"`. Since it is, the condition is true, and the `main()` function executes.

⚡ **RECAP:** You now possess every syntactic weapon required to build and read object-oriented Python. Syntax audit complete.

---

## PHASE 3 — GOD-MODE ARTIFACT (The Build, Narrated)

The chapter commands a strict hands-on build: "Split the Agent example across files: `agent.py` (the class), `memory.py` (a Memory class the agent holds — composition), and `main.py` importing both, creating two agents, and printing their separate histories". It also commands a reading rep against your frozen `agent-lab/`.

Because I cannot see into your local repo, I am using Law 0 to simulate the `agent-lab/` file as `sample_lab_agent.py`. You will apply this exact reading strategy to your real files on the floor. To ensure the chapter's `Agent` code operates flawlessly, I am adding the `self.model = model` assignment to the constructor.

### File 1: `memory.py`

```python
class Memory:
    def __init__(self):
        # We start with an empty list for this specific instance's history
        self.history: list[dict] = []
        
    def add(self, prompt: str) -> None:
        # Appends a new dictionary to this instance's isolated list
        self.history.append({"role": "user", "content": prompt})

```

### File 2: `agent.py`

```python
# We import the Memory blueprint from our memory.py module
from memory import Memory

class Agent:
    def __init__(self, name: str, model: str):
        self.name = name
        # Added per professional standards: we must save the model to use it later!
        self.model = model
        # COMPOSITION: The Agent instance creates and holds its own Memory instance
        self.memory = Memory()
        
    def ask(self, prompt: str) -> str:
        # The agent delegates the storage task to its internal memory object
        self.memory.add(prompt)
        # Using f-strings to format the response as dictated by the canon
        return f"[{self.name}] would call {self.model} here"

```

### File 3: `main.py`

```python
# We import the Agent blueprint from our agent.py module
from agent import Agent

def main():
    # Instantiate two separate agents (proving instance isolation)
    bot1 = Agent("vizier", "claude-sonnet-4-6")
    bot2 = Agent("jarvis", "gpt-4o")
    
    # Run the ask method on both instances
    print(bot1.ask("What is the mission?"))
    print(bot2.ask("Initiate protocol."))
    
    # Print their separate histories to prove they do not collide
    print(f"{bot1.name}'s history: {bot1.memory.history}")
    print(f"{bot2.name}'s history: {bot2.memory.history}")

# The module execution entry point (runs only if main.py is executed directly)
if __name__ == "__main__":
    main()

```

### File 4: `sample_lab_agent.py` (Simulating your `agent-lab/` Reading Rep)

```python
from base import BaseAgent
from dataclasses import dataclass

@dataclass
class DatabaseRetriever(BaseAgent):
    connection_string: str
    
    def fetch_records(self, query: str) -> list:
        return [f"record_for_{query}"]

```

**Plain-English Summary (The Reading Rep):**

* **What data it holds:** Because of `@dataclass`, its `__init__` is auto-generated to hold a single piece of data: `connection_string`.
* **What it can do (methods):** It has one method, `fetch_records`, which takes a text query and returns a list of records.
* **What it inherits:** It inherits from `BaseAgent`, meaning it receives all the default abilities of a base agent and acts as a specialized subclass.

### The Full Execution

**[OUTPUT of running `python main.py`]**
[vizier] would call claude-sonnet-4-6 here
[jarvis] would call gpt-4o here
vizier's history: [{'role': 'user', 'content': 'What is the mission?'}]
jarvis's history: [{'role': 'user', 'content': 'Initiate protocol.'}]

**[MENTAL TRACE of `main.py`]**

1. Python reads `main.py` and hits `from agent import Agent`. It secretly opens `agent.py`.
2. Inside `agent.py`, it hits `from memory import Memory`. It secretly opens `memory.py`, memorizes the `Memory` blueprint, and returns to `agent.py`.
3. It memorizes the `Agent` blueprint, and returns to `main.py`.
4. Python reads down to `if __name__ == "__main__":`, confirms it is running directly, and triggers `main()`.
5. `bot1 = Agent("vizier", "claude-sonnet-4-6")` executes. The `Agent` constructor runs, attaching the name and model. It also creates a brand new `Memory()` object and assigns it to `bot1.memory`.
6. `bot2 = Agent("jarvis", "gpt-4o")` executes. A completely separate `Agent` is built, with a completely separate `Memory()` object attached to `bot2.memory`.
7. `bot1.ask(...)` runs. `bot1` reaches into its own `Memory` instance and appends the prompt. It returns the formatted string, which is printed.
8. `bot2.ask(...)` runs. `bot2` reaches into its own *different* `Memory` instance and appends its prompt. It returns its string, which is printed.
9. We print `bot1.memory.history`. It contains only "What is the mission?".
10. We print `bot2.memory.history`. It contains only "Initiate protocol.". Instance isolation is proven.

⚡ **RECAP:** Composition (an object holding another object) and instance isolation (objects keeping their own distinct data) are the twin engines of robust architecture.

---

## PHASE 4 — PRO-TIPS, HACKS & BEGINNER TRAPS

Here are the fatal crashes that happen when you don't respect the laws of object-oriented programming. Read the errors, understand the cause, memorize the fix.

**Trap 1: The Missing `self` Crash (The Canon Catch)**

* **Error Message:** `AttributeError: 'Agent' object has no attribute 'model'`
* **Trigger Code:**
```python
class Agent:
    def __init__(self, model):
        pass # Forgot to save it!
    def print_model(self):
        print(self.model)

```


* **Why it happens:** You passed data into the constructor, but you didn't physically staple it to the instance using `self.`. When the method later tries to look for `self.model`, the object has no idea what you are talking about.
* **The Fix:** Always write `self.model = model` inside `__init__`.

**Trap 2: The Missing Argument Crash**

* **Error Message:** `TypeError: __init__() missing 1 required positional argument: 'model'`
* **Trigger Code:**
```python
class Agent:
    def __init__(self, name, model):
        self.name = name
        self.model = model
bot = Agent("vizier") # Missing the second argument!

```


* **Why it happens:** The blueprint explicitly demanded two pieces of materials (name and model) to construct the instance. You only provided one.
* **The Fix:** Pass all required arguments: `bot = Agent("vizier", "claude")`.

**Trap 3: The Relative Import Crash (Called out in Canon)**

* **Error Message:** `ImportError: attempted relative import with no known parent package`
* **Trigger Code:** Running a file directly via `python my_folder/module.py` when that file contains an import like `from .sibling_module import Tool`.
* **Why it happens:** The chapter explicitly warns about this: imports resolve relative to where you run from. When you run a file directly by its path, Python forgets it is part of a larger package structure.
* **The Fix:** Run it as a module from the project root using the `-m` flag: `python -m my_folder.module`.

**Trap 4: The Shared List Trap**

* **Error Message:** (No crash, just catastrophic silent failure where all agents share one memory).
* **Trigger Code:**
```python
class Agent:
    history = [] # Defined outside __init__!
    def __init__(self, name):
        self.name = name

```


* **Why it happens:** Variables defined directly under `class` (outside `__init__`) are shared by *every single instance* of that class.
* **The Fix:** Always define instance-specific variables inside `__init__` using `self.`.

**Pro Habits:**

1. **Composition over Inheritance:** The chapter shows `Agent` holding a `Memory` class. This is composition. It is generally safer and more flexible than making deeply nested inheritance chains (e.g., `MemoryAgent(Agent)`).
2. **Type Hint Relentlessly:** You saw `list[dict]` and `-> str`. In complex AI factories, if you don't type hint your data structures, your IDE goes blind and your code becomes unreadable.

⚡ **RECAP:** Bind everything to `self` in the constructor, respect module execution paths (`python -m`), and protect your instance isolation.

---

## PHASE 5 — THE FEYNMAN BREAKDOWN (Answers + Note)

### The Prove It Answers (Verbatim from Chapter)

**1. What is `self`, and how do two instances of one class not collide?**
`self` is a variable that represents "this exact, specific instance." When you create two objects, Python allocates completely separate blocks of memory for them. When `bot1` calls a method, Python secretly passes `bot1`'s memory address in as `self`. When `bot2` calls it, Python passes `bot2`'s address. They don't collide because `self` guarantees they are only looking in their own memory box.

**2. What does `__init__` do and when does it run?**
`__init__` is the constructor. Its job is to take raw data and attach it to the newly created instance using `self`. It runs automatically the exact millisecond the class is instantiated (e.g., when you write `Agent()`).

**3. Read `class RetrievalAgent(BaseAgent):` aloud — what does it promise about RetrievalAgent's abilities?**
"RetrievalAgent inherits from BaseAgent." It promises that `RetrievalAgent` automatically possesses every single piece of data and every single method that `BaseAgent` has, while reserving the right to add new abilities or override (overwrite) the base ones.

**4. What is the `if __name__ == "__main__":` idiom for?**
It is an execution guard. It prevents a file's main logic from running when the file is imported by someone else. It means "run this code block ONLY when this file is executed directly as a script." It allows a single `.py` file to be both a reusable library and an executable script.

**5. Why does an AI engineer need to read classes fluently even if they rarely write them?**
Because the modern AI ecosystem (LangChain, OpenAI SDK, LlamaIndex) is entirely built on object-oriented interfaces. You don't interact with these tools via loose functions; you instantiate their classes, inherit from their base models, and override their methods. If you cannot read a class, you cannot read the source code, which means you are flying blind.

### Interview Readiness

**Q: Explain the difference between Composition and Inheritance.**
*Answer:* Inheritance is an "is-a" relationship (a `ChatAgent` *is an* `Agent`). Composition is a "has-a" relationship (an `Agent` *has a* `Memory`). Professional engineers prefer composition because it allows you to plug-and-play different components (like swapping `ShortTermMemory` for `LongTermMemory`) without rewriting the whole class tree.

**Q: If I see a class labeled with `@dataclass`, what do I immediately know?**
*Answer:* I know the class exists primarily to hold data. I also know I don't have to look for an `__init__` method, because the `@dataclass` decorator automatically generates one behind the scenes based on the class variables.

**Q: What is a package in Python, and how does it differ from a module?**
*Answer:* A module is just a single `.py` file. A package is a folder containing multiple modules, specifically marked with an `__init__.py` file. It allows for hierarchical organization of code.

### The Feynman Note

> **Classes & Modules**
> Imagine you want to bake cookies. You don't build each cookie from scratch by hand. You make a cookie cutter (the **Class**). The class is a blueprint that dictates the shape. When you press it into dough, you get an actual cookie (the **Instance**). Every cookie has its own unique sprinkles and chips attached to it (its **self** data), handled by the factory initialization step (**init**). Because you'll eventually have hundreds of cookie cutters, you organize them into labeled filing cabinets (**Modules**). By importing these blueprints across different files, you can build massive, complex systems like LangChain without drowning in millions of loose variables.

Wikilinks: [[python-data-shapes]] · [[python-typing-pydantic]] · [[python-craft-professional]]

⚡ **RECAP:** You can now verbally defend every concept in this node against senior engineers.

---

## PHASE 6 — RAPID REVISION SHEET (The Compounding Engine)

* **Class:** A blueprint bundling data with the functions that operate on it.
* **Instance:** The actual, concrete object created from the class blueprint.
* **Module:** A single `.py` file that can be imported.
* **Package:** A folder of modules marked by an `__init__.py` file.
* **Method:** A function that lives inside a class and operates on `self`.
* **Constructor:** The `__init__` method that fires upon instantiation to set up the object.
* **Inheritance:** Creating a subclass that takes on the traits of a parent class (`class Child(Parent):`).
* **Composition:** A class holding an instance of another class (`self.memory = Memory()`).
* **Subclass Overriding:** A child class redefining a method that existed in the parent.
* `class Agent:` → Defines a new blueprint.
* `def __init__(self, name):` → The constructor; fires instantly on creation.
* `self.name = name` → Attaches data specifically to THIS instance.
* `bot = Agent("vizier")` → Instantiates the class into a concrete object.
* `class ChatAgent(Agent):` → Inherits from `Agent`.
* `@dataclass` → Auto-generates the `__init__` method for data-heavy classes.
* `@property` → Allows accessing a method as if it were a simple attribute without `()`.
* `from agent import Agent` → Imports a specific class from a module file.
* `if __name__ == "__main__":` → Ensures code only runs when executed directly.
* **Q: What is `self`?** → A reference to the specific instance calling the code.
* **Q: How do instances stay isolated?** → Each instance is allocated separate memory; `self` points only to that instance's memory.
* **Q: Why use `if __name__ == "__main__":`?** → So a file can be imported safely without executing its script logic.
* **Q: How does LangChain build 100 variants of an Agent?** → Subclass overriding; they all inherit from a base class and change specific methods.
* **AttributeError 'X' has no attribute 'Y'** → Cause: Forgot to save `self.Y = Y` in `__init__` → Fix: Add it to the constructor.
* **TypeError missing 1 required positional argument** → Cause: Didn't pass enough data when instantiating → Fix: Provide all arguments `Agent("name", "model")`.
* **ImportError attempted relative import...** → Cause: Ran a script directly instead of as a module → Fix: Use `python -m folder.script`.

⚡ **RECAP:** Read this sheet whenever the node drops from "lit" to "charging". Five minutes is all it takes to reset to god mode.

---

## APPENDIX — FLOOR PRACTICE (Optional, for when I'm at the machine)

Buddy, this is your muscle-memory execution block. When you have 15 minutes at the keyboard, open Git Bash, navigate to your root directory, and hammer this out exactly as written. This builds the God-Mode Artifact.

**1. Create the environment:**

```bash
mkdir -p vizier-floor/classes-modules
cd vizier-floor/classes-modules

```

**2. Create the Memory module:**

```bash
cat << 'EOF' > memory.py
class Memory:
    def __init__(self):
        self.history: list[dict] = []
        
    def add(self, prompt: str) -> None:
        self.history.append({"role": "user", "content": prompt})
EOF

```

**3. Create the Agent module (Composition):**

```bash
cat << 'EOF' > agent.py
from memory import Memory

class Agent:
    def __init__(self, name: str, model: str):
        self.name = name
        self.model = model
        self.memory = Memory()
        
    def ask(self, prompt: str) -> str:
        self.memory.add(prompt)
        return f"[{self.name}] would call {self.model} here"
EOF

```

**4. Create the execution Entry Point:**

```bash
cat << 'EOF' > main.py
from agent import Agent

def main():
    bot1 = Agent("vizier", "claude-sonnet-4-6")
    bot2 = Agent("jarvis", "gpt-4o")
    
    print(bot1.ask("What is the mission?"))
    print(bot2.ask("Initiate protocol."))
    
    print(f"{bot1.name}'s history: {bot1.memory.history}")
    print(f"{bot2.name}'s history: {bot2.memory.history}")

if __name__ == "__main__":
    main()
EOF

```

**5. Execute the artifact:**

```bash
python main.py

```

**6. Success Output Confirmation:**

```text
[vizier] would call claude-sonnet-4-6 here
[jarvis] would call gpt-4o here
vizier's history: [{'role': 'user', 'content': 'What is the mission?'}]
jarvis's history: [{'role': 'user', 'content': 'Initiate protocol.'}]

```

You are unstoppable. End of transmission.