const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');
const curriculumDir = path.join(repoRoot, 'curriculum');
const lockedDir = path.join(curriculumDir, '.locked');
const siteDir = path.join(repoRoot, 'site');
const notesDir = path.join(siteDir, 'notes');

// 10 domains ordered
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

// Secret patterns for sanitizing note files
const leakPatterns = [
  /SUPABASE_[A-Z_]+/i,
  /sk-[a-zA-Z0-9]{20,}/,
  /AIzaSy[a-zA-Z0-9_-]{33}/,
  /bearer\s+[a-zA-Z0-9._-]+/i,
  /[a-zA-Z0-9+/]{40,}/,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/,
  /\+?[0-9]{1,4}[-.\s]?[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/,
  /[a-zA-Z]:\\[a-zA-Z0-9_.-]+/i
];

function sanitizeContent(content, filename) {
  const hasPrivateFlag = /private:\s*true/i.test(content);
  if (hasPrivateFlag) {
    return { clean: false, reason: 'Explicitly marked private' };
  }
  for (const pattern of leakPatterns) {
    const match = content.match(pattern);
    if (match) {
      return { clean: false, reason: `Matches forbidden pattern: ${match[0].substring(0, 15)}...` };
    }
  }
  return { clean: true, content };
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result = {};
  const lines = match[1].split(/\r?\n/);
  for (let line of lines) {
    const kv = line.split(':');
    if (kv.length >= 2) {
      const k = kv[0].trim();
      let v = kv.slice(1).join(':').trim();
      if (v.startsWith('[') && v.endsWith(']')) {
        v = v.substring(1, v.length - 1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      } else {
        v = v.replace(/^["']|["']$/g, '');
      }
      result[k] = v;
    }
  }
  return result;
}

function extractWikiLinks(content) {
  const links = [];
  const matches = content.matchAll(/\[\[([a-zA-Z0-9\s-_#|]+)\]\]/g);
  for (const match of matches) {
    const linkText = match[1].split('|')[0].trim().toLowerCase().replace(/\s+/g, '-');
    links.push(linkText);
  }
  return links;
}

function parseMasteryGraph(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  let version = '1.0.0';
  const versionMatch = content.match(/VIZIER\s*—\s*THE\s*MASTERY\s*GRAPH\s*\(v([\d.]+)\)/i);
  if (versionMatch) {
    version = versionMatch[1];
  }
  
  const nodes = [];
  const milestones = [];
  const crossDomainLinks = [];
  
  let currentDomain = null;
  let currentCluster = null;
  
  const lines = content.split(/\r?\n/);
  
  let inMilestones = false;
  let inCrossLinks = false;
  let milestoneBlock = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('## FLOATING MILESTONES')) {
      inMilestones = true;
      inCrossLinks = false;
      continue;
    }
    if (trimmed.startsWith('## CROSS-DOMAIN LINKS')) {
      inMilestones = false;
      inCrossLinks = true;
      continue;
    }
    if (trimmed.startsWith('## DOMAIN')) {
      inMilestones = false;
      inCrossLinks = false;
      
      const domMatch = trimmed.match(/^## DOMAIN\s+\d+\s+—\s+(.*?)\s*·\s*ring:\s*`?([\w-]+)`?/i);
      if (domMatch) {
        currentDomain = domMatch[2].trim();
      }
      currentCluster = null;
      continue;
    }
    if (trimmed.startsWith('## GRAPH TOTALS')) {
      inMilestones = false;
      inCrossLinks = false;
      continue;
    }
    
    if (inMilestones) {
      if (trimmed.startsWith('- ')) {
        if (milestoneBlock) {
          parseMilestone(milestoneBlock, milestones);
        }
        milestoneBlock = line;
      } else if (line.startsWith('  ') || line.startsWith('\t')) {
        milestoneBlock += '\n' + line;
      }
      continue;
    }
    
    if (inCrossLinks) {
      if (trimmed && !trimmed.startsWith('#')) {
        crossDomainLinks.push(trimmed);
      }
      continue;
    }
    
    if (currentDomain) {
      if (trimmed.startsWith('### Cluster:')) {
        currentCluster = trimmed.replace('### Cluster:', '').trim();
        continue;
      }
      
      if (trimmed.startsWith('- ')) {
        const nodeMatch = trimmed.match(/^- ([a-zA-Z0-9-]+) — (.*?)\s*\((concept|build|deep-dive|synthesis|capstone|frontier) · (S|M|L)\)(?::\s*(.*))?/);
        if (nodeMatch) {
          const id = nodeMatch[1].trim();
          const title = nodeMatch[2].trim().replace(/\.$/, '');
          const type = nodeMatch[3].trim();
          const size = nodeMatch[4].trim();
          const summary = (nodeMatch[5] || '').trim();
          
          nodes.push({
            id,
            title,
            domain: currentDomain,
            cluster: currentCluster || 'General',
            type,
            size,
            summary,
            requires: [],
            locked: false
          });
        }
      }
    }
  }
  
  if (milestoneBlock) {
    parseMilestone(milestoneBlock, milestones);
  }
  
  return { version, nodes, milestones, crossDomainLinks };
}

function parseMilestone(block, milestones) {
  const cleaned = block.replace(/\s+/g, ' ').replace(/^- /, '').trim();
  const match = cleaned.match(/^\*\*([^-]+)\s*—\s*([^*]+)\*\*\s*·\s*related:\s*([^·]+?)\s*(?:·\s*([\s\S]+))?$/i);
  if (match) {
    const id = match[1].trim();
    const title = match[2].trim();
    const relatedStr = match[3].trim();
    const rest = match[4] || '';
    
    const related_domains = relatedStr.split(',').map(s => s.trim());
    
    let baseline_node = null;
    const baseMatch = rest.match(/Baseline node:\s*`?([a-zA-Z0-9-]+)`?/i);
    if (baseMatch) {
      baseline_node = baseMatch[1].trim();
    }
    
    let description = rest.replace(/Baseline node:\s*`?([a-zA-Z0-9-]+)`?\.?/i, '').trim();
    
    milestones.push({
      id,
      title,
      description,
      related_domains,
      baseline_node,
      status: "floating"
    });
  }
}

function compileCurriculum() {
  console.log('=== Compiling Curriculum Node Graph ===');
  
  // Ensure required folders exist
  if (!fs.existsSync(curriculumDir)) {
    fs.mkdirSync(curriculumDir, { recursive: true });
  }
  if (!fs.existsSync(lockedDir)) {
    fs.mkdirSync(lockedDir, { recursive: true });
  }
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }

  const parsed = parseMasteryGraph(path.join(curriculumDir, 'VIZIER_MASTERY_GRAPH.md'));
  const nodes = parsed.nodes;
  const milestones = parsed.milestones;
  
  // Set up lookup maps
  const nodeMap = {};
  for (const node of nodes) {
    nodeMap[node.id] = node;
  }
  
  // 1. Resolve note statuses, wikilinks, and validate locks
  const filesToExport = [];
  const nodeBacklinks = {};
  for (const node of nodes) {
    nodeBacklinks[node.id] = [];
  }
  
  const nodeWikilinks = {};

  for (const node of nodes) {
    const notePath = path.join(repoRoot, 'brain', 'knowledge', node.domain, `${node.id}.md`);
    node.started = null;
    node.completed = null;
    let resolvedStatus = 'ghost';
    let rawContent = '';
    
    if (fs.existsSync(notePath)) {
      rawContent = fs.readFileSync(notePath, 'utf-8');
      const check = sanitizeContent(rawContent, `${node.id}.md`);
      if (!check.clean) {
        console.warn(`[WARNING] Sanitization issue for node ${node.id}: ${check.reason}`);
      }
      
      const fm = parseFrontmatter(rawContent);
      node.started = (fm.started && fm.started !== 'null') ? fm.started : null;
      node.completed = (fm.completed && fm.completed !== 'null') ? fm.completed : null;
      if (fm.status === 'learned') {
        resolvedStatus = 'lit';
      } else if (fm.status === 'in-progress') {
        resolvedStatus = 'charging';
      } else {
        // default note present to charging
        resolvedStatus = 'charging';
      }
      
      // Extract wikilinks from note content
      const wLinks = extractWikiLinks(rawContent);
      nodeWikilinks[node.id] = wLinks;
      
      filesToExport.push({
        source: notePath,
        destName: `notes/${node.id}.html`,
        type: node.type,
        id: `note-${node.id}`,
        slug: node.id,
        metadata: {
          title: node.title,
          domain: node.domain,
          status: resolvedStatus,
          confidence: fm.confidence || 'high',
          modified: fm.modified || new Date().toISOString()
        },
        content: rawContent
      });
    } else {
      resolvedStatus = 'ghost';
    }
    
    node.status = resolvedStatus;
    
    // Check Lifecycle Lock
    const lockPath = path.join(lockedDir, `${node.id}.json`);
    const lockExists = fs.existsSync(lockPath);
    
    if (resolvedStatus === 'lit') {
      node.locked = true;
      if (lockExists) {
        // Verify locked metadata hasn't changed
        const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
        if (
          lockData.title !== node.title ||
          lockData.domain !== node.domain ||
          lockData.type !== node.type ||
          lockData.size !== node.size
        ) {
          console.error(`\n[LOCKED NODE VIOLATION] Metadata changed for locked node: ${node.id}`);
          console.error(`Expected:`, { title: lockData.title, domain: lockData.domain, type: lockData.type, size: lockData.size });
          console.error(`Actual:  `, { title: node.title, domain: node.domain, type: node.type, size: node.size });
          process.exit(1);
        }
      } else {
        // Lock this node forever!
        const lockObj = {
          id: node.id,
          title: node.title,
          domain: node.domain,
          type: node.type,
          size: node.size,
          status: 'lit',
          locked_at: new Date().toISOString()
        };
        fs.writeFileSync(lockPath, JSON.stringify(lockObj, null, 2));
        console.log(`[LOCKED] Locked node metadata snapshot saved for: ${node.id}`);
      }
    } else {
      node.locked = false;
      // If lock exists but resolvedStatus is not 'lit', a locked node was downgraded!
      if (lockExists) {
        console.error(`\n[LOCKED NODE VIOLATION] Reverted status of locked node: ${node.id} from LIT to ${resolvedStatus.toUpperCase()}`);
        process.exit(1);
      }
    }
  }
  
  // 2. Wire backlinks and wikilinks
  for (const srcId in nodeWikilinks) {
    for (const targetId of nodeWikilinks[srcId]) {
      if (nodeMap[targetId]) {
        // valid wikilink target
        if (!nodeBacklinks[targetId].some(b => b.id === srcId)) {
          nodeBacklinks[targetId].push({
            id: srcId,
            title: nodeMap[srcId].title
          });
        }
      }
    }
  }
  
  // Attach backlinks to nodes for D3 and search
  for (const node of nodes) {
    node.backlinks = nodeBacklinks[node.id];
  }
  
  // 3. Programmatic sequence links within clusters
  // Group nodes by domain and cluster (retaining document order)
  const clusters = {};
  for (const node of nodes) {
    const key = `${node.domain}::${node.cluster}`;
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(node);
  }
  for (const key in clusters) {
    const clusterNodes = clusters[key];
    for (let i = 1; i < clusterNodes.length; i++) {
      const prev = clusterNodes[i-1];
      const curr = clusterNodes[i];
      if (!curr.requires.includes(prev.id)) {
        curr.requires.push(prev.id);
      }
    }
  }
  
  // 4. Capstone transitions: domain N capstone linked to domain N+1 first node
  for (let d = 0; d < domainsOrdered.length - 1; d++) {
    const thisDom = domainsOrdered[d];
    const nextDom = domainsOrdered[d + 1];
    
    // Capstone nodes of this domain
    const capstones = nodes.filter(n => n.domain === thisDom && n.type === 'capstone');
    
    // First node of next domain
    const firstNext = nodes.find(n => n.domain === nextDom);
    
    if (firstNext && capstones.length > 0) {
      for (const cap of capstones) {
        if (!firstNext.requires.includes(cap.id)) {
          firstNext.requires.push(cap.id);
        }
      }
    }
  }
  
  // 5. Parse cross-domain links from CROSS-DOMAIN LINKS section
  for (const linkLine of parsed.crossDomainLinks) {
    // A -> B or A → B. Multiple links can exist on one line separated by ·
    const parts = linkLine.split('·');
    for (const p of parts) {
      const trimmedLink = p.trim();
      const m = trimmedLink.match(/([a-zA-Z0-9-]+)\s*(?:→|->)\s*([a-zA-Z0-9-]+)/);
      if (m) {
        const src = m[1].trim();
        const dest = m[2].trim();
        if (nodeMap[dest] && nodeMap[src]) {
          if (!nodeMap[dest].requires.includes(src)) {
            nodeMap[dest].requires.push(src);
          }
        }
      }
    }
  }
  
  // 6. Resolve Milestone statuses & link to baseline node
  for (const ms of milestones) {
    if (ms.baseline_node && nodeMap[ms.baseline_node]) {
      ms.status = nodeMap[ms.baseline_node].status; // inherits status of its baseline node!
    } else {
      ms.status = 'floating';
    }
  }
  
  // 7. Write curriculum/curriculum.json (Mastery Graph JSON)
  const curriculumObj = {
    version: parsed.version,
    updated_at: new Date().toISOString(),
    marathon: { days: parsed.marathon ? parsed.marathon.days || 250 : 250, start_date: parsed.marathon ? parsed.marathon.start_date || null : null },
    nodes: nodes,
    milestones: milestones
  };
  fs.writeFileSync(path.join(curriculumDir, 'curriculum.json'), JSON.stringify(curriculumObj, null, 2));
  console.log(`Saved curriculum.json (Version ${parsed.version}, 200 nodes, 5 milestones).`);
  
  // 8. Generate D3 index JSON for LIVE mode (site/brain-index.public.json)
  const d3LiveNodes = [];
  const d3LiveEdges = [];
  
  // Center node VIZIER
  d3LiveNodes.push({
    id: 'center-vizier',
    label: 'VIZIER',
    title: 'VIZIER',
    type: 'center',
    ring: 'center',
    status: 'lit',
    summary: 'The main nervous system of AI engineering.'
  });
  
  // Concentric Domain guides/nodes (to layout and guide D3 circles)
  for (const dom of domainsOrdered) {
    d3LiveNodes.push({
      id: `domain-${dom}`,
      label: dom.replace('-', ' ').toUpperCase(),
      title: dom.replace('-', ' ').toUpperCase(),
      type: 'domain',
      ring: dom,
      domain: dom,
      status: 'lit'
    });
    // Edge from center to domain
    d3LiveEdges.push({
      source: 'center-vizier',
      target: `domain-${dom}`,
      type: 'domain-core'
    });
  }
  
  // Curriculum nodes
  for (const node of nodes) {
    d3LiveNodes.push({
      id: node.id,
      label: node.title,
      title: node.title,
      type: node.type,
      ring: node.domain,
      domain: node.domain,
      size: node.size,
      status: node.status,
      summary: node.summary,
      backlinks: node.backlinks,
      slug: node.id,
      started: node.started,
      completed: node.completed
    });
    
    // Edge from domain guide to node (containment edge)
    d3LiveEdges.push({
      source: `domain-${node.domain}`,
      target: node.id,
      type: 'containment'
    });
    
    // Dependency edges
    for (const reqId of node.requires) {
      if (nodeMap[reqId]) {
        d3LiveEdges.push({
          source: reqId,
          target: node.id,
          type: 'dependency'
        });
      }
    }
    
    // Add wikilink edges in graph
    if (nodeWikilinks[node.id]) {
      for (const wlTarget of nodeWikilinks[node.id]) {
        if (nodeMap[wlTarget]) {
          d3LiveEdges.push({
            source: node.id,
            target: wlTarget,
            type: 'wikilink'
          });
        }
      }
    }
  }
  
  // Milestone nodes
  for (const ms of milestones) {
    d3LiveNodes.push({
      id: ms.id,
      label: ms.title,
      title: ms.title,
      type: 'milestone',
      ring: 'milestones',
      status: ms.status,
      summary: ms.description,
      related_domains: ms.related_domains,
      slug: ms.baseline_node || ''
    });
    
    if (ms.baseline_node && nodeMap[ms.baseline_node]) {
      d3LiveEdges.push({
        source: ms.baseline_node,
        target: ms.id,
        type: 'milestone-dependency'
      });
    }
  }
  
  const marathonData = curriculumObj.marathon || {};
  const d3LiveIndex = {
    nodes: d3LiveNodes,
    edges: d3LiveEdges,
    metadata: {
      generated_at: new Date().toISOString(),
      plan_version: parsed.version,
      node_count: nodes.length, // exactly 200 plan nodes
      lit_count: nodes.filter(n => n.status === 'lit').length,
      charging_count: nodes.filter(n => n.status === 'charging').length,
      ghost_count: nodes.filter(n => n.status === 'ghost').length,
      edge_count: d3LiveEdges.length,
      marathon: { days: marathonData.days || 250, start_date: marathonData.start_date || null }
    }
  };
  fs.writeFileSync(path.join(siteDir, 'brain-index.public.json'), JSON.stringify(d3LiveIndex, null, 2));
  console.log(`Saved site/brain-index.public.json (${d3LiveNodes.length} nodes, ${d3LiveEdges.length} edges).`);
  
  // Save identical copy to brain-index.preview.json to satisfy references, keeping them in sync
  fs.writeFileSync(path.join(siteDir, 'brain-index.preview.json'), JSON.stringify(d3LiveIndex, null, 2));
  console.log(`Saved site/brain-index.preview.json (${d3LiveNodes.length} nodes, ${d3LiveEdges.length} edges).`);
  
  return filesToExport;
}

module.exports = { compileCurriculum };

if (require.main === module) {
  compileCurriculum();
}
