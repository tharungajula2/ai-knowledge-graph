const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const curriculumPath = path.join(repoRoot, 'curriculum', 'curriculum.json');
const knowledgeDir = path.join(repoRoot, 'brain', 'knowledge');

// Helper to parse YAML frontmatter (simplified regex parser)
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

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function run() {
  if (!fs.existsSync(curriculumPath)) {
    console.error(`Error: curriculum.json not found at ${curriculumPath}. Please run a build first.`);
    process.exit(1);
  }

  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
  const nodes = curriculum.nodes || [];

  // Determine current status of all nodes by scanning files
  const nodeStatus = {};
  const activeCharging = [];

  for (const node of nodes) {
    const notePath = path.join(knowledgeDir, node.domain, `${node.id}.md`);
    if (fs.existsSync(notePath)) {
      const content = fs.readFileSync(notePath, 'utf-8');
      const fm = parseFrontmatter(content);
      if (fm.status === 'learned') {
        nodeStatus[node.id] = 'lit';
      } else {
        nodeStatus[node.id] = 'charging';
        activeCharging.push({ node, file: notePath });
      }
    } else {
      nodeStatus[node.id] = 'ghost';
    }
  }

  console.log('\n==================================================');
  console.log('            VIZIER MASTERY RITUAL: NEXT NODE      ');
  console.log('==================================================\n');

  if (activeCharging.length > 0) {
    console.log('⚡ CURRENTLY CHARGING NODES:');
    activeCharging.forEach(({ node, file }) => {
      console.log(`   - [${node.domain.toUpperCase()}] ${node.title} (${node.id})`);
      console.log(`     File: ${path.relative(repoRoot, file)}`);
    });
    console.log('');
  } else {
    console.log('⚡ No nodes currently charging.\n');
  }

  // Find next ghost candidates
  // Prereqs satisfied = all requires are 'lit'
  const candidates = [];
  for (const node of nodes) {
    if (nodeStatus[node.id] === 'ghost') {
      const requires = node.requires || [];
      const satisfied = requires.every(reqId => nodeStatus[reqId] === 'lit');
      if (satisfied) {
        candidates.push(node);
        if (candidates.length >= 3) break; // We only need the 3 best candidates
      }
    }
  }

  if (candidates.length === 0) {
    console.log('🎉 No new candidates found. You have completed the curriculum, or some pre-requisites are missing!');
    process.exit(0);
  }

  console.log('🧭 BEST GHOST CANDIDATES (Prerequisites Satisfied):');
  candidates.forEach((cand, index) => {
    console.log(`   [${index + 1}] [${cand.domain.toUpperCase()}] ${cand.title} (${cand.id})`);
    console.log(`       Prereqs: ${cand.requires.join(', ') || 'None'}`);
    console.log(`       Summary: ${cand.summary || 'No summary available.'}`);
  });
  console.log('');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('👉 Select a candidate to start charging (1-3) or press Enter to continue: ', (answer) => {
    const choice = parseInt(answer.trim(), 10);
    rl.close();

    if (isNaN(choice) || choice < 1 || choice > candidates.length) {
      console.log('\nContinuing without changes. Happy learning!\n');
      process.exit(0);
    }

    const selected = candidates[choice - 1];
    const destPath = path.join(knowledgeDir, selected.domain, `${selected.id}.md`);

    if (fs.existsSync(destPath)) {
      console.log(`\nNote already exists at ${destPath}. Opening...`);
      openFile(destPath);
      return;
    }

    // Create note templates
    const today = getTodayStr();
    const template = `---
id: ${selected.id}
title: "${selected.title}"
domain: ${selected.domain}
cluster: "${selected.cluster}"
status: in-progress
started: ${today}
completed: null
plan_version: 1.0.0
tags: []
links: []
---

# What I learned

# Feynman explanation (to a 12-year-old)

# What I built / tried

# Aha moment

# Frontier check (anything new in the field worth a replan?)

# Wikilinks I noticed
`;

    // Ensure directory exists
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, template, 'utf-8');
    console.log(`\n📝 Created new note at: ${path.relative(repoRoot, destPath)}`);

    // Try to open it
    openFile(destPath);
  });
}

function openFile(filePath) {
  console.log(`Opening file: ${filePath}`);
  // Try VS Code first
  exec(`code "${filePath}"`, (err) => {
    if (err) {
      // Fallback to default system handler
      const cmd = process.platform === 'win32' ? 'start' : 'open';
      exec(`${cmd} "${filePath}"`, (err2) => {
        if (err2) {
          console.log(`Could not open file automatically. Please open it manually in your editor.`);
        }
      });
    }
  });
}

run();
