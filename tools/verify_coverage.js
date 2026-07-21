const fs = require('fs');
const path = require('path');

const curriculumContent = fs.readFileSync('CURRICULUM_FULL.md', 'utf8');
const nodeMap = {};
curriculumContent.split(/\r?\n/).forEach(line => {
  const nodeMatch = line.trim().match(/^- ([a-zA-Z0-9-]+) — (.*?)\s*\((concept|build|deep-dive|synthesis|capstone|frontier) · (S|M|L)\)/);
  if (nodeMatch) {
    nodeMap[nodeMatch[1].trim()] = { id: nodeMatch[1].trim(), title: nodeMatch[2].trim() };
  }
});

const volumeFiles = fs.readdirSync('source-volumes').filter(f => f.endsWith('.md')).sort();
const mappedNodes = new Set();
const chapterCountPerNode = {};
let totalChapters = 0;

volumeFiles.forEach(file => {
  const content = fs.readFileSync(path.join('source-volumes', file), 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach(l => {
    const nodeMatch = l.match(/\*\*Node:\*\*\s*`?([a-zA-Z0-9-]+)`?/);
    if (nodeMatch && nodeMatch[1]) {
      const id = nodeMatch[1].trim();
      mappedNodes.add(id);
      chapterCountPerNode[id] = (chapterCountPerNode[id] || 0) + 1;
      totalChapters++;
    }
  });
});

console.log('Total curriculum nodes in CURRICULUM_FULL.md:', Object.keys(nodeMap).length);
console.log('Total chapters in source-volumes:', totalChapters);
console.log('Unique mapped nodes count:', mappedNodes.size);

const ghostNodes = Object.keys(nodeMap).filter(id => !mappedNodes.has(id));
console.log('Ghost nodes (no chapter):', ghostNodes.length, ghostNodes);

const multiChapterNodes = Object.keys(chapterCountPerNode).filter(id => chapterCountPerNode[id] > 1);
console.log('Nodes with multiple chapters:', multiChapterNodes.length, multiChapterNodes);
