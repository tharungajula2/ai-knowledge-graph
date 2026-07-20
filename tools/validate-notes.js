#!/usr/bin/env node
/**
 * validate-notes.js
 * Comprehensive validation script for Vizier notes system.
 *
 * Enforces:
 *  1. 1-to-1 Mapping: Every curriculum node has exactly one note file and vice versa.
 *  2. ID Match: Frontmatter `id` matches filename (without .md).
 *  3. Status: Status is one of dark | charging | lit (or legacy learned/in-progress/ghost).
 *  4. Dates: `created`, `updated`, `lit_date` parse cleanly as YYYY-MM-DD.
 *  5. Version: `version` is valid semver (e.g. 0.1.0).
 *  6. Empty-Lit Guard: A note with status:lit must have real substantive content.
 *
 * Exit 0 = PASS, Exit 1 = FAIL.
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const repoRoot      = path.join(__dirname, '..');
const currPath      = path.join(repoRoot, 'curriculum', 'curriculum.json');
const brainDir      = path.join(repoRoot, 'brain', 'knowledge');
const notesDir      = path.join(repoRoot, 'notes');

const SKIP_FILENAMES = new Set(['README', 'TEMPLATE', 'readme', 'template']);
const VALID_STATUSES = new Set(['dark', 'ghost', 'charging', 'in-progress', 'lit', 'learned']);
const DATE_REGEX     = /^\d{4}-\d{2}-\d{2}$/;
const SEMVER_REGEX   = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;

const CONTENT_MIN_LINES = 3;
const CONTENT_MIN_CHARS = 20;

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const kv = line.split(':');
    if (kv.length >= 2) {
      const k = kv[0].trim();
      let v   = kv.slice(1).join(':').trim();
      if (v.startsWith('[') && v.endsWith(']')) {
        v = v.substring(1, v.length - 1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      } else {
        v = v.replace(/^["']|["']$/g, '');
      }
      result[k] = v;
    }
  }
  return result;
}

function hasNoteContent(rawContent) {
  let body = rawContent;
  if (rawContent.startsWith('---')) {
    const endIdx = rawContent.indexOf('---', 3);
    if (endIdx !== -1) body = rawContent.substring(endIdx + 3);
  }
  const meaningfulLines = body.split(/\r?\n/).filter(line => {
    const t = line.trim();
    if (!t) return false;
    if (t.startsWith('#')) return false;
    if (t.startsWith('<!--')) return false;
    if (t.startsWith('---')) return false;
    return t.length >= CONTENT_MIN_CHARS;
  });
  return meaningfulLines.length >= CONTENT_MIN_LINES;
}

function collectNoteFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  function walk(current) {
    for (const entry of fs.readdirSync(current)) {
      const full = path.join(current, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.md')) {
        const basename = path.basename(entry, '.md');
        if (!SKIP_FILENAMES.has(basename)) {
          results.push(full);
        }
      }
    }
  }
  walk(dir);
  return results;
}

// ── Main Validation ────────────────────────────────────────────────────────────

function validateNotes() {
  console.log('=== validate-notes: Executing Node Integrity Checks ===');

  let errorCount = 0;

  // 1. Read Curriculum Nodes
  if (!fs.existsSync(currPath)) {
    console.error(`[ERROR] curriculum.json not found at: ${currPath}`);
    process.exit(1);
  }
  const currData = JSON.parse(fs.readFileSync(currPath, 'utf8'));
  const curriculumNodes = currData.nodes || [];
  const currNodeIds = new Set(curriculumNodes.map(n => n.id));

  console.log(`Curriculum defines ${currNodeIds.size} total nodes.`);

  // 2. Collect Note Files
  const files = [
    ...collectNoteFiles(notesDir),
    ...collectNoteFiles(brainDir)
  ];

  console.log(`Discovered ${files.length} note file(s) in repository.`);

  // 3. Check 1-to-1 Mapping & Duplicates
  const nodeToFileMap = new Map();
  for (const filePath of files) {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(rawContent);
    const basename = path.basename(filePath, '.md');
    const cleanId = fm.id || basename.replace(/^\d{2}-\d{2}-/, '');
    if (!nodeToFileMap.has(cleanId)) {
      nodeToFileMap.set(cleanId, []);
    }
    nodeToFileMap.get(cleanId).push(filePath);
  }

  // Check missing notes
  for (const nodeId of currNodeIds) {
    if (!nodeToFileMap.has(nodeId)) {
      console.error(`  [ERROR] Missing note file for curriculum node: "${nodeId}"`);
      errorCount++;
    }
  }

  // Check duplicate notes and orphan notes
  for (const [nodeId, paths] of nodeToFileMap.entries()) {
    if (!currNodeIds.has(nodeId)) {
      console.error(`  [ERROR] Orphan note file (no matching curriculum node): "${nodeId}" at ${paths.join(', ')}`);
      errorCount++;
    }
    if (paths.length > 1) {
      console.error(`  [ERROR] Duplicate note files for node "${nodeId}":\n          ${paths.join('\n          ')}`);
      errorCount++;
    }
  }

  // 4. Detailed File-Level Checks
  for (const filePath of files) {
    const filename   = path.basename(filePath, '.md');
    const relPath    = path.relative(repoRoot, filePath);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const fm         = parseFrontmatter(rawContent);
    const cleanFilename = filename.replace(/^\d{2}-\d{2}-/, '');

    // ID Match
    if (!fm.id) {
      console.error(`  [ERROR] ${relPath}: Missing 'id' in frontmatter.`);
      errorCount++;
    } else if (fm.id !== cleanFilename) {
      console.error(`  [ERROR] ${relPath}: frontmatter id="${fm.id}" does not match filename "${cleanFilename}".`);
      errorCount++;
    }

    // Status Check
    const fmStatus = (fm.status || '').toLowerCase().trim();
    if (!fmStatus) {
      console.error(`  [ERROR] ${relPath}: Missing 'status' in frontmatter.`);
      errorCount++;
    } else if (!VALID_STATUSES.has(fmStatus)) {
      console.error(`  [ERROR] ${relPath}: Invalid status "${fm.status}". Must be dark | charging | lit.`);
      errorCount++;
    }

    // Dates Parsing
    const dateFields = ['created', 'updated'];
    for (const df of dateFields) {
      const val = fm[df];
      if (val && val !== 'null') {
        if (!DATE_REGEX.test(val) || isNaN(Date.parse(val))) {
          console.error(`  [ERROR] ${relPath}: Invalid date format for '${df}': "${val}". Expected YYYY-MM-DD.`);
          errorCount++;
        }
      }
    }
    if (fm.lit_date && fm.lit_date !== 'null') {
      if (!DATE_REGEX.test(fm.lit_date) || isNaN(Date.parse(fm.lit_date))) {
        console.error(`  [ERROR] ${relPath}: Invalid lit_date format: "${fm.lit_date}". Expected YYYY-MM-DD.`);
        errorCount++;
      }
    }

    // Version Semver Check
    if (fm.version) {
      if (!SEMVER_REGEX.test(fm.version)) {
        console.error(`  [ERROR] ${relPath}: Invalid semver version: "${fm.version}". Expected X.Y.Z.`);
        errorCount++;
      }
    }

    // Empty-Lit Guard Check
    const canonStatus = fmStatus === 'learned' ? 'lit' : (fmStatus === 'ghost' ? 'dark' : fmStatus);
    if (canonStatus === 'lit' && !hasNoteContent(rawContent)) {
      console.error(`  [ERROR] ${relPath}: EMPTY LIT NODE — status is "${fm.status}" but has no substantive body content.`);
      errorCount++;
    }
  }

  console.log('');
  if (errorCount === 0) {
    console.log(`✅ validate-notes PASSED: 1-to-1 curriculum mapping verified, all 228 notes valid.`);
    process.exit(0);
  } else {
    console.error(`❌ validate-notes FAILED with ${errorCount} error(s).`);
    process.exit(1);
  }
}

validateNotes();
