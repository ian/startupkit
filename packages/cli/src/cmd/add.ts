import { replaceInFile } from 'replace-in-file';
import inquirer from "inquirer";
import { spinner } from "../lib/spinner";
import path from "path";
import degit from "degit";
import fs from "fs";
import { exec } from '../lib/system';

const APP_TYPES = [
  { name: "Next.js", value: "next" },
  { name: "Expo (maybe)", value: "expo" },
  { name: "Capacitor Mobile", value: "capacitor" },
  { name: "Electron", value: "electron" },
  { name: "Vite (maybe)", value: "vite" },
  { name: "Astro", value: "astro" },
  { name: "Hono", value: "hono" },
  { name: "Fastify", value: "fastify" },
];

// Slugify copied from init
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function printComingSoon(type: string) {
  console.log(`\n${type} support coming soon, we've recorded your vote!`);
}

async function addApp(type?: string, nameArg?: string, repoArg?: string) {
  // If no type specified, show interactive select
  let appType = type;
  if (!appType) {
    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message: "Which app type would you like to add?",
        choices: APP_TYPES.map((t) => ({ name: t.name, value: t.value })),
      },
    ]);
    appType = selected;
  }

  if (appType !== "next") {
    printComingSoon(appType);
    return;
  }

  // Ask for app name if not provided
  let appName = nameArg;
  if (!appName) {
    const { inputName } = await inquirer.prompt([
      {
        type: "input",
        name: "inputName",
        message: "What is the name of your app?",
        validate: (input: string) => input ? true : "App name is required",
      },
    ]);
    appName = inputName;
  }
  const appSlug = slugify(appName);

  // For next, clone template into apps/<appSlug>
  const destDir = path.resolve(process.cwd(), "apps", appSlug);
  const repoSubdir = repoArg || "ian/startupkit/templates/next#startup-156-template-generation";

  if (fs.existsSync(destDir)) {
    console.error(`\nError: apps/${appSlug} already exists. Please remove it or choose a different app name.`);
    process.exit(1);
  }

  console.log(`Cloning template into ${destDir}`);
  console.log({repoArg})
  const emitter = degit(repoSubdir, { cache: false, force: true, verbose: true });
  await emitter.clone(destDir);

  
  function listFiles(dir: string, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    console.debug({entries})
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      console.log(prefix + entry.name + (entry.isDirectory() ? '/' : ''));
      if (entry.isDirectory()) listFiles(fullPath, prefix + '  ');
    }
  }
  listFiles(destDir);

  console.log(path.join(destDir, '**/*'))

  // Recursively replace all instances of PROJECT with slug in the cloned repo
  await replaceInFile({
    files: path.join(destDir, '**/*'),
    from: /PROJECT/g,
    to: appSlug,
    ignore: ['**/node_modules/**', '**/.git/**']
  });

  // Install dependencies
  await spinner(`Installing dependencies`, async () => {
    await exec('pnpm install', { cwd: destDir });
  });

  console.log(`\nNext.js app added at: ${destDir}`);
}

export { addApp as add };
