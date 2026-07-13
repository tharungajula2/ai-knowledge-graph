const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');
const siteDir = path.join(repoRoot, 'site');

// Forbidden pattern list for security checks
const forbiddenRegexes = [
  /SUPABASE_[A-Z_]+/i,
  /sk-[a-zA-Z0-9]{20,}/,
  /AIzaSy[a-zA-Z0-9_-]{33}/,
  /bearer\s+[a-zA-Z0-9._-]+/i,
  /[a-zA-Z0-9+/]{40,}/, // generic long base64
  /[a-zA-Z0-9._%+-]+@gmail\.com/i, // Gmail address specifically
  /[a-zA-Z]:\\[a-zA-Z0-9_.-]+/i // Windows absolute paths
];

function runVerification() {
  console.log('--- Running Automated Gate 2 Verifications ---');
  let errorsCount = 0;
  
  if (!fs.existsSync(siteDir)) {
    console.error('Error: site/ folder does not exist.');
    process.exit(1);
  }

  // 1. Run secret scanning over all files inside site/
  function scanDirForSecrets(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirForSecrets(fullPath);
      } else if (file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.css') || file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        for (const regex of forbiddenRegexes) {
          const match = content.match(regex);
          if (match) {
            console.error(`[SECURITY FAILURE] File ${path.relative(siteDir, fullPath)} contains forbidden pattern: "${match[0].substring(0, 20)}..."`);
            errorsCount++;
          }
        }
      }
    }
  }
  scanDirForSecrets(siteDir);

  // 2. Validate internal links inside generated HTML files
  const htmlFiles = [];
  function collectHtml(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        collectHtml(fullPath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }
  collectHtml(siteDir);

  console.log(`Scanning ${htmlFiles.length} HTML files for broken links...`);
  
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf-8');
    // Extract all hrefs
    const hrefMatches = content.matchAll(/href="([^"]+)"/g);
    for (const match of hrefMatches) {
      const href = match[1];
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('#')) {
        // Skip external links / mail links / anchor links
        continue;
      }
      
      // Resolve path relative to the file it was found in
      const fileDir = path.dirname(htmlFile);
      const targetPath = path.resolve(fileDir, href);
      
      // Check if target file exists
      if (!fs.existsSync(targetPath)) {
        console.error(`[LINK FAILURE] File ${path.relative(siteDir, htmlFile)} contains broken link: "${href}" (resolved to: ${path.relative(siteDir, targetPath)})`);
        errorsCount++;
      }
    }
  }

  if (errorsCount === 0) {
    console.log('✅ GATE 2 SUCCESS: 0 secrets leaked, 0 broken internal links.');
    process.exit(0);
  } else {
    console.error(`❌ GATE 2 FAILURE: Found ${errorsCount} validation issues.`);
    process.exit(1);
  }
}

runVerification();
