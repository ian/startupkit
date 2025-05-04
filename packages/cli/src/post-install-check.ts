#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Recursively walk a directory and return all files matching the given extensions,
 * ignoring specified directories.
 */
function walk(dir: string, exts: string[], ignoreDirs: string[] = []): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (ignoreDirs.includes(file)) continue; // skip ignored dirs/files
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath, exts, ignoreDirs));
    } else if (exts.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  }
  return results;
}

/**
 * Check for unreplaced PROJECT references in files.
 */
function checkProjectReferences(dir: string): { file: string, line: number, content: string }[] {
  const ignoreDirs = [
    'node_modules', 'dist', '.git', 'coverage', 'out', 'build',
    '.next', '.turbo', '.vercel', '.output', '.DS_Store'
  ];
  console.log(`[post-install-check] Scanning directory: ${dir}`);
  const files = walk(dir, ['.json', '.js', '.ts', '.md'], ignoreDirs);
  const issues: { file: string, line: number, content: string }[] = [];
  for (const file of files) {
    console.log(`[post-install-check] Checking file: ${file}`);
    // Only check package.json for name field
    if (file.endsWith('package.json')) {
      const json = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (json.name === 'PROJECT') {
        console.warn(`[post-install-check] Issue found in ${file}: package.json name field is PROJECT`);
        issues.push({ file, line: 1, content: 'package.json name field is PROJECT' });
      }
    } else {
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, idx) => {
        // Exact match for PROJECT (not part of another word)
        if (line.includes('PROJECT')) {
          // For .js/.ts/.md, any occurrence counts
          console.warn(`[post-install-check] Issue found in ${file}:${idx + 1}: ${line.trim()}`);
          issues.push({ file, line: idx + 1, content: line.trim() });
        }
      });
    }
  }
  console.log(`[post-install-check] Finished scanning. Total files checked: ${files.length}`);
  return issues;
}

function runPostInstallCheck({ dir, mode }: { dir: string, mode: 'repo' | 'app' }) {
  console.log(`[post-install-check] Running post-install check in '${dir}' with mode '${mode}'`);
  if (mode === 'repo') {
    const issues = checkProjectReferences(dir);
    if (issues.length === 0) {
      console.log(' All PROJECT references replaced.');
    } else {
      console.error(' Unreplaced PROJECT references found:');
      for (const issue of issues) {
        console.error(`  ${issue.file}:${issue.line}  ${issue.content}`);
      }
      console.error(`[post-install-check] Total issues found: ${issues.length}`);
      process.exit(1);
    }
  } else {
    // TODO: Implement app mode checks
    console.log('App mode checks not implemented yet.');
  }
}

// CLI usage: node post-install-check.js <dir> <mode>
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url === process.argv[1]) {
  console.log('[post-install-check] Script running as main entrypoint.');
  const [,, dir = '.', mode = 'repo'] = process.argv;
  runPostInstallCheck({ dir, mode: mode as 'repo' | 'app' });
}