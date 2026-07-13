const fs = require('fs');
const path = require('path');

function parseMasteryGraph(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract Version
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
    
    // Check section transitions
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
      
      // Parse DOMAIN line
      // Format: ## DOMAIN 01 — FOUNDATIONS · ring: `foundations` · 21 nodes
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
    
    // Parse clusters and nodes inside domains
    if (currentDomain) {
      if (trimmed.startsWith('### Cluster:')) {
        currentCluster = trimmed.replace('### Cluster:', '').trim();
        continue;
      }
      
      // Node line: - id — Title (type · size): summary
      if (trimmed.startsWith('- ')) {
        const nodeMatch = trimmed.match(/^- ([a-zA-Z0-9-]+) — (.*?)\s*\((concept|build|deep-dive|synthesis|capstone|frontier) · (S|M|L)\)(?::\s*(.*))?/);
        if (nodeMatch) {
          const id = nodeMatch[1].trim();
          const title = nodeMatch[2].trim().replace(/\.$/, ''); // clean trailing period if no summary
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
        } else {
          console.log('UNMATCHED LINE:', trimmed);
        }
      }
    }
  }
  
  // Parse last milestone block if any
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

const res = parseMasteryGraph(path.join(__dirname, '../../curriculum/VIZIER_MASTERY_GRAPH.md'));
console.log('Version:', res.version);
console.log('Nodes count:', res.nodes.length);
console.log('Milestones count:', res.milestones.length);
console.log('First 3 nodes:', res.nodes.slice(0, 3));
console.log('Milestones:', res.milestones);
console.log('Cross Domain Links sample:', res.crossDomainLinks.slice(0, 5));
