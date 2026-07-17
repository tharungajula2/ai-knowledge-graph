const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const knowledgeDir = path.join(repoRoot, 'brain', 'knowledge');
const buildScript = path.join(repoRoot, 'tools', 'site-build', 'build.js');

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

function updateFrontmatter(content, todayStr) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return content;
  
  let fmContent = fmMatch[1];
  
  // Replace status: in-progress or status: charging with status: learned
  if (fmContent.match(/status:/)) {
    fmContent = fmContent.replace(/status:\s*[^\r\n]+/g, 'status: learned');
  } else {
    fmContent += '\nstatus: learned';
  }
  
  // Replace completed: null or completed: with completed: YYYY-MM-DD
  if (fmContent.match(/completed:/)) {
    fmContent = fmContent.replace(/completed:\s*[^\r\n]+/g, `completed: ${todayStr}`);
  } else {
    fmContent += `\ncompleted: ${todayStr}`;
  }
  
  // Reconstruct file content
  let newContent = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---\n${fmContent.trim()}\n---`);

  // Now update ## Status log section in body if present
  const statusLogMatch = newContent.match(/##\s*Status\s*log\s*([\s\S]*?)(?:##|$)/i);
  if (statusLogMatch) {
    const originalSection = statusLogMatch[0];
    let updatedSection = originalSection;
    if (originalSection.match(/-\s*Finished:\s*/i)) {
      updatedSection = originalSection.replace(/(-\s*Finished:\s*)([^\r\n]*)/i, `$1${todayStr}`);
    } else if (originalSection.match(/-\s*Completed:\s*/i)) {
      updatedSection = originalSection.replace(/(-\s*Completed:\s*)([^\r\n]*)/i, `$1${todayStr}`);
    } else {
      updatedSection = originalSection.trim() + `\n- Finished: ${todayStr}\n`;
    }
    newContent = newContent.replace(originalSection, updatedSection);
  }

  return newContent;
}

function run() {
  // Find note files under brain/knowledge
  const inProgressNotes = [];
  
  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const fm = parseFrontmatter(content);
        if (fm.status === 'in-progress' || fm.status === 'charging' || (fm.status !== 'learned' && fm.id)) {
          inProgressNotes.push({
            id: fm.id || path.basename(entry.name, '.md'),
            title: fm.title || fm.id,
            path: fullPath,
            domain: fm.domain
          });
        }
      }
    }
  }
  
  if (fs.existsSync(knowledgeDir)) {
    scan(knowledgeDir);
  }

  // Check if a specific node ID was passed in arguments
  const argNodeId = process.argv[2];
  let targetNote = null;

  if (argNodeId) {
    targetNote = inProgressNotes.find(n => n.id === argNodeId);
    if (!targetNote) {
      console.error(`Error: Could not find an in-progress node with ID "${argNodeId}".`);
      process.exit(1);
    }
  } else if (inProgressNotes.length === 0) {
    console.log('⚡ No charging or in-progress nodes found to finish!');
    process.exit(0);
  } else if (inProgressNotes.length === 1) {
    targetNote = inProgressNotes[0];
  } else {
    // Multiple charging notes: let user select
    console.log('\n🧭 Multiple in-progress nodes found:');
    inProgressNotes.forEach((n, i) => {
      console.log(`   [${i + 1}] [${n.domain.toUpperCase()}] ${n.title} (${n.id})`);
    });
    console.log('');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('👉 Select which node you finished (1-' + inProgressNotes.length + '): ', (answer) => {
      rl.close();
      const choice = parseInt(answer.trim(), 10);
      if (isNaN(choice) || choice < 1 || choice > inProgressNotes.length) {
        console.error('Invalid selection.');
        process.exit(1);
      }
      finishNode(inProgressNotes[choice - 1]);
    });
    return;
  }

  if (targetNote) {
    finishNode(targetNote);
  }
}

function finishNode(note) {
  const today = getTodayStr();
  const rawContent = fs.readFileSync(note.path, 'utf-8');
  const updatedContent = updateFrontmatter(rawContent, today);
  
  fs.writeFileSync(note.path, updatedContent, 'utf-8');
  console.log(`\n🎉 Node marked as completed (learned) and lit today (${today}):`);
  console.log(`   - Title: ${note.title}`);
  console.log(`   - File: ${path.relative(repoRoot, note.path)}`);

  console.log('\n🤖 Running link suggestion engine...');
  try {
    execSync(`node "${path.join(repoRoot, 'tools', 'suggest-links.js')}" "${note.id}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Error running suggest-links:', err.message);
  }

  console.log('\n🤖 Generating social content drafts...');
  try {
    execSync(`node "${path.join(repoRoot, 'tools', 'draft-post.js')}" "${note.id}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Error running draft-post:', err.message);
  }
  
  console.log('\n🔄 Rebuilding brain database...');
  try {
    execSync(`node "${buildScript}"`, { stdio: 'inherit' });
    console.log('✅ Rebuild completed successfully.');
  } catch (err) {
    console.error('Error during site rebuild:', err.message);
  }
}

run();
