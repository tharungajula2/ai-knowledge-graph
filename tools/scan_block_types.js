const fs = require('fs');
const path = require('path');

function scanNotes(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      files.push(...scanNotes(full));
    } else if (entry.endsWith('.md') && entry !== 'TEMPLATE.md') {
      files.push(full);
    }
  }
  return files;
}

const noteFiles = scanNotes('notes');
const fences = {};
const tracebacks = [];
const mentalTraces = [];
const terminals = [];
const outputs = [];
const pythons = [];

noteFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  
  lines.forEach((l, idx) => {
    if (l.trim().startsWith('```')) {
      const tag = l.trim().substring(3).trim();
      fences[tag] = (fences[tag] || 0) + 1;
      if (tag === 'bash' || tag === 'sh' || tag === 'shell' || tag === 'terminal') terminals.push(file);
      if (tag === 'output' || tag === 'stdout') outputs.push(file);
      if (tag === 'error' || tag === 'traceback') tracebacks.push(file);
      if (tag === 'python' || tag === 'py') pythons.push(file);
    }
    if (l.includes('Traceback (most recent call last):') || /^[A-Z]\w*Error:/.test(l)) {
      tracebacks.push(file);
    }
    if (l.toLowerCase().includes('mental trace')) {
      mentalTraces.push(file);
    }
  });
});

console.log('Code fence tags count:', fences);
console.log('Python notes count:', pythons.length, 'sample:', pythons[0]);
console.log('Terminal notes count:', terminals.length, 'sample:', terminals[0]);
console.log('Output notes count:', outputs.length, 'sample:', outputs[0]);
console.log('Traceback notes count:', tracebacks.length, 'sample:', tracebacks[0]);
console.log('Mental Trace notes count:', mentalTraces.length, 'sample:', mentalTraces[0]);
