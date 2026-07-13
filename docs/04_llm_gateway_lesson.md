# Lesson 4.0: The Model Gateway & Resilient LLM-Ops

In this lesson, we will explore the engineering patterns that separate simple AI scripts from production-ready agentic systems. We will break down how VIZIER routes queries around API failures and rate limits.

---

## 1. The Volatility of Free-Tier APIs

When building applications on top of free LLM APIs, you are subject to extreme rate limits. 
* **Gemini 2.5 Flash-Lite:** 15 requests per minute (RPM) / 1,000 requests per day (RPD).
* **Groq Llama 3:** ~30 RPM.
* **OpenRouter Free:** 20 RPM.

In a multi-agent system, a single user query might trigger **10 to 15 internal LLM calls** (planning, agent routing, tool selection, reflection). A single user can easily exhaust a free-tier rate limit in under two minutes. 

Therefore, our architecture must build resilience directly into the code.

---

## 2. Exponential Backoff & Jitter

When a server is overloaded, it returns an **HTTP 429: Too Many Requests** error. If we immediately retry the request, we will just get blocked again.

### A. Exponential Backoff
* **What it is:** Waiting twice as long after each failed attempt before trying again (e.g. wait 2s, then 4s, then 8s).
* **The Analogy:** If you call a busy customer support line, you hang up and wait 5 minutes before calling again. If it is still busy, you wait 15 minutes, then 30 minutes, rather than dialing non-stop.

### B. Jitter (Randomness)
* **What it is:** Adding a small amount of random variance (noise) to the backoff delay.
* **Why it matters:** If 100 client apps hit a rate limit at the exact same time, and they all wait exactly 4 seconds (exponential backoff), they will all hit the server again at the exact same millisecond. This causes another spike (the "thundering herd" problem). 
* **The Formula:**
  ```python
  sleep_time = min(max_backoff, base * (2 ** attempt)) + random.uniform(0, 1.0)
  ```

---

## 3. Fallback Chains & Cooldowns

### A. Fallback Chain
If our primary model (Gemini) fails completely or exhausts its daily limits, the gateway automatically redirects the traffic to a backup model (Groq), then to OpenRouter, and finally to local Ollama.
* **The Analogy:** If your car breaks down, you take the bus. If the bus is late, you call an Uber. If your phone has no signal, you walk.

### B. Cooldowns
When a provider throws a major error (e.g., bad API key or quota exhausted), we put that provider on **cooldown** (e.g. 60 seconds). During this cooldown, the gateway bypasses it completely, sparing the client from wasting time on a server we know is broken.

---

## 4. Development Response Caching

During development, you will edit code and restart the server frequently. If you send the exact same prompt to the LLM over and over to test UI changes, you waste your API limits.

### Cache Hit vs. Cache Miss
To save tokens, the `ModelGateway` generates an MD5 hash of your query.
1. **Cache Miss:** The query is new. The gateway calls the API, gets the response, and writes it to a file inside the `.cache/` folder.
2. **Cache Hit:** The query matches a previous request. The gateway reads the JSON file from `.cache/` and returns it instantly (under 5 milliseconds) at **zero cost** and with **zero API quota usage**!
