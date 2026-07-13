const fs = require('fs');
const path = require('path');
const ai = require('./ai/client');

const repoRoot = path.resolve(__dirname, '..');
const curriculumPath = path.join(repoRoot, 'curriculum', 'curriculum.json');
const docsDir = path.join(repoRoot, 'docs', 'frontier-scans');

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function run() {
  console.log('\n==================================================');
  console.log('       VIZIER SYSTEM SCANNER: FRONTIER-SCAN        ');
  console.log('==================================================\n');

  if (!fs.existsSync(curriculumPath)) {
    console.error(`Error: curriculum.json not found at ${curriculumPath}. Please run build first.`);
    process.exit(1);
  }

  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
  const nodes = curriculum.nodes || [];

  // Get next 10 ghost nodes
  const ghostNodes = nodes.filter(n => n.status !== 'lit' && n.status !== 'learned').slice(0, 10);

  if (ghostNodes.length === 0) {
    console.log('🎉 No ghost nodes remaining to scan! You have mastered the curriculum.');
    process.exit(0);
  }

  console.log(`🧭 Next 10 target ghost nodes for scanning:`);
  ghostNodes.forEach((n, i) => {
    console.log(`   [${i + 1}] [${n.domain.toUpperCase()}] ${n.title}`);
  });
  console.log('\n🧠 Querying Gemini for recent developments & frontier research...');
  console.log(`🤖 Model: ${ai.modelName}`);

  const prompt = `You are a research scanner for VIZIER's AI Engineering curriculum.
The user is planning to study these next 10 topics in their learning path:
${JSON.stringify(ghostNodes.map(n => ({ id: n.id, title: n.title, domain: n.domain, summary: n.summary })), null, 2)}

Task:
List 3-5 recent developments, tools, models, frameworks, papers, or techniques in the AI/LLM space that are highly relevant to these topics.
For each development, write a structured evaluation:
- Title / Development name
- Relevance: which of the 10 nodes it affects
- Description: what it is and why it matters
- Worth a replan?: Yes/No + brief reasoning (e.g. "Yes, LangGraph has added new state schema patterns which replace the manual ReAct cycle in Node X", or "No, keep current baseline").

Caveat: Because this is running via offline model inference, note that the recommendations are based on the model's training data state with a caveat that user should verify the very latest news.

Output the result in clean Markdown format with a title "# Frontier Scan - <Date>".`;

  try {
    const markdownResult = await ai.generate(prompt, false);
    
    // Ensure directory exists
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const todayStr = getTodayStr();
    const destFile = path.join(docsDir, `${todayStr}.md`);
    
    // Prefix with offline dated caveat as requested
    const fullMarkdown = `> [!NOTE]  
> **Dated Caveat**: This scan was generated using model knowledge as of mid-2026/early-2027. Cross-reference with live web resources for the absolute moving edge.

${markdownResult}`;

    fs.writeFileSync(destFile, fullMarkdown, 'utf-8');
    console.log(`\n💾 Saved frontier scan report to: ${path.relative(repoRoot, destFile)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Review the report and decide if you want to run `npm run replan`.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (err) {
    console.error('\n❌ Frontier scan failed:', err.message);
    process.exit(1);
  }
}

run();
