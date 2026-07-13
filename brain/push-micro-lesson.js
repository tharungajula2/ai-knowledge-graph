const fs = require('fs');
const path = require('path');

// Helper to load and parse .env manually
function loadEnv(envPath) {
  const env = {};
  if (!fs.existsSync(envPath)) return env;
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([\w_]+)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      val = val.replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
  return env;
}

// Simple frontmatter parser
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  
  const result = {};
  const yamlBlock = match[1];
  const lines = yamlBlock.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    
    const kvMatch = line.match(/^([\w_]+)\s*:\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let val = kvMatch[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.substring(1, val.length - 1).split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      } else {
        val = val.replace(/^["']|["']$/g, '');
      }
      result[key] = val;
    }
  }
  return result;
}

// Helper to extract markdown sections
function extractSection(content, sectionHeading) {
  const regex = new RegExp(`##\\s+${sectionHeading}\\r?\\n([\\s\\S]*?)(?:\\r?\\n##|$)`, 'i');
  const match = content.match(regex);
  if (match) {
    return match[1].trim().replace(/<!--[\s\S]*?-->/g, '').trim();
  }
  return '';
}

// Format message for Telegram (using standard markdown-safe characters)
function cleanMarkdown(text) {
  // Telegram MarkdownV2 requires escaping certain characters, but standard Markdown is easier and supported by Bot API
  return text;
}

async function run() {
  console.log('--- Starting VIZIER Micro-Learning Push ---');
  
  // 1. Load config
  const envPath = path.join(__dirname, '../backend/.env');
  const env = loadEnv(envPath);
  
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.error('Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not found in backend/.env');
    process.exit(1);
  }
  
  // 2. Scan Feynman notes directory for available lessons
  const feynmanDir = path.join(__dirname, 'feynman');
  if (!fs.existsSync(feynmanDir)) {
    console.error('Error: Feynman notes directory does not exist!');
    process.exit(1);
  }
  
  const files = fs.readdirSync(feynmanDir)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep')
    .map(f => path.join(feynmanDir, f));
    
  if (files.length === 0) {
    console.log('No Feynman notes found to send.');
    process.exit(0);
  }
  
  // 3. Load seen list
  const seenPath = path.join(__dirname, '.seen-lessons.json');
  let seenFiles = [];
  if (fs.existsSync(seenPath)) {
    try {
      seenFiles = JSON.parse(fs.readFileSync(seenPath, 'utf-8'));
    } catch (e) {
      console.warn('Warning: Failed to parse .seen-lessons.json, starting fresh.');
    }
  }
  
  // 4. Select next unseen lesson deterministically
  let selectedFile = null;
  for (const file of files) {
    if (!seenFiles.includes(file)) {
      selectedFile = file;
      break;
    }
  }
  
  if (!selectedFile) {
    console.log('All Feynman notes have been sent. Resetting seen list to cycle again...');
    seenFiles = [];
    selectedFile = files[0];
  }
  
  // 5. Parse selected note
  const content = fs.readFileSync(selectedFile, 'utf-8');
  const fm = parseFrontmatter(content);
  if (!fm) {
    console.error(`Error: Failed to parse frontmatter of ${selectedFile}`);
    process.exit(1);
  }
  
  const title = fm.title || path.basename(selectedFile, '.md');
  const domain = fm.domain || 'general';
  const confidence = fm.confidence || 'high';
  
  const oneSentence = extractSection(content, 'The one-sentence version') || 'No summary available.';
  const deeperVersion = extractSection(content, 'The slightly deeper version') || '';
  const sourcesSection = extractSection(content, 'Sources') || '';
  
  // Create clean takeaway from the first 2-3 sentences of the deeper version
  let takeaway = deeperVersion;
  if (takeaway.length > 250) {
    takeaway = takeaway.substring(0, 250) + '...';
  }
  if (!takeaway) takeaway = 'Review note for full details.';
  
  // Parse source list briefly
  let sourcesList = sourcesSection.split('\n')
    .map(s => s.trim().replace(/^-\s*/, ''))
    .filter(s => s.length > 0)
    .slice(0, 3)
    .join('\n- ');
  if (!sourcesList) sourcesList = 'Primary literature RAG references';
  
  // 6. Format Telegram Message
  const messageText = `🧠 *VIZIER Life-OS Micro-Lesson*

📌 *Title:* ${title}
📁 *Domain:* ${domain.toUpperCase()}
📊 *Evidence Confidence:* ${confidence.toUpperCase()}

📝 *The Core Idea:*
"${oneSentence}"

💡 *Key Takeaway:*
${takeaway}

📚 *Source Tiers:*
- ${sourcesList}

---
_Educational summary — not medical advice; verify with a clinician._`;

  console.log(`Selected lesson: "${title}" (${path.basename(selectedFile)})`);
  console.log(`Sending message to Telegram...`);
  
  // 7. Push HTTP request to Telegram Bot API
  const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });
    
    const resData = await res.json();
    if (!res.ok || !resData.ok) {
      throw new Error(`Telegram HTTP ${res.status}: ${resData.description || 'Unknown error'}`);
    }
    
    console.log('Telegram push successful!');
    
    // Save to seen list
    seenFiles.push(selectedFile);
    fs.writeFileSync(seenPath, JSON.stringify(seenFiles, null, 2));
    console.log(`Updated seen-lessons list: (${seenFiles.length}/${files.length} sent).`);
    console.log('--- Push Complete ---');
  } catch (err) {
    console.error('Error sending Telegram notification:', err.message);
    process.exit(1);
  }
}

run();
