const fs = require('fs');
const path = require('path');

// Include rendering functions identical to build.js / note-reader.js
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

  // Comments
  esc = esc.replace(/(#.*$)/gm, (m) => addTok('tok-comment', m));
  // Multi-line / Single strings
  esc = esc.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/g, (m) => addTok('tok-str', m));
  // Keywords
  esc = esc.replace(/\b(def|class|return|if|else|elif|import|from|as|for|while|try|except|finally|raise|with|async|await|yield|lambda|pass|break|continue|is|in|not|and|or|True|False|None)\b/g, (m) => addTok('tok-kw', m));
  // Builtins
  esc = esc.replace(/\b(print|len|range|enumerate|zip|dict|list|set|tuple|str|int|float|bool|super|type|isinstance|open|map|filter)\b/g, (m) => addTok('tok-builtin', m));
  // Functions
  esc = esc.replace(/\b([a-zA-Z_]\w*)(?=\()/g, (m) => addTok('tok-fn', m));
  // Types / Classes
  esc = esc.replace(/\b([A-Z]\w*)\b/g, (m) => addTok('tok-type', m));
  // Numbers
  esc = esc.replace(/\b(\d+\.?\d*)\b/g, (m) => addTok('tok-num', m));
  // Operators
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
  esc = esc.replace(/\b(python|git|cd|mkdir|cat|ls|grep|npm|node|pip|curl|wget|echo|export|chmod|touch|activate|deactivate|uv)\b/g, (m) => addTok('tok-cmd', m));
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
  esc = esc.replace(/\b([A-Z]\w*Error:|[A-Z]\w*Exception:|[A-Z]\w*Warning:)/g, (m) => addTok('tok-err-title', m));

  tokens.forEach((tok, idx) => {
    esc = esc.replace(`___TOK_${idx}___`, tok);
  });

  return esc;
}

function markdownToHtml(md) {
  let html = md;

  // Clean frontmatter
  html = html.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');

  // Code blocks: ```js ... ```
  const codeBlocks = [];
  html = html.replace(/```(\w*)\r?\n([\s\S]*?)\r?\n```/g, (match, lang, code) => {
    const cleanLang = (lang || 'text').toLowerCase().trim();
    const cleanCode = code.trim();
    let codeHtml = '';
    let blockWrapperClass = 'code-block-wrapper block-python';
    let headerHtml = `<span class="code-lang">${cleanLang || 'python'}</span><button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>`;

    if (cleanLang === 'output' || cleanLang === 'stdout') {
      blockWrapperClass = 'code-block-wrapper block-output';
      headerHtml = `<span class="code-lang badge-output">OUTPUT</span><button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>`;
      codeHtml = `<code class="output-text">${escapeHtml(cleanCode)}</code>`;
    } else if (cleanLang === 'bash' || cleanLang === 'sh' || cleanLang === 'shell' || cleanLang === 'terminal' || cleanCode.startsWith('$ ')) {
      blockWrapperClass = 'code-block-wrapper block-terminal';
      headerHtml = `<div class="terminal-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span><span class="code-lang ml-2">TERMINAL</span></div><button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>`;
      codeHtml = `<code class="language-shell">${highlightShellCode(cleanCode)}</code>`;
    } else if (cleanLang === 'traceback' || cleanLang === 'error' || cleanCode.includes('Traceback (most recent call last):') || /^[A-Z]\w*Error:/.test(cleanCode)) {
      blockWrapperClass = 'code-block-wrapper block-error';
      headerHtml = `<span class="code-lang badge-error">ERROR TRACEBACK</span><button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>`;
      codeHtml = `<code class="language-error">${highlightErrorCode(cleanCode)}</code>`;
    } else {
      blockWrapperClass = 'code-block-wrapper block-python';
      headerHtml = `<span class="code-lang">${cleanLang || 'python'}</span><button class="btn-code-copy" onclick="copyCodeBlock(this)">Copy</button>`;
      codeHtml = `<code class="language-${cleanLang || 'python'}">${highlightPythonCode(cleanCode)}</code>`;
    }

    const idx = codeBlocks.length;
    codeBlocks.push(
      `<div class="${blockWrapperClass}">
        <div class="code-block-header">${headerHtml}</div>
        <pre>${codeHtml}</pre>
      </div>`
    );
    return `___CODE_BLOCK_${idx}___`;
  });

  // Escape basic HTML
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Mental trace blockquotes
  html = html.replace(/^\s*&gt;\s*\*\*(?:Mental Trace|Mental trace|Mental model)\.\*\*\s+(.*)$/gm, (match, body) => {
    return `<div class="block-mental-trace">
      <div class="mental-trace-header"><span class="mental-trace-tag">🧠 MENTAL TRACE</span></div>
      <div class="mental-trace-body">${body}</div>
    </div>`;
  });

  // Blockquotes: > quote
  html = html.replace(/^\s*&gt;\s+(.*)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules: --- or ***
  html = html.replace(/^\s*(---|\*\*\*|___)\s*$/gm, '<hr>');

  // Headers: # Header, ## Header, ### Header, #### Header
  html = html.replace(/^\s*#\s+(.*)$/gm, (match, p1) => `<h1 id="${p1.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${p1}</h1>`);
  html = html.replace(/^\s*##\s+(.*)$/gm, (match, p1) => `<h2 id="${p1.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${p1}</h2>`);
  html = html.replace(/^\s*###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^\s*####\s+(.*)$/gm, '<h4>$1</h4>');

  // Task lists
  html = html.replace(/^\s*[-*+]\s+\[ \]\s+(.*)$/gm, '<li class="task-list-item"><input type="checkbox" disabled /> <span>$1</span></li>');
  html = html.replace(/^\s*[-*+]\s+\[[xX]\]\s+(.*)$/gm, '<li class="task-list-item task-checked"><input type="checkbox" checked disabled /> <span>$1</span></li>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Wiki-links: [[note-slug]]
  html = html.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
    const rawContent = p1.replace(/&amp;/g, '&');
    const parts = rawContent.split('|');
    const slug = parts[0].trim().toLowerCase().replace(/\s+/g, '-');
    const label = parts[1] ? parts[1].trim() : parts[0].trim();
    return `<a class="wiki-link" data-node-id="${slug}" href="#${slug}">${label}</a>`;
  });

  // Paragraphs
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') || trimmed.startsWith('<hr') || trimmed.startsWith('___CODE_BLOCK_')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');

  // Restore Code Blocks
  codeBlocks.forEach((cb, idx) => {
    html = html.replace(`___CODE_BLOCK_${idx}___`, cb);
  });

  return html;
}

// Five test notes to render
const notePaths = [
  { id: 'python-classes-modules', category: 'Code Heavy (Python)', path: 'notes/01-foundations/01-16-python-classes-modules.md' },
  { id: 'python-environments', category: 'Terminal Commands', path: 'notes/01-foundations/01-14-python-environments.md' },
  { id: 'python-data-shapes', category: 'Output & Data Heavy', path: 'notes/01-foundations/01-15-python-data-shapes.md' },
  { id: 'python-async', category: 'Error & Tracebacks', path: 'notes/01-foundations/01-17-python-async.md' },
  { id: 'map-of-ai', category: 'Prose & Mental Trace', path: 'notes/01-foundations/01-01-map-of-ai.md' }
];

const renderedNotes = {};

notePaths.forEach(n => {
  const content = fs.readFileSync(n.path, 'utf8');
  const renderedHtml = markdownToHtml(content);
  
  // Leak check assertions
  const leaks = [];
  if (renderedHtml.includes('class=' + '"' + '"') || renderedHtml.includes('class=undefined')) leaks.push('stray class attribute');
  if (renderedHtml.includes('<span<span') || renderedHtml.includes('&lt;span')) leaks.push('un-escaped span tag');
  if (/```[a-z]*/i.test(renderedHtml)) leaks.push('un-rendered markdown code block');
  
  console.log(`Rendered [${n.id}] (${n.category}): HTML len ${renderedHtml.length}, Leaks: ${leaks.length === 0 ? 'ZERO ✓' : leaks.join(', ')}`);
  
  renderedNotes[n.id] = {
    category: n.category,
    html: renderedHtml,
    rawMd: content
  };
});
