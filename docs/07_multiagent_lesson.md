# Lesson 7.0: Hierarchical Multi-Agent Systems & Streaming

In this lesson, we explore the design principles of multi-agent networks, handoff mechanics, and user experience protocols for multi-step execution.

---

## 1. Why Multi-Agent?

When building simple agent systems, a single agent loop handles all queries. While simple, it hits boundaries under scale:
* ** Megaprompt Bloat:** Loading 20 tools and 3 different task domains into one prompt degrades attention.
* **Tool Confusions:** Models occasionally mix arguments or fail to route to the correct tool.
* **Testing Hardness:** Evaluating a single prompt that must act as a scheduler, analyst, and researcher is extremely difficult.

**Decomposition** solves this. By dividing responsibilities among autonomous specialist agents, each agent works within a smaller, clean domain with a focused prompt and 2-3 specific tools.

---

## 2. Multi-Agent Topologies: Supervisor vs. Swarm

Agents can be coordinated in two primary ways:

### A. Supervisor (Hierarchical)
* **Design:** A central router (Supervisor) owns the execution state and delegates work to specialist subgraphs. After a specialist completes its run, it always hands execution control back to the Supervisor.
* **Best for:** Task sequences requiring structured orchestration, compliance gates, or logical coordination (e.g. "Research X, then draft a report").

### B. Swarm (Collegiate)
* **Design:** Agents pass control to one another directly without a central coordinator (e.g., Researcher directly calls Scribe).
* **Best for:** Fluid, open-ended dialogues or collaborative problem-solving.

---

## 3. Key Concepts in Supervisor Networks

### Subgraphs
A subgraph is a self-contained graph representing a single agent's internal loop. Subgraphs encapsulate specific states and behaviors, preventing parent state corruption.

### Handoffs
A handoff occurs when a specialist node returns control. In VIZIER:
1. The Specialist finishes its work.
2. It writes its results to the shared `scratchpad` dictionary.
3. It returns the updated scratchpad and sets the routing flag to point back to the `supervisor`.

### Scratchpad
A central memory buffer separate from the conversation message history. Specialists write raw reports (e.g. fetched stock prices or web text) to the scratchpad so that subsequent specialists can read from it without cluttering the main conversation thread.

---

## 4. Real-time UX: SSE vs. WebSockets

Because multi-agent workflows chain multiple LLM calls and tools, response times can span several seconds. If a web app remains static during this, users assume it has crashed. We address this using **Server-Sent Events (SSE)**:

| Protocol | Connection Type | Direction | Overhead | Best For |
|---|---|---|---|---|
| **SSE** | Standard HTTP | Server-to-Client | Minimal | Streaming assistant replies & status updates |
| **WebSockets** | Custom TCP | Bidirectional | Heavy | Real-time gaming, collaborative boards |

Using SSE, VIZIER streams status logs dynamically (e.g. `"Routing to RESEARCHER..."`) so the user sees live progress ticks in the chat feed.
