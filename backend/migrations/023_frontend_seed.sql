-- =====================================================================
-- Seed 023: Block 13.1 — Unified Command Center Frontend
-- Dictionary Terms + Academy Lesson Row
-- =====================================================================

-- ---------------------------------------------------------------
-- Dictionary Terms
-- ---------------------------------------------------------------
INSERT INTO dictionary_terms (term, category, beginner_definition, deep_definition, analogy, first_seen_phase)
VALUES
(
    'Glassmorphism',
    'Design',
    'A modern UI design style that looks like frosted glass, using blur effects, transparency, and thin borders to create a premium depth.',
    'Glassmorphism is a user interface design trend characterized by translucent background panels (using backdrop-filter: blur), subtle background transparency, light borders mimicking glass bevels, and glowing backdrop gradients to establish hierarchy and visual depth.',
    'Like looking at elements through a sheet of clean, frosted glass under a soft neon light.',
    13
),
(
    'Micro-Animations',
    'Design',
    'Small, subtle animations (like buttons glowing or expanding slightly on hover) that make a user interface feel responsive and alive.',
    'Micro-animations are small, purposeful visual transitions that guide user attention, provide instant feed-forward or feedback (e.g. status spinners, button expansions, checklist transitions), and improve the overall perceived quality and feel of the interface.',
    'Like the haptic vibration you feel when typing on your phone: a small, satisfying confirmation that your action was registered.',
    13
),
(
    'Unified Dashboard',
    'Design',
    'A single-page interface that aggregates multiple separate features (chat, approvals, briefings, metrics) into a cohesive dashboard layout.',
    'A Unified Dashboard is an interface pattern that integrates real-time communications, administrative settings, safety controls, and analytics indicators into a single layout. This reduces navigation friction, maintains thread state across panels, and provides immediate operational overview.',
    'Like the cockpit of a jet airplane: every dial, screen, and control stick is within the pilot''s reach, allowing them to fly, monitor, and adjust course without moving seats.',
    13
),
(
    'Real-Time Sync',
    'Engineering',
    'Keeping the frontend UI instantly updated with database changes (like approvals) using WebSockets instead of slow, manual refreshing.',
    'Real-time synchronization maintains state consistency between client views and database tables. VIZIER utilizes Supabase WebSockets (Postgres Replication via Realtime Channels) to push inserts, updates, and deletes of proposals directly to the React application state without polling.',
    'Like a collaborative online document where you can see the other person typing in real-time, rather than having to reload the page to see their edits.',
    13
)
ON CONFLICT (term) DO NOTHING;

-- ---------------------------------------------------------------
-- Academy Lesson Row
-- ---------------------------------------------------------------
INSERT INTO lessons (phase, order_index, title, body_markdown, competency_tag)
VALUES (
    13,
    1,
    'Block 13.1 — Unified Command Center Dashboard',
    E'## What You Built\n\nYou built VIZIER''s central Command Center page, unifying the real-time SSE chat console (with graph interrupts), safety cockpit approvals list (driven by Supabase Realtime), daily briefings reader, and system health status indices into a premium dark-themed single page layout.\n\n## Key Concepts\n- **Unified Dashboard**: Aggregating chat, actions, reviews, and monitoring into a single viewport to eliminate navigation latency.\n- **Real-Time Sync**: Subscribing to database updates via WebSockets (Supabase Realtime) to reflect approval actions immediately.\n- **Glassmorphism Design**: Using translucent overlays, shadows, and subtle animations to build a highly premium dark aesthetics theme.\n- **Durable Interrupt Resume**: Hooking frontend approval buttons directly to LangGraph''s resume command to steer agent executions in-flight.\n\n## Visual Polish\nWe leveraged custom CSS transitions, glass bevel borders, and glowing alerts to elevate the UI to production-grade standard.\n\n## Interview Line\n*"I designed and built VIZIER''s Unified Command Center, uniting a real-time SSE chat interface with LangGraph resume integration, an approvals cockpit backed by Supabase WebSocket subscriptions, and system briefings in a single-page dark dashboard."*',
    'glassmorphism, micro-animations, unified dashboard, real-time sync'
)
ON CONFLICT (phase, order_index) DO NOTHING;
