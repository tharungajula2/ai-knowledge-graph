// ── Vizier Configuration & Shared State ─────────────────────────────────────

const LIVE_SRC    = 'brain-index.public.json';
const PREVIEW_SRC = 'brain-index.preview.json';

const ringRadii = {
  center: 0,
  foundations: 120,
  'prompting-apis': 200,
  'rag-retrieval': 280,
  agents: 360,
  'multi-agent-mcp': 440,
  'memory-knowledge': 520,
  'evals-observability': 600,
  'safety-security': 680,
  production: 760,
  'frontier-capstone': 840,
  milestones: 920,
  skills: 1000,
  routines: 1080,
  applications: 1160
};

const domainsOrdered = [
  'foundations',
  'prompting-apis',
  'rag-retrieval',
  'agents',
  'multi-agent-mcp',
  'memory-knowledge',
  'evals-observability',
  'safety-security',
  'production',
  'frontier-capstone'
];

const domainColors = {
  foundations:         '#3ee2e2',
  'prompting-apis':      '#2a7f7f',
  'rag-retrieval':       '#4fd1c5',
  agents:              '#76e4f7',
  'multi-agent-mcp':     '#b794f4',
  'memory-knowledge':    '#68d391',
  'evals-observability': '#fc8181',
  'safety-security':     '#fbd38d',
  production:          '#f6ad55',
  'frontier-capstone':   '#f687b3',
};

const domainList = [
  { id: 'foundations', num: '01', title: 'FOUNDATIONS', color: '#3ee2e2' },
  { id: 'prompting-apis', num: '02', title: 'PROMPTING & LLM APIs', color: '#2a7f7f' },
  { id: 'rag-retrieval', num: '03', title: 'RAG & RETRIEVAL', color: '#4fd1c5' },
  { id: 'agents', num: '04', title: 'AGENTS', color: '#76e4f7' },
  { id: 'multi-agent-mcp', num: '05', title: 'MULTI-AGENT & MCP', color: '#b794f4' },
  { id: 'memory-knowledge', num: '06', title: 'MEMORY & KNOWLEDGE', color: '#68d391' },
  { id: 'evals-observability', num: '07', title: 'EVALS & OBSERVABILITY', color: '#fc8181' },
  { id: 'safety-security', num: '08', title: 'SAFETY & SECURITY', color: '#fbd38d' },
  { id: 'production', num: '09', title: 'PRODUCTION', color: '#f6ad55' },
  { id: 'frontier-capstone', num: '10', title: 'FRONTIER & CAPSTONE', color: '#f687b3' }
];

function nodeColor(d) {
  if (d.type === 'center')      return '#3ee2e2';
  if (d.type === 'domain')      return domainColors[d.domain] || '#2a7f7f';
  if (d.type === 'milestone')   return '#f687b3';
  return domainColors[d.domain] || '#94a3b8';
}

// ── State ─────────────────────────────────────────────────────────────────────
let graphData = null;
let selectedNode = null;
let hoveredDomain = null;
let layoutMode = 'rings';
let labelsMode = 'smart';
let dataMode = 'preview';
let baseNodeSize = 8;
let linkDistance = 80;
let spinSpeed = 0.2;          // degrees per frame
let ringSpin = 0;             // current rotation angle (degrees)
let spinAnimId = null;
let hoveredNode = null;
let quadtree = null;

let linkSel = d3.select(null);
let nodeSel = d3.select(null);
let labelSel = d3.select(null);

let currentTransform = d3.zoomIdentity;
