const fs = require('fs');
const path = require('path');

const curriculumContent = fs.readFileSync('CURRICULUM_FULL.md', 'utf8');
const nodeMap = {};
const domainList = [];
let currentDomain = null;

curriculumContent.split(/\r?\n/).forEach(line => {
  const domMatch = line.match(/^## DOMAIN\s+(\d+)\s+—\s+(.*?)\s*·\s*ring:\s*`?([\w-]+)`?/i);
  if (domMatch) {
    currentDomain = {
      num: parseInt(domMatch[1], 10),
      title: domMatch[2].trim(),
      ring: domMatch[3].trim(),
      nodes: []
    };
    domainList.push(currentDomain);
  }
  if (currentDomain && line.trim().startsWith('- ')) {
    const nodeMatch = line.trim().match(/^- ([a-zA-Z0-9-]+) — (.*?)\s*\((concept|build|deep-dive|synthesis|capstone|frontier) · (S|M|L)\)(?::\s*(.*))?/);
    if (nodeMatch) {
      const id = nodeMatch[1].trim();
      const title = nodeMatch[2].trim();
      const type = nodeMatch[3].trim();
      const size = nodeMatch[4].trim();
      const summary = (nodeMatch[5] || '').trim();
      const nodeObj = {
        id,
        title,
        type,
        size,
        summary,
        ring: currentDomain.ring,
        domainNum: currentDomain.num,
        domainTitle: currentDomain.title
      };
      nodeMap[id] = nodeObj;
      currentDomain.nodes.push(nodeObj);
    }
  }
});

console.log(`Parsed ${Object.keys(nodeMap).length} nodes across ${domainList.length} domains from CURRICULUM_FULL.md.`);

// Check all 10 volumes
const volumeFiles = fs.readdirSync('source-volumes').filter(f => f.endsWith('.md')).sort();
const mappedChapters = [];
const unmappedChapters = [];
const mappedNodeIds = new Set();

volumeFiles.forEach(file => {
  const content = fs.readFileSync(path.join('source-volumes', file), 'utf8');
  const lines = content.split(/\r?\n/);
  
  let currentChapter = null;
  const chapters = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## Chapter') || line.startsWith('# Chapter') || line.startsWith('## CHAPTER')) {
      if (currentChapter) chapters.push(currentChapter);
      currentChapter = { header: line, lines: [], startLine: i + 1 };
    } else if (currentChapter) {
      currentChapter.lines.push(line);
    }
  }
  if (currentChapter) chapters.push(currentChapter);

  chapters.forEach((ch, idx) => {
    const text = ch.lines.join('\n');
    // Try to find Node: `node-id`
    const nodeMatch = text.match(/\*\*Node:\*\*\s*`?([a-zA-Z0-9-]+)`?/);
    const nodeId = nodeMatch ? nodeMatch[1] : null;
    
    // Also try matching by title if nodeId not found or double checking
    const chapTitleMatch = ch.header.match(/^##\s*Chapter\s*\d+\s*—\s*(.*)/i);
    const chapTitle = chapTitleMatch ? chapTitleMatch[1].trim() : ch.header;

    if (nodeId && nodeMap[nodeId]) {
      mappedChapters.push({
        volume: file,
        chapterHeader: ch.header,
        chapterTitle: chapTitle,
        nodeId: nodeId,
        nodeInfo: nodeMap[nodeId],
        lineCount: ch.lines.length
      });
      mappedNodeIds.add(nodeId);
    } else {
      unmappedChapters.push({
        volume: file,
        chapterHeader: ch.header,
        chapterTitle: chapTitle,
        nodeId: nodeId
      });
    }
  });
});

const unmappedNodes = Object.keys(nodeMap).filter(id => !mappedNodeIds.has(id));

console.log(`Mapped chapters: ${mappedChapters.length}`);
console.log(`Unmapped chapters: ${unmappedChapters.length}`);
console.log(`Unmapped nodes: ${unmappedNodes.length}`);

if (unmappedChapters.length > 0) {
  console.log('\nUnmapped Chapters:');
  console.log(unmappedChapters);
}

if (unmappedNodes.length > 0) {
  console.log('\nUnmapped Nodes:');
  console.log(unmappedNodes);
}
