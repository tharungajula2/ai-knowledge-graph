/**
 * gen-preview-brain.js
 * Deterministic generator for the VIZIER Day-251 PREVIEW brain dataset.
 * Produces site/brain-index.preview.json with ~500 nodes and 1200-1800 edges.
 * Uses a seeded LCG RNG — reproducible, no LLM, no randomness drift.
 *
 * Run: node tools/site-build/gen-preview-brain.js
 */

'use strict';
const fs = require('fs');
const path = require('path');

// ─── Seeded LCG RNG ──────────────────────────────────────────────────────────
function makeLCG(seed) {
  let s = seed >>> 0;
  return {
    next() {
      s = Math.imul(1664525, s) + 1013904223;
      return (s >>> 0) / 4294967296;
    },
    pick(arr) {
      return arr[Math.floor(this.next() * arr.length)];
    },
    int(min, max) {
      return min + Math.floor(this.next() * (max - min + 1));
    },
    shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(this.next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  };
}
const rng = makeLCG(251_991_337);

// ─── Domain config ───────────────────────────────────────────────────────────
const START_DATE = new Date('2026-07-09');

const DOMAINS = [
  { id: 'foundations',         label: 'Foundations',         color: '#3ee2e2', count: 72 },
  { id: 'prompting-apis',      label: 'Prompting & APIs',    color: '#2a7f7f', count: 58 },
  { id: 'rag-retrieval',       label: 'RAG & Retrieval',     color: '#4fd1c5', count: 55 },
  { id: 'agents',              label: 'Agents',              color: '#76e4f7', count: 48 },
  { id: 'multi-agent-mcp',     label: 'Multi-Agent & MCP',   color: '#b794f4', count: 62 },
  { id: 'memory-knowledge',    label: 'Memory & Knowledge',  color: '#68d391', count: 42 },
  { id: 'evals-observability', label: 'Evals & Obs',         color: '#fc8181', count: 38 },
  { id: 'safety-security',     label: 'Safety & Security',   color: '#fbd38d', count: 35 },
  { id: 'production',          label: 'Production',          color: '#f6ad55', count: 18 },
  { id: 'frontier-capstone',   label: 'Frontier & Capstone', color: '#f687b3', count: 14 },
];

// ─── Curated topic lists per domain ─────────────────────────────────────────
const TOPICS = {
  foundations: [
    'Transformer self-attention mathematics and QKV dot-product scaling',
    'Positional embeddings: Sinusoidal vs Rotary Position Embedding (RoPE)',
    'KV Cache mechanics and GPU memory bandwidth bottlenecks in decoding',
    'Decoding strategies: Top-P, Top-K, Temperature, and Min-P mechanics',
    'Feed-Forward Network (FFN) architectures: SwiGLU activation dynamics',
    'Tokenization limitations: Byte-Pair Encoding (BPE) and OOV handling',
    'Layer normalization placement: Pre-LN vs Post-LN stability tradeoffs',
    'Model quantization math: GPTQ, AWQ, and GGUF active weight formats',
    'Gradient descent and backpropagation through attention heads',
    'FlashAttention: GPU SRAM utilization and memory IO reduction',
    'Mixture of Experts (MoE) routing, gating networks, and capacity factor',
    'Maximum sequence length extrapolation and context scaling methods',
    'Fine-tuning techniques: LoRA rank selection and QLoRA double quantization',
    'Loss functions in LLM training: Cross-entropy and perplexity tracking',
    'Tokenizer vocabulary size impact on representation and training speed',
  ],
  'prompting-apis': [
    'Chain-of-Thought (CoT) elicitation and system instruction isolation',
    'Few-shot prompting: Exemplar selection, ordering, and bias mitigation',
    'Tool calling: JSON schema definitions and forced function selection',
    'Structured outputs: Restricting schema validation at the parser level',
    'Rate limiting mitigation: Exponential backoff and jitter algorithms',
    'Context window optimization: System prompt trimming and dynamic compression',
    'System prompt injection mitigation via XML tags and schema enforcement',
    'Multi-modal prompt construction: Interleaved image-text token structures',
    'API parameter tuning: Frequency vs presence penalty effects',
    'Provider failover logic: Dynamic routing across Groq, Anthropic, and OpenAI',
    'Function definition guidelines for high-recall tool calling accuracy',
    'LLM token utilization efficiency: Prefix caching and prompt sharing',
    'Context-caching strategies on Anthropic and DeepSeek APIs',
    'Zero-shot routing prompts for specialized model sub-selection',
    'Handling truncated API responses and maximum token limits cleanly',
  ],
  'rag-retrieval': [
    'Vector embeddings: Cosine similarity vs Inner Product vs L2 distance',
    'Hierarchical Navigable Small World (HNSW) index graph construction parameters',
    'Hybrid search: Reciprocal Rank Fusion (RRF) combining BM25 and dense vectors',
    'Reranking models: Cross-encoders vs bi-encoders for precision retrieval',
    'Chunking strategies: Recursive character split vs semantic sentence split',
    'Parent-child chunking: Storing parents, retrieving children for context',
    'Metadata filtering: Partitioning vector space before vector scan execution',
    'Query rewriting: Expansion via HyDE (Hypothetical Document Embeddings)',
    'Lost in the Middle problem: Structuring context to counter position bias',
    'ColBERT late interaction embeddings and token-level matching mechanics',
    'Vector compression: Product Quantization (PQ) and Scalar Quantization (SQ)',
    'Retrieval-Augmented Generation evaluation: Faithfulness and Answer Relevance',
    'Dynamic chunk sizing based on content density and formatting clues',
    'Index maintenance: Incremental updates vs complete index rebuilds',
    'Vector database partitioning for multi-tenant enterprise RAG systems',
  ],
  agents: [
    'ReAct pattern: Interleaved reasoning and action loops in execution',
    'LangGraph state management: Reducer functions and thread checkpoints',
    'State transition cycles: Cycle detection and infinite loop guards',
    'Single-agent planning: Self-reflection and correction loops',
    'Human-in-the-loop triggers: Interrupting state graphs for approval',
    'Agent state persistence: Database backends for state resumption',
    'Task decomposition strategies: Dynamic sub-task list generation',
    'Agent tool registry: Thread-safe tool execution environments',
    'Time-to-action constraints: Dynamic timeout tracking in agent loops',
    'Agent execution trace logging: Visualizing steps in nested graphs',
    'State machine agents vs free-form LLM routing networks',
    'Token budget limits in long-running agent execution paths',
    'Exception handling in tool execution and graceful recovery paths',
    'Agent routing logic based on semantic search of tool descriptions',
    'Memory-injected agent states: Context-aware system state management',
  ],
  'multi-agent-mcp': [
    'Model Context Protocol (MCP) server-client architecture definition',
    'Supervisor pattern: Hierarchical agent routing and dispatch loops',
    'Choreography vs orchestration in multi-agent team communication',
    'MCP tool registration: Dynamically exposing host scripts to LLM clients',
    'Agent-to-agent negotiation: Conflict resolution and output alignment',
    'Asynchronous multi-agent messaging: Message queues and pub-sub states',
    'MCP transport options: SSE vs Standard I/O communication channels',
    'Resource sharing in MCP: Access controls for local files and database tools',
    'Dynamic team creation: Spawning sub-agents for specialized tasks',
    'MCP client routing: Distributing requests across remote MCP servers',
    'Multi-agent consensus algorithms: Voting protocols for collaborative tasks',
    'Context handoff mechanics: Minimizing token bloat between sub-agents',
    'MCP server security: Sandboxing tools and limiting API token exposure',
    'Multi-agent role definitions: System prompt specialization and constraints',
    'Debugging MCP exchanges: Inspecting JSON-RPC messages and errors',
  ],
  'memory-knowledge': [
    'Short-term vs long-term memory: Ephemeral thread history vs persistent stores',
    'GraphRAG: Building entity-relation knowledge graphs from unstructured text',
    'Episodic memory: Extracting key events and lessons from conversation logs',
    'Semantic memory: Storing facts and relationships in a vector index',
    'Neo4j knowledge graphs: Querying relationships with Cypher templates',
    'Entity extraction: LLM-based entity and relationship detection from markdown',
    'Memory summarization: Rolling compression of chat logs to fit context windows',
    'Vector-based memory retrieval: Querying historical context with relevance weights',
    'Hierarchical summarization of knowledge bases for global query responses',
    'Memory consolidation: Offline cron jobs updating core user profile notes',
    'Graph-dense retrieval: Combining vector search with neighborhood traversal',
    'Entity resolution: Merging duplicate nodes in a knowledge graph',
    'Decay functions: Weighting memory retrieval by recency and frequency',
    'Fact verification: Checking memory updates against established sources',
    'Memory access control: Partitioning personal vs system memory stores',
  ],
  'evals-observability': [
    'Golden datasets: Creating high-fidelity benchmarks for agent validation',
    'LLM-as-a-judge: Implementing G-Eval criteria and rubric templates',
    'Tracing mechanics: Span ID tracking in nested tool and model calls',
    'Retrieval metrics: Mean Reciprocal Rank (MRR) and NDCG calculations',
    'Phoenix and LangSmith tracing: Debugging production trace graphs',
    'Latency profiling: Measuring token generation time and network overhead',
    'Token cost calculation: Tracking input, output, and cached tokens dynamically',
    'Automated CI/CD evaluations: Running agent tests before code merges',
    'Evaluating agent behavior: Path accuracy vs final response accuracy',
    'Detection of hallucination rates using NLI (Natural Language Inference)',
    'Semantic similarity metrics: BERTscore vs cosine embedding distance',
    'Cost-efficiency profiling: Tradeoffs between high-end and small-fast models',
    'Confidence scoring: Calibration of LLM self-assessed confidence ratings',
    'A/B testing of prompt iterations: Statistically valid evaluation design',
    'Synthetic data generation for domain-specific benchmark expansion',
  ],
  'safety-security': [
    'Prompt injection mitigation: Structural separation of instruction and data',
    'Jailbreak detection: Classifying adversarial system instruction bypasses',
    'Guardrails.ai: Enforcing runtime output constraints and type checking',
    'Llama Guard: Filtering toxic input prompts and unsafe model outputs',
    'PII masking: Redacting sensitive data before forwarding to external APIs',
    'Adversarial red-teaming: Automating probe queries for safety testing',
    'Human-in-the-loop (HITL): Triggering verification for high-risk tools',
    'OWASP Top 10 for LLMs: Addressing key vulnerability vectors in agents',
    'Data leakage prevention: Controlling model access to system memory files',
    'Output validation: Scanning generated code for security vulnerabilities',
    'Rate-limit abuse protection: Throttling suspicious agent execution chains',
    'Model behavior guardrails: Restricting discussion domains via system prompts',
    'Prompt leakage protection: Preventing retrieval of hidden system prompts',
    'Audit logging: Recording every tool output and prompt in immutable logs',
    'Abstention criteria: Training models to refuse inputs outside safety guidelines',
  ],
  production: [
    'FastAPI wrappers: Deploying production agent loops behind HTTP endpoints',
    'Dockerizing agents: Packaging environment, system libraries, and runtimes',
    'PostgreSQL pgvector: Indexing and querying dense embeddings in SQL',
    'Redis cache: Caching frequent model queries and embeddings lookup',
    'Stream processing: SSE streaming of partial tokens and trace updates',
    'Asynchronous tasks: Offloading agent runs to Celery or RQ task queues',
    'Auto-scaling LLM calls: Concurrency limits and queue depth monitoring',
    'Cost management: Budget capping and resource consumption monitoring',
    'Database connection pooling for high-concurrency vector database access',
    'Websocket connections: Real-time agent status and interaction updates',
    'Horizontal scaling of stateless agent execution containers',
    'Handling API outages: High-availability setups and local fallback models',
    'Production database migrations: Schema updates with pgvector indexes',
    'Cold start optimization for serverless agent deployment endpoints',
    'Agent monitoring: Dashboard widgets for costs, latencies, and error rates',
  ],
  'frontier-capstone': [
    'o1-style reasoning models: Reinforcement learning for long-thought traces',
    'Reinforcement Learning from AI Feedback (RLAIF) pipeline mechanics',
    'Multi-modal agents: Joint vision-action models for GUI automation',
    'Computer-use agents: Action space mapping, screenshot parsing, click grids',
    'Real-time Audio API integration: Duplex streaming and low-latency response',
    'Long-horizon planning benchmarks: Testing agent stability over 100+ steps',
    'Search-augmented reasoning: Training models to search web, code, and documents',
    'Autonomous skill acquisition: Agent loops writing and saving their own tools',
    'Speculative decoding: Using small models to draft tokens for large models',
    'Deep reinforcement learning for custom routing and decision agents',
    'Neural-symbolic agents: Combining neural models with formal logic solvers',
    'State space models (SSM) vs transformers for infinite context sequences',
    'Self-evolving codebases: Agents refactoring their own codebase with safety checks',
    'Zero-shot tool generation: Compiling custom APIs at run-time for tasks',
  ],
};

// ─── Skills (inner ring) ─────────────────────────────────────────────────────
const SKILLS = [
  { id: 'skill-write-script',       label: 'Write Script',          status: 'active' },
  { id: 'skill-feynman-note',       label: 'Feynman Note',          status: 'active' },
  { id: 'skill-grounded-research',  label: 'Grounded Research',     status: 'active' },
  { id: 'skill-daily-log',          label: 'Daily Log',             status: 'active' },
  { id: 'skill-weekly-review',      label: 'Weekly Review',         status: 'active' },
  { id: 'skill-citation-format',    label: 'Citation Format',       status: 'active' },
  { id: 'skill-challenge-section',  label: 'Challenge Section',     status: 'active' },
  { id: 'skill-tier-tagging',       label: 'Tier Tagging',          status: 'active' },
  { id: 'skill-telegram-brief',     label: 'Telegram Brief',        status: 'active' },
  { id: 'skill-diagram-gen',        label: 'Diagram Gen',           status: 'active' },
  { id: 'skill-abstention-check',   label: 'Abstention Check',      status: 'active' },
  { id: 'skill-cross-link',         label: 'Cross-Link',            status: 'active' },
  { id: 'skill-draft-email',        label: 'Draft Email',           status: 'active' },
  { id: 'skill-self-review',        label: 'Self Review',           status: 'active' },
  { id: 'skill-embed-search',       label: 'Embed Search',          status: 'active' },
];

// ─── Routines ─────────────────────────────────────────────────────────────────
const ROUTINES = [
  { id: 'routine-micro-learning-push', label: 'Micro-Learning Push',   status: 'active' },
  { id: 'routine-weekly-review',       label: 'Weekly Review',          status: 'active' },
  { id: 'routine-scan-refresh',        label: 'Scan & Refresh',         status: 'active' },
  { id: 'routine-morning-briefing',    label: 'Morning Briefing',       status: 'active' },
  { id: 'routine-oauth-reconsent',     label: 'OAuth Reconsent',        status: 'planned' },
  { id: 'routine-supabase-keepalive',  label: 'Supabase Keepalive',     status: 'active' },
  { id: 'routine-export-brain',        label: 'Export Brain',           status: 'active' },
  { id: 'routine-citation-audit',      label: 'Citation Audit',         status: 'planned' },
];

// ─── Applications (outer ring) ───────────────────────────────────────────────
const APPS = [
  { id: 'app-gmail',       label: 'Gmail',          icon: 'mail',       trustLevel: 'human-approved', inUse: true },
  { id: 'app-calendar',    label: 'Calendar',       icon: 'calendar',   trustLevel: 'human-approved', inUse: true },
  { id: 'app-drive',       label: 'Google Drive',   icon: 'hard-drive', trustLevel: 'read-only',      inUse: true },
  { id: 'app-tasks',       label: 'Tasks',          icon: 'check-square',trustLevel: 'human-approved',inUse: true },
  { id: 'app-telegram',    label: 'Telegram',       icon: 'send',       trustLevel: 'human-approved', inUse: true },
  { id: 'app-supabase',    label: 'Supabase',       icon: 'database',   trustLevel: 'direct',         inUse: true },
  { id: 'app-mcp',         label: 'Custom MCP',     icon: 'network',    trustLevel: 'direct',         inUse: true },
  { id: 'app-gemini',      label: 'Gemini',         icon: 'bot',        trustLevel: 'direct',         inUse: true },
  { id: 'app-groq',        label: 'Groq',           icon: 'zap',        trustLevel: 'direct',         inUse: true },
  { id: 'app-openrouter',  label: 'OpenRouter',     icon: 'shuffle',    trustLevel: 'direct',         inUse: false },
  { id: 'app-europe-pmc',  label: 'Europe PMC',     icon: 'microscope', trustLevel: 'read-only',      inUse: true },
];

// ─── Build nodes ─────────────────────────────────────────────────────────────
const nodes = [];
const edges = [];

// Center node
nodes.push({ id: 'center-vizier', label: 'VIZIER', type: 'center', ring: 'center' });

// Domain nodes
for (const d of DOMAINS) {
  nodes.push({ id: `domain-${d.id}`, label: d.label, type: 'domain', ring: d.id, domain: d.id, color: d.color });
  edges.push({ source: 'center-vizier', target: `domain-${d.id}`, type: 'domain-core' });
}

// Skills
for (const s of SKILLS) {
  nodes.push({ id: s.id, label: s.label, type: 'skill', ring: 'skills', status: s.status });
  edges.push({ source: 'center-vizier', target: s.id, type: 'skill-core' });
}

// Routines
for (const r of ROUTINES) {
  nodes.push({ id: r.id, label: r.label, type: 'routine', ring: 'routines', status: r.status });
  edges.push({ source: 'center-vizier', target: r.id, type: 'routine-core' });
}

// Applications
for (const a of APPS) {
  nodes.push({ id: a.id, label: a.label, type: 'application', ring: 'applications', icon: a.icon, trustLevel: a.trustLevel, inUse: a.inUse });
  edges.push({ source: 'center-vizier', target: a.id, type: 'app-core' });
}

// ─── Note nodes ──────────────────────────────────────────────────────────────
const noteTypes = ['feynman', 'knowledge'];
const tiers = [1, 1, 2, 2, 3, 4]; // Weighted toward 1–2

let dayOffset = 0;
const totalDays = 251;

for (const domain of DOMAINS) {
  const topicPool = rng.shuffle([...TOPICS[domain.id]]);
  const count = domain.count;

  for (let i = 0; i < count; i++) {
    const topic = topicPool[i % topicPool.length];
    // Unique enough with domain + index
    const slug = `${domain.id}-note-${String(i + 1).padStart(3, '0')}`;
    const noteId = `note-${slug}`;
    const noteType = rng.pick(noteTypes);
    const tier = rng.pick(tiers);

    // Spread dates across 251 days (domain-weighted density mimics real journal growth)
    dayOffset = (dayOffset + rng.int(0, 3)) % totalDays;
    const noteDate = new Date(START_DATE);
    noteDate.setDate(noteDate.getDate() - (totalDays - dayOffset - 1));

    nodes.push({
      id: noteId,
      label: topic,
      type: noteType,
      ring: domain.id,
      domain: domain.id,
      tier: tier,
      tags: [domain.id, noteType, `tier-${tier}`],
      date: noteDate.toISOString().slice(0, 10),
      slug: slug,
    });

    // Domain→note containment edge
    edges.push({ source: `domain-${domain.id}`, target: noteId, type: 'containment' });

    // Skill usage edges (skill used to create this note)
    const skillUser = rng.pick(SKILLS.slice(0, 8));
    edges.push({ source: skillUser.id, target: noteId, type: 'used-by' });
  }
}

// ─── Cross-domain wiki-links ──────────────────────────────────────────────────
// Build an index of note nodes per domain for efficient linking
const notesByDomain = {};
for (const n of nodes) {
  if ((n.type === 'feynman' || n.type === 'knowledge') && n.type !== 'domain') {
    if (!notesByDomain[n.domain]) notesByDomain[n.domain] = [];
    notesByDomain[n.domain].push(n.id);
  }
}

// Cross-link rules: which domains should link to which
const crossLinkRules = [
  ['foundations',         'prompting-apis',      0.45],
  ['foundations',         'rag-retrieval',       0.40],
  ['foundations',         'evals-observability', 0.30],
  ['prompting-apis',      'agents',              0.40],
  ['prompting-apis',      'foundations',         0.45],
  ['prompting-apis',      'multi-agent-mcp',     0.25],
  ['prompting-apis',      'production',          0.20],
  ['rag-retrieval',       'memory-knowledge',    0.40],
  ['rag-retrieval',       'production',          0.35],
  ['rag-retrieval',       'foundations',         0.25],
  ['agents',              'multi-agent-mcp',     0.45],
  ['agents',              'memory-knowledge',    0.40],
  ['agents',              'production',          0.25],
  ['multi-agent-mcp',     'production',          0.30],
  ['multi-agent-mcp',     'safety-security',     0.35],
  ['memory-knowledge',    'rag-retrieval',       0.30],
  ['memory-knowledge',    'evals-observability', 0.35],
  ['evals-observability', 'production',          0.30],
  ['evals-observability', 'safety-security',     0.25],
  ['safety-security',     'production',          0.30],
  ['production',          'frontier-capstone',   0.25],
  ['frontier-capstone',   'foundations',         0.20],
];

for (const [fromDomain, toDomain, prob] of crossLinkRules) {
  const fromNotes = notesByDomain[fromDomain] || [];
  const toNotes   = notesByDomain[toDomain]   || [];
  if (!fromNotes.length || !toNotes.length) continue;

  for (const fromId of fromNotes) {
    if (rng.next() < prob) {
      const toId = rng.pick(toNotes);
      // Avoid self-links and duplicates (lightweight check)
      if (fromId !== toId) {
        edges.push({ source: fromId, target: toId, type: 'wiki-link' });
      }
    }
  }
}

// ─── Routine → Skill edges ────────────────────────────────────────────────────
const routineSkillMap = {
  'routine-micro-learning-push': ['skill-feynman-note', 'skill-grounded-research', 'skill-telegram-brief'],
  'routine-weekly-review':       ['skill-weekly-review', 'skill-self-review'],
  'routine-scan-refresh':        ['skill-embed-search', 'skill-abstention-check'],
  'routine-morning-briefing':    ['skill-telegram-brief', 'skill-daily-log'],
  'routine-export-brain':        ['skill-cross-link', 'skill-tier-tagging'],
  'routine-citation-audit':      ['skill-citation-format', 'skill-tier-tagging'],
};
for (const [routineId, skillIds] of Object.entries(routineSkillMap)) {
  for (const skillId of skillIds) {
    edges.push({ source: routineId, target: skillId, type: 'routine-skill' });
  }
}

// ─── App → Routine edges ─────────────────────────────────────────────────────
const appRoutineMap = {
  'app-telegram':  ['routine-micro-learning-push', 'routine-morning-briefing'],
  'app-gmail':     ['routine-morning-briefing'],
  'app-calendar':  ['routine-morning-briefing', 'routine-weekly-review'],
  'app-supabase':  ['routine-supabase-keepalive', 'routine-scan-refresh'],
  'app-europe-pmc':['routine-scan-refresh'],
  'app-gemini':    ['routine-micro-learning-push', 'routine-scan-refresh'],
};
for (const [appId, routineIds] of Object.entries(appRoutineMap)) {
  for (const routineId of routineIds) {
    edges.push({ source: appId, target: routineId, type: 'app-routine' });
  }
}

// ─── Deduplicate edges ────────────────────────────────────────────────────────
const edgeSet = new Set();
const uniqueEdges = [];
for (const e of edges) {
  const key = `${e.source}||${e.target}||${e.type}`;
  if (!edgeSet.has(key)) {
    edgeSet.add(key);
    uniqueEdges.push(e);
  }
}

// ─── Build domain stats ───────────────────────────────────────────────────────
const domainStats = {};
for (const n of nodes) {
  if ((n.type === 'feynman' || n.type === 'knowledge') && n.domain && n.type !== 'domain') {
    domainStats[n.domain] = (domainStats[n.domain] || 0) + 1;
  }
}

// ─── Output ───────────────────────────────────────────────────────────────────
const output = {
  nodes,
  edges: uniqueEdges,
  metadata: {
    generated_at: new Date().toISOString(),
    preview: true,
    day: 251,
    label: 'Day-251 Vision (PREVIEW — illustrative, not real entries)',
    node_count: nodes.length,
    edge_count: uniqueEdges.length,
    domain_stats: domainStats,
  }
};

const outPath = path.join(__dirname, '../../site/brain-index.preview.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log(`✅ GATE 1: Preview brain written to site/brain-index.preview.json`);
console.log(`   Nodes: ${nodes.length}  |  Edges: ${uniqueEdges.length}`);
console.log(`   Domain breakdown:`, domainStats);

// Validate gate
const valid = (nodes.length >= 480 && nodes.length <= 520) && (uniqueEdges.length >= 1000);
if (!valid) {
  console.error(`❌ GATE 1 FAILED: Nodes=${nodes.length} (need 480-520), Edges=${uniqueEdges.length} (need ≥1000)`);
  process.exit(1);
} else {
  console.log(`✅ GATE 1 PASSED`);
}
