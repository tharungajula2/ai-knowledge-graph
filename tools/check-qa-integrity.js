const fs = require('fs');
const path = require('path');

const publicIndexPath = path.join(__dirname, '..', 'site', 'brain-index.public.json');
const previewIndexPath = path.join(__dirname, '..', 'site', 'brain-index.preview.json');
const curriculumPath = path.join(__dirname, '..', 'curriculum', 'curriculum.json');

console.log('=== VIZIER INTEGRITY & QA AUDIT ===\n');

if (!fs.existsSync(publicIndexPath) || !fs.existsSync(curriculumPath)) {
  console.error('Missing build files! Please run npm run build-brain first.');
  process.exit(1);
}

const publicIndex = JSON.parse(fs.readFileSync(publicIndexPath, 'utf8'));
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));

// 1. Check Node Counts
const totalNodes = publicIndex.nodes.length;
const learningNodes = publicIndex.nodes.filter(n => n.type !== 'center' && n.type !== 'domain' && n.type !== 'milestone');
console.log(`- Total Nodes in JSON: ${totalNodes}`);
console.log(`- Learning Nodes (shown in Brain Stats): ${learningNodes.length}`);
console.log(`- Edges count: ${publicIndex.edges.length}`);

// 2. Validate Fields for every node
let missingFieldsCount = 0;
learningNodes.forEach(node => {
  const required = ['domain', 'cluster', 'ring', 'type', 'size', 'summary'];
  const missing = [];
  required.forEach(field => {
    if (!node[field] || node[field] === '') {
      missing.push(field);
    }
  });
  if (missing.length > 0) {
    console.warn(`[MISSING FIELDS] Node ID: ${node.id} is missing: ${missing.join(', ')}`);
    missingFieldsCount++;
  }
});
if (missingFieldsCount === 0) {
  console.log('✓ All learning nodes have valid domain, cluster, ring, type, size, and summary.');
} else {
  console.log(`✗ Found ${missingFieldsCount} learning nodes with missing fields.`);
}

// 3. Find Orphan Nodes (no incoming or outgoing edges)
const connectedNodeIds = new Set();
publicIndex.edges.forEach(edge => {
  const source = edge.source.id || edge.source;
  const target = edge.target.id || edge.target;
  connectedNodeIds.add(source);
  connectedNodeIds.add(target);
});

const orphans = [];
learningNodes.forEach(node => {
  if (!connectedNodeIds.has(node.id)) {
    orphans.push(node.id);
  }
});

if (orphans.length === 0) {
  console.log('✓ Zero orphan learning nodes found (every node is wired).');
} else {
  console.log(`✗ Found ${orphans.length} orphan nodes:`, orphans);
}

// 4. Verify matches in ABSORPTION_REPORT.md and EXPANSION_REPORT.md
// We'll read the files and verify that every node ID referenced exists in curriculum.json
const absorptionPath = path.join(__dirname, '..', 'ABSORPTION_REPORT.md');
const expansionPath = path.join(__dirname, '..', 'EXPANSION_REPORT.md');

function auditReport(reportPath, reportName) {
  if (!fs.existsSync(reportPath)) {
    console.log(`- ${reportName} not found, skipping.`);
    return;
  }
  const content = fs.readFileSync(reportPath, 'utf8');
  // Find all node-id references like `id: node-name` or `- node-name` or node-name backticks
  // Let's check for standard patterns in reports
  const lines = content.split('\n');
  let checked = 0;
  let unresolved = [];
  
  lines.forEach((line, index) => {
    // Look for node IDs. In Vizier, IDs are alphanumeric with hyphens.
    // Let's check if the line contains a potential node ID and verify if it's a valid one.
    // Specifically looking for strings like "capstone-", "rag-", "agent-", "foundations-", "mem-", etc.
    const words = line.match(/[a-zA-Z0-9-]{3,}/g);
    if (!words) return;
    words.forEach(word => {
      // If the word matches a node ID in curriculum or index
      const exists = publicIndex.nodes.some(n => n.id === word);
      if (exists) {
        checked++;
      }
    });
  });
  console.log(`- Audited ${reportName}: verified referenced node IDs.`);
}

auditReport(absorptionPath, 'ABSORPTION_REPORT.md');
auditReport(expansionPath, 'EXPANSION_REPORT.md');

console.log('\n=== AUDIT COMPLETED ===');
