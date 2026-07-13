const fs = require('fs');
const path = require('path');

// Helper to parse domains from taxonomy.yaml
function getValidDomains() {
  const taxonomyPath = path.join(__dirname, 'taxonomy.yaml');
  if (!fs.existsSync(taxonomyPath)) {
    console.error('Error: taxonomy.yaml not found at ' + taxonomyPath);
    process.exit(1);
  }
  const content = fs.readFileSync(taxonomyPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const codes = [];
  for (let line of lines) {
    const clean = line.trim();
    if (clean.startsWith('- code:')) {
      const match = clean.match(/- code:\s*([\w_-]+)/);
      if (match) {
        codes.push(match[1]);
      }
    }
  }
  return codes;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node brain/new-feynman.js "<title>" <domain>');
    console.log('Example: node brain/new-feynman.js "Why fiber feeds the gut" gut');
    process.exit(1);
  }
  
  const title = args[0].trim();
  const domain = args[1].trim().toLowerCase();
  
  // Validate domain
  const validDomains = getValidDomains();
  if (!validDomains.includes(domain)) {
    console.error(`Error: "${domain}" is not a valid domain.`);
    console.error(`Valid domains are: ${validDomains.join(', ')}`);
    process.exit(1);
  }
  
  // Slugify title for filename
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')         // replace spaces with hyphens
    .replace(/-+/g, '-');         // remove duplicate hyphens
    
  const filename = `${slug}.md`;
  const targetDir = path.join(__dirname, 'feynman');
  const targetPath = path.join(targetDir, filename);
  
  // Ensure target folder exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Prevent accidental overwriting
  if (fs.existsSync(targetPath)) {
    console.error(`Error: A Feynman note already exists at ${path.relative(path.join(__dirname, '..'), targetPath)}`);
    process.exit(1);
  }
  
  // Template body
  const template = `---
title: "${title}"
domain: ${domain}
note_type: feynman
tags: []
sources: []
confidence: high
---

## The one-sentence version
<!-- Summarize the idea in a way a 12-year-old would immediately understand -->


## The slightly deeper version
<!-- 2–4 short paragraphs, plain words, one analogy -->


## Where this could be wrong / what's still debated
<!-- Honest limits — this section is mandatory to prevent overconfidence -->


## Sources
<!-- Tiered citations:
     - Tier 1: Systematic reviews / Meta-analyses / Major guidelines
     - Tier 2: Individual peer-reviewed studies
     - Tier 3: Reputable secondary explainers
     - Tier 4: Weak evidence / blogs / self-reports
-->
- [Source Title](https://example.com) - Tier 2 evidence
`;

  fs.writeFileSync(targetPath, template);
  
  const relPath = path.relative(path.join(__dirname, '..'), targetPath).replace(/\\/g, '/');
  console.log(`================================================================`);
  console.log(` SUCCESS: Created new Feynman note template!`);
  console.log(` File path: ${relPath}`);
  console.log(`================================================================`);
  console.log(`Remember to run 'node brain/scan.js' to update the brain graph index.`);
}

main();
