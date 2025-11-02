#!/usr/bin/env node

/**
 * Link/Unlink Local Packages Script
 *
 * This script toggles between using local file: links and npm versions
 * for @startupkit/* packages in the template repo.
 *
 * Usage:
 *   pnpm link:local    - Convert npm versions to local file: links (for development)
 *   pnpm unlink:local  - Convert file: links back to npm versions (before publishing)
 *
 * Examples:
 *   Development: pnpm link:local && cd templates/repo && pnpm install
 *   Publishing:  pnpm unlink:local
 */

import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TEMPLATE_ROOT = 'templates/repo';
const PACKAGES_TO_LINK = ['@startupkit/auth', '@startupkit/analytics'];

const command = process.argv[2];

if (!command || !['link', 'unlink'].includes(command)) {
  console.error('Usage: node scripts/link-local.js [link|unlink]');
  console.error('');
  console.error('Commands:');
  console.error('  link    Convert npm versions to local file: links');
  console.error('  unlink  Convert file: links to npm versions');
  process.exit(1);
}

async function main() {
  const packageJsonFiles = await glob(`${TEMPLATE_ROOT}/**/package.json`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  });

  let changedCount = 0;

  for (const file of packageJsonFiles) {
    const content = readFileSync(file, 'utf8');
    const pkg = JSON.parse(content);
    let changed = false;

    if (pkg.dependencies) {
      for (const pkgName of PACKAGES_TO_LINK) {
        if (pkg.dependencies[pkgName]) {
          const currentValue = pkg.dependencies[pkgName];

          if (command === 'link') {
            // Convert version to file: link
            if (!currentValue.startsWith('file:')) {
              // Calculate relative path from package to root
              const depth = file.split('/').length - 1;
              const relativeRoot = '../'.repeat(depth);
              const targetPackage = pkgName.replace('@startupkit/', '');
              pkg.dependencies[pkgName] =
                `file:${relativeRoot}packages/${targetPackage}`;
              changed = true;
              console.log(`✅ ${file}: ${pkgName} → local link`);
            }
          } else if (command === 'unlink') {
            // Convert file: link to version
            if (currentValue.startsWith('file:')) {
              // Read version from root package
              const targetPackage = pkgName.replace('@startupkit/', '');
              const rootPkg = JSON.parse(
                readFileSync(
                  join('packages', targetPackage, 'package.json'),
                  'utf8',
                ),
              );
              pkg.dependencies[pkgName] = rootPkg.version;
              changed = true;
              console.log(`✅ ${file}: ${pkgName} → v${rootPkg.version}`);
            }
          }
        }
      }
    }

    if (changed) {
      writeFileSync(file, `${JSON.stringify(pkg, null, '\t')}\n`);
      changedCount++;
    }
  }

  if (changedCount > 0) {
    console.log(`\n🎉 Updated ${changedCount} package.json file(s)`);
    if (command === 'link') {
      console.log(
        '\n⚠️  Run "pnpm install" in templates/repo to update node_modules',
      );
    } else {
      console.log('\n⚠️  Remember to update lockfile before committing');
    }
  } else {
    console.log('\n✨ No changes needed');
  }
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
