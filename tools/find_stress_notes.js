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
const stats = [];

noteFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const pythonBlocks = (content.match(/```python/g) || []).length;
  const outputBlocks = (content.match(/```output|```stdout/g) || []).length;
  const terminalBlocks = (content.match(/```bash|```sh|```shell|```terminal/g) || []).length;
  const errorBlocks = (content.match(/```traceback|```error|Traceback \(most recent/g) || []).length;
  const mentalTrace = (content.match(/Mental Trace|\[MENTAL TRACE\]/gi) || []).length;
  const codeLines = (content.match(/```/g) || []).length;

  stats.push({
    file,
    id: path.basename(file, '.md'),
    pythonBlocks,
    outputBlocks,
    terminalBlocks,
    errorBlocks,
    mentalTrace,
    codeLines,
    contentLength: content.length
  });
});

console.log('Top Code-Heavy:');
stats.sort((a, b) => b.pythonBlocks - a.pythonBlocks);
stats.slice(0, 3).forEach(s => console.log(s.id, 'pythonBlocks:', s.pythonBlocks, s.file));

console.log('\nTop Output-Heavy:');
stats.sort((a, b) => b.outputBlocks - a.outputBlocks);
stats.slice(0, 3).forEach(s => console.log(s.id, 'outputBlocks:', s.outputBlocks, s.file));

console.log('\nTop Terminal-Heavy:');
stats.sort((a, b) => b.terminalBlocks - a.terminalBlocks);
stats.slice(0, 3).forEach(s => console.log(s.id, 'terminalBlocks:', s.terminalBlocks, s.file));

console.log('\nTop Error-Heavy:');
stats.sort((a, b) => b.errorBlocks - a.errorBlocks);
stats.slice(0, 3).forEach(s => console.log(s.id, 'errorBlocks:', s.errorBlocks, s.file));

console.log('\nMental-Trace / Prose Heavy:');
stats.sort((a, b) => b.mentalTrace - a.mentalTrace);
stats.slice(0, 3).forEach(s => console.log(s.id, 'mentalTrace:', s.mentalTrace, s.file));
