const fs = require('fs');
const path = require('path');

// Helper to load and parse .env manually
function loadEnv(envPath) {
  const env = {};
  if (!fs.existsSync(envPath)) return env;
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([\w_]+)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      val = val.replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
  return env;
}

// Custom simple YAML parsers
function parseTaxonomy(content) {
  const domains = [];
  const lines = content.split(/\r?\n/);
  let current = null;
  
  for (let line of lines) {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) continue;
    
    if (clean.startsWith('-')) {
      if (current) domains.push(current);
      current = {};
      const rest = clean.substring(1).trim();
      const kvMatch = rest.match(/^([\w_]+)\s*:\s*(.*)$/);
      if (kvMatch) {
        current[kvMatch[1]] = kvMatch[2].trim().replace(/^["']|["']$/g, '');
      }
    } else {
      const kvMatch = clean.match(/^([\w_]+)\s*:\s*(.*)$/);
      if (kvMatch && current) {
        current[kvMatch[1]] = kvMatch[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  if (current) domains.push(current);
  return domains;
}

function parseRegistry(content) {
  const items = [];
  const lines = content.split(/\r?\n/);
  let current = null;
  
  for (let line of lines) {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) continue;
    
    if (clean.startsWith('-')) {
      if (current) items.push(current);
      current = {};
      const rest = clean.substring(1).trim();
      const kvMatch = rest.match(/^([\w_]+)\s*:\s*(.*)$/);
      if (kvMatch) {
        let val = kvMatch[2].trim();
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.substring(1, val.length - 1).split(',')
            .map(s => s.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
        } else {
          val = val.replace(/^["']|["']$/g, '');
        }
        current[kvMatch[1]] = val;
      }
    } else {
      const kvMatch = clean.match(/^([\w_]+)\s*:\s*(.*)$/);
      if (kvMatch && current) {
        let val = kvMatch[2].trim();
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.substring(1, val.length - 1).split(',')
            .map(s => s.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
        } else {
          val = val.replace(/^["']|["']$/g, '');
        }
        current[kvMatch[1]] = val;
      }
    }
  }
  if (current) items.push(current);
  return items;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  
  const result = {};
  const yamlBlock = match[1];
  const lines = yamlBlock.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    
    const kvMatch = line.match(/^([\w_]+)\s*:\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let val = kvMatch[2].trim();
      
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.substring(1, val.length - 1).split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      } else {
        val = val.replace(/^["']|["']$/g, '');
      }
      result[key] = val;
    }
  }
  return result;
}

// Path normalizer to convert Windows paths to forward slashes relative to repo root
const repoRoot = path.join(__dirname, '..');
function normalizePath(p) {
  const relative = path.relative(repoRoot, p);
  return relative.replace(/\\/g, '/');
}

// Recursive directory walk finding all files (optionally matching extensions)
function walkDir(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, filesList);
    } else {
      if (file !== '.gitkeep') {
        filesList.push({ filePath, stat });
      }
    }
  }
  return filesList;
}

// Supabase REST count queries
async function getTableCountWithTimeout(supabaseUrl, serviceKey, tableName, timeoutMs = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${supabaseUrl}/rest/v1/${tableName}?limit=1`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'count=exact'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const contentRange = response.headers.get('content-range');
    if (contentRange) {
      const parts = contentRange.split('/');
      if (parts.length > 1) {
        const count = parseInt(parts[1], 10);
        if (!isNaN(count)) return count;
      }
    }
    // Fallback if header is missing
    const body = await response.json();
    return Array.isArray(body) ? body.length : 0;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Extract keywords for inverted index
const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'about', 'by', 'this', 'that', 'these', 'those']);
function extractKeywords(node) {
  const keywords = new Set();
  
  if (node.domain) {
    keywords.add(node.domain.toLowerCase());
  }
  
  if (Array.isArray(node.tags)) {
    for (const tag of node.tags) {
      keywords.add(tag.toLowerCase());
    }
  }
  
  if (node.label) {
    const words = node.label.toLowerCase().split(/[^a-z0-9]+/i);
    for (const word of words) {
      if (word && word.length > 2 && !stopWords.has(word)) {
        keywords.add(word);
      }
    }
  }
  
  return Array.from(keywords);
}

// Find a matching node ID for [[wiki-links]]
function findNodeMatch(target, nodes) {
  const cleanTarget = target.trim().toLowerCase();
  
  // 1. Direct ID match
  let match = nodes.find(n => n.id.toLowerCase() === cleanTarget);
  if (match) return match.id;
  
  // 2. Label/Title match
  match = nodes.find(n => n.label && n.label.toLowerCase() === cleanTarget);
  if (match) return match.id;
  
  // 3. Filename match
  match = nodes.find(n => {
    if (!n.path) return false;
    const base = path.basename(n.path, '.md').toLowerCase();
    const baseWithExt = path.basename(n.path).toLowerCase();
    return base === cleanTarget || baseWithExt === cleanTarget;
  });
  if (match) return match.id;
  
  return null;
}

// Main execution function
async function run() {
  console.log('--- Starting VIZIER Brain Graph Indexer ---');
  
  const nodes = [];
  const edges = [];
  const domainCodes = new Set();
  
  // 1. Load taxonomy.yaml
  const taxonomyPath = path.join(__dirname, 'taxonomy.yaml');
  if (!fs.existsSync(taxonomyPath)) {
    console.error('CRITICAL: taxonomy.yaml not found!');
    process.exit(1);
  }
  const taxonomyContent = fs.readFileSync(taxonomyPath, 'utf-8');
  const domains = parseTaxonomy(taxonomyContent);
  
  console.log(`Loaded ${domains.length} domains from taxonomy.`);
  
  // Create Domain nodes
  for (const d of domains) {
    domainCodes.add(d.code);
    nodes.push({
      id: `domain-${d.code}`,
      label: d.name,
      type: 'domain',
      ring: 'knowledge',
      domain: d.code,
      description: d.description
    });
  }
  
  // 2. Add Center Node (VIZIER.md)
  let centerNode = {
    id: 'center-vizier',
    label: 'VIZIER',
    type: 'center',
    ring: 'center',
    path: 'brain/VIZIER.md',
    content: ''
  };
  const vizierPath = path.join(__dirname, 'VIZIER.md');
  if (fs.existsSync(vizierPath)) {
    centerNode.content = fs.readFileSync(vizierPath, 'utf-8');
  }
  nodes.push(centerNode);
  
  // Connect Domain nodes to Center Node
  for (const d of domains) {
    edges.push({
      source: 'center-vizier',
      target: `domain-${d.code}`,
      type: 'domain-core'
    });
  }
  
  // 3. Scan Knowledge Notes
  const knowledgeDir = path.join(__dirname, 'knowledge');
  const knowledgeFiles = walkDir(knowledgeDir);
  console.log(`Found ${knowledgeFiles.length} files under knowledge/.`);
  
  for (const fileInfo of knowledgeFiles) {
    const { filePath, stat } = fileInfo;
    if (!filePath.endsWith('.md')) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(content) || {};
    const normPath = normalizePath(filePath);
    
    // Determine domain from parent directory or frontmatter
    let domain = fm.domain;
    if (!domain) {
      const parentDirName = path.basename(path.dirname(filePath));
      if (domainCodes.has(parentDirName)) {
        domain = parentDirName;
      } else {
        domain = 'meta';
      }
    }
    
    const title = fm.title || path.basename(filePath, '.md');
    const isReadme = path.basename(filePath) === 'README.md';
    
    const node = {
      id: normPath,
      label: title,
      type: 'knowledge',
      ring: 'knowledge',
      domain: domain,
      path: normPath,
      size: stat.size,
      modified: stat.mtime.toISOString(),
      tags: fm.tags || [],
      sources: fm.sources || [],
      confidence: fm.confidence || '',
      note_type: fm.note_type || (isReadme ? 'stub' : 'knowledge'),
      content: content
    };
    
    nodes.push(node);
    
    // Connect node to its domain parent
    edges.push({
      source: `domain-${domain}`,
      target: normPath,
      type: 'containment'
    });
  }
  
  // 4. Scan Feynman Notes
  const feynmanDir = path.join(__dirname, 'feynman');
  const feynmanFiles = walkDir(feynmanDir);
  console.log(`Found ${feynmanFiles.length} files under feynman/.`);
  
  for (const fileInfo of feynmanFiles) {
    const { filePath, stat } = fileInfo;
    if (!filePath.endsWith('.md')) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(content) || {};
    const normPath = normalizePath(filePath);
    const domain = fm.domain || 'meta';
    const title = fm.title || path.basename(filePath, '.md');
    
    const node = {
      id: normPath,
      label: title,
      type: 'feynman',
      ring: 'knowledge',
      domain: domain,
      path: normPath,
      size: stat.size,
      modified: stat.mtime.toISOString(),
      tags: fm.tags || [],
      sources: fm.sources || [],
      confidence: fm.confidence || '',
      note_type: 'feynman',
      content: content
    };
    
    nodes.push(node);
    
    // Link to domain
    edges.push({
      source: `domain-${domain}`,
      target: normPath,
      type: 'containment'
    });
  }
  
  // 5. Scan Skills
  const skillsDir = path.join(__dirname, 'skills');
  const skillsFiles = walkDir(skillsDir);
  console.log(`Found ${skillsFiles.length} files under skills/.`);
  
  for (const fileInfo of skillsFiles) {
    const { filePath, stat } = fileInfo;
    if (!filePath.endsWith('.md')) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(content) || {};
    const normPath = normalizePath(filePath);
    const domain = fm.domain || 'meta';
    const title = fm.title || path.basename(filePath, '.md');
    
    const node = {
      id: normPath,
      label: title,
      type: 'skill',
      ring: 'skills',
      domain: domain,
      path: normPath,
      size: stat.size,
      modified: stat.mtime.toISOString(),
      tags: fm.tags || [],
      sources: fm.sources || [],
      confidence: fm.confidence || '',
      note_type: 'skill',
      content: content
    };
    
    nodes.push(node);
    
    // Skills link directly to center VIZIER node (or meta domain)
    edges.push({
      source: 'center-vizier',
      target: normPath,
      type: 'skill-core'
    });
  }
  
  // 6. Scan Routines
  const routinesDir = path.join(__dirname, 'routines');
  const routinesFiles = walkDir(routinesDir);
  console.log(`Found ${routinesFiles.length} files under routines/.`);
  
  for (const fileInfo of routinesFiles) {
    const { filePath, stat } = fileInfo;
    // Skip registry.yaml
    if (path.basename(filePath) === 'registry.yaml' || !filePath.endsWith('.md')) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(content) || {};
    const normPath = normalizePath(filePath);
    const domain = fm.domain || 'meta';
    const title = fm.title || path.basename(filePath, '.md');
    
    const node = {
      id: normPath,
      label: title,
      type: 'routine',
      ring: 'routines',
      domain: domain,
      path: normPath,
      size: stat.size,
      modified: stat.mtime.toISOString(),
      tags: fm.tags || [],
      sources: fm.sources || [],
      confidence: fm.confidence || '',
      note_type: 'routine',
      content: content
    };
    
    nodes.push(node);
    
    edges.push({
      source: 'center-vizier',
      target: normPath,
      type: 'routine-core'
    });
  }
  
  // 7. Read registries (routines/registry.yaml, applications/registry.yaml)
  const routinesRegistryPath = path.join(__dirname, 'routines', 'registry.yaml');
  if (fs.existsSync(routinesRegistryPath)) {
    try {
      const content = fs.readFileSync(routinesRegistryPath, 'utf-8');
      const routines = parseRegistry(content);
      console.log(`Loaded ${routines.length} entries from routines/registry.yaml.`);
      for (const r of routines) {
        if (!r.name) continue;
        const id = `routine-entry-${r.name}`;
        nodes.push({
          id,
          label: r.name,
          type: 'routine',
          ring: 'routines',
          domain: 'meta',
          schedule: r.schedule || '',
          status: r.status || 'planned',
          what_it_does: r.what_it_does || '',
          touches: r.touches || []
        });
        
        // Link routine to center
        edges.push({
          source: 'center-vizier',
          target: id,
          type: 'routine-map'
        });
        
        // Link routine to any domain code it touches
        if (Array.isArray(r.touches)) {
          for (const touch of r.touches) {
            if (domainCodes.has(touch)) {
              edges.push({
                source: `domain-${touch}`,
                target: id,
                type: 'routine-domain-touch'
              });
            } else {
              // Touch might be an app name
              edges.push({
                source: id,
                target: `app-entry-${touch}`,
                type: 'routine-app-touch'
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Warning: Failed to parse routines/registry.yaml:', e.message);
    }
  }
  
  const appsRegistryPath = path.join(__dirname, 'applications', 'registry.yaml');
  if (fs.existsSync(appsRegistryPath)) {
    try {
      const content = fs.readFileSync(appsRegistryPath, 'utf-8');
      const apps = parseRegistry(content);
      console.log(`Loaded ${apps.length} entries from applications/registry.yaml.`);
      for (const app of apps) {
        if (!app.name) continue;
        const id = `app-entry-${app.name}`;
        nodes.push({
          id,
          label: app.name,
          type: 'application',
          ring: 'applications',
          domain: 'meta',
          app_type: app.type || '',
          scopes: app.scopes || app.permissions || [],
          trust_level: app.trust_level || 'low',
          in_use: app.in_use === 'yes' || app.in_use === true
        });
        
        edges.push({
          source: 'center-vizier',
          target: id,
          type: 'app-link'
        });
      }
    } catch (e) {
      console.warn('Warning: Failed to parse applications/registry.yaml:', e.message);
    }
  }
  
  // 8. Query Supabase READ-ONLY
  const envPath = path.join(__dirname, '../backend/.env');
  const env = loadEnv(envPath);
  
  let live = false;
  let supabaseStatus = 'offline';
  let counts = {
    memories: 0,
    documents: 0,
    proposed_actions: 0,
    dictionary_terms: 0
  };
  
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      console.log('Querying Supabase database counters...');
      counts.memories = await getTableCountWithTimeout(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, 'memories', 3000);
      counts.documents = await getTableCountWithTimeout(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, 'documents', 3000);
      counts.proposed_actions = await getTableCountWithTimeout(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, 'proposed_actions', 3000);
      counts.dictionary_terms = await getTableCountWithTimeout(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, 'dictionary_terms', 3000);
      live = true;
      supabaseStatus = 'online';
      console.log('Supabase query successful:', counts);
    } catch (e) {
      console.warn(`Supabase offline: ${e.message}. Using default offline counts.`);
      live = false;
      supabaseStatus = 'offline';
    }
  } else {
    console.warn('Supabase configuration missing in backend/.env. Using default offline counts.');
    live = false;
    supabaseStatus = 'offline';
  }
  
  const countNodesInfo = [
    { id: 'count-memories', label: 'Memories', count: counts.memories, ring: 'knowledge' },
    { id: 'count-documents', label: 'RAG Documents', count: counts.documents, ring: 'knowledge' },
    { id: 'count-proposed_actions', label: 'Proposed Actions', count: counts.proposed_actions, ring: 'applications' },
    { id: 'count-dictionary_terms', label: 'Dictionary Terms', count: counts.dictionary_terms, ring: 'knowledge' }
  ];
  
  for (const info of countNodesInfo) {
    nodes.push({
      id: info.id,
      label: `${info.label} (${live ? info.count : 'Offline'})`,
      type: 'supabase-count',
      ring: info.ring,
      domain: 'meta',
      size: info.count,
      live,
      status: supabaseStatus
    });
    
    edges.push({
      source: 'center-vizier',
      target: info.id,
      type: 'supabase-count-link'
    });
  }
  
  // 9. Process wiki links [[Wiki-Link]]
  console.log('Processing wiki-links inside notes...');
  for (const n of nodes) {
    if (n.content && typeof n.content === 'string') {
      const wikiLinkRegex = /\[\[(.*?)\]\]/g;
      let match;
      while ((match = wikiLinkRegex.exec(n.content)) !== null) {
        const targetRef = match[1];
        const targetId = findNodeMatch(targetRef, nodes);
        if (targetId && targetId !== n.id) {
          edges.push({
            source: n.id,
            target: targetId,
            type: 'wiki-link'
          });
        }
      }
    }
  }
  
  // 10. Process sources -> domain links
  for (const n of nodes) {
    if (Array.isArray(n.sources)) {
      for (const src of n.sources) {
        const cleanSrc = src.trim().toLowerCase();
        if (domainCodes.has(cleanSrc)) {
          edges.push({
            source: n.id,
            target: `domain-${cleanSrc}`,
            type: 'source-domain'
          });
        }
      }
    }
  }
  
  // Clean content from nodes to prevent bloated index file size
  // Keep title, meta, but remove full text body to keep the index extremely fast for graph render
  for (const n of nodes) {
    delete n.content;
  }
  
  // 11. Generate Stats (per domain note/file counts)
  const stats = {};
  for (const d of domains) {
    stats[d.code] = 0;
  }
  for (const n of nodes) {
    if (n.domain && stats[n.domain] !== undefined) {
      stats[n.domain]++;
    }
  }
  
  // 12. Build Inverted Index (keyword -> [paths/IDs])
  const invertedIndex = {};
  for (const n of nodes) {
    if (n.path) { // Only index nodes with physical files
      const keywords = extractKeywords(n);
      for (const kw of keywords) {
        if (!invertedIndex[kw]) {
          invertedIndex[kw] = [];
        }
        if (!invertedIndex[kw].includes(n.id)) {
          invertedIndex[kw].push(n.id);
        }
      }
    }
  }
  
  // 13. Write files
  const outputIndex = {
    nodes,
    edges,
    stats,
    metadata: {
      generated_at: new Date().toISOString(),
      node_count: nodes.length,
      edge_count: edges.length
    }
  };
  
  const indexOutputPath = path.join(__dirname, 'brain-index.json');
  fs.writeFileSync(indexOutputPath, JSON.stringify(outputIndex, null, 2));
  console.log(`Saved brain-index.json to ${indexOutputPath}.`);
  
  const keywordOutputPath = path.join(__dirname, 'keyword-index.json');
  fs.writeFileSync(keywordOutputPath, JSON.stringify(invertedIndex, null, 2));
  console.log(`Saved keyword-index.json to ${keywordOutputPath}.`);
  
  console.log('--- Indexing Complete successfully! ---');
}

run();
