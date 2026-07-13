-- =====================================================================
-- Seed 022: Block 12.1 — Langfuse & Golden Evaluations
-- Dictionary Terms + Academy Lesson Row
-- =====================================================================

-- ---------------------------------------------------------------
-- Dictionary Terms
-- ---------------------------------------------------------------
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, first_seen_phase)
VALUES
(
    'Observability',
    'Engineering',
    'The ability to understand what is happening inside a complex system by looking at the data it outputs (like logs, traces, and metrics).',
    'Observability (o11y) is a measure of how well internal states of a system can be inferred from knowledge of its external outputs. In LLM applications, it involves capturing complete context windows, latency breakdown per API call, prompt versions, tokens/cost metrics, and system execution trees.',
    'Like a doctor using an X-ray machine to see what is happening inside a patient''s body, instead of just guessing based on external symptoms.',
    12
),
(
    'Tracing',
    'Engineering',
    'Recording the exact step-by-step path a query takes through your code (e.g. from chatbot to supervisor, then to a specialist, then to an API call).',
    'Tracing tracks the lifecycle of a request as it flows through a distributed or nested graph. A single "trace" contains multiple nested "spans", representing individual function calls, tool executions, and LLM requests, showing execution order and latency.',
    'Like a package tracking number that shows every sorting facility, truck route, and delivery step your package went through on its journey.',
    12
),
(
    'Golden Dataset',
    'Engineering',
    'A high-quality set of test questions and expected answers used to check if your AI assistant is performing correctly.',
    'A Golden Dataset is a curated, version-controlled collection of reference inputs and expected outputs (or expected paths) used as the ground truth for evaluation. It is used in regression testing to ensure that changes to agent code or prompts do not degrade performance.',
    'Like an answer key for a school exam: we grade the AI''s answers against this key to see if it deserves an A or if it is failing.',
    12
),
(
    'LLM-as-a-Judge',
    'Engineering',
    'Using a powerful AI model (like Gemini or GPT-4) to grade the responses of another AI model based on correctness and helpfulness.',
    'LLM-as-a-Judge is an evaluation methodology that leverages state-of-the-art foundation models to evaluate and score output content from target models. By using structured prompts and scoring rubrics (e.g., grading 0.0 to 1.0), the judge model acts as an automated evaluator for semantic, structural, and alignment criteria.',
    'Like hiring a master chef to taste-test and grade the dishes prepared by a junior cook, instead of relying on a simple checklist.',
    12
),
(
    'Regression Testing',
    'Engineering',
    'Re-running your tests after making a code change to make sure you didn''t accidentally break features that used to work.',
    'Regression testing is a quality assurance practice that re-runs test suites (e.g., golden evaluations) after code refactoring, prompt edits, or library upgrades. It verifies that existing functionalities have not been broken or degraded by recent changes.',
    'Like checking if all the light switches in your house still work after an electrician finishes fixing the wiring in one room.',
    12
)
ON CONFLICT (term) DO NOTHING;

-- ---------------------------------------------------------------
-- Academy Lesson Row
-- ---------------------------------------------------------------
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag)
VALUES (
    12,
    1,
    'Block 12.1 — Langfuse Integration + Golden Evaluations',
    E'## What You Built\n\nYou instrumented VIZIER with Langfuse observability for nested execution tracing, and built an automated Golden Evaluations testing harness that runs queries against mock tools and grades routing and output accuracy using LLM-as-a-Judge.\n\n## Key Concepts\n- **Observability vs Logging**: Tracing captures structured nested spans (execution tree) instead of flat, isolated text logs.\n- **Golden Dataset**: Curated ground-truth test cases to ensure safety and prevent regression.\n- **LLM-as-a-Judge**: Running an evaluator model to score semantic answers against a rubric (e.g. 0.0 - 1.0).\n- **Regression Prevention**: Quantifying routing accuracy and score trends before deploying updates.\n\n## Durable Evaluation History\nAll evaluation runs are persisted to the database and viewable via a custom web dashboard.\n\n## Interview Line\n*"I integrated Langfuse tracing into our LangGraph supervisor agent and built an automated Golden Evaluation suite. The test harness mocks external APIs, evaluates routing and output accuracy via LLM-as-a-judge, and persists historical runs to track performance regression."*',
    'observability, tracing, golden dataset, LLM-as-a-judge, regression testing'
)
ON CONFLICT (phase, order_index) DO NOTHING;
