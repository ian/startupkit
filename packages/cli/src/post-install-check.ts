import fs from 'fs';
import path from 'path';

/**
 * Recursively walk a directory and return all files matching the given extensions.
 */
function walk(dir: string, exts: string[]): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath, exts));
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
  const files = walk(dir, ['.json', '.js', '.ts', '.md']);
  const issues: { file: string, line: number, content: string }[] = [];
  for (const file of files) {
    // Only check package.json for name field
    if (file.endsWith('package.json')) {
      const json = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (json.name === 'PROJECT') {
        issues.push({ file, line: 1, content: 'package.json name field is PROJECT' });
      }
    } else {
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, idx) => {
        // Exact match for PROJECT (not part of another word)
        if (line.includes('PROJECT')) {
          // For .js/.ts/.md, any occurrence counts
          issues.push({ file, line: idx + 1, content: line.trim() });
        }
      });
    }
  }
  return issues;
}

function runPostInstallCheck({ dir, mode }: { dir: string, mode: 'repo' | 'app' }) {
  if (mode === 'repo') {
    const issues = checkProjectReferences(dir);
    if (issues.length === 0) {
      console.log(' All PROJECT references replaced.');
    } else {
      console.error(' Unreplaced PROJECT references found:');
      for (const issue of issues) {
        console.error(`  ${issue.file}:${issue.line}  ${issue.content}`);
      }
      process.exit(1);
    }
  } else {
    // TODO: Implement app mode checks
    console.log('App mode checks not implemented yet.');
  }
}

// CLI usage: node post-install-check.js <dir> <mode>
if (require.main === module) {
  const [,, dir = '.', mode = 'repo'] = process.argv;
  runPostInstallCheck({ dir, mode: mode as 'repo' | 'app' });
}