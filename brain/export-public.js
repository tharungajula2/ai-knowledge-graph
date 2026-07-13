const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const siteDir = path.join(repoRoot, 'site');
const toolsDir = path.join(repoRoot, 'tools', 'site-build');

// Create directories if they do not exist
if (!fs.existsSync(siteDir)) {
  fs.mkdirSync(siteDir, { recursive: true });
}
if (!fs.existsSync(toolsDir)) {
  fs.mkdirSync(toolsDir, { recursive: true });
}

// 10 domains from taxonomy
const validDomains = ['health-core', 'gut', 'mind-gut', 'body', 'nutrition', 'mind', 'communication', 'family-os', 'handyman', 'meta'];

// Secret / Leak patterns
const leakPatterns = [
  /SUPABASE_[A-Z_]+/i,
  /sk-[a-zA-Z0-9]{20,}/, // OpenAI API keys style
  /AIzaSy[a-zA-Z0-9_-]{33}/, // Google API keys style
  /bearer\s+[a-zA-Z0-9._-]+/i,
  /[a-zA-Z0-9+/]{40,}/, // generic long base64 strings
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/, // email addresses
  /\+?[0-9]{1,4}[-.\s]?[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/, // phone numbers
  /[a-zA-Z]:\\[a-zA-Z0-9_.-]+/i // Windows absolute paths (e.g. c:\...)
];

function sanitizeContent(content, filename) {
  // Check if note is explicitly marked private
  const hasPrivateFlag = /private:\s*true/i.test(content);
  if (hasPrivateFlag) {
    return { clean: false, reason: 'Explicitly marked private' };
  }

  // Scan content against secret regex patterns
  for (const pattern of leakPatterns) {
    const match = content.match(pattern);
    if (match) {
      return { clean: false, reason: `Matches forbidden pattern: ${match[0].substring(0, 15)}...` };
    }
  }

  return { clean: true, content };
}

// Parse frontmatter metadata
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

// Extract double bracket wiki-links e.g. [[some-note]]
function extractWikiLinks(content) {
  const links = [];
  const matches = content.matchAll(/\[\[([a-zA-Z0-9\s-_#|]+)\]\]/g);
  for (const match of matches) {
    const linkText = match[1].split('|')[0].trim().toLowerCase().replace(/\s+/g, '-');
    links.push(linkText);
  }
  return links;
}

function runExport() {
  console.log('--- Starting Public Sanitizing Export ---');
  
  const report = {
    exported_count: 0,
    excluded: [],
    errors: []
  };

  const publicNodes = [];
  const publicEdges = [];
  const filePathsToExport = [];

  // Read taxonomy domains
  const taxonomyPath = path.join(repoRoot, 'brain', 'taxonomy.yaml');
  let domainMap = {};
  if (fs.existsSync(taxonomyPath)) {
    const content = fs.readFileSync(taxonomyPath, 'utf-8');
    const matches = content.matchAll(/-\s*code:\s*([\w_-]+)\r?\n\s*name:\s*(.*?)\r?\n/g);
    for (const m of matches) {
      domainMap[m[1]] = m[2];
    }
  }

  // 1. Export VIZIER.md center note
  const vizierPath = path.join(repoRoot, 'brain', 'VIZIER.md');
  if (fs.existsSync(vizierPath)) {
    const content = fs.readFileSync(vizierPath, 'utf-8');
    const check = sanitizeContent(content, 'VIZIER.md');
    if (check.clean) {
      publicNodes.push({
        id: 'center-vizier',
        label: 'VIZIER',
        type: 'center',
        ring: 'center'
      });
      filePathsToExport.push({ source: vizierPath, destName: 'VIZIER.md', type: 'center', id: 'center-vizier', content: content });
    } else {
      report.excluded.push({ name: 'VIZIER.md', reason: check.reason });
    }
  }

  // Add domain nodes to index
  for (const d of validDomains) {
    publicNodes.push({
      id: `domain-${d}`,
      label: domainMap[d] || d,
      type: 'domain',
      ring: 'knowledge',
      domain: d
    });
    publicEdges.push({
      source: 'center-vizier',
      target: `domain-${d}`,
      type: 'domain-core'
    });
  }

  // 2. Scan knowledge/ and feynman/
  const folders = [
    { dir: path.join(repoRoot, 'brain', 'knowledge'), ring: 'knowledge' },
    { dir: path.join(repoRoot, 'brain', 'feynman'), ring: 'feynman' }
  ];

  const notePaths = [];

  for (const item of folders) {
    if (!fs.existsSync(item.dir)) continue;

    function walkDir(currentPath) {
      const files = fs.readdirSync(currentPath);
      for (const file of files) {
        const fullPath = path.join(currentPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (file.endsWith('.md') && file !== 'README.md') {
          notePaths.push({ path: fullPath, ring: item.ring });
        }
      }
    }
    walkDir(item.dir);
  }

  // Process and sanitize notes
  for (const note of notePaths) {
    const content = fs.readFileSync(note.path, 'utf-8');
    const basename = path.basename(note.path);
    const check = sanitizeContent(content, basename);

    if (!check.clean) {
      report.excluded.push({ name: basename, reason: check.reason });
      continue;
    }

    const metadata = parseFrontmatter(content);
    const slug = basename.replace('.md', '');
    const noteId = `note-${slug}`;

    publicNodes.push({
      id: noteId,
      label: metadata.title || basename.replace('.md', ''),
      type: note.ring === 'feynman' ? 'feynman' : 'knowledge',
      ring: note.ring,
      domain: metadata.domain || 'none',
      confidence: metadata.confidence || 'medium',
      path: `notes/${slug}.md`,
      slug: slug
    });

    // Add domain containment edge
    if (metadata.domain && validDomains.includes(metadata.domain)) {
      publicEdges.push({
        source: `domain-${metadata.domain}`,
        target: noteId,
        type: 'containment'
      });
    }

    filePathsToExport.push({
      source: note.path,
      destName: `notes/${slug}.html`, // will be rendered as html page later
      type: note.ring === 'feynman' ? 'feynman' : 'knowledge',
      id: noteId,
      slug: slug,
      metadata: metadata,
      content: content
    });

    report.exported_count++;
  }

  // Save the public graph index file
  const graphIndex = {
    nodes: publicNodes,
    edges: publicEdges,
    metadata: {
      generated_at: new Date().toISOString(),
      node_count: publicNodes.length,
      edge_count: publicEdges.length
    }
  };

  fs.writeFileSync(path.join(siteDir, 'brain-index.public.json'), JSON.stringify(graphIndex, null, 2));
  console.log(`Saved public index to site/brain-index.public.json with ${publicNodes.length} nodes and ${publicEdges.length} connections.`);

  // Write report
  const reportContent = `--- VIZIER Public Export Report ---
Date: ${new Date().toISOString()}
Total Exported Notes: ${report.exported_count}
Total Excluded Notes: ${report.excluded.length}

Excluded details:
${report.excluded.map(x => `- ${x.name}: ${x.reason}`).join('\n')}
`;

  fs.writeFileSync(path.join(toolsDir, 'last-export-report.txt'), reportContent);
  console.log(`Saved export report to tools/site-build/last-export-report.txt.`);
  
  return filePathsToExport;
}

if (require.main === module) {
  runExport();
}

module.exports = { runExport, sanitizeContent };
