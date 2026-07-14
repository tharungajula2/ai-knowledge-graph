const fs = require('fs');
const path = require('path');
const readline = require('readline');

const repoRoot = path.resolve(__dirname, '..');
const curriculumDir = path.join(repoRoot, 'curriculum');
const curJsonPath = path.join(curriculumDir, 'curriculum.json');
const universesDir = path.join(repoRoot, 'universes');
const knowledgeDir = path.join(repoRoot, 'brain', 'knowledge');
const universesMdPath = path.join(curriculumDir, 'UNIVERSES.md');

// Helper to recursively copy a folder
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

// Helper to recursively delete a folder
function deleteFolderRecursiveSync(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.readdirSync(targetPath).forEach((file) => {
      const curPath = path.join(targetPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursiveSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(targetPath);
  }
}

// Helper to move folder
function moveFolderSync(source, target) {
  copyFolderRecursiveSync(source, target);
  deleteFolderRecursiveSync(source);
}

function promptQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function main() {
  console.log('\n==================================================');
  console.log('         VIZIER UNIVERSE TRANSITION TOOL          ');
  console.log('==================================================\n');

  // 1. Read existing curriculum.json
  if (!fs.existsSync(curJsonPath)) {
    console.error('❌ Error: curriculum.json not found. Cannot proceed.');
    process.exit(1);
  }

  let curriculumData;
  try {
    curriculumData = JSON.parse(fs.readFileSync(curJsonPath, 'utf-8'));
  } catch (e) {
    console.error('❌ Error parsing curriculum.json:', e.message);
    process.exit(1);
  }

  const universe = curriculumData.universe || {
    number: 1,
    codename: 'AI ENGINEERING',
    title: 'Universe 01 — AI Engineering Mastery',
    status: 'active',
    started: null,
    completed: null
  };

  const nodes = curriculumData.nodes || [];
  const totalCount = nodes.length;
  const litCount = nodes.filter(n => n.status === 'lit').length;
  const isComplete = totalCount > 0 && litCount === totalCount;
  const abandon = process.argv.includes('--abandon');

  console.log(`Current Universe: ${universe.title}`);
  console.log(`Status: ${universe.status}`);
  console.log(`Lit Nodes: ${litCount} / ${totalCount}`);

  if (!isComplete && !abandon) {
    console.error(`\n❌ Error: Active universe is not 100% complete (lit: ${litCount}/${totalCount}).`);
    console.error('To proceed with transitioning anyway, you must run with the --abandon flag:\n');
    console.error('  npm run new-universe -- --abandon\n');
    process.exit(1);
  }

  if (abandon) {
    console.log('⚠️ --abandon flag detected. The active universe will be recorded as abandoned.');
  }

  // 2. Prompt for next universe details
  // Use CLI args or defaults if not interactive
  let nextCodename = process.argv[2] || '';
  let nextTitle = process.argv[3] || '';
  let nextCurriculumPath = process.argv[4] || '';

  if (!nextCodename && process.stdin.isTTY) {
    nextCodename = await promptQuestion('Enter next universe codename (e.g. AGENTS): ');
  }
  if (!nextCodename) nextCodename = 'NEXT_UNIVERSE';

  if (!nextTitle && process.stdin.isTTY) {
    nextTitle = await promptQuestion('Enter next universe title (e.g. Universe 02 — Agentic Systems): ');
  }
  if (!nextTitle) nextTitle = `Universe 0${universe.number + 1} — ${nextCodename} Mastery`;

  if (!nextCurriculumPath && process.stdin.isTTY) {
    nextCurriculumPath = await promptQuestion('Enter path to the new curriculum Markdown file: ');
  }
  
  if (!nextCurriculumPath || !fs.existsSync(nextCurriculumPath)) {
    // If path is invalid or empty, write a template mock
    console.log('⚠️ No valid curriculum file provided. Creating a baseline curriculum template.');
    const tempPath = path.join(curriculumDir, 'new_curriculum_template.md');
    fs.writeFileSync(tempPath, `# VIZIER Mastery Graph\n\n## v1.0.0\n\n## Nodes\n- map-of-new — The Map of ${nextCodename} · domain: foundations · type: concept · summary: Baseline map.\n`);
    nextCurriculumPath = tempPath;
  }

  // 3. Perform Archival
  const archiveLabel = `universe-${String(universe.number).padStart(2, '0')}`;
  const archiveDir = path.join(universesDir, archiveLabel);
  console.log(`\n📦 Archiving current universe to ${archiveDir}...`);

  fs.mkdirSync(archiveDir, { recursive: true });

  // Move brain notes
  if (fs.existsSync(knowledgeDir)) {
    copyFolderRecursiveSync(knowledgeDir, path.join(archiveDir, 'brain', 'knowledge'));
    // Empty but keep knowledgeDir
    deleteFolderRecursiveSync(knowledgeDir);
    fs.mkdirSync(knowledgeDir, { recursive: true });
  }

  // Move locked snapshots
  const lockedDir = path.join(curriculumDir, '.locked');
  if (fs.existsSync(lockedDir)) {
    moveFolderSync(lockedDir, path.join(archiveDir, '.locked'));
    fs.mkdirSync(lockedDir, { recursive: true });
  }

  // Copy curriculum files
  fs.copyFileSync(curJsonPath, path.join(archiveDir, 'curriculum.json'));
  fs.unlinkSync(curJsonPath);

  const changelogPath = path.join(curriculumDir, 'CHANGELOG.md');
  if (fs.existsSync(changelogPath)) {
    fs.copyFileSync(changelogPath, path.join(archiveDir, 'CHANGELOG.md'));
    fs.unlinkSync(changelogPath);
  }

  const activeGraphPath = path.join(curriculumDir, 'VIZIER_MASTERY_GRAPH.md');
  if (fs.existsSync(activeGraphPath)) {
    fs.copyFileSync(activeGraphPath, path.join(archiveDir, 'VIZIER_MASTERY_GRAPH.md'));
  }

  // 4. Update UNIVERSES.md Registry
  console.log('📝 Updating UNIVERSES.md registry...');
  let universesContent = '';
  if (fs.existsSync(universesMdPath)) {
    universesContent = fs.readFileSync(universesMdPath, 'utf-8');
  }

  const nextStatus = isComplete ? 'COMPLETE' : 'ABANDONED';
  const updatedActiveHeader = `## Universe 0${universe.number} — ${universe.codename} Mastery · ${totalCount} nodes · plan v1.0.0 · status: ${nextStatus}`;
  
  // Replace active status in registry
  const regex = new RegExp(`## Universe 0${universe.number}[^\\n]+status: ACTIVE`, 'i');
  if (regex.test(universesContent)) {
    universesContent = universesContent.replace(regex, updatedActiveHeader);
  } else {
    // Or just append it if not found
    universesContent += `\n${updatedActiveHeader}\n`;
  }

  // Append the next universe
  const nextNumber = universe.number + 1;
  const nextHeader = `\n## Universe 0${nextNumber} — ${nextTitle} · 200 nodes · plan v1.0.0 · status: ACTIVE\n\nInitial plan for ${nextTitle}.\n`;
  universesContent += nextHeader;
  fs.writeFileSync(universesMdPath, universesContent);

  // 5. Initialize Next Universe
  console.log(`🌱 Initializing Universe 0${nextNumber}: ${nextTitle}...`);

  // Copy new curriculum file to active VIZIER_MASTERY_GRAPH.md
  fs.copyFileSync(nextCurriculumPath, activeGraphPath);

  // Write new CHANGELOG.md
  fs.writeFileSync(changelogPath, `# VIZIER Curriculum Changelog\n\n## v1.0.0 — baseline graph\n- Initialized Universe 0${nextNumber} — ${nextTitle}.\n`);

  // Create a minimal placeholder curriculum.json so build scripts can run compile
  const newUniverse = {
    number: nextNumber,
    codename: nextCodename.toUpperCase(),
    title: nextTitle,
    status: 'active',
    started: null,
    completed: null
  };

  const newCurriculumObj = {
    version: '1.0.0',
    updated_at: new Date().toISOString(),
    universe: newUniverse,
    nodes: [],
    milestones: []
  };

  fs.writeFileSync(curJsonPath, JSON.stringify(newCurriculumObj, null, 2));

  // Run site build/compile automatically to parse the newly copied curriculum file
  console.log('🔄 Building new universe database...');
  try {
    const buildScript = path.join(repoRoot, 'tools', 'site-build', 'build.js');
    const { execSync } = require('child_process');
    execSync(`node "${buildScript}"`, { stdio: 'inherit' });
    console.log('✅ Universe transition complete! Site rebuilt successfully.');
  } catch (err) {
    console.error('⚠️ Warning: Rebuild failed, please run compile-curriculum manually.', err.message);
  }
}

main();
