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

// Determines whether a note has real body content below the frontmatter.
// A note is considered to have content if its body (below ---) has at least
// one non-empty, non-whitespace, non-comment line of 20+ characters.
function hasNoteContent(rawContent) {
  // Strip frontmatter block
  let body = rawContent;
  if (rawContent.startsWith('---')) {
    const endIdx = rawContent.indexOf('---', 3);
    if (endIdx !== -1) {
      body = rawContent.substring(endIdx + 3);
    }
  }
  // Count meaningful lines: non-blank, not pure heading markers, not comment markers
  const meaningfulLines = body.split(/\r?\n/).filter(line => {
    const t = line.trim();
    if (!t) return false;              // blank
    if (t.startsWith('#')) return false; // headings are structural, not content
    if (t.startsWith('<!--')) return false; // HTML comments
    if (t.startsWith('---')) return false; // section dividers
    return t.length >= 20;             // must be substantive
  });
  return meaningfulLines.length >= 3;
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

function parseStatusLog(content) {
  let started = null;
  let finished = null;
  const match = content.match(/##\s*Status\s*log\s*([\s\S]*?)(?:##|$)/i);
  if (match) {
    const lines = match[1].split('\n');
    for (let line of lines) {
      const startedMatch = line.match(/-\s*Started:\s*([^\r\n]+)/i);
      const finishedMatch = line.match(/-\s*(Finished|Completed):\s*([^\r\n]+)/i);
      if (startedMatch) {
        const val = startedMatch[1].trim();
        if (val && val.toLowerCase() !== 'null' && val.toLowerCase() !== 'yyyy-mm-dd') {
          started = val;
        }
      }
      if (finishedMatch) {
        const val = finishedMatch[2].trim();
        if (val && val.toLowerCase() !== 'null' && val.toLowerCase() !== 'yyyy-mm-dd') {
          finished = val;
        }
      }
    }
  }
  return { started, finished };
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
  
  // Recursive index of note files in notes/ and brain/knowledge/
  const noteFileIndex = {};
  function indexNotesDir(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        indexNotesDir(full);
      } else if (entry.endsWith('.md')) {
        const content = fs.readFileSync(full, 'utf-8');
        const fm = parseFrontmatter(content);
        const basename = path.basename(entry, '.md');
        const id = fm.id || basename.replace(/^\d{2}-\d{2}-/, '');
        if (id) {
          noteFileIndex[id] = full;
        }
      }
    }
  }
  indexNotesDir(path.join(repoRoot, 'brain', 'knowledge'));
  indexNotesDir(path.join(repoRoot, 'notes'));

  // 1. Resolve note statuses, wikilinks, and validate locks
  const filesToExport = [];
  const nodeBacklinks = {};
  for (const node of nodes) {
    nodeBacklinks[node.id] = [];
  }
  
  const nodeWikilinks = {};

  for (const node of nodes) {
    let notePath = noteFileIndex[node.id] || path.join(repoRoot, 'notes', `${node.id}.md`);
    node.started = null;
    node.completed = null;
    let resolvedStatus = 'ghost';
    let rawContent = '';
    let noteHasContent = false;
    
    if (fs.existsSync(notePath)) {
      rawContent = fs.readFileSync(notePath, 'utf-8');
      const check = sanitizeContent(rawContent, `${node.id}.md`);
      if (!check.clean) {
        console.warn(`[WARNING] Sanitization issue for node ${node.id}: ${check.reason}`);
      }
      
      const fm = parseFrontmatter(rawContent);
      const bodyStatus = parseStatusLog(rawContent);
      
      const startedDate = fm.started || bodyStatus.started;
      const finishedDate = fm.completed || fm.finished || bodyStatus.finished;
      
      node.started = (startedDate && startedDate !== 'null') ? startedDate : null;
      node.completed = (finishedDate && finishedDate !== 'null') ? finishedDate : null;

      // ── Status resolution (new spec-compliant order) ─────────────────────
      // Explicit frontmatter status:lit/learned triggers lit.
      // Explicit status:charging overrides completion-based inference.
      // Explicit status:dark forces ghost even if note file exists.
      // Fallback: infer from completed date.
      const fmStatus = (fm.status || '').toLowerCase().trim();
      if (fmStatus === 'lit' || fmStatus === 'learned' || node.completed) {
        resolvedStatus = 'lit';
      } else if (fmStatus === 'dark') {
        resolvedStatus = 'ghost';
      } else {
        // note file exists but no completion date and no explicit status → charging
        resolvedStatus = 'charging';
      }
      // Override: explicit charging beats a completed date only if the note author
      // deliberately set it (rare — safety valve for in-progress notes).
      if (fmStatus === 'charging') {
        resolvedStatus = 'charging';
      }

      // ── Note metadata fields ─────────────────────────────────────────────
      noteHasContent = hasNoteContent(rawContent);
      node.note_version  = fm.version  || null;
      node.note_updated  = fm.updated  || fm.modified || null;
      node.lit_date      = fm.lit_date && fm.lit_date !== 'null' ? fm.lit_date : null;
      node.note_revisions = fm.revisions ? parseInt(fm.revisions, 10) || 0 : 0;
      node.has_content   = noteHasContent;
      
      // ── Empty-lit guard ──────────────────────────────────────────────────
      // A node that claims status:lit but has no real content is a lie.
      // Fail hard here so the build cannot proceed.
      if (resolvedStatus === 'lit' && !noteHasContent) {
        console.error(`\n[BUILD ERROR] EMPTY LIT NODE — "${node.id}" claims status:lit but has no substantive content.`);
        console.error(`  File: ${notePath}`);
        console.error(`  A lit node must have at least 3 lines of real content (each 20+ chars) below the frontmatter.`);
        console.error(`  Either add content or set status: charging.\n`);
        process.exit(1);
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
          version: fm.version || node.note_version || '0.1.0',
          updated: fm.updated || node.note_updated || '2026-07-20',
          revisions: fm.revisions ? parseInt(fm.revisions, 10) || 0 : (node.note_revisions || 0),
          lit_date: fm.lit_date && fm.lit_date !== 'null' ? fm.lit_date : (node.lit_date || null),
          modified: fm.modified || fm.updated || new Date().toISOString()
        },
        content: rawContent
      });
    } else {
      resolvedStatus = 'ghost';
      node.note_version   = null;
      node.note_updated   = null;
      node.lit_date       = null;
      node.note_revisions = 0;
      node.has_content    = false;
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
  let activeUniverse = {
    number: 1,
    codename: "AI ENGINEERING",
    title: "Universe 01 — AI Engineering Mastery",
    status: "active",
    started: null,
    completed: null
  };
  
  const curJsonPath = path.join(curriculumDir, 'curriculum.json');
  if (fs.existsSync(curJsonPath)) {
    try {
      const existingCur = JSON.parse(fs.readFileSync(curJsonPath, 'utf-8'));
      if (existingCur.universe) {
        activeUniverse = { ...activeUniverse, ...existingCur.universe };
      }
    } catch (e) {}
  }

  const litNodesList = nodes.filter(n => n.status === 'lit' && n.completed);
  if (litNodesList.length > 0) {
    const completedDates = litNodesList.map(n => n.completed).sort();
    activeUniverse.started = completedDates[0];
  } else {
    activeUniverse.started = null;
  }

  const totalPlannedNodes = nodes.length;
  const litPlannedCount = nodes.filter(n => n.status === 'lit').length;
  
  if (litPlannedCount === totalPlannedNodes) {
    activeUniverse.status = "complete";
    const completedDates = litNodesList.map(n => n.completed).sort();
    activeUniverse.completed = completedDates[completedDates.length - 1];
  } else {
    activeUniverse.status = "active";
    activeUniverse.completed = null;
  }

  const { execSync } = require('child_process');
  let currentStreak = 0;
  let bestStreak = 0;
  try {
    const logOutput = execSync('git log --pretty=format:"%ad|%s" --date=short').toString().trim();
    const commits = logOutput.split('\n').map(line => {
      const parts = line.split('|');
      return {
        date: parts[0],
        message: parts[1] || ''
      };
    });

    const activeDates = new Set();
    commits.forEach(c => {
      if (c.message.startsWith('learn(') || c.message.startsWith('progress(') || c.message.startsWith('feat(daily):')) {
        activeDates.add(c.date);
      }
    });

    const sortedDates = Array.from(activeDates).sort();
    if (sortedDates.length > 0) {
      let currentSeq = 0;
      let prevDateObj = null;
      const streaks = [];
      
      for (const dateStr of sortedDates) {
        const currentDateObj = new Date(dateStr + 'T00:00:00');
        if (!prevDateObj) {
          currentSeq = 1;
        } else {
          const diffTime = Math.abs(currentDateObj - prevDateObj);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            currentSeq++;
          } else if (diffDays > 1) {
            streaks.push(currentSeq);
            currentSeq = 1;
          }
        }
        prevDateObj = currentDateObj;
      }
      streaks.push(currentSeq);
      bestStreak = Math.max(...streaks, 0);

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      if (activeDates.has(todayStr) || activeDates.has(yesterdayStr)) {
        let traceDate = activeDates.has(todayStr) ? today : yesterday;
        while (true) {
          const traceStr = `${traceDate.getFullYear()}-${String(traceDate.getMonth() + 1).padStart(2, '0')}-${String(traceDate.getDate()).padStart(2, '0')}`;
          if (activeDates.has(traceStr)) {
            currentStreak++;
            traceDate.setDate(traceDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not calculate streaks from git log:', err.message);
  }

  const totalXP = nodes
    .filter(n => n.status === 'lit')
    .reduce((sum, n) => {
      if (n.type === 'capstone') return sum + 100;
      if (n.size === 'S') return sum + 10;
      if (n.size === 'M') return sum + 25;
      if (n.size === 'L') return sum + 50;
      return sum + 10;
    }, 0);

  const curriculumObj = {
    version: parsed.version,
    updated_at: new Date().toISOString(),
    universe: activeUniverse,
    metadata: {
      node_count: nodes.length,
      lit_nodes: litPlannedCount,
      total_xp: totalXP,
      streak: { current: currentStreak, best: bestStreak }
    },
    nodes: nodes,
    milestones: milestones
  };
  fs.writeFileSync(curJsonPath, JSON.stringify(curriculumObj, null, 2));
  console.log(`Saved curriculum.json (Version ${parsed.version}, ${nodes.length} nodes, ${milestones.length} milestones).`);
  
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
      cluster: node.cluster,
      size: node.size,
      status: node.status,
      summary: node.summary,
      backlinks: node.backlinks,
      slug: node.id,
      started: node.started,
      completed: node.completed,
      // ── Note-state fields (ignition schema) ─────────────────────────────
      note_version:   node.note_version   || null,
      note_updated:   node.note_updated   || null,
      lit_date:       node.lit_date       || null,
      note_revisions: node.note_revisions || 0,
      revisions:      node.note_revisions || 0,
      has_content:    node.has_content    || false
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
      universe: activeUniverse,
      total_xp: totalXP,
      streak: { current: currentStreak, best: bestStreak }
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
