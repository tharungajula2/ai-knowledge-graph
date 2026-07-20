#!/usr/bin/env node
/**
 * validate-notes.js
 * Standalone validation gate for the ignition note system.
 *
 * Rules enforced:
 *  1. EMPTY-LIT VIOLATION: A note with status:lit must have real body content.
 *  2. MISSING ID: Every note must have an `id` frontmatter field.
 *  3. ID-FILENAME MISMATCH: The frontmatter `id` must match the filename (without .md).
 *  4. INVALID STATUS: status must be one of dark | charging | lit | learned.
 *
 * Usage:
 *   node tools/validate-notes.js          # validates all notes
 *   node tools/validate-notes.js --strict # also fails on missing optional fields
 *
 * Exit 0 = all clean.
 * Exit 1 = one or more violations found.
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const repoRoot    = path.join(__dirname, '..');
const brainDir    = path.join(repoRoot, 'brain', 'knowledge');
const notesDir    = path.join(repoRoot, 'notes');  // fallback legacy directory
const strict      = process.argv.includes('--strict');

const VALID_STATUSES = new Set(['dark', 'ghost', 'charging', 'in-progress', 'lit', 'learned']);
// Minimum number of substantive body lines to consider a note non-empty
const CONTENT_MIN_LINES = 3;
const CONTENT_MIN_CHARS = 20;
// Filenames that are scaffolding, not curriculum notes — skip them
const SKIP_FILENAMES = new Set(['README', 'TEMPLATE', 'readme', 'template']);

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
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────────

function validateNotes() {
  console.log('=== validate-notes: Scanning note files ===');

  const files = [
    ...collectNoteFiles(brainDir),
    ...collectNoteFiles(notesDir)
  ];

  if (files.length === 0) {
    console.log('No note files found. Nothing to validate.');
    process.exit(0);
  }

  console.log(`Found ${files.length} note file(s).`);

  let errorCount   = 0;
  let warningCount = 0;

  for (const filePath of files) {
    const filename    = path.basename(filePath, '.md');
    // Skip scaffold / directory-level README and TEMPLATE files
    if (SKIP_FILENAMES.has(filename)) continue;

    const rawContent  = fs.readFileSync(filePath, 'utf-8');
    const fm          = parseFrontmatter(rawContent);
    const relPath     = path.relative(repoRoot, filePath);

    // Rule 2: Missing id
    if (!fm.id) {
      if (strict) {
        console.error(`  [ERROR] ${relPath}: Missing 'id' frontmatter field.`);
        errorCount++;
      } else {
        console.warn(`  [WARN]  ${relPath}: Missing 'id' frontmatter field.`);
        warningCount++;
      }
    }

    // Rule 3: id-filename mismatch
    if (fm.id && fm.id !== filename) {
      console.error(`  [ERROR] ${relPath}: frontmatter id="${fm.id}" does not match filename "${filename}".`);
      errorCount++;
    }

    // Rule 4: Invalid status value
    const fmStatus = (fm.status || '').toLowerCase().trim();
    if (fmStatus && !VALID_STATUSES.has(fmStatus)) {
      console.error(`  [ERROR] ${relPath}: Invalid status value "${fm.status}". Must be one of: dark | charging | lit | learned.`);
      errorCount++;
    }

    // Canonicalise legacy status aliases for the hard guard below
    // ghost → dark (not lit, so no danger)
    // in-progress → charging (not lit, so no danger)
    const canonStatus = fmStatus === 'learned' ? 'lit'
                      : (fmStatus === 'ghost'   ? 'dark' : fmStatus);

    // Rule 1: Empty-lit violation (the hard rule)
    const isLit = canonStatus === 'lit';
    if (isLit && !hasNoteContent(rawContent)) {
      console.error(`  [ERROR] ${relPath}: EMPTY LIT NODE — status is "${fm.status}" but note has no substantive content.`);
      console.error(`          A lit note requires at least ${CONTENT_MIN_LINES} lines of content (each ${CONTENT_MIN_CHARS}+ chars) below the frontmatter.`);
      console.error(`          Either add real content or lower the status to: charging`);
      errorCount++;
    }
  }

  console.log('');
  if (errorCount === 0 && warningCount === 0) {
    console.log(`✅ validate-notes PASSED: ${files.length} file(s) validated, 0 errors, 0 warnings.`);
    process.exit(0);
  } else if (errorCount === 0) {
    console.log(`⚠️  validate-notes PASSED with warnings: ${files.length} file(s), 0 errors, ${warningCount} warnings.`);
    process.exit(0);
  } else {
    console.error(`❌ validate-notes FAILED: ${errorCount} error(s), ${warningCount} warning(s) in ${files.length} file(s).`);
    process.exit(1);
  }
}

validateNotes();
