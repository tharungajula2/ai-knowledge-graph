-- ==========================================
-- VIZIER Academy - Seed Data (003_gateway_seed)
-- ==========================================

-- 1. SEED DICTIONARY TERMS FOR PHASE 4
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, related_terms, first_seen_phase) VALUES
('rate limit', 'Basics',
 'A restriction on how many requests you can send to an API in a certain amount of time (e.g. 15 requests per minute).',
 'A safety throttle imposed by API providers measured in requests per minute (RPM), requests per day (RPD), or tokens per minute (TPM).',
 'A ticket check at an amusement park ride that only lets 20 people enter every minute.',
 ARRAY['backoff', 'jitter'], 'Phase 4'),

('backoff', 'Durable Execution',
 'Waiting progressively longer before retrying a failed task or request to prevent overloading a server.',
 'An algorithm that increases the delay between retries exponentially (e.g. 2s, 4s, 8s...) upon receiving rate limit or temporary server errors.',
 'Waiting 2 minutes, then 4 minutes, then 8 minutes to call back a busy friend, instead of calling them every second.',
 ARRAY['rate limit', 'jitter'], 'Phase 4'),

('jitter', 'Durable Execution',
 'Adding a tiny bit of random time to your retry delay to prevent many processes from retrying at the exact same millisecond.',
 'A randomization factor introduced into retry backoff algorithms to prevent synchronization collisions (the thundering herd problem).',
 'Adding a random delay of 1 to 5 seconds to your alarm clock so you and your roommates don''t all run for the shower at the exact same microsecond.',
 ARRAY['backoff', 'rate limit'], 'Phase 4'),

('fallback chain', 'Basics',
 'A structured list of backup plans that the application goes through in sequence if the primary service fails.',
 'A prioritized list of LLM endpoints used to resolve completion calls when the preceding model in the array returns an error.',
 'A list of grocery stores. If Store A is closed, you drive to Store B. If Store B is out of stock, you go to Store C.',
 ARRAY['router', 'provider'], 'Phase 4'),

('router', 'Basics',
 'A script or gateway that decides where to send your data or request next.',
 'An abstraction layer that directs execution queries dynamically to different backend engines based on rules or health statuses.',
 'A postal worker sorting packages into different delivery trucks based on address.',
 ARRAY['fallback chain'], 'Phase 4'),

('cache hit/miss', 'Basics',
 'A cache hit is when requested data is found in local memory (fast). A cache miss is when it must be retrieved from the main server (slower).',
 'A hit returns deserialized results directly from storage; a miss executes the live API gateway pipeline and updates the cache store.',
 'Looking for an answer in your notebook (hit) versus walking to the library to read the textbook (miss).',
 ARRAY['cache'], 'Phase 4'),

('provider', 'Basics',
 'The company or platform (like Google, Groq, or OpenRouter) that hosts the AI model and provides the API connection.',
 'An external organization exposing cloud services, APIs, and model weights via standard communication endpoints.',
 'Your cell phone carrier (e.g. Verizon or T-Mobile) that provides your signal and network access.',
 ARRAY['LLM', 'fallback chain'], 'Phase 4')
ON CONFLICT (term) DO NOTHING;

-- 2. SEED LESSONS FOR PHASE 4
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag) VALUES
(4, 1, 'The Model Gateway & Fallbacks',
 '# Lesson 4.1: Fallback Routing and Resilience

In this phase, we constructed the central Model Gateway (`gateway.py`) powered by LiteLLM. A robust gateway is key to moving from simple prototypes to reliable systems.

### Key Resiliencies:
- **Fallback Chains:** Automatically routes requests from Gemini to Groq, OpenRouter, and Ollama to handle server downtime or key exhaustion.
- **Backoff & Jitter:** Applies randomized delays (`min(10, base * (2**attempt)) + random`) on HTTP 429 rate limit exceptions.
- **On-Disk Caching:** Caches identical prompt payloads locally during development to conserve free token limits.',
 'gateway_routing')
ON CONFLICT (phase, order_index) DO NOTHING;
