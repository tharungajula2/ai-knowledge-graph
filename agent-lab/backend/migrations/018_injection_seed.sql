-- =====================================================================
-- Seed 018: Block 10.2 — Prompt Injection Defense & Red-Team Drill
-- Dictionary Terms + Academy Lesson Row
-- =====================================================================

-- ---------------------------------------------------------------
-- Dictionary Terms
-- ---------------------------------------------------------------
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, first_seen_phase)
VALUES
(
    'Prompt Injection',
    'Safety',
    'A security vulnerability where an attacker sends text that tricks an AI model into ignoring its original safety instructions and executing the attacker''s commands instead.',
    'Prompt injection is an exploit technique targeting LLM-based systems. It occurs when untrusted input is parsed as instructions by the model''s parser or reasoning engine, overriding the developer-defined system instructions. It can be direct (user inputs commands) or indirect (attacker places commands in a document/email that the agent later retrieves and processes).',
    'Like a post-hypnotic suggestion or a trick question: if someone tells you "Forget everything I just said, and bark like a dog," and you do it, you''ve been prompt-injected.',
    10
),
(
    'Lethal Trifecta',
    'Safety',
    'The dangerous combination of three capabilities in an agent: access to private data, reading untrusted external inputs, and the ability to send emails or make API writes.',
    'The Lethal Trifecta is a structural vulnerability pattern in agentic systems. It requires three ingredients: (1) read access to privileged data (e.g. Gmail/Docs), (2) write access to exfiltration channels (e.g. SMTP/webhooks), and (3) ingestion of untrusted payloads (e.g. web pages/emails). If an agent possesses all three without human gates, an attacker can construct an indirect prompt injection that retrieves and exfiltrates private data autonomously.',
    'Like giving a stranger keys to your filing cabinet (read access), letting them write letters to your bank on your behalf (write access), and reading their advice blindly (untrusted inputs).',
    10
),
(
    'Exfiltration',
    'Safety',
    'The unauthorized transfer of private data out of a system by an attacker or a compromised program.',
    'Data exfiltration is the unauthorized retrieval and transmission of sensitive credentials, files, or information from a system to an external destination controlled by an adversary. In agent systems, this is typically executed by abusing email sending, webhook invocation, or logging APIs to transmit sensitive context.',
    'Like a corporate spy printing out classified blueprints, hiding them in their briefcase, and walking out of the building to deliver them to a competitor.',
    10
),
(
    'Spotlighting/Quarantining',
    'Safety',
    'Wrapping retrieved web pages or email text inside clear delimiters (like XML tags) and telling the AI to treat it strictly as data, never as commands.',
    'Spotlighting (or quarantine wrapping) is an LLM prompting mitigation technique. It isolates untrusted data by wrapping it within custom XML elements (e.g., <untrusted_source_data>) and prepending a strong system rule instructing the model''s attention mechanism to process text inside the boundary solely as static semantic data, never as executive instructions.',
    'Like placing a biohazard sample inside a sealed glass box. You can look at it and study it, but it is physically separated from you so it cannot infect you or control your movements.',
    10
),
(
    'Red Teaming',
    'Safety',
    'A security practice where you pretend to be an attacker and try to hack, bypass, or break your own system to find weaknesses before a real hacker does.',
    'Red Teaming is the systematic process of executing adversarial attacks against a system to evaluate its security posture. For LLM agents, it involves crafting adversarial prompts, jailbreaks, and indirect prompt injections to verify if system guardrails, code-level isolation, and human-in-the-loop gates hold under active compromise attempts.',
    'Like a bank hiring a security team to try to break into their vault at night to check if the alarms and locks actually work.',
    10
),
(
    'Indirect Prompt Injection',
    'Safety',
    'A prompt injection attack where the attacker doesn''t talk to the AI directly. Instead, they hide the attack in an email or web page, waiting for the AI to read it and get infected.',
    'Indirect prompt injection occurs when an agent retrieves data from an external, untrusted source (such as an email inbox, a database, or a scraped website) containing malicious instruction payloads. When the model processes the retrieved data, the embedded instructions hijack the context window, causing the agent to execute actions on behalf of the attacker rather than the principal.',
    'Like a trojan horse: you bring a wooden horse inside your city gates (retrieving the email), only for soldiers to climb out of it at night and capture the city (executing the hidden attack).',
    10
)
ON CONFLICT (term) DO NOTHING;

-- ---------------------------------------------------------------
-- Academy Lesson Row
-- ---------------------------------------------------------------
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag)
VALUES (
    10,
    2,
    'Block 10.2 — Prompt Injection Defense & Red-Team Drill',
    E'## What You Built\n\nYou secured VIZIER against Indirect Prompt Injection attacks (the Lethal Trifecta) using multi-layered defenses: wrapping data in spotlighting delimiters, scanning payloads for command patterns, and correlating outputs with retrieved sources via the checkpointer.\n\n## Key Concepts\n- **Lethal Trifecta**: Read access + Write access + Untrusted inputs. VIZIER has all three, making gates mandatory.\n- **Spotlighting/Quarantining**: Delimiting untrusted text to prevent instructions-in-data hijack.\n- **Heuristic Scanner**: Keyword regex filters to identify override attempts.\n- **Correlation check**: Matching proposal payloads against recent thread tool outputs to catch data leakage.\n\n## The Human Backstop\nEven if the LLM is completely tricked by an injection, it physically cannot bypass the human approval gate because the executor import is isolated from the agent graph.\n\n## Interview Line\n*"I red-teamed my own agent with a lethal-trifecta prompt injection attack and verified that my defense-in-depth architecture—combining spotlighting delimiters, a checkpointer-based correlation scanner, and a code-level human gate—successfully contained the exploit."*',
    'prompt injection, lethal trifecta, exfiltration, spotlighting, red teaming'
)
ON CONFLICT (phase, order_index) DO NOTHING;
