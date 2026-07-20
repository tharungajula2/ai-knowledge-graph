const fs = require('fs');
const path = require('path');
const { compileCurriculum } = require('./compile-curriculum.js');

const repoRoot = path.join(__dirname, '../..');
const siteDir = path.join(repoRoot, 'site');
const notesDir = path.join(siteDir, 'notes');
const assetsDir = path.join(siteDir, 'assets');

// Ensure output dirs exist
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Write site/config.json if not present
const configPath = path.join(siteDir, 'config.json');
let siteConfig = { start_date: null, canonical_url: '' };
if (fs.existsSync(configPath)) {
  try {
    siteConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (e) {
    // Ignore and write default
  }
}
fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2));

// Calculate Day N
function getDayNumber(startDateStr) {
  const start = new Date(startDateStr);
  const today = new Date();
  const diffTime = today - start;
  if (diffTime < 0) return 1;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}
const dayNumber = getDayNumber(siteConfig.start_date);

// Helper to convert Markdown to clean HTML (without external heavy libraries)
function simpleMarkdownToHtml(md, domain) {
  let html = md;

  // Clean frontmatter
  html = html.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');

  // Code blocks: ```js ... ```
  const codeBlocks = [];
  html = html.replace(/```(\w*)\r?\n([\s\S]*?)\r?\n```/g, (match, lang, code) => {
    const cleanLang = (lang || 'text').toLowerCase();
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang">${cleanLang}</span>
          <button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>
        </div>
        <pre><code class="language-${cleanLang}">${escapedCode.trim()}</code></pre>
      </div>`
    );
    return `___CODE_BLOCK_${idx}___`;
  });

  // Escape remaining basic HTML tags to prevent XSS / formatting corruption
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore allowed basic comments
  html = html.replace(/&lt;!--([\s\S]*?)--&gt;/g, '<!--$1-->');

  // Blockquotes: > quote
  html = html.replace(/^\s*&gt;\s+(.*)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules: --- or ***
  html = html.replace(/^\s*(---|\*\*\*|___)\s*$/gm, '<hr>');

  // Headers: # Header, ## Header, ### Header, #### Header
  html = html.replace(/^\s*#\s+(.*)$/gm, (match, p1) => {
    const cleanId = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h1 id="${cleanId}">${p1}</h1>`;
  });
  html = html.replace(/^\s*##\s+(.*)$/gm, (match, p1) => {
    const cleanId = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (p1.toLowerCase().includes('where this could be wrong') || p1.toLowerCase().includes('debated')) {
      return `<h2 id="${cleanId}" class="section-challenged">${p1}</h2>`;
    }
    return `<h2 id="${cleanId}">${p1}</h2>`;
  });
  html = html.replace(/^\s*###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^\s*####\s+(.*)$/gm, '<h4>$1</h4>');

  // Task lists
  html = html.replace(/^\s*-\s+\[ \]\s+(.*)$/gm, '<li class="task-list-item"><input type="checkbox" disabled /> <span>$1</span></li>');
  html = html.replace(/^\s*-\s+\[[xX]\]\s+(.*)$/gm, '<li class="task-list-item task-checked"><input type="checkbox" checked disabled /> <span>$1</span></li>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Double bracket wiki-links: [[note-slug]] or [[note-slug|Display Label]]
  html = html.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
    const rawContent = p1.replace(/&amp;/g, '&');
    const parts = rawContent.split('|');
    const slug = parts[0].trim().toLowerCase().replace(/\s+/g, '-');
    const label = parts[1] ? parts[1].trim() : parts[0].trim();
    return `<a class="wiki-link" data-node-id="${slug}" href="${slug}.html">${label}</a>`;
  });

  // Standard markdown links: [label](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Table rendering (GFM markdown tables)
  const lines = html.split(/\r?\n/);
  let inTable = false;
  let tableHeader = [];
  let tableRows = [];
  let processedLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else if (cells.every(c => /^:?-+:?$/.test(c))) {
        // Alignment divider line, ignore
      } else {
        tableRows.push(cells);
      }
    } else {
      if (inTable) {
        processedLines.push(buildTableHtml(tableHeader, tableRows));
        inTable = false;
        tableHeader = [];
        tableRows = [];
      }
      processedLines.push(line);
    }
  }
  if (inTable) {
    processedLines.push(buildTableHtml(tableHeader, tableRows));
  }
  html = processedLines.join('\n');

  // Lists & Paragraphs handling
  const listLines = html.split(/\r?\n/);
  let inList = false;
  let finalLines = [];

  for (let line of listLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') && !trimmed.includes('task-list-item')) {
      if (!inList) {
        finalLines.push('<ul>');
        inList = true;
      }
      finalLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList && !trimmed.includes('task-list-item')) {
        finalLines.push('</ul>');
        inList = false;
      }
      if (trimmed.length > 0 && 
          !trimmed.startsWith('<h') && 
          !trimmed.startsWith('<pre') && 
          !trimmed.startsWith('<code') && 
          !trimmed.startsWith('<div') && 
          !trimmed.startsWith('<block') && 
          !trimmed.startsWith('<hr') &&
          !trimmed.startsWith('<tr') &&
          !trimmed.startsWith('<td') &&
          !trimmed.startsWith('<th') &&
          !trimmed.startsWith('<table') &&
          !trimmed.startsWith('&lt;!--') && 
          !trimmed.startsWith('<!--') &&
          !trimmed.startsWith('___CODE_BLOCK_')) {
        finalLines.push(`<p>${trimmed}</p>`);
      } else {
        finalLines.push(line);
      }
    }
  }
  if (inList) {
    finalLines.push('</ul>');
  }

  html = finalLines.join('\n');

  // Restore Code Blocks
  codeBlocks.forEach((cb, idx) => {
    html = html.replace(`___CODE_BLOCK_${idx}___`, cb);
  });

  return html;
}

function buildTableHtml(header, rows) {
  const ths = header.map(h => `<th>${h}</th>`).join('');
  const trs = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
  return `<div class="table-wrapper"><table class="md-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
}

// 2. Generate CSS style sheet (assets/style.css)
const styleCss = `
:root {
  --bg-color: #0b0f12;
  --panel-bg: rgba(15, 23, 30, 0.75);
  --panel-border: rgba(42, 127, 127, 0.25);
  --accent-teal: #2a7f7f;
  --accent-bright: #3ee2e2;
  --text-main: #e2e8f0;
  --text-muted: #94a3b8;
  --text-dark: #64748b;
}

body {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

/* Gridlines Layout */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(42, 127, 127, 0.04) 1px, transparent 0);
  background-size: 20px 20px;
}

header {
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-bright);
}

.day-badge {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(42, 127, 127, 0.2);
  border: 1px solid var(--accent-teal);
  padding: 4px 10px;
  border-radius: 4px;
}

nav {
  margin: 10px 0;
  display: flex;
  gap: 16px;
}

nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--accent-bright);
}

h1, h2, h3 {
  letter-spacing: -0.02em;
}

h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.metadata-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid var(--panel-border);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--text-muted);
}

p {
  margin-bottom: 20px;
  color: var(--text-main);
}

strong {
  color: #fff;
}

blockquote {
  border-left: 3px solid var(--accent-teal);
  padding-left: 16px;
  margin: 20px 0;
  color: var(--text-muted);
  font-style: italic;
}

pre {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--panel-border);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 24px 0;
}

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

a {
  color: var(--accent-bright);
  text-decoration: none;
  transition: border-bottom 0.2s;
}

a:hover {
  text-decoration: underline;
}

a.wiki-link {
  border-bottom: 1px dashed var(--accent-teal);
}

a.wiki-link:hover {
  border-bottom-style: solid;
  text-decoration: none;
}

/* Styled "Where this could be wrong" heading */
.section-challenged {
  border-left: 3px solid #f6ad55;
  padding-left: 10px;
  color: #f6ad55;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 0.05em;
  margin-top: 32px;
}

.tier-tag {
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(246, 173, 85, 0.15);
  color: #f6ad55;
  border: 1px solid rgba(246, 173, 85, 0.3);
  padding: 1px 4px;
  border-radius: 3px;
  margin-left: 6px;
}

.clinician-footer {
  margin-top: 40px;
  border-top: 1px dashed var(--panel-border);
  padding-top: 16px;
  font-size: 0.8rem;
  color: var(--text-dark);
  font-style: italic;
}

.back-btn {
  display: inline-block;
  margin-bottom: 24px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.feed-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px 0;
}

.feed-item a {
  font-size: 1.1rem;
  font-weight: 600;
}

.feed-item .date {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 4px;
}
`;
fs.writeFileSync(path.join(assetsDir, 'style.css'), styleCss);

// 3. Main runner
function buildSite() {
  console.log('--- Rebuilding Static Site Pages ---');
  
  // Call exporter first to verify and get files list
  const filesToExport = compileCurriculum();

  // Load universe metadata from curriculum.json
  const curriculumPath = path.join(repoRoot, 'curriculum/curriculum.json');
  let universeObj = { number: 1, codename: "AI ENGINEERING", title: "Universe 01 — AI Engineering Mastery", status: "active", started: null, completed: null };
  if (fs.existsSync(curriculumPath)) {
    try {
      const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
      if (curriculumData.universe) {
        universeObj = curriculumData.universe;
      }
    } catch (e) {
      // ignore
    }
  }

  // Sync to config.json (keep only canonical_url, no public start_date)
  try {
    const configPath = path.join(siteDir, 'config.json');
    let siteConfig = { canonical_url: '' };
    if (fs.existsSync(configPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        siteConfig.canonical_url = existing.canonical_url || '';
      } catch (e) {}
    }
    fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2));
  } catch (e) {}

  let universeBadgeText = `UNIVERSE 01 · AI ENGINEERING`;
  if (universeObj) {
    if (universeObj.status === 'complete') {
      universeBadgeText = `UNIVERSE 01 · COMPLETE`;
    } else {
      const titlePart = universeObj.title.split(' — ')[0].toUpperCase();
      const codePart = universeObj.codename.toUpperCase();
      universeBadgeText = `${titlePart} · ${codePart}`;
    }
  }
  
  // HTML Template Wrapper
  function wrapHtml(title, canonicalUrl, contentHtml) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — VIZIER Living Brain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/style.css">
  ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : ''}
</head>
<body>
  <div class="container">
    <header>
      <a href="../index.html" class="brand">VIZIER</a>
      <div class="day-badge" id="day-badge">${universeBadgeText}</div>
    </header>
    <nav>
      <a href="../index.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg> Brain</a>
    </nav>
    <main style="margin-top: 20px;">
      ${contentHtml}
    </main>
  </div>
  <script>
    fetch('../brain-index.public.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.metadata && data.metadata.universe) {
          const u = data.metadata.universe;
          const badge = document.getElementById('day-badge');
          if (badge) {
            const litCount = data.nodes ? data.nodes.filter(n => n.status === 'lit' && n.type !== 'center' && n.type !== 'domain' && n.type !== 'milestone').length : 0;
            const totalCount = data.metadata.node_count ?? 228;
            if (u.status === 'complete' || litCount === totalCount) {
              badge.textContent = 'UNIVERSE 01 · COMPLETE';
            } else {
              badge.textContent = u.title.split(' — ')[0].toUpperCase() + ' · ' + u.codename.toUpperCase();
            }
          }
        }
      }).catch(() => {});
  </script>
</body>
</html>`;
  }

  const feedItems = [];

  // 4. Render Note Pages & Write Raw Sanitized Markdown
  for (const file of filesToExport) {
    if (file.type === 'center') {
      // VIZIER.md center note
      fs.writeFileSync(path.join(siteDir, 'VIZIER.md'), file.content);
      continue;
    }

    const noteSlug = file.slug;
    const noteMeta = file.metadata;
    const cleanContent = file.content.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
    
    // Write sanitized raw markdown for D3 sidebar previews
    fs.writeFileSync(path.join(notesDir, `${noteSlug}.md`), cleanContent);
    
    // Convert to HTML
    const noteBodyHtml = simpleMarkdownToHtml(file.content, noteMeta.domain);
    const dateStr = noteMeta.modified || new Date().toISOString();
    
    const notePageHtml = wrapHtml(
      noteMeta.title || noteSlug,
      siteConfig.canonical_url ? `${siteConfig.canonical_url}/notes/${noteSlug}.html` : '',
      `
      <a href="../index.html" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12" style="margin-right:4px;"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Brain
      </a>
      <article>
        <h1>${noteMeta.title || noteSlug}</h1>
        <div class="metadata-row">
          <span class="tag status-badge status-${(noteMeta.status || 'dark').toLowerCase()}">${(noteMeta.status || 'dark').toUpperCase()}</span>
          <span class="tag">Domain: ${noteMeta.domain || 'none'}</span>
          <span class="tag">v${noteMeta.version || '0.1.0'}</span>
          <span class="tag">Updated: ${noteMeta.updated || '2026-07-20'}</span>
          <span class="tag">Revisions: ${noteMeta.revisions !== undefined ? noteMeta.revisions : 0}</span>
          ${noteMeta.status === 'lit' && noteMeta.lit_date ? `<span class="tag lit-date-badge">Lit on ${noteMeta.lit_date}</span>` : ''}
        </div>
        <div class="note-body">
          ${noteBodyHtml}
        </div>
      </article>
      `
    );

    fs.writeFileSync(path.join(notesDir, `${noteSlug}.html`), notePageHtml);
    
    feedItems.push({
      title: noteMeta.title || noteSlug,
      slug: noteSlug,
      domain: noteMeta.domain || 'none',
      date: new Date(dateStr)
    });
  }

  console.log('--- Static Site Build Completed successfully! ---');
}

if (require.main === module) {
  buildSite();
}

module.exports = { buildSite };
