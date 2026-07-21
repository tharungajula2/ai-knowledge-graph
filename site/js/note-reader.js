// ── Vizier Note Reader Engine ──────────────────────────────────────────────

// Global helper for escaping HTML in code block renderer
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Native 1-Pass Syntax Tokenizers (Zero Double-Escaping Leaks) ─────────────
function highlightPythonCode(rawCodeText) {
  if (!rawCodeText) return '';
  let esc = String(rawCodeText)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const tokens = [];
  function addTok(cls, content) {
    const idx = tokens.length;
    tokens.push(`<span class="${cls}">${content}</span>`);
    return `___TOK_${idx}___`;
  }

  esc = esc.replace(/(#.*)$/gm, (m) => addTok('tok-comment', m));
  esc = esc.replace(/([fF]?"""[\s\S]*?"""|[fF]?'\\'\\'[\s\S]*?'\\'\\')/g, (m) => addTok('tok-str', m));
  esc = esc.replace(/([fF]?"(?:[^"\\]|\\.)*"|[fF]?'(?:[^'\\]|\\.)*')/g, (m) => addTok('tok-str', m));
  esc = esc.replace(/\b(def|class|return|import|from|if|elif|else|try|except|finally|for|while|in|is|and|or|not|None|True|False|self|async|await|pass|raise|with|as|yield|break|continue|lambda)\b/g, (m) => addTok('tok-kw', m));
  esc = esc.replace(/\b(str|int|float|bool|list|dict|set|tuple|print|len|range|type|isinstance|super|open|any|all|enumerate|zip|map|filter)\b/g, (m) => addTok('tok-builtin', m));
  esc = esc.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, (m, fn) => {
    if (m.startsWith('___TOK_')) return m;
    return addTok('tok-fn', fn) + '(';
  });
  esc = esc.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, (m) => {
    if (m.startsWith('___TOK_')) return m;
    return addTok('tok-type', m);
  });
  esc = esc.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => {
    if (m.startsWith('___TOK_')) return m;
    return addTok('tok-num', m);
  });
  esc = esc.replace(/(-&gt;)/g, (m) => addTok('tok-op', m));

  tokens.forEach((tok, idx) => {
    esc = esc.replace(`___TOK_${idx}___`, tok);
  });

  return esc;
}

function highlightShellCode(rawCodeText) {
  if (!rawCodeText) return '';
  let esc = String(rawCodeText)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const tokens = [];
  function addTok(cls, content) {
    const idx = tokens.length;
    tokens.push(`<span class="${cls}">${content}</span>`);
    return `___TOK_${idx}___`;
  }

  esc = esc.replace(/^(\$\s+)/gm, (m) => addTok('tok-prompt', m));
  esc = esc.replace(/\b(python|git|cd|mkdir|cat|ls|grep|npm|node|pip|curl|wget|echo|export|chmod|touch)\b/g, (m) => addTok('tok-cmd', m));
  esc = esc.replace(/(\s-[a-zA-Z0-9_-]+|\s--[a-zA-Z0-9_-]+)/g, (m) => addTok('tok-flag', m));
  esc = esc.replace(/("[^"]*"|'[^']*')/g, (m) => addTok('tok-str', m));

  tokens.forEach((tok, idx) => {
    esc = esc.replace(`___TOK_${idx}___`, tok);
  });

  return esc;
}

function highlightErrorCode(rawCodeText) {
  if (!rawCodeText) return '';
  let esc = String(rawCodeText)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const tokens = [];
  function addTok(cls, content) {
    const idx = tokens.length;
    tokens.push(`<span class="${cls}">${content}</span>`);
    return `___TOK_${idx}___`;
  }

  esc = esc.replace(/(Traceback \(most recent call last\):)/g, (m) => addTok('tok-tb-header', m));
  esc = esc.replace(/\b([A-Z]\w*Error:|[A-Z]\w*Exception:)/g, (m) => addTok('tok-err-title', m));

  tokens.forEach((tok, idx) => {
    esc = esc.replace(`___TOK_${idx}___`, tok);
  });

  return esc;
}

// Global Copy Code Handler
window.copyCodeBlock = function(btn) {
  const wrapper = btn.closest('.code-block-wrapper');
  if (!wrapper) return;
  const codeEl = wrapper.querySelector('code');
  if (!codeEl) return;
  const codeText = codeEl.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(codeText).then(() => {
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    }).catch(() => {
      fallbackCopy(codeText, btn);
    });
  } else {
    fallbackCopy(codeText, btn);
  }
};

function fallbackCopy(text, btn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  btn.textContent = '✓ Copied!';
  setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
}

// Global Wikilink Handler
window.openNoteReaderById = function(targetId) {
  if (!graphData || !graphData.nodes) return;
  const cleanTarget = targetId.toLowerCase().trim();
  const targetNode = graphData.nodes.find(n => n.id === cleanTarget || (n.slug && n.slug.toLowerCase() === cleanTarget));
  if (targetNode) {
    onNodeClick(new Event('click'), targetNode);
  } else {
    const insp = document.getElementById('insp');
    document.getElementById('node-title').textContent = targetId;
    document.getElementById('node-meta').innerHTML = `<span class="mtag status-badge status-dark">DARK</span>`;
    document.getElementById('node-details').innerHTML = `<span class="gl">ID</span><span class="gv">${targetId}</span>`;
    document.getElementById('node-preview').innerHTML = `
      <div class="dark-note-notice" style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h4 style="color: #f6ad55; margin-top:0; margin-bottom:8px;">⚠️ Node Not Activated</h4>
        <p style="margin:0; color: var(--muted); font-size: 0.85rem;">Node <code>${targetId}</code> has not been authored yet. Content will be available once the note is activated in curriculum.</p>
      </div>`;
    if (insp) insp.classList.add('open');
  }
};

// Configure Marked custom renderer for GFM tables and native block types
if (typeof marked !== 'undefined') {
  const markedRenderer = new marked.Renderer();

  markedRenderer.table = function(header, body) {
    return `<div class="table-wrapper"><table class="md-table"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
  };

  markedRenderer.code = function(code, lang) {
    let rawCode = '';
    let rawLang = lang || 'text';

    if (typeof code === 'object' && code !== null) {
      rawCode = code.text || '';
      rawLang = code.lang || lang || 'text';
    } else {
      rawCode = String(code || '');
    }

    const cleanLang = (rawLang || 'text').toLowerCase().trim();
    const cleanCode = rawCode.trim();

    // 1. Output / Stdout Block
    if (cleanLang === 'output' || cleanLang === 'stdout') {
      return `<div class="code-block-wrapper block-output">
        <div class="code-block-header">
          <span class="code-lang badge-output">OUTPUT</span>
          <button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>
        </div>
        <pre><code class="output-text">${escapeHtml(cleanCode)}</code></pre>
      </div>`;
    }

    // 2. Terminal / Shell Block
    if (cleanLang === 'bash' || cleanLang === 'sh' || cleanLang === 'shell' || cleanLang === 'terminal' || cleanLang === 'console' || cleanCode.startsWith('$ ')) {
      return `<div class="code-block-wrapper block-terminal">
        <div class="code-block-header">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
            <span class="code-lang ml-2">TERMINAL</span>
          </div>
          <button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>
        </div>
        <pre><code class="language-shell">${highlightShellCode(cleanCode)}</code></pre>
      </div>`;
    }

    // 3. Error / Traceback Block
    if (cleanLang === 'traceback' || cleanLang === 'error' || cleanCode.includes('Traceback (most recent call last):') || /^[A-Z]\w*Error:/.test(cleanCode)) {
      return `<div class="code-block-wrapper block-error">
        <div class="code-block-header">
          <span class="code-lang badge-error">ERROR TRACEBACK</span>
          <button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>
        </div>
        <pre><code class="language-error">${highlightErrorCode(cleanCode)}</code></pre>
      </div>`;
    }

    // 4. Default / Python Block
    const highlighted = highlightPythonCode(cleanCode);
    return `<div class="code-block-wrapper block-python">
      <div class="code-block-header">
        <span class="code-lang">${cleanLang || 'python'}</span>
        <button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>
      </div>
      <pre><code class="language-${cleanLang || 'python'}">${highlighted}</code></pre>
    </div>`;
  };

  marked.setOptions({ renderer: markedRenderer });
}

// Reading Progress Bar Scroll Event
document.addEventListener('DOMContentLoaded', () => {
  const inspBody = document.getElementById('insp-body');
  const progressBar = document.getElementById('reading-progress-bar');
  if (inspBody && progressBar) {
    inspBody.addEventListener('scroll', () => {
      const scrollTop = inspBody.scrollTop;
      const scrollHeight = inspBody.scrollHeight - inspBody.clientHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    });
  }
});

function openInspector(d) {
  const insp = document.getElementById('insp');
  const progressBar = document.getElementById('reading-progress-bar');
  if (progressBar) progressBar.style.width = '0%';
  const inspBody = document.getElementById('insp-body');
  if (inspBody) inspBody.scrollTop = 0;

  document.getElementById('node-title').textContent = d.label;
  
  const nodeStatus = (d.status || 'dark').toLowerCase();
  const nodeVersion = d.version || d.plan_version || '0.1.0';
  const nodeUpdated = d.updated || d.completed || d.created || '2026-07-20';
  const nodeRevisions = d.revisions !== undefined ? d.revisions : 0;
  const nodeLitDate = d.lit_date || null;

  const meta = document.getElementById('node-meta');
  const chips = [
    `<span class="mtag status-badge status-${nodeStatus}">${nodeStatus.toUpperCase()}</span>`,
    d.domain ? `<span class="mtag">Domain: ${d.domain}</span>` : '',
    `<span class="mtag">v${nodeVersion}</span>`,
    `<span class="mtag">Updated: ${nodeUpdated}</span>`,
    `<span class="mtag">Revisions: ${nodeRevisions}</span>`,
    (nodeStatus === 'lit' && nodeLitDate) ? `<span class="mtag lit-date-badge">Lit on ${nodeLitDate}</span>` : ''
  ].filter(Boolean);
  meta.innerHTML = chips.join('');
  
  const grid = document.getElementById('node-details');
  const gridItems = [
    ['ID', d.id],
    ['Ring', d.ring || '—'],
    ['Connections', d._conn || 0],
    d.started ? ['Started', d.started] : null,
    d.completed ? ['Completed', d.completed] : null,
    d.tags && d.tags.length ? ['Tags', d.tags.join(', ')] : null
  ].filter(Boolean);
  grid.innerHTML = gridItems.map(([k, v]) =>
    `<span class="gl">${k}</span><span class="gv">${v}</span>`
  ).join('');

  // ── Prerequisites List ──────────────────────────────────────────────────
  const reqsDiv = document.getElementById('node-reqs');
  if (reqsDiv) {
    reqsDiv.innerHTML = '';
    const reqs = d.requires || [];
    if (reqs.length > 0) {
      const title = document.createElement('h4');
      title.innerText = 'Prerequisites';
      reqsDiv.appendChild(title);
      
      const list = document.createElement('div');
      list.className = 'nav-list';
      reqs.forEach(reqId => {
        const reqNode = graphData?.nodes.find(n => n.id === reqId);
        if (reqNode) {
          const item = document.createElement('button');
          item.className = 'nav-item';
          item.innerText = reqNode.label;
          item.addEventListener('click', (e) => {
            onNodeClick(e, reqNode);
          });
          list.appendChild(item);
        }
      });
      reqsDiv.appendChild(list);
    }
  }

  // ── Backlinks List ──────────────────────────────────────────────────────
  const backsDiv = document.getElementById('node-backlinks');
  if (backsDiv) {
    backsDiv.innerHTML = '';
    const requiredBy = graphData?.nodes.filter(n => n.requires && n.requires.includes(d.id)) || [];
    const wikiLinkedBy = graphData?.edges
      .filter(e => e.type === 'wiki-link' && (e.target.id ?? e.target) === d.id)
      .map(e => graphData.nodes.find(n => n.id === (e.source.id ?? e.source)))
      .filter(Boolean) || [];

    const allBacklinks = Array.from(new Map([...requiredBy, ...wikiLinkedBy].map(n => [n.id, n])).values());

    if (allBacklinks.length > 0) {
      const title = document.createElement('h4');
      title.innerText = 'Backlinks';
      backsDiv.appendChild(title);
      
      const list = document.createElement('div');
      list.className = 'nav-list';
      allBacklinks.forEach(bNode => {
        const item = document.createElement('button');
        item.className = 'nav-item';
        item.innerText = bNode.label;
        item.addEventListener('click', (e) => {
          onNodeClick(e, bNode);
        });
        list.appendChild(item);
      });
      backsDiv.appendChild(list);
    }
  }

  document.getElementById('node-preview').innerHTML = '<div style="color:var(--muted); font-size:0.8rem;">Loading note content...</div>';
  const fetchTarget = d.slug || d.id;
  if (fetchTarget) {
    fetch(`notes/${fetchTarget}.md`)
      .then(r => r.ok ? r.text() : null)
      .then(md => {
        if (md) {
          let cleanMd = md;
          let parsedFrontmatter = {};
          if (md.startsWith('---')) {
            const nextIdx = md.indexOf('---', 3);
            if (nextIdx !== -1) {
              const fmContent = md.substring(3, nextIdx);
              cleanMd = md.substring(nextIdx + 3).trim();
              
              const statusMatch = fmContent.match(/^status:\s*([^\r\n]+)/m);
              const versionMatch = fmContent.match(/^version:\s*([^\r\n]+)/m);
              const updatedMatch = fmContent.match(/^updated:\s*([^\r\n]+)/m);
              const revisionsMatch = fmContent.match(/^revisions:\s*([^\r\n]+)/m);
              const litDateMatch = fmContent.match(/^lit_date:\s*([^\r\n]+)/m);
              
              if (statusMatch) parsedFrontmatter.status = statusMatch[1].trim();
              if (versionMatch) parsedFrontmatter.version = versionMatch[1].trim();
              if (updatedMatch) parsedFrontmatter.updated = updatedMatch[1].trim();
              if (revisionsMatch) parsedFrontmatter.revisions = parseInt(revisionsMatch[1].trim(), 10);
              if (litDateMatch) parsedFrontmatter.lit_date = litDateMatch[1].trim() !== 'null' ? litDateMatch[1].trim() : null;
            }
          }

          const finalStatus = (parsedFrontmatter.status || nodeStatus).toLowerCase();
          const finalVersion = parsedFrontmatter.version || nodeVersion;
          const finalUpdated = parsedFrontmatter.updated || nodeUpdated;
          const finalRevisions = parsedFrontmatter.revisions !== undefined ? parsedFrontmatter.revisions : nodeRevisions;
          const finalLitDate = parsedFrontmatter.lit_date || nodeLitDate;

          const updatedChips = [
            `<span class="mtag status-badge status-${finalStatus}">${finalStatus.toUpperCase()}</span>`,
            d.domain ? `<span class="mtag">Domain: ${d.domain}</span>` : '',
            `<span class="mtag">v${finalVersion}</span>`,
            `<span class="mtag">Updated: ${finalUpdated}</span>`,
            `<span class="mtag">Revisions: ${finalRevisions}</span>`,
            (finalStatus === 'lit' && finalLitDate) ? `<span class="mtag lit-date-badge">Lit on ${finalLitDate}</span>` : ''
          ].filter(Boolean);
          document.getElementById('node-meta').innerHTML = updatedChips.join('');

          cleanMd = cleanMd.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
            const rawContent = p1.replace(/&amp;/g, '&');
            const parts = rawContent.split('|');
            const targetId = parts[0].trim().toLowerCase().replace(/\s+/g, '-');
            const label = parts[1] ? parts[1].trim() : parts[0].trim();
            return `<a class="wiki-link" data-node-id="${targetId}" href="javascript:void(0)" onclick="openNoteReaderById('${targetId}')">${label}</a>`;
          });

          const isPlaceholder = cleanMd.includes('PASTE MASTERCLASS NOTE BELOW THIS LINE');
          if (finalStatus === 'dark' || isPlaceholder) {
            const warningBanner = `
              <div class="dark-note-notice" style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15); border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
                <div style="color: #94a3b8; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Status: DARK</div>
                <p style="font-size: 0.82rem; color: var(--muted); margin: 0; line-height: 1.5;">Node note content not yet written. Set status to <code>charging</code> or <code>lit</code> in note frontmatter once masterclass content is pasted.</p>
              </div>`;
            document.getElementById('node-preview').innerHTML = warningBanner + marked.parse(cleanMd);
          } else {
            document.getElementById('node-preview').innerHTML = marked.parse(cleanMd);
          }
        } else {
          document.getElementById('node-preview').innerHTML = '<div style="color:var(--muted); font-size:0.8rem;">No note file available for this node.</div>';
        }
      })
      .catch(() => {
        document.getElementById('node-preview').innerHTML = '<div style="color:var(--muted); font-size:0.8rem;">Note file not found.</div>';
      });
  }
  insp.classList.add('open');
  const sp = document.getElementById('search-panel');
  if (sp) sp.style.display = 'none';
}
