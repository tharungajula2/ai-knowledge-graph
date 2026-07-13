const fs = require('fs');
const path = require('path');
const readline = require('readline');
const ai = require('./ai/client');

const repoRoot = path.resolve(__dirname, '..');
const curriculumPath = path.join(repoRoot, 'curriculum', 'curriculum.json');
const knowledgeDir = path.join(repoRoot, 'brain', 'knowledge');

// Helper to parse YAML frontmatter
function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return {};
  const lines = fmMatch[1].split('\n');
  const meta = {};
  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      meta[key] = val;
    }
  }
  return meta;
}

function updateFrontmatterLinks(content, targetId) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return content;
  
  let fmContent = fmMatch[1];
  let currentLinks = [];
  
  const linksMatch = fmContent.match(/links:\s*\[(.*?)\]/);
  if (linksMatch) {
    currentLinks = linksMatch[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    if (!currentLinks.includes(targetId)) {
      currentLinks.push(targetId);
    }
    const newLinksStr = `links: [${currentLinks.map(s => `"${s}"`).join(', ')}]`;
    fmContent = fmContent.replace(/links:\s*\[.*?\]/, newLinksStr);
  } else {
    // If not matching single line links: [..], check if it's there at all
    if (fmContent.match(/links:/)) {
      fmContent = fmContent.replace(/links:\s*[^\r\n]+/g, `links: ["${targetId}"]`);
    } else {
      fmContent += `\nlinks: ["${targetId}"]`;
    }
  }
  
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---\n${fmContent.trim()}\n---`);
}

async function run() {
  const argNodeId = process.argv[2];
  if (!argNodeId) {
    console.error('Usage: node tools/suggest-links.js <node-id>');
    process.exit(1);
  }

  // Find note path
  let notePath = null;
  let noteDomain = null;
  
  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name === `${argNodeId}.md`) {
        notePath = fullPath;
        noteDomain = path.basename(dir);
        break;
      }
    }
  }

  if (fs.existsSync(knowledgeDir)) {
    scan(knowledgeDir);
  }

  if (!notePath) {
    console.error(`Error: Could not find note file for ID "${argNodeId}" under ${knowledgeDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(curriculumPath)) {
    console.error(`Error: curriculum.json not found.`);
    process.exit(1);
  }

  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
  const nodes = curriculum.nodes || [];
  const otherNodes = nodes.filter(n => n.id !== argNodeId);

  const noteContent = fs.readFileSync(notePath, 'utf-8');

  console.log(`\n🧠 Suggesting links for note: ${argNodeId}...`);

  const prompt = `You are a linker engine for VIZIER's curriculum node graph.
We just finished study note "${argNodeId}". Below is its content:
---
${noteContent}
---

Here is a list of other nodes currently in the graph:
${JSON.stringify(otherNodes.map(n => ({ id: n.id, title: n.title, domain: n.domain })), null, 2)}

Task:
Analyze the note content and propose 3-7 outgoing connections (edges) from "${argNodeId}" to other existing nodes that are conceptually related or represent logical follow-ups / prerequisites.
Provide a one-line reason for each link.
Output strictly a JSON object conforming to the schema:
{
  "proposed_links": [
    {
      "target_id": "other-node-id",
      "reason": "why these are related"
    }
  ]
}`;

  try {
    const result = await ai.generate(prompt, true);
    const proposed = result.proposed_links || [];
    
    if (proposed.length === 0) {
      console.log('No link suggestions returned.');
      process.exit(0);
    }

    console.log(`\n🔗 Proposed link edges from "${argNodeId}":`);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    let index = 0;
    let modifiedContent = noteContent;
    let countApproved = 0;

    function askNextLink() {
      if (index < proposed.length) {
        const prop = proposed[index];
        rl.question(`👉 Link [${argNodeId}] -> [${prop.target_id}]? \n   Reason: ${prop.reason}\n   Approve? (y/n): `, (ans) => {
          if (ans.trim().toLowerCase() === 'y') {
            modifiedContent = updateFrontmatterLinks(modifiedContent, prop.target_id);
            countApproved++;
          }
          index++;
          console.log('');
          askNextLink();
        });
      } else {
        rl.close();
        if (countApproved > 0) {
          fs.writeFileSync(notePath, modifiedContent, 'utf-8');
          console.log(`✅ Saved ${countApproved} approved link(s) to ${path.relative(repoRoot, notePath)} frontmatter.`);
        } else {
          console.log('No links were approved.');
        }
        process.exit(0);
      }
    }

    askNextLink();
  } catch (err) {
    console.error('❌ Failed to get link suggestions:', err.message);
    process.exit(1);
  }
}

// Only execute automatically if run directly
if (require.main === module) {
  run();
}

module.exports = {
  suggestLinksForNode: async (nodeId, notePath) => {
    // Programmatic helper to run without command line parsing
    const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    const nodes = curriculum.nodes || [];
    const otherNodes = nodes.filter(n => n.id !== nodeId);
    const noteContent = fs.readFileSync(notePath, 'utf-8');
    
    const prompt = `You are a linker engine for VIZIER's curriculum node graph.
We just finished study note "${nodeId}". Below is its content:
---
${noteContent}
---

Here is a list of other nodes currently in the graph:
${JSON.stringify(otherNodes.map(n => ({ id: n.id, title: n.title, domain: n.domain })), null, 2)}

Task:
Analyze the note content and propose 3-7 outgoing connections (edges) from "${nodeId}" to other existing nodes that are conceptually related or represent logical follow-ups / prerequisites.
Provide a one-line reason for each link.
Output strictly a JSON object conforming to the schema:
{
  "proposed_links": [
    {
      "target_id": "other-node-id",
      "reason": "why these are related"
    }
  ]
}`;

    const result = await ai.generate(prompt, true);
    return result.proposed_links || [];
  },
  updateFrontmatterLinks
};
