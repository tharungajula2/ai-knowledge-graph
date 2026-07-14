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

  // Escape HTML tags to prevent XSS / formatting corruption
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore allowed basic tags like <!-- comment --> if any
  html = html.replace(/&lt;!--([\s\S]*?)--&gt;/g, '<!--$1-->');

  // Code blocks: ```js ... ```
  html = html.replace(/```(\w*)\r?\n([\s\S]*?)\r?\n```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Blockquotes: > quote
  html = html.replace(/^\s*&gt;\s+(.*)$/gm, '<blockquote>$1</blockquote>');

  // Headers: ## Header, ### Header
  html = html.replace(/^\s*##\s+(.*)$/gm, (match, p1) => {
    const cleanId = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    // Specially style "Where this could be wrong" heading
    if (p1.toLowerCase().includes('where this could be wrong') || p1.toLowerCase().includes('debated')) {
      return `<h2 id="${cleanId}" class="section-challenged">${p1}</h2>`;
    }
    return `<h2 id="${cleanId}">${p1}</h2>`;
  });
  html = html.replace(/^\s*###\s+(.*)$/gm, '<h3>$1</h3>');

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Double bracket wiki-links: [[note-slug]] or [[note-slug|Display Label]]
  html = html.replace(/\[\[([a-zA-Z0-9\s-_#|]+)\]\]/g, (match, p1) => {
    const parts = p1.split('|');
    const slug = parts[0].trim().toLowerCase().replace(/\s+/g, '-');
    const label = parts[1] ? parts[1].trim() : parts[0].trim();
    return `<a class="wiki-link" href="${slug}.html">${label}</a>`;
  });

  // Standard markdown links: [label](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Lists: - bullet
  // Simple paragraph & bullet handling
  const lines = html.split(/\r?\n/);
  let inList = false;
  let finalLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      if (!inList) {
        finalLines.push('<ul>');
        inList = true;
      }
      finalLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        finalLines.push('</ul>');
        inList = false;
      }
      if (trimmed.length > 0 && !trimmed.startsWith('<h') && !trimmed.startsWith('<pre') && !trimmed.startsWith('<code') && !trimmed.startsWith('<block') && !trimmed.startsWith('&lt;!--') && !trimmed.startsWith('<!--')) {
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

  // No auto-footer appended — notes carry their own honest limits section

  return html;
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

  // Load marathon start_date and days from curriculum.json
  const curriculumPath = path.join(repoRoot, 'curriculum/curriculum.json');
  let marathonStartDate = null;
  let marathonDays = 250;
  if (fs.existsSync(curriculumPath)) {
    try {
      const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
      marathonStartDate = curriculumData.marathon ? curriculumData.marathon.start_date : null;
      marathonDays = curriculumData.marathon ? curriculumData.marathon.days || 250 : 250;
    } catch (e) {
      // ignore
    }
  }

  // Sync to config.json
  try {
    const configPath = path.join(siteDir, 'config.json');
    let siteConfig = { start_date: marathonStartDate, canonical_url: '' };
    if (fs.existsSync(configPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        siteConfig.canonical_url = existing.canonical_url || '';
      } catch (e) {}
    }
    siteConfig.start_date = marathonStartDate;
    fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2));
  } catch (e) {}

  let dayBadgeText = 'IGNITION PENDING';
  if (marathonStartDate) {
    const start = new Date(marathonStartDate);
    const today = new Date();
    start.setHours(0,0,0,0); today.setHours(0,0,0,0);
    const diffTime = today - start;
    const dayN = Math.max(1, Math.floor(diffTime / 86400000) + 1);
    dayBadgeText = `DAY ${dayN} OF ${marathonDays}`;
  } else {
    dayBadgeText = `IGNITION PENDING · ${marathonDays}-DAY MARATHON`;
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
      <div class="day-badge">${dayBadgeText}</div>
    </header>
    <nav>
      <a href="../brain.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg> Brain</a>
      <a href="../feed.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg> Feed</a>
      <a href="../capabilities.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Capabilities</a>
      <a href="../about.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> About</a>
    </nav>
    <main style="margin-top: 20px;">
      ${contentHtml}
    </main>
  </div>
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
      <a href="../brain.html" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12" style="margin-right:4px;"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Brain
      </a>
      <article>
        <h1>${noteMeta.title || noteSlug}</h1>
        <div class="metadata-row">
          <span class="tag">Domain: ${noteMeta.domain || 'none'}</span>
          <span class="tag">Confidence: ${noteMeta.confidence || 'medium'}</span>
          <span class="tag">Class: ${noteMeta.note_type || 'note'}</span>
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

  // 5. Generate Feed Page (feed.html)
  // Sort newest first
  feedItems.sort((a, b) => b.date - a.date);
  
  const feedListHtml = feedItems.map(item => `
    <div class="feed-item">
      <a href="notes/${item.slug}.html">${item.title}</a>
      <div class="metadata-row" style="margin-top: 4px; margin-bottom: 0;">
        <span class="tag">Domain: ${item.domain}</span>
      </div>
      <div class="date">Completed: ${item.date.toLocaleDateString()}</div>
    </div>
  `).join('\n');

  const feedPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Latest Feed — VIZIER Living Brain</title>
  <meta name="description" content="Chronological index of published knowledge nodes from the VIZIER living brain.">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="VIZIER — Latest Notes">
  <meta property="og:description" content="Published knowledge nodes from the 250-day AI engineering marathon.">
  <meta property="og:image" content="assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="assets/og-image.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <div class="container">
    <header>
      <a href="./index.html" class="brand">VIZIER</a>
      <div class="day-badge" id="day-badge">${dayBadgeText}</div>
    </header>
    <nav>
      <a href="./index.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Home</a>
      <a href="./brain.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg> Brain</a>
      <a href="./feed.html" class="active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg> Feed</a>
      <a href="./about.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> About</a>
    </nav>
    <main style="margin-top: 20px;">
      <h1>Latest Notes Feed</h1>
      <p style="color: var(--text-muted); margin-bottom: 30px;">Every entry here is a lit node &mdash; genuinely learned, Feynman-tested, locked forever.</p>
      <div class="feed-list" id="feed-list">
        ${feedListHtml || '<p style="color: var(--text-dark)">Nothing yet. The first node lights soon &mdash; watch this space.</p>'}
      </div>
    </main>
    <footer style="margin-top: 60px; border-top: 1px solid var(--panel-border); padding-top: 20px; font-size: 0.8rem; color: var(--text-dark);">
      VIZIER &mdash; built in public &mdash;
      <a href="./index.html" style="color: var(--accent-bright);">Home</a> &nbsp;&middot;&nbsp;
      <a href="./brain.html" style="color: var(--accent-bright);">Brain</a>
    </footer>
  </div>
  <script>
    // Update day badge from marathon metadata
    fetch('brain-index.public.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.metadata && data.metadata.marathon && data.metadata.marathon.start_date) {
          const start = new Date(data.metadata.marathon.start_date);
          const today = new Date();
          start.setHours(0,0,0,0); today.setHours(0,0,0,0);
          const dayN = Math.max(1, Math.floor((today - start) / 86400000) + 1);
          const badge = document.getElementById('day-badge');
          if (badge) badge.textContent = 'DAY ' + dayN + ' OF 250';
        }
      }).catch(() => {});
  </script>
</body>
</html>`;
  fs.writeFileSync(path.join(siteDir, 'feed.html'), feedPageHtml);

  // 6. Generate About Page (about.html)
  const aboutPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — VIZIER Living Brain</title>
  <meta name="description" content="About VIZIER — a living knowledge graph of one human mastering AI engineering in public. 200 planned nodes across 10 domains over a 250-day marathon.">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="VIZIER — About the Brain">
  <meta property="og:description" content="200 planned nodes across 10 domains over a 250-day marathon. The past is locked. The future evolves.">
  <meta property="og:image" content="assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="assets/og-image.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/style.css">
  <style>
    .legend-box { background: var(--panel-bg); border: 1px solid var(--panel-border); border-radius: 8px; padding: 16px; margin: 20px 0; }
    .legend-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .legend-item:last-child { margin-bottom: 0; }
    .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .dot.ghost { background: #475569; box-shadow: 0 0 8px rgba(71,85,105,0.4); }
    .dot.charging { background: #f6ad55; box-shadow: 0 0 12px rgba(246,173,85,0.7); animation: pulse 1.8s infinite ease-in-out; }
    .dot.lit { background: #3ee2e2; box-shadow: 0 0 14px rgba(62,226,226,0.85); }
    @keyframes pulse { 0%, 100% { opacity: 0.6; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.15); } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <a href="./index.html" class="brand">VIZIER</a>
      <div class="day-badge" id="day-badge">${dayBadgeText}</div>
    </header>
    <nav>
      <a href="./index.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Home</a>
      <a href="./brain.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg> Brain</a>
      <a href="./feed.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg> Feed</a>
      <a href="./about.html" class="active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> About</a>
    </nav>
    <main style="margin-top: 20px;">
      <h1>About VIZIER</h1>

      <h2>What is this?</h2>
      <p>This is a living, public knowledge graph representing a personal mastery roadmap. The graph is built around learning nodes, not just passing days, detailing a 250-day marathon to master frontier AI engineering. 200 planned nodes across 10 domains &mdash; each one a concept, build, or synthesis worth genuinely understanding.</p>

      <h2>The Node Protocol</h2>
      <p>A node lights up only when its note contains a Feynman explanation that a 12-year-old could follow, and (for build nodes) an artifact that actually runs. Notes are dynamically wikilinked; the knowledge graph automatically rewires nightly based on their relationships.</p>

      <h2>Immutable Past, Fluid Future</h2>
      <p>Once a node is lit, it is locked forever. Ghost nodes represent planned topics for plan v1.0.0, which can be revised through human-approved replans. Every revision is publicly logged in the repository changelog. Transparency about plan adaptations is a core feature of the system.</p>

      <h2>The Three States</h2>
      <p>The learning roadmap is tracked across three distinct states:</p>
      <div class="legend-box">
        <div class="legend-item">
          <span class="dot ghost"></span>
          <span><strong>Ghost:</strong> Planned knowledge node, currently unlit.</span>
        </div>
        <div class="legend-item">
          <span class="dot charging"></span>
          <span><strong>Charging:</strong> Node is currently in progress, pulsing.</span>
        </div>
        <div class="legend-item">
          <span class="dot lit"></span>
          <span><strong>Lit:</strong> Note is completed, Feynman-tested, and locked forever.</span>
        </div>
      </div>

      <h2 id="milestones">The Frozen Engine</h2>
      <p>Inside the repository sleeps a complete agentic lab system (including supervisor, memory, RAG, approval gate, and injection scanner)&mdash;built agentically, but deliberately frozen. A floating milestone called <strong>THE RESURRECTION</strong> will bring the system back online, deployed manually. Until then, it serves as the master textbook.</p>

      <h2>Honest Limits</h2>
      <p>Streaks are never backfilled. Charging days are shown honestly as charging. The counter tells the truth. The past is locked &mdash; there is no editing history to make the journey look smoother than it was.</p>
    </main>
    <footer style="margin-top: 60px; border-top: 1px solid var(--panel-border); padding-top: 20px; font-size: 0.8rem; color: var(--text-dark);">
      VIZIER &mdash; built in public &mdash;
      <a href="./index.html" style="color: var(--accent-bright);">Home</a> &nbsp;&middot;&nbsp;
      <a href="./brain.html" style="color: var(--accent-bright);">Brain</a> &nbsp;&middot;&nbsp;
      <a href="./feed.html" style="color: var(--accent-bright);">Feed</a>
    </footer>
  </div>
  <script>
    // Update day badge from marathon metadata
    fetch('brain-index.public.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.metadata && data.metadata.marathon && data.metadata.marathon.start_date) {
          const start = new Date(data.metadata.marathon.start_date);
          const today = new Date();
          start.setHours(0,0,0,0); today.setHours(0,0,0,0);
          const dayN = Math.max(1, Math.floor((today - start) / 86400000) + 1);
          const badge = document.getElementById('day-badge');
          if (badge) badge.textContent = 'DAY ' + dayN + ' OF 250';
        }
      }).catch(() => {});
  </script>
</body>
</html>`;
  fs.writeFileSync(path.join(siteDir, 'about.html'), aboutPageHtml);

  // 7. brain.html day chip is now updated client-side from marathon.start_date in brain-index.public.json.
  //    No static injection needed here.
  // feed.html day badge is updated client-side from marathon metadata. No static injection.

  console.log('--- Static Site Build Completed successfully! ---');
}

if (require.main === module) {
  buildSite();
}

module.exports = { buildSite };
