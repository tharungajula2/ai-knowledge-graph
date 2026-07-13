const fs = require('fs');
const path = require('path');
const ai = require('./ai/client');

const repoRoot = path.resolve(__dirname, '..');
const knowledgeDir = path.join(repoRoot, 'brain', 'knowledge');
const postsDir = path.join(repoRoot, 'posts');

async function run() {
  const argNodeId = process.argv[2];
  if (!argNodeId) {
    console.error('Usage: node tools/draft-post.js <node-id>');
    process.exit(1);
  }

  // Find note path
  let notePath = null;
  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name === `${argNodeId}.md`) {
        notePath = fullPath;
        break;
      }
    }
  }

  if (fs.existsSync(knowledgeDir)) {
    scan(knowledgeDir);
  }

  if (!notePath) {
    console.error(`Error: Could not find note file for ID "${argNodeId}"`);
    process.exit(1);
  }

  console.log(`\n✍️ Drafting social post assets for: ${argNodeId}...`);
  await draftSocialPosts(argNodeId, notePath);
  process.exit(0);
}

async function draftSocialPosts(nodeId, notePath) {
  const noteContent = fs.readFileSync(notePath, 'utf-8');
  const deepLink = `https://vizier-life-os.vercel.app/site/brain?node=${nodeId}`;

  const prompt = `You are VIZIER's social post architect. You write educational content for LinkedIn.
We want to draft posts based on this study note for "${nodeId}":
---
${noteContent}
---

Your task is to generate three assets with a warm, welcoming tone and zero unexplained jargon.

Asset 1: text-post
- Feynman-style explanation for a non-technical reader.
- Use exactly ONE everyday Indian-life analogy (e.g. Chai, local trains, auto-rickshaw, spice box, kirana store, cricket matches).
- A compelling 2-line hook at the start.
- Keep the body under 200 words.
- MUST end with a newline and this exact link: "${deepLink}"

Asset 2: carousel-outline
- A structured 6-slide carousel.
- Slide 1: Title Slide (catchy).
- Slides 2-5: Educational flow, one key point per slide.
- Slide 6: Call to action to explore the live VIZIER graph.
- Format: "Slide X: [Title] - [Description]"

Asset 3: video-script
- A 45-second short-form spoken script.
- Include spoken dialogue and [visual / caption cues] in brackets.
- Keep it punchy, conversational, and warm.

Please return exactly a JSON object conforming to the schema below. Do not wrap the JSON in markdown code blocks. Return raw JSON.

JSON SCHEMA:
{
  "text_post": "Markdown content for text-post",
  "carousel_outline": "Markdown content for carousel-outline",
  "video_script": "Markdown content for video-script"
}`;

  try {
    const result = await ai.generate(prompt, true);
    
    // Save under posts/<node-id>/
    const targetDir = path.join(postsDir, nodeId);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(path.join(targetDir, 'text-post.md'), result.text_post || '', 'utf-8');
    fs.writeFileSync(path.join(targetDir, 'carousel-outline.md'), result.carousel_outline || '', 'utf-8');
    fs.writeFileSync(path.join(targetDir, 'video-script.md'), result.video_script || '', 'utf-8');

    console.log(`✅ Social post assets successfully created in: ${path.relative(repoRoot, targetDir)}/`);
    console.log(`   - text-post.md`);
    console.log(`   - carousel-outline.md`);
    console.log(`   - video-script.md\n`);
  } catch (err) {
    console.error('❌ Failed to draft social posts:', err.message);
    throw err;
  }
}

// Only execute automatically if run directly
if (require.main === module) {
  run();
}

module.exports = {
  draftSocialPosts
};
