## ELI5
A brilliant advisor sits in a sealed room: no internet, no calculator, no calendar — only what they memorized (and a whiteboard). Now slide a phone under the door and a menu: *"You may ask me to run these functions; I'll return results."* The advisor can now say, in a formal note: **CALL get_weather(city="Hyderabad")** — you run it, pass back `{"temp": 31}`, and they answer with live truth. The advisor never gained abilities. They gained a *protocol for requesting yours*. That protocol is tool calling — the node summary says it plainly: the single most important mechanic in agentic AI.

## The Real Explanation
**The mechanic, precisely — burn this into memory.** The model **never executes anything**. Ever. The loop is:
1. You send: messages + a list of **tool definitions** — each a name, a description, and a JSON Schema of parameters (Pydantic again — Ch 6's schema skills are literally tool-calling skills).
2. The model decides an answer needs a tool, and instead of prose returns a **structured tool-call request**: `{"name": "get_weather", "args": {"city": "Hyderabad"}}` — this is structured output (Ch 6) with a purpose. Recall Chapter 1: response content is a *list of parts* — here is why; a reply can be text + tool-call.
3. **Your code** looks up the real function, validates the args (boundary law!), executes it, and appends the **result** to the conversation as a special tool-result message.
4. Model reads the result and either answers in prose — or requests *another* tool. Repeat.
That request→execute→feed-back cycle, looped, has a name you met in Volume 01 Chapter 1: **the agent loop**. Model + tools + loop + goal = agent. Domain 04 is this chapter, industrialized. Your agent-lab's supervisor routing to specialists? Tool calling, orchestrated.

**Why descriptions are the real programming language.** The model chooses tools *by reading their descriptions* — nothing else. "Gets data" invites misuse; "Returns current weather for a city. Use ONLY for weather questions; requires an exact city name, never a country" steers precisely. Writing tool descriptions is prompt engineering aimed at a decision-maker, and bad descriptions are the #1 cause of tool misuse (wrong tool chosen, tools called when none needed, needed tools ignored). Parameter descriptions in the schema matter equally — the model reads them to fill args. Domain 04 has a whole node (`designing-tools`) on this craft; plant the seed now.

**Decisions the engineer owns around the loop:** *tool choice modes* — auto (model decides; default), forced ("you must call X" — turns a model into a reliable extraction engine), none (prose only); *parallel calls* — models can request several tools at once, and Vol 01 Ch 17's `asyncio.gather` is exactly how you execute them concurrently (told you async was load-bearing); *error feeding* — when a tool fails, don't crash: feed the error message back as the result and let the model adapt (retry differently, ask the user, answer without) — the repair loop of Ch 6, again; *safety* — the model requests, *you* decide; dangerous tools (send money, delete files) get a human gate between request and execution. Your agent-lab's human-approval gate is this exact principle, and Domain 04's `add-the-gate` node rebuilds it with your hands.

**Same mechanic, every provider.** Gemini, Anthropic, OpenAI: superficially different JSON, identical concept — define/describe/schema → model requests → you execute → feed back. Learn it once here; Chapter 11's gateway papers over the dialects.

## Why It Matters
Where this appears in real systems and jobs: the single most important mechanic in agentic AI.

## Hands-On
No framework — do the loop *manually* so you feel every gear: define two fake tools in a script, `get_weather(city)` and `search_web(query)` (both return canned dicts). Send a Gemini call with both tool definitions and the prompt "Should I carry an umbrella in Hyderabad today?" Inspect the response: find the tool-call part, print the requested name and args. Execute your fake function, append the tool-result message, call the model again, get the prose answer. Then three probes: a question needing *no* tool (does it correctly answer directly?), a question needing *both* tools, and a run where your weather function returns `{"error": "service down"}` — feed it back and watch the model cope. Transcript of all four runs → your note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. State what the model never does, and enumerate the four steps of the loop from memory.
2. Why are tool descriptions "the real programming language"? Name two misuse modes bad ones cause.
3. Where exactly do Chapter 6's skills reappear here — twice?
4. What do you do when a tool fails mid-loop, and why is that better than crashing?
5. Complete and explain: model + ___ + ___ + ___ = agent. Which two pieces did this chapter supply?


---

# PART II — ENGINEERING THE CALL
*9 chapters. The request was Part I; Part II is everything wrapped around it so it survives contact with reality: streams, failures, throttles, attacks, images, voice, long documents — and the discipline of asking "was that prompt actually good?"*

---

## Wikilinks
[[structured-output]]
[[python-async]]
[[map-of-ai]]
[[injection-first-look]]

## Status log
- Started: 2026-07-21
- Finished: null