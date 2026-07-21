---
id: first-api-call
title: "First API Call"
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
wikilinks: ["context-windows", "tokens", "build-token-cost-calculator", "roles-and-system-prompts"]
tags: [prompting-apis]
---

## ELI5
Everything you did in a chat window, a program can do with one HTTPS request. That's the whole revelation of this chapter: **a model is a function you call**. Text goes in over the wire, text comes back, and the moment it's a function, you can compose it — into loops, pipelines, products. Today the magic becomes an object in your terminal.

## The Real Explanation
**What an API call actually is.** An HTTP POST to a provider's endpoint with (1) your **API key** in a header — your identity and your bill, (2) a **JSON body** — model name, messages, settings like temperature and max output tokens, and (3) back comes a **JSON response** — the generated text plus metadata. The SDK (`pip install google-genai`) is just a polite wrapper around this POST; never forget the HTTP underneath, because when things break, the truth is in the raw request/response.

```python
from google import genai

client = genai.Client()   # reads GEMINI_API_KEY from the environment (Vol 01, Ch 20!)
resp = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain tokens in one sentence."
)
print(resp.text)
```

**The three laws of API keys** (violating law 1 has cost real people real money): keys live in **environment variables** (`export GEMINI_API_KEY=...`) or a `.env` file that is **in `.gitignore`** — never in code, never in a commit (Git history is forever — Vol 01, Ch 19); one key per project so leaks are containable; and rotate any key you even suspect leaked.

**Inspect the raw response — the node's real assignment.** `resp.text` is convenience sugar. Print the full response object and find the anatomy you'll meet on every provider: the **candidates/content/parts** structure (why a list of parts? because responses can mix text, tool calls, and more — foreshadowing Chapter 7), the **finish reason** (`STOP` = natural end; length-cap and safety endings look different — check this field before trusting truncated-looking output), and **usage metadata** — input tokens, output tokens. That usage block is your `tokentools` numbers, now official: reconcile the API's count against your Volume 01 calculator on the same text and note the delta.

**Statelessness, witnessed.** Make two calls: "My name is Tharun." then "What's my name?" The model has no idea — Vol 01 Chapter 8's whiteboard truth, now demonstrated by your own code. Every "conversation" you build from here on is you re-sending history manually. Chapter 17's chatbot is exactly that loop.

## Why It Matters
Where this appears in real systems and jobs: call Gemini from Python; inspect the raw response.

## Hands-On
In a fresh venv: get a free Gemini API key (AI Studio), set it as an env var, make the call above. Then: print the full raw response and label every field in a comment; check the finish reason; print token usage and compare with `tokentools`; run the two-call statelessness experiment; and finally set `max_output_tokens=10`, observe the truncation *and* the changed finish reason. Five experiments, one script, `first_call.py` — commit it (key nowhere in sight).

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What are the three components of every LLM API call, at the HTTP level?
2. Recite the three laws of API keys and the reason Git makes leaks worse.
3. Why is response content a *list of parts* rather than a string? What does that design anticipate?
4. What does the finish reason tell you, and why check it before trusting output?
5. Describe your statelessness experiment and its result — and what it obligates every chat app to do.


---

## Wikilinks
[[context-windows]]
[[tokens]]
[[build-token-cost-calculator]]
[[roles-and-system-prompts]]

## Status log
- Started: 2026-07-21
- Finished: null
