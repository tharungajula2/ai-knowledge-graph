<!-- PASTE MASTERCLASS NOTE BELOW THIS LINE. Then set status to charging (pasted) or lit (mastered), bump version, update the updated date. -->


---

## PHASE 0 — CANON DECOMPRESSION

Here is our ground truth contract. Every single item on this list will be hardwired into your brain by the time you finish reading.

* **Concepts:** CPU-bound vs IO-bound work, concurrency, thread, paused-mid-wait tasks, event loop, rate limits.
* **Keywords / Syntax:** `async def`, `coroutine`, `await`, `asyncio.sleep`, `asyncio.gather`, `asyncio.run`, `asyncio.Semaphore`, `asyncio.to_thread`.
* **Libraries:** `asyncio`, `requests`, `time`, `httpx`, `aiohttp`.
* **Errors / Bugs:** `RuntimeWarning: coroutine was never awaited`, placing a blocking call in async code (starving the loop).
* **Applications:** Batch-embedding RAG chunks, multi-agent fan-out, streaming tokens to a UI, FastAPI endpoints, agent-lab's async MCP bridge.
* **Code Snippets:** The chapter's base `call_llm` script.
* **Artifact:** `race.py` (sequential timing vs gather timing vs Semaphore wrapper, plus the deliberate un-awaited call).
* **Prove It Questions:** All 5 chapter questions.
* **Wikilinks:** `[[python-classes-modules]]`, `[[python-craft-professional]]`, `[[context-windows]]`.

⚡ **RECAP:** The canon is unpacked. No concept gets left behind.

---

## PHASE 1 — ABSOLUTE ZERO (Concept & Intuition)

Buddy, imagine you are a chef in a chaotic kitchen, and I hand you a recipe for a 12-hour smoked brisket.

If you are a **Synchronous** chef, you put the brisket in the smoker, pull up a chair, and stare at the metal box for 12 straight hours. The phone rings. You ignore it. The potatoes need boiling. You ignore them. Your entire life freezes until that brisket comes out. This is madness.

If you are an **Asynchronous** chef, you put the brisket in the smoker, set a timer (the "bell"), and instantly pivot to boiling the potatoes, answering the phone, and prepping the dessert. You are doing one thing at a time (you only have two hands), but you are *juggling* the waiting periods.

Your Python code is exactly like this. The one distinction that matters in software is **CPU-bound vs IO-bound** work.

* **CPU-bound:** Crunching massive math equations. Your code is the one doing the heavy lifting. It physically cannot do two things at once because the processor is sweating. (Chopping vegetables).
* **IO-bound:** Waiting on something outside your computer's brain. Calling an LLM over the internet, saving a file to the hard drive, downloading a web page. Your code is just sitting there doing literally nothing, waiting for a response. (Waiting for the smoker).

AI applications are made of huge, agonizing waits. Calling OpenAI takes 2 to 30 seconds! If you use synchronous code, your entire program freezes. If a user asks a question, nobody else can use your app until the LLM answers.

**Async/Await** is the sane waiter. It is the tool for IO-bound concurrency. You still only have one thread (one waiter), but that waiter creates many paused-mid-wait tasks and uses an **event loop** to juggle them. When an LLM call fires, the waiter says, "Call me when the kitchen bell rings," and immediately goes to serve tables 2 through 8.

Without this, your AI pipeline chokes on its own idle time. With it, you achieve god-tier speed.

⚡ **RECAP:** Async/Await lets your program do other work while waiting for slow, outside tasks (IO-bound) to finish.

---

## PHASE 2 — THE ESCALATOR (Syntax, Micro-Steps)

We are starting at absolute zero, Buddy. We will build the exact vocabulary you need, step by micro-step. Read the code, read the output, read the trace.

### 1. Variables and Functions (`def`, `->`)

A variable stores data. A function (`def`) is a reusable block of code. We use `-> str` to tell the reader (and the computer) that this function will hand back a string of text.

```python
def greet(name: str) -> str:
    message = "Hello " + name
    return message

result = greet("Buddy")
print(result)

```

**OUTPUT:**

```text
Hello Buddy

```

**MENTAL TRACE:**

1. The code defines a function called `greet` that expects a name and promises to return a string (`-> str`).
2. It jumps down to `result = greet("Buddy")` and runs the function.
3. Inside, `message` becomes `"Hello Buddy"`.
4. It returns that message, stores it in `result`, and prints it.

### 2. The f-string (`f"..."`)

Instead of gluing strings together with `+`, professionals inject variables directly into text using `f"..."`. The `f` stands for format.

```python
character = "Neo"
action = "dodged"
print(f"The character {character} just {action} the bullets.")

```

**OUTPUT:**

```text
The character Neo just dodged the bullets.

```

**MENTAL TRACE:**

1. `character` holds `"Neo"`.
2. `action` holds `"dodged"`.
3. The f-string swaps the curly braces `{}` for the actual values and prints the final sentence.

### 3. The `for` loop and `range()`

When we want to do something repeatedly, we loop. `range(3)` counts from 0 up to, but not including, 3.

```python
for i in range(3):
    print(f"Task {i}")

```

**OUTPUT:**

```text
Task 0
Task 1
Task 2

```

**MENTAL TRACE:**

1. The loop starts. `i` becomes `0`. It prints "Task 0".
2. The loop restarts. `i` becomes `1`. It prints "Task 1".
3. The loop restarts. `i` becomes `2`. It prints "Task 2". The loop ends.

### 4. Importing modules (`time`, `random`)

Python comes with hidden toolboxes. We `import` them to use them. `time.time()` gives us the current clock time. `random.randint(1, 3)` gives us a random whole number between 1 and 3.

```python
import time
import random

start = time.time()
delay = random.randint(1, 2)
print(f"Random delay chosen: {delay}")
# Pretend we waited here...
end = time.time()
print(f"Time passed: {end - start} seconds")

```

**OUTPUT:**

```text
Random delay chosen: 2
Time passed: 0.00012 seconds

```

**MENTAL TRACE:**

1. We grab the `time` and `random` toolboxes.
2. `start` records the exact millisecond on the clock.
3. `delay` picks a random number (it picked 2). Prints it.
4. `end` records the clock again instantly.
5. It prints the difference, which is basically zero because the computer is blazing fast.

### 5. Entering Async (`async def`, `asyncio.run`)

Now we upgrade a normal function to an async coroutine. Adding `async` means "this function is allowed to be paused." A coroutine cannot be run normally. You must hand it to an **Event Loop** using `asyncio.run()`.

```python
import asyncio

async def say_hello() -> str:
    return "Hello from the future"

# result = say_hello() # THIS WOULD FAIL! 
result = asyncio.run(say_hello())
print(result)

```

**OUTPUT:**

```text
Hello from the future

```

**MENTAL TRACE:**

1. `import asyncio` brings in the async toolbox.
2. `async def` defines a special pausable function (a coroutine).
3. `asyncio.run(...)` fires up the Event Loop (the master juggler), hands it `say_hello()`, and waits for it to finish.
4. The loop gets the return value, gives it to `result`, and prints it.

### 6. The Magic Pause (`await`, `asyncio.sleep`)

Inside an `async def`, you can pause execution. `await asyncio.sleep(1)` tells the event loop: "Freeze me here for 1 second. Go do other stuff, then wake me up." **Law: You can only use `await` inside an `async def`.**

```python
import asyncio

async def slow_hello() -> str:
    print("Starting...")
    await asyncio.sleep(1) # The pause!
    return "Done!"

result = asyncio.run(slow_hello())
print(result)

```

**OUTPUT:**

```text
Starting...
(1 second pause happens here)
Done!

```

**MENTAL TRACE:**

1. The event loop starts running `slow_hello()`.
2. It prints "Starting...".
3. It hits `await asyncio.sleep(1)`. The function goes to sleep. The event loop walks away.
4. One second later, the loop comes back, resumes the code, returns "Done!", and prints it.

### 7. Concurrent Power (`asyncio.gather`)

This is the god-mode command. `gather` takes multiple async tasks and fires them all at the exact same time. It waits until they are *all* done, then hands you back a list of their results.

```python
import asyncio

async def fast_task(id: int) -> str:
    await asyncio.sleep(1)
    return f"Task {id} complete"

async def main():
    # Run three 1-second tasks at the exact same time
    results = await asyncio.gather(
        fast_task(1), 
        fast_task(2), 
        fast_task(3)
    )
    print(results)

asyncio.run(main())

```

**OUTPUT:**

```text
['Task 1 complete', 'Task 2 complete', 'Task 3 complete']

```

**MENTAL TRACE:**

1. `asyncio.run` starts the loop and runs `main()`.
2. `main` hits `gather`. It fires off tasks 1, 2, and 3 simultaneously.
3. All three tasks hit their 1-second `await` pause.
4. ONE second later (not three!), they all wake up and finish.
5. `gather` packages the three return strings into a list `[]` and prints them.

### 8. Controlling the Flood (`asyncio.Semaphore`, `async with`)

If you fire 10,000 tasks at once, you will crash the server you are talking to. A Semaphore is a bouncer at a club. It says "only 2 tasks allowed in at a time." The `async with` syntax means "wait in line, grab the VIP pass, do the work, then give the pass back."

```python
import asyncio

async def limited_task(id: int, sem: asyncio.Semaphore):
    async with sem: # Wait in line for a slot
        print(f"Task {id} is in the club!")
        await asyncio.sleep(1)
        print(f"Task {id} left.")

async def main():
    bouncer = asyncio.Semaphore(2) # Only 2 allowed at once
    await asyncio.gather(
        limited_task(1, bouncer),
        limited_task(2, bouncer),
        limited_task(3, bouncer)
    )

asyncio.run(main())

```

**OUTPUT:**

```text
Task 1 is in the club!
Task 2 is in the club!
(1 second pause)
Task 1 left.
Task 3 is in the club!
Task 2 left.
(1 second pause)
Task 3 left.

```

**MENTAL TRACE:**

1. `main` sets up a Semaphore `bouncer` with 2 slots.
2. `gather` fires tasks 1, 2, and 3 at the same time.
3. Task 1 asks the bouncer `async with sem:` and gets in.
4. Task 2 asks the bouncer and gets in.
5. Task 3 asks the bouncer but is told to wait (the club is full).
6. One second passes. Tasks 1 and 2 finish and give their slots back.
7. Task 3 instantly grabs a newly open slot, enters, waits 1 second, and leaves.

⚡ **RECAP:** You now own `async def` to create tasks, `await` to pause them, `gather` to fire them concurrently, and `Semaphore` to limit the blast radius.

---

## PHASE 3 — GOD-MODE ARTIFACT (The Build, Narrated)

Buddy, we are now building the exact artifact demanded by the canon: `race.py`.
We will build a fake LLM call that takes a random 1-3 seconds. We will run 5 of them sequentially and time it. We will run the same 5 via `gather` and time it. We will wrap them in a Semaphore. And we will deliberately break the code by forgetting an `await` to prove the #1 beginner bug.

Here is the code. Read it top to bottom.

```python
import asyncio
import time
import random

# 1. The Fake IO-Bound Work
async def call_llm(prompt: str) -> str:
    delay = random.randint(1, 3)
    await asyncio.sleep(delay)
    return f"answer to: {prompt}"

# 2. The Wrapper for the Semaphore
async def sem_call_llm(prompt: str, sem: asyncio.Semaphore) -> str:
    async with sem:
        return await call_llm(prompt)

async def main():
    print("=== THE BROKEN CALL ===")
    # Breaking it on purpose: no 'await'
    call_llm("break_it")
    print("Look at your terminal warnings!\n")

    print("=== 1. SEQUENTIAL RUN ===")
    start_time = time.time()
    for i in range(5):
        # We wait for each to finish before starting the next
        answer = await call_llm(f"seq_q{i}")
        print(f"  Got: {answer}")
    seq_duration = time.time() - start_time
    print(f"Sequential total time: {seq_duration:.2f} seconds\n")

    print("=== 2. GATHER RUN ===")
    start_time = time.time()
    # Fire all 5 at the exact same time
    answers = await asyncio.gather(
        call_llm("gather_q0"),
        call_llm("gather_q1"),
        call_llm("gather_q2"),
        call_llm("gather_q3"),
        call_llm("gather_q4")
    )
    print(f"  Got: {answers}")
    gather_duration = time.time() - start_time
    print(f"Gather total time: {gather_duration:.2f} seconds\n")

    print("=== 3. SEMAPHORE RUN (Waves of 2) ===")
    bouncer = asyncio.Semaphore(2)
    start_time = time.time()
    # Fire all 5, but the bouncer only lets 2 execute at once
    answers_sem = await asyncio.gather(
        sem_call_llm("sem_q0", bouncer),
        sem_call_llm("sem_q1", bouncer),
        sem_call_llm("sem_q2", bouncer),
        sem_call_llm("sem_q3", bouncer),
        sem_call_llm("sem_q4", bouncer)
    )
    print(f"  Got: {answers_sem}")
    sem_duration = time.time() - start_time
    print(f"Semaphore total time: {sem_duration:.2f} seconds\n")

# Start the event loop
asyncio.run(main())

```

### The Walkthrough (Why pros write it this way)

* **Line 6 (`delay = random.randint(1, 3)`):** Pros simulate chaos. Network latency is never predictable. This proves our async code can handle varying wait times.
* **Line 13 (`async with sem:`):** Pros separate logic. We didn't clutter the main `call_llm` function with semaphore logic. We created a tiny wrapper `sem_call_llm`. Clean architecture.
* **Line 19 (`call_llm("break_it")`):** A raw function call without `await` creates an un-run coroutine object. We do this to trigger the exact warning you will face in production.
* **Line 28 & 43 (`{seq_duration:.2f}`):** The `:.2f` inside the f-string is a pro formatting trick. It truncates the long messy decimal to just 2 decimal places.

### The Output

**OUTPUT:**

```text
=== THE BROKEN CALL ===
Look at your terminal warnings!

race.py:19: RuntimeWarning: coroutine 'call_llm' was never awaited
  call_llm("break_it")
RuntimeWarning: Enable tracemalloc to get the object allocation traceback

=== 1. SEQUENTIAL RUN ===
  Got: answer to: seq_q0
  Got: answer to: seq_q1
  Got: answer to: seq_q2
  Got: answer to: seq_q3
  Got: answer to: seq_q4
Sequential total time: 10.04 seconds

=== 2. GATHER RUN ===
  Got: ['answer to: gather_q0', 'answer to: gather_q1', 'answer to: gather_q2', 'answer to: gather_q3', 'answer to: gather_q4']
Gather total time: 3.01 seconds

=== 3. SEMAPHORE RUN (Waves of 2) ===
  Got: ['answer to: sem_q0', 'answer to: sem_q1', 'answer to: sem_q2', 'answer to: sem_q3', 'answer to: sem_q4']
Semaphore total time: 6.02 seconds

```

### The Mental Trace

1. Python reads all the imports and function definitions.
2. It hits `asyncio.run(main())`, boot-strapping the event loop.
3. Inside `main`, it calls `call_llm("break_it")`. Because there is no `await`, it instantly skips it and prints the `RuntimeWarning` to the terminal. The function never actually ran.
4. **Sequential Block:** It loops 5 times. Query 0 takes 2s. Waits for it. Query 1 takes 3s. Waits. It processes them sequentially. Total time is the *sum* of all random sleeps (~10 seconds).
5. **Gather Block:** It hits `gather`. All 5 queries fire out instantly. The loop goes to sleep. Because they run concurrently, the total time to finish all 5 is equal to the time of the *slowest single query* (~3 seconds).
6. **Semaphore Block:** `gather` fires all 5, but the Semaphore stops them. Queries 0 and 1 start. Query 2, 3, and 4 wait in line. Once 0 or 1 finishes, the next grabs the slot. They process in tight waves of 2. Total time is roughly ~6 seconds, effectively throttling the rate limit.

⚡ **RECAP:** You proved concurrency. Sequential adds time; Gather overlaps time; Semaphore bounds time. `race.py` is the blueprint for every AI pipeline you will ever build.

---

## PHASE 4 — PRO-TIPS, HACKS & BEGINNER TRAPS

This is where beginners bleed. Memorize these errors so you never panic in production.

### Trap 1: The Ghost Call (From the Canon)

* **Error:** `RuntimeWarning: coroutine 'my_func' was never awaited`
* **Snippet:**
```python
async def fetch(): pass
fetch() # Broken!

```


* **Why it happens:** Calling an async function doesn't execute it; it just creates a "coroutine object." You dropped the object on the floor without telling the event loop to run it.
* **Fix:** Always write `await fetch()`.

### Trap 2: Starving the Loop (From the Canon)

* **Error:** No error message. The entire program just violently freezes, ignoring all other tasks.
* **Snippet:**
```python
import time, requests
async def bad_idea():
    time.sleep(5) # FREEZE!
    requests.get("http://api.com") # FREEZE!

```


* **Why it happens:** `time.sleep` and the `requests` library are **synchronous**. They don't know how to yield control back to the event loop. They put the *entire waiter* in a chokehold.
* **Fix:** Use async-native libraries: `httpx` or `aiohttp` instead of `requests`. Use `asyncio.sleep` instead of `time.sleep`. If you *must* use a sync library, wrap it in `await asyncio.to_thread(sync_function)`.

### Trap 3: The Rate Limit Nuke

* **Error:** `HTTP 429 Too Many Requests` or `ConnectionResetError`
* **Snippet:**
```python
tasks = [call_llm(q) for q in huge_list_of_1000_items]
await asyncio.gather(*tasks) # KABOOM

```


* **Why it happens:** You fired 1,000 network requests in one millisecond. The target server (OpenAI, your DB) views this as an attack and blocks your IP.
* **Fix:** Wrap the core function with an `asyncio.Semaphore(50)`.

### Trap 4: The Jupyter/Notebook Conflict

* **Error:** `RuntimeError: asyncio.run() cannot be called from a running event loop`
* **Snippet:**
```python
asyncio.run(main()) # Inside a Jupyter Notebook cell

```


* **Why it happens:** Jupyter notebooks *already* have an event loop running in the background to handle the web interface. You can't start a loop inside a loop.
* **Fix:** In Jupyter, just use `await main()` directly in the cell, no `asyncio.run` needed.

### 👑 Pro Habits for AI Mastery

1. **Never write `for` loops with `await` for IO tasks.** If you have independent AI prompts, map them to a list and `gather` them. Sequential LLM calls are a crime against speed.
2. **Semaphore everything.** Every time you talk to a 3rd party API, wrap it in a Semaphore at the architecture level. You will sleep better knowing you can't accidentally bankrupt your rate limits.

⚡ **RECAP:** Never forget `await`, never use sync tools (`requests`, `time.sleep`) in an async room, and always throttle outbound blasts.

---

## PHASE 5 — THE FEYNMAN BREAKDOWN (Answers + Note)

Here are the bulletproof answers to the canon's "Prove It" questions, plus interview expansions.

### Canon Prove It Answers

* **IO-bound vs CPU-bound — define both and say which one async helps and why.**
IO-bound means the program is waiting on an external resource (network, disk, API). CPU-bound means the program is maxing out the computer's processor doing math. Async ONLY helps IO-bound work. Why? Because async works by switching tasks *while waiting*. If the CPU is busy doing math, there is no "waiting" period to switch during.
* **Narrate exactly what happens at an await, mentioning the event loop.**
When the event loop hits an `await`, it pauses that specific function, saves its exact state, and registers a listener ("wake me up when this network call is done"). The event loop then instantly pivots to run other pending tasks. When the network call finishes, the event loop returns to the paused function and resumes it on the very next line.
* **Sequential loop vs gather over 5 two-second calls: total time each, and why?**
Sequential takes 10 seconds (2 + 2 + 2 + 2 + 2) because it refuses to start the next task until the current one finishes. Gather takes 2 seconds total, because all 5 tasks are started simultaneously, they all sleep for the *same* 2 seconds in overlapping parallel, and wake up together.
* **Name the two classic async bugs and the symptom of each.**
Bug 1: Forgetting `await`. Symptom: The code skips execution and logs `RuntimeWarning: coroutine was never awaited`.
Bug 2: Putting a blocking sync call (like `requests` or `time.sleep`) in async code. Symptom: The whole program freezes, concurrency stops, and all other tasks starve.
* **Why must AI applications specifically be async? Name three concrete cases from your future domains.**
AI apps are primarily made of massive IO-bound waits (talking to large language models over the internet). Without async, one user prompt freezes the entire server. Cases: 1) Batch-embedding thousands of RAG chunks, 2) Multi-agent fan-out (agents talking to agents), 3) Streaming tokens to a UI (FastAPI endpoints), 4) Your agent-lab's async MCP bridge.

### Interview-Style Questions

* **Interviewer: "I have a legacy synchronous function that does a heavy database query, and I can't rewrite it. How do I use it safely in my new async pipeline?"**
*Answer:* I would wrap the legacy call in `await asyncio.to_thread(legacy_function)`. This executes the blocking code in a separate background worker thread, ensuring the main async event loop remains unblocked and can continue serving other tables.
* **Interviewer: "What is the difference between an `async def` function and a regular `def` function?"**
*Answer:* A regular `def` returns a value. An `async def` returns a *coroutine object* — a pausable task that hasn't started yet. It must be scheduled on an event loop (using `await` or `asyncio.run()`) to actually execute.
* **Interviewer: "If asyncio uses only one thread, how is it concurrent?"**
*Answer:* It uses cooperative multitasking. Unlike threading (where the OS forces context switches), async tasks voluntarily give up control to the event loop whenever they hit an `await`. Because they only give up control during idle wait times, a single thread can juggle thousands of open network connections efficiently.

### The Feynman Note (For your VIZIER brain)

**Async/Await Explained for a 12-Year-Old:**
Imagine you are playing a video game where you have to craft 5 swords. The blacksmith takes 10 minutes to forge each sword.
If you are **synchronous**, you give him the iron for sword 1, and you stand there staring at him for 10 minutes. Then sword 2, stare for 10 minutes. It takes 50 minutes.
If you are **asynchronous**, you give him the iron for sword 1 and say "text me when it's done (`await`)." You instantly run and chop wood, mine gold, and fight goblins. When he texts you, you grab the sword.
In Python, `async def` makes you the smart gamer. `await` is the "text me when it's done" command. And `asyncio.gather` is when you hire 5 blacksmiths at once so all swords are done in exactly 10 minutes.

Relevant Links: [[python-classes-modules]] · [[python-craft-professional]] · [[context-windows]]

⚡ **RECAP:** You can now verbally defend the architecture of async AI systems against senior engineers.

---

## PHASE 6 — RAPID REVISION SHEET (The Compounding Engine)

*This is for your 50th re-read, Buddy. Fast, ruthless recall.*

### The Vocabulary Map

* **CPU-bound:** Code busy crunching math. (Async does not help).
* **IO-bound:** Code sitting idle waiting for network/disk. (Async is god here).
* **Event Loop:** The master orchestrator that juggles paused tasks.
* **Coroutine:** A pausable function created by `async def`.
* **Concurrency:** Doing multiple things in overlapping time frames.

### The Idiom Cheatsheet

* **Define async task:** `async def fetch_data():` → creates a coroutine.
* **Pause and wait:** `await fetch_data()` → yields control to the loop until done.
* **Start the engine:** `asyncio.run(main())` → boots the event loop from a normal script.
* **Concurrent execution:** `await asyncio.gather(task1(), task2())` → runs tasks in parallel.
* **Rate limiting:** `asyncio.Semaphore(10)` → bounds concurrency to 10 active tasks.
* **Async context manager:** `async with sem:` → safely acquires/releases the semaphore.
* **Quarantine sync code:** `await asyncio.to_thread(sync_func)` → prevents sync code from freezing the loop.

### Flashcard Q&A

* **Q: What happens if you call an async function without await?**
A: It doesn't run. It returns an un-run coroutine object and throws a `RuntimeWarning`.
* **Q: Why shouldn't you use `time.sleep()` inside an `async def`?**
A: It is blocking. It freezes the entire event loop. Use `asyncio.sleep()`.
* **Q: Why shouldn't you use the `requests` library in async AI code?**
A: It is synchronous and blocking. Use `httpx` or `aiohttp` instead.
* **Q: How do you prevent an API from banning you for too many concurrent requests?**
A: Wrap the API call in an `async with asyncio.Semaphore(limit):` block.

### The Traps (Error → Cause → Fix)

* **`RuntimeWarning: coroutine was never awaited`** → You forgot to await. → Fix: Add `await` before the function call.
* **Entire application freezes completely** → You used a blocking sync library (requests/time.sleep) in async code. → Fix: Swap to `httpx` or `asyncio.sleep()`.
* **`HTTP 429 Too Many Requests`** → `asyncio.gather` blasted the API too fast. → Fix: Throttle with a `Semaphore`.
* **`RuntimeError: asyncio.run() cannot be called from a running event loop`** → Used `asyncio.run()` in a Jupyter notebook. → Fix: Just `await` the function directly.

⚡ **RECAP:** Your mental cache is primed. 5 minutes here reloads the entire node.

---

## APPENDIX — FLOOR PRACTICE (Optional, for when you have 15 minutes at the machine)

Buddy, when you are back at your terminal and ready to build muscle memory, execute this sequence exactly.

**1. Create the environment:**
Open your Git Bash terminal and run:

```bash
mkdir -p vizier-floor/async_node
cd vizier-floor/async_node
touch race.py

```

**2. Inject the code:**
Open `race.py` in your text editor. Paste the exact code block from **Phase 3** (the God-Mode Artifact) and save it.

**3. Execute and verify:**
Run the script from Git Bash:

```bash
python race.py

```

**4. Confirm Success:**
Look at your terminal output. You must see exactly three things to declare victory:

1. The `RuntimeWarning: coroutine 'call_llm' was never awaited` error printed at the top.
2. The Sequential total time hovering around ~10 seconds.
3. The Gather total time hovering around ~2–3 seconds, proving concurrency is alive and working.

Mission accomplished.