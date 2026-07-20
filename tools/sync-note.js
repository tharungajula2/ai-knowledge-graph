#!/usr/bin/env node
/**
 * tools/sync-note.js
 * Automated Vizier Note Sync & Deployment Tool
 *
 * Usage:
 *   npm run sync
 *   npm run sync -- <node-id>
 *   npm run sync -- <node-id> --lit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const notesDir = path.join(repoRoot, 'notes');

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Helper to index all note files in notes/ recursively
function findNoteFile(nodeId) {
  let foundPath = null;
  function walk(dir) {
    if (!fs.existsSync(dir) || foundPath) return;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.md')) {
        const content = fs.readFileSync(full, 'utf-8');
        const match = content.match(/^id:\s*(.+)$/m);
        const cleanBasename = path.basename(entry, '.md').replace(/^\d{2}-\d{2}-/, '');
        const id = match ? match[1].trim().replace(/^["']|["']$/g, '') : cleanBasename;
        if (id === nodeId || cleanBasename === nodeId) {
          foundPath = full;
          return;
        }
      }
    }
  }
  walk(notesDir);
  return foundPath;
}

// Find all modified markdown files in git status
function getGitModifiedNotes() {
  try {
    const statusOutput = execSync('git status --porcelain', { cwd: repoRoot }).toString();
    const lines = statusOutput.split('\n');
    const modifiedFiles = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const filePart = trimmed.substring(3).trim();
      if (filePart.includes('notes/') && filePart.endsWith('.md')) {
        const fullPath = path.resolve(repoRoot, filePart);
        if (fs.existsSync(fullPath)) {
          modifiedFiles.push(fullPath);
        }
      }
    }
    return modifiedFiles;
  } catch (e) {
    return [];
  }
}

function updateFrontmatter(filePath, forceLit = false, forceCharging = false) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const today = getTodayStr();

  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return { updated: false, id: null, domain: 'curriculum', status: 'dark' };

  let fmText = fmMatch[1];
  const meta = {};
  fmText.split(/\r?\n/).forEach(line => {
    const kv = line.split(':');
    if (kv.length >= 2) {
      meta[kv[0].trim()] = kv.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
    }
  });

  const nodeId = meta.id || path.basename(filePath, '.md').replace(/^\d{2}-\d{2}-/, '');
  const domain = meta.domain || 'curriculum';
  let currentStatus = (meta.status || 'dark').toLowerCase();

  // Determine target status
  if (forceLit) {
    currentStatus = 'lit';
  } else if (forceCharging) {
    currentStatus = 'charging';
  } else if (currentStatus === 'dark' || currentStatus === 'ghost') {
    currentStatus = 'charging';
  }

  // Update frontmatter keys
  let newFmText = fmText;

  // status
  if (/status:/.test(newFmText)) {
    newFmText = newFmText.replace(/status:\s*[^\r\n]+/g, `status: ${currentStatus}`);
  } else {
    newFmText += `\nstatus: ${currentStatus}`;
  }

  // updated
  if (/updated:/.test(newFmText)) {
    newFmText = newFmText.replace(/updated:\s*[^\r\n]+/g, `updated: ${today}`);
  } else {
    newFmText += `\nupdated: ${today}`;
  }

  // revisions
  const revCount = meta.revisions ? parseInt(meta.revisions, 10) + 1 : 1;
  if (/revisions:/.test(newFmText)) {
    newFmText = newFmText.replace(/revisions:\s*[^\r\n]+/g, `revisions: ${revCount}`);
  } else {
    newFmText += `\nrevisions: ${revCount}`;
  }

  // Handle lit specifics
  if (currentStatus === 'lit' || currentStatus === 'learned') {
    if (/completed:/.test(newFmText)) {
      newFmText = newFmText.replace(/completed:\s*[^\r\n]+/g, `completed: ${today}`);
    } else {
      newFmText += `\ncompleted: ${today}`;
    }

    if (/lit_date:/.test(newFmText)) {
      newFmText = newFmText.replace(/lit_date:\s*[^\r\n]+/g, `lit_date: ${today}`);
    } else {
      newFmText += `\nlit_date: ${today}`;
    }

    if (/version:/.test(newFmText)) {
      newFmText = newFmText.replace(/version:\s*[^\r\n]+/g, `version: 1.0.0`);
    } else {
      newFmText += `\nversion: 1.0.0`;
    }
  } else if (currentStatus === 'charging') {
    if (/version:/.test(newFmText) && meta.version === '0.1.0') {
      newFmText = newFmText.replace(/version:\s*[^\r\n]+/g, `version: 0.2.0`);
    }
  }

  const newContent = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---\n${newFmText.trim()}\n---`);
  fs.writeFileSync(filePath, newContent, 'utf-8');

  return { updated: true, id: nodeId, domain, status: currentStatus, filePath };
}

function main() {
  console.log('⚡ === Vizier One-Command Note Sync & Deployment Tool ===\n');

  const args = process.argv.slice(2);
  const isLitFlag = args.includes('--lit');
  const isChargingFlag = args.includes('--charging');
  const targetIdArg = args.find(a => !a.startsWith('--'));

  let targetFiles = [];

  if (targetIdArg) {
    const file = findNoteFile(targetIdArg);
    if (!file) {
      console.error(`❌ Error: Note file for node ID "${targetIdArg}" not found.`);
      process.exit(1);
    }
    targetFiles.push(file);
  } else {
    targetFiles = getGitModifiedNotes();
  }

  if (targetFiles.length === 0) {
    console.log('ℹ️ No modified note files detected in git status.');
    console.log('   To sync a specific node, run: npm run sync -- <node-id>');
    console.log('   Or edit any note file in notes/ and run npm run sync again.\n');
  } else {
    console.log(`📝 Processing ${targetFiles.length} note file(s):`);
    targetFiles.forEach(f => console.log(`   - ${path.relative(repoRoot, f)}`));
    console.log('');
  }

  // 1. Update frontmatter & dates for target files
  const updatedNodes = [];
  for (const filePath of targetFiles) {
    const res = updateFrontmatter(filePath, isLitFlag, isChargingFlag);
    if (res.updated) {
      updatedNodes.push(res);
      console.log(`✅ Updated metadata for [${res.id}] -> status: ${res.status}`);
    }
  }

  // 2. Run build-brain
  console.log('\n🛠️ Building Vizier brain database...');
  try {
    execSync('npm run build-brain', { cwd: repoRoot, stdio: 'inherit' });
    console.log('✅ Build PASSED cleanly.');
  } catch (err) {
    console.error('\n❌ BUILD FAILED! Fix the error above and try again.');
    process.exit(1);
  }

  // 3. Git commit & push
  console.log('\n🚀 Committing and pushing to GitHub...');
  try {
    execSync('git add .', { cwd: repoRoot, stdio: 'inherit' });

    let commitMsg = 'learn(curriculum): update notes and sync brain';
    if (updatedNodes.length === 1) {
      const n = updatedNodes[0];
      commitMsg = `learn(${n.domain}): ${n.status === 'lit' ? 'light' : 'update'} ${n.id}`;
    } else if (updatedNodes.length > 1) {
      commitMsg = `learn: sync ${updatedNodes.length} notes (${updatedNodes.map(n => n.id).join(', ')})`;
    }

    execSync(`git commit -m "${commitMsg}"`, { cwd: repoRoot, stdio: 'inherit' });
    console.log(`✅ Git commit created: "${commitMsg}"`);

    execSync('git push origin main', { cwd: repoRoot, stdio: 'inherit' });
    console.log('\n🎉 PUSHED TO GITHUB SUCCESSFULLY! Live app deploying on Vercel.');
  } catch (err) {
    console.warn('⚠️ Git commit/push skipped or no changes to commit:', err.message);
  }
}

main();
