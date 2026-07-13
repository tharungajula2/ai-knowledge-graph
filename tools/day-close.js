const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const knowledgeDir = path.join(repoRoot, 'brain', 'knowledge');
const buildScript = path.join(repoRoot, 'tools', 'site-build', 'build.js');
const configPath = path.join(repoRoot, 'site', 'config.json');

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

function getDayNumber(startDateStr) {
  const start = new Date(startDateStr);
  const today = new Date();
  const diffTime = today - start;
  if (diffTime < 0) return 1;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

function run() {
  console.log('\n==================================================');
  console.log('            VIZIER DAILY RITUAL: CLOSURE          ');
  console.log('==================================================\n');

  // 1. Run build-brain
  console.log('🔄 Rebuilding brain database (running site build)...');
  try {
    execSync(`node "${buildScript}"`, { stdio: 'inherit' });
    console.log('✅ Rebuild completed successfully.\n');
  } catch (err) {
    console.error('❌ Error during rebuild:', err.message);
    process.exit(1);
  }

  // 2. Scan notes to find if a node was lit today or is charging
  const todayStr = getTodayStr();
  let litToday = null;
  const chargingNodes = [];

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const fm = parseFrontmatter(content);
        if (fm.id) {
          if (fm.status === 'learned' && fm.completed === todayStr) {
            litToday = { id: fm.id, title: fm.title || fm.id };
          } else if (fm.status === 'in-progress' || fm.status === 'charging' || (fm.status !== 'learned' && fm.id)) {
            chargingNodes.push(fm.id);
          }
        }
      }
    }
  }

  if (fs.existsSync(knowledgeDir)) {
    scan(knowledgeDir);
  }

  // Read config.json to get start date for Day N
  let startDateStr = '2026-07-09';
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (cfg.start_date) {
        startDateStr = cfg.start_date;
      }
    } catch (e) {}
  }
  const dayNum = getDayNumber(startDateStr);

  // 3. Determine Commit Message
  let commitMessage = '';
  if (litToday) {
    commitMessage = `learn(${litToday.id}): ${litToday.title}`;
  } else if (chargingNodes.length > 0) {
    commitMessage = `progress(day-${dayNum}): daily work on ${chargingNodes[0]}`;
  } else {
    commitMessage = `progress(day-${dayNum}): daily work`;
  }

  console.log(`📝 Calculated commit message: "${commitMessage}"`);

  // 4. Git Actions
  try {
    console.log('git add -A...');
    execSync('git add -A', { stdio: 'inherit' });

    console.log('git commit...');
    // Only commit if there are changes to avoid erroring, or check status first
    const status = execSync('git status --porcelain').toString().trim();
    if (!status) {
      console.log('⚠️ No changes detected. Creating empty commit to maintain daily streak.');
      execSync(`git commit --allow-empty -m "${commitMessage}"`, { stdio: 'inherit' });
    } else {
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    }

    console.log('git push...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('🚀 Pushed to origin main successfully.\n');
  } catch (err) {
    console.error('❌ Error during Git actions:', err.message);
    process.exit(1);
  }

  // 5. Calculate Daily Streak
  try {
    const logOutput = execSync('git log --pretty=format:"%ad|%s" --date=short').toString().trim();
    const commits = logOutput.split('\n').map(line => {
      const parts = line.split('|');
      return {
        date: parts[0],
        message: parts[1] || ''
      };
    });

    // Extract dates of learn(...) or progress(...) commits
    const activeDates = new Set();
    commits.forEach(c => {
      if (c.message.startsWith('learn(') || c.message.startsWith('progress(')) {
        activeDates.add(c.date);
      }
    });

    // Add today since we just committed
    activeDates.add(todayStr);

    let streak = 0;
    const checkDate = new Date();
    while (true) {
      const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (activeDates.has(checkStr)) {
        streak++;
        // subtract one day
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔥 CURRENT DAILY STREAK: ${streak} DAYS`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (err) {
    console.warn('⚠️ Could not calculate daily streak from git log:', err.message);
  }
}

run();
