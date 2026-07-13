-- =====================================================================
-- Seed 014: Block 9.2 — Write Actions via Proposal Gate
-- Dictionary Terms + Academy Lesson Row
-- =====================================================================

-- ---------------------------------------------------------------
-- Dictionary Terms
-- ---------------------------------------------------------------
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, first_seen_phase)
VALUES
(
    'Proposal Pattern',
    'Safety',
    'A design where the agent first creates a "proposal" for a write action, which a human must approve before the action is actually taken. The agent proposes; you decide.',
    'The proposal pattern decouples the decision to perform an action from its execution. An agent inserts a proposal record (including the full payload, rationale, and risk tier) into a database with status=''proposed''. A separate human-in-the-loop step transitions the status to ''approved'' before an executor function performs the real-world action. This enforces auditability, accountability, and revocability at the architectural level, not at the prompt level.',
    'Like a financial advisor who can research investments and present recommendations, but cannot move your money without your signature on a physical approval form.',
    9
),
(
    'Executor',
    'Safety',
    'A function that carries out a real-world action (like sending an email) — but only after checking that the proposal has been approved by a human. Executors refuse to act on unapproved proposals.',
    'An executor is the final step in a propose→approve→execute pipeline. Each executor: (1) loads the proposal from the database, (2) verifies status=''approved'' (refusing to run otherwise), (3) checks idempotency to prevent double execution, (4) calls the external API, and (5) writes the result and updates status to ''executed'' or ''failed''. Executors are isolated from agent code at the import level — agents can never call executors directly.',
    'Like a bank teller who can only process a transfer after it has been authorized by the branch manager — no matter what the customer says.',
    9
),
(
    'Idempotency Key',
    'Engineering',
    'A unique token attached to each proposal. It guarantees that even if "approve" is called multiple times, the real-world action (sending an email, creating an event) happens exactly once.',
    'Idempotency means "same input → same result, no matter how many times applied." An idempotency key is a UUID generated at proposal creation time, stored with a UNIQUE database constraint. The executor checks if the proposal is already ''executed'' before calling the API. Combined with the database constraint, this provides a two-layer guarantee: no double-sends even under network retries, UI bugs, or concurrent requests.',
    'Like a credit card payment gateway that uses a transaction reference number — swiping your card twice at the checkout doesn''t charge you twice if the terminal sees the same reference number.',
    9
),
(
    'Risk Tier',
    'Safety',
    'A label (low, medium, high) classifying how dangerous a proposed action is. Higher risk = more scrutiny, explicit approval, and sometimes secondary confirmation.',
    'Risk tiers allow the system to apply proportionate controls to different action types. Low-risk actions (create_task, label_email) are reversible and have no external impact. Medium-risk actions (create_calendar_event) affect scheduling and require undo effort. High-risk actions (send_email) are irreversible, cross organizational boundaries, and have external-world consequences. In Block 10.1, risk tiers drive the visual design of the approval inbox (green/yellow/red badges) and may trigger Telegram notifications for high-risk proposals.',
    'Like how a hospital has different authorization levels for prescribing Advil (nurse can approve) vs. performing surgery (attending physician required).',
    9
),
(
    'Code-Level Enforcement',
    'Safety',
    'Security guaranteed by the structure of the code (import chains, function access), not by instructions to the LLM. Even if the LLM tries to bypass it, the code physically cannot reach the protected function.',
    'Code-level enforcement means that the attack surface is reduced structurally. In VIZIER, specialist agents import ONLY from proposer.py. executors.py is not in their import graph. Even if a prompt injection attack instructs the LLM to "call send_email directly," the Python runtime cannot resolve that call because the import simply does not exist in the agent module. This is fundamentally stronger than prompt-level rules because it does not rely on LLM compliance — it relies on Python''s module system.',
    'Like a nuclear launch protocol that physically requires two officers to simultaneously turn their keys — you can''t override it by shouting commands, because the hardware does not accept single-key activation.',
    9
),
(
    'Prompt-Level Enforcement',
    'Safety',
    'Safety rules written into the LLM''s instructions ("never send emails without permission"). These work most of the time, but can be bypassed by prompt injection or adversarial inputs. Should NEVER be the only defense.',
    'Prompt-level rules rely entirely on the LLM obeying the system prompt in all circumstances. Because LLMs are probabilistic and can be manipulated via indirect prompt injection (malicious instructions embedded in tool outputs, retrieved documents, or emails), prompt-level rules are speed bumps, not walls. They are necessary but insufficient. The correct defense-in-depth strategy layers prompt rules WITH OAuth scopes, code-level import isolation, and the proposal gate.',
    'Like posting a "Do Not Enter" sign on a door — it works for honest people but provides no barrier against someone who ignores signs.',
    9
)
ON CONFLICT (term) DO NOTHING;

-- ---------------------------------------------------------------
-- Academy Lesson Row
-- ---------------------------------------------------------------
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag)
VALUES (
    9,
    2,
    'Block 9.2 — Write Actions via Proposal Gate',
    E'## What You Built\n\nYou granted VIZIER write access to Gmail (send, modify), Google Calendar (events), and Google Tasks — but **exclusively through a human-in-the-loop proposal gate**.\n\n## The Core Architecture\n\n```\nAgent → propose_action() → DB row (status=proposed)\n                              ↓\n               Human reviews → approves → executor() → Google API\n```\n\n## Key Concepts\n- **Proposal pattern**: decouple decision from execution\n- **Idempotency key**: UUID-based at-most-once execution guarantee (UNIQUE constraint)\n- **Risk tiers**: low (task/label) / medium (calendar) / high (email)\n- **Code-level vs prompt-level enforcement**: structural safety beats instructional safety\n\n## The Idempotency Insight\nEven if "approve" is clicked twice, the executor checks `status == ''executed''` and returns early. No double-sends.\n\n## Interview Line\n*"I implemented a propose→approve→execute pattern with idempotent execution using a unique idempotency key per proposal, and enforced agent isolation at the Python import level — agents have no access to executor functions."*',
    'human-in-the-loop, idempotency, risk tiers, code-level enforcement'
)
ON CONFLICT (phase, order_index) DO NOTHING;
