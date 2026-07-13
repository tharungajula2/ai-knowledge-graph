# Block 10.1 — safety cockpit, permission tiers & audit trail

## What You Built
In this block, you created a centralized dashboard for gating actions, complete with a settings control panel, append-only logs, and a LangGraph native interrupt.

---

## 1. Human-in-the-Loop (HITL)
Human-in-the-Loop (HITL) ensures that the Large Language Model does not possess direct, autonomous execution power over side-effecting APIs.

```
+---------------+     propose     +-------------------+
|  LLM Agent    | --------------> | proposed_actions  |
+---------------+                 +-------------------+
                                            |
                                            | Human review / approve
                                            v
                                  +-------------------+
                                  |     Executor      |
                                  +-------------------+
```

By separating proposal creation from proposal execution:
- The agent loop runs to completion and exits, saving its work.
- The human receives a notification (browser WebSockets or Telegram message).
- The human authorizes the action.
- A decoupled worker loop executes the action and updates status.

---

## 2. LangGraph Interrupt & Resume
In LangGraph, the native way to achieve HITL is using the `interrupt()` function.

```python
from langgraph.types import interrupt

# Inside graph node:
user_approval = interrupt("Do you want to run this?")
```

### How it works:
1. When `interrupt()` is called, LangGraph throws a special exception that halts graph execution.
2. The checkpointer writes a full serialized snapshot of the state (messages, variables) to the PostgreSQL database.
3. The server thread is released, consuming zero CPU or memory while waiting.
4. When the user resumes (by running `stream(Command(resume="yes"), config)`), the graph reads the checkpoint and resumes execution **on the line directly following the interrupt call**, assigning `"yes"` to `user_approved`.

### Comparison: DB Proposals vs. Native Interrupts

| Aspect | DB Proposals Table | Native LangGraph Interrupt |
|---|---|---|
| **Best For** | CRUD integrations (send email, create event) | In-graph conditional flow control (e.g., "confirm calendar wipe") |
| **State Persistence** | Decoupled DB records | Full serialized thread checkpoint |
| **Resume Mechanism** | Poller / UI flips DB column | `Command(resume=...)` resume API call |
| **Complexity** | Low — standard DB query / web API | Medium — requires LangGraph state checkpoint awareness |

---

## 3. Permission Tiers
VIZIER safety policies are configured in `action_permissions` with three tiers:

- **Always Ask:** Decoupled proposals are created. Humans must approve every single instance. (Safe default).
- **Auto-Approve Low Risk:** Low-risk integrations (`create_task` or `label_email`) bypass human confirmation and execute instantly. Medium and high-risk actions still require review.
- **Blocked:** Prevents the agent from even proposing the action, raising a structural code-error.

---

## 4. Append-Only Audit Trail
An **audit log** records every safety setting change, proposal decision, and API outcome:

- `actor`: Who triggered the event (`human`, `agent`, `system`).
- `event_type`: What happened (`proposal_created`, `proposal_approved`, `permission_changed`).
- `details`: Contextual JSON payload.

### The Immutable Rule
The audit log table should never support SQL `UPDATE` or `DELETE` statements. In corporate environments, this guarantees that an attacker (or a compromised agent) cannot erase their actions, maintaining a reliable record for forensics.

---

## Key Terms Learned
- **Human-in-the-Loop (HITL)**: Control paradigm gating AI actions with human confirmation.
- **Interrupt/Resume**: Native graph pause/resume primitive.
- **Permission Tier**: Policy-driven gate configurations (always_ask, auto_approve_low_risk, blocked).
- **Audit Log**: Append-only chronological trace of safety operations.
- **Append-Only**: Database write-only design preventing erasure.
- **Supabase Realtime**: WebSocket-based client-server sync protocol for live updates.
