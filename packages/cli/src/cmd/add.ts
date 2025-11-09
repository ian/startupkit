import degit from 'degit';
import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';
import { spinner } from '../lib/spinner';
import { exec } from '../lib/system';

const APP_TYPES = [
  { name: 'Next.js', value: 'next' },
  { name: 'Expo (maybe)', value: 'expo' },
  { name: 'Capacitor Mobile', value: 'capacitor' },
  { name: 'Electron', value: 'electron' },
  { name: 'Vite', value: 'vite' },
  { name: 'Astro', value: 'astro' },
  { name: 'Hono', value: 'hono' },
  { name: 'Fastify', value: 'fastify' },
];

const PACKAGE_TYPES = [{ name: 'Package', value: 'pkg' }];

// Slugify copied from init
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function printComingSoon(type: string) {
  console.log(`\n${type} support coming soon, we've recorded your vote!`);
}

function checkWorkspacePackages(workspaceRoot: string): boolean {
  const requiredPackages = [
    'packages/analytics',
    'packages/auth',
    'packages/db',
    'packages/ui',
    'packages/utils',
    'config/nextjs',
  ];

  const missingPackages = requiredPackages.filter(
    (pkg) => !fs.existsSync(path.join(workspaceRoot, pkg)),
  );

  if (missingPackages.length > 0) {
    console.error(
      '\n❌ Error: This workspace is missing required packages for StartupKit apps.',
    );
    console.error('\nMissing packages:');
    for (const pkg of missingPackages) {
      console.error(`  - ${pkg}`);
    }
    console.error(
      '\n💡 To fix this, initialize a new StartupKit workspace with:',
    );
    console.error('   npx startupkit init');
    console.error(
      "\n   Or run this command inside a workspace that was created with 'startupkit init'.",
    );
    return false;
  }

  return true;
}

function replaceInDirectory(
  dir: string,
  pattern: RegExp,
  replacement: string,
): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }

    if (entry.isDirectory()) {
      replaceInDirectory(fullPath, pattern, replacement);
    } else if (entry.isFile()) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const newContent = content.replace(pattern, replacement);
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
        }
      } catch (error) {
        // Skip binary files or files that can't be read as text
      }
    }
  }
}

async function addApp(props: {
  type?: string;
  nameArg?: string;
  repoArg?: string;
}) {
  const { type, nameArg, repoArg } = props;

  // If no type specified, show interactive select
  let appType = type;
  if (!appType) {
    const allTypes = [...APP_TYPES, ...PACKAGE_TYPES];
    const { selected } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Which type would you like to add?',
        choices: allTypes.map((t) => ({ name: t.name, value: t.value })),
      },
    ]);
    appType = selected;
  }

  if (!['next', 'vite', 'pkg'].includes(appType)) {
    printComingSoon(appType);
    return;
  }

  // Determine template type
  let templateType = 'app';
  if (appType === 'pkg') {
    templateType = 'package';
  }

  // Ask for name if not provided
  let itemName = nameArg;
  if (!itemName) {
    const itemTypeLabel = templateType === 'package' ? 'package' : 'app';
    const { inputName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'inputName',
        message: `What is the name of your ${itemTypeLabel}?`,
        validate: (input: string) =>
          input ? true : `${itemTypeLabel} name is required`,
      },
    ]);
    itemName = inputName;
  }
  const appSlug = slugify(itemName);

  // Determine where to place the new directory
  let destDir: string;
  const cwd = process.cwd();
  const cwdBase = path.basename(cwd);

  if (templateType === 'package') {
    if (cwdBase === 'packages') {
      destDir = path.resolve(cwd, appSlug);
    } else {
      destDir = path.resolve(cwd, 'packages', appSlug);
    }
  } else {
    if (cwdBase === 'apps') {
      destDir = path.resolve(cwd, appSlug);
    } else {
      destDir = path.resolve(cwd, 'apps', appSlug);
    }
  }

  // Validate workspace for app templates that require workspace packages
  if (appType === 'next' || appType === 'vite') {
    const workspaceRoot = cwdBase === 'apps' ? path.dirname(cwd) : cwd;
    if (!checkWorkspacePackages(workspaceRoot)) {
      process.exit(1);
    }
  }

  // Determine template path
  let templatePath: string;

  if (appType === 'next') {
    templatePath = repoArg || 'ian/startupkit/templates/apps/next';
  } else if (appType === 'vite') {
    templatePath = repoArg || 'ian/startupkit/templates/apps/vite';
  } else if (appType === 'pkg') {
    templatePath = repoArg || 'ian/startupkit/templates/package';
  }

  if (fs.existsSync(destDir)) {
    console.error(
      `\nError: ${destDir} already exists. Please remove it or choose a different app name.`,
    );
    process.exit(1);
  }

  await spinner(`Cloning template into ${destDir}`, async () => {
    const emitter = degit(templatePath, {
      cache: false,
      force: true,
      verbose: true,
    });
    await emitter.clone(destDir);
  });

  // Recursively replace all instances of PROJECT placeholders with slug in the cloned repo
  let replacementPattern: RegExp;
  if (appType === 'next') {
    replacementPattern = /PROJECT_NEXT/g;
  } else if (appType === 'vite') {
    replacementPattern = /PROJECT_VITE/g;
  } else {
    replacementPattern = /PROJECT/g;
  }

  replaceInDirectory(destDir, replacementPattern, appSlug);

  // Install dependencies from workspace root
  const workspaceRoot = process.cwd();
  await spinner(`Installing dependencies`, async () => {
    await exec('pnpm install --no-frozen-lockfile', {
      cwd: workspaceRoot,
      stdio: 'inherit',
    });
  });

  // Note: pnpm should automatically link workspace dependencies when installing in a workspace

  const itemTypeLabel = templateType === 'package' ? 'Package' : 'App';
  console.log(`\n${itemTypeLabel} added at: ${destDir}`);
}

export { addApp as add };
