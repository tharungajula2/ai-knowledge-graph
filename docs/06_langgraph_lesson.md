# Lesson 6.0: Orchestration with LangGraph & Checkpointing

In this lesson, we explore graph-based agent orchestration frameworks and how to enable **Durable Execution** using database-backed checkpointers.

---

## 1. Graphs vs. Chains

Traditional AI pipelines are constructed as linear **Chains**:
* **Chains:** Step A runs, feeds output to Step B, which feeds output to Step C. It is a straight, one-way road.
* **Graphs:** Steps (nodes) are connected dynamically by routing rules (edges). Execution can loop, fork, merge, or route back to previous steps based on real-time decisions. This cyclical nature is essential for the ReAct loop.

---

## 2. Core Concepts in LangGraph

LangGraph organizes AI workloads by mapping them to mathematical graphs:

### A. State
* **What it is:** The shared data object passed from node to node throughout execution.
* **Reducers:** Special functions that control how updates are merged into the state. For example, `add_messages` is a reducer that appends new messages to the message list instead of replacing the entire list.

### B. Nodes
* **What it is:** The executable steps of the graph. A node is a simple python function that accepts the current state as input, performs work (e.g. calls the LLM, reads a file, queries a DB), and returns a dictionary of updates to merge into the state.

### C. Edges
* **What it is:** The paths connecting nodes.
* **Conditional Edges:** Rules that inspect the state and determine which node to route to next (e.g., if tool calls are present, route to `tools`; otherwise, route to the final answer endpoint).

---

## 3. Checkpointing & Durable Execution

In real-world applications, agents make network calls, trigger long-running processes, or converse with users over days. If your server restarts, crashes, or drops connection, the entire memory of the agent is wiped out in standard memory setups.

### PostgresSaver Checkpointer
A **checkpointer** is a state-saving engine. In our implementation, we wired `PostgresSaver` directly to your Supabase PostgreSQL DB:
1. **Serialization:** After a node executes, the checkpointer serializes the entire state (JSON messages, variables) into bytes.
2. **Persistence:** It saves these bytes as a row in the database, keyed by a unique **`thread_id`**.
3. **Resumption:** If a client requests a thread ID that already exists, the checkpointer immediately retrieves the saved state from the database and restores the agent's memory to that exact step.

This is called **Durable Execution**. It guarantees that conversation memory survives server restarts and crashes!
