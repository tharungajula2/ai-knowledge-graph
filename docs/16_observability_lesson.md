# Block 12.1 — Observability & Automated Evaluations

## 1. Tracing vs Logging

When building complex agentic systems (like supervisor-multi-agent graphs), traditional text logging is insufficient.

```
TRADITIONAL LOG (Flat):
12:00:01 INFO  Supervisor started.
12:00:03 INFO  Routing query to SCHEDULER.
12:00:05 INFO  Calling calendar API.
12:00:06 ERROR Calendar call failed.

NESTED TRACE (Tree):
[Trace: Chat Interaction]
   ├── [Span: Supervisor Decision] (duration: 1.2s, tokens: 450)
   └── [Span: SCHEDULER Specialist] (duration: 3.1s)
         ├── [Span: Get Time Tool] (duration: 0.1s)
         └── [Span: Calendar Event Tool] (duration: 2.0s, API status: 500)
```

- **Flat Logging**: Outputs isolated messages. Finding which LLM prompt triggered which tool call requires matching timestamps or manually stitching thread logs.
- **Nested Tracing**: Captures the complete execution tree structure. A single trace encompasses the entire user interaction, nested with sub-spans for supervisor routing, specialist runs, tool invocations, and individual database/LLM queries, tracking exact inputs, outputs, token metrics, and latency.

---

## 2. LLM-as-a-Judge

Traditional unit tests check exact string matches (e.g. `assert response == "Hello"`). In AI engineering, this fails because LLM responses vary semantically.

**LLM-as-a-Judge** solves this by using a high-capability model (like Gemini or GPT-4) to evaluate target model outputs against a structured rubric:

```
                  +---------------------------+
                  |  Target Model Response:   |
                  |  "Sure, lunch is booked   |
                  |   at 1pm tomorrow."       |
                  +---------------------------+
                                |
                                v
+-------------------------------------------------------------+
| LLM Judge Prompt:                                           |
| "Grade the semantic alignment of the response on a scale   |
|  of 0.0 to 1.0 against the target query 'schedule lunch   |
|  tomorrow at 1pm'. Output JSON."                           |
+-------------------------------------------------------------+
                                |
                                v
                  +---------------------------+
                  |  Judge Structured Output: |
                  |  - Score: 1.0             |
                  |  - Reason: "Booked at     |
                  |    correct time/date."    |
                  +---------------------------+
```

---

## 3. Golden Datasets and Regression Testing

A **Golden Dataset** is a hand-crafted, version-controlled collection of representative query test cases that cover the core capabilities of the agent:
- Scheduling checks
- Inbox fetching & labeling
- Research and web searches
- Financial ticker analysis

### Regression Testing
When you update system instructions, edit tools, or upgrade foundation models, you run the golden evaluation suite to compare:
- **Routing Accuracy**: Did the supervisor send the query to the correct specialist?
- **Factual correctness**: Did the specialist extract correct parameters?
- **Average judge score**: Did quality increase or decrease?

If the overall score drops, a **regression** has occurred, signaling that the prompt edits or model change has introduced unwanted side-effects.

---

## Key Terms Learned
- **Observability (o11y)**: Understanding internal execution state from external trace outputs.
- **Trace**: The complete execution path of a single transaction.
- **Span**: A single unit of work (nested function/LLM query) within a trace.
- **Golden Query**: A curated test case representing expected behavior.
- **Regression**: A decline in system performance or accuracy after a code change.
