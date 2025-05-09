import { replaceInFile } from 'replace-in-file';
import inquirer from "inquirer";
import { spinner } from "../lib/spinner";
import path from "path";
import degit from "degit";
import fs from "fs";
import { exec } from '../lib/system';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';

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

async function addApp(props: {
  type?: string, nameArg?: string, repoArg?: string
}) {
  const { type, nameArg, repoArg } = props;
  
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

  // Determine where to place the new app directory
  let destDir: string;
  const cwd = process.cwd();
  const cwdBase = path.basename(cwd);
  if (cwdBase === "apps") {
    destDir = path.resolve(cwd, appSlug);
  } else {
    destDir = path.resolve(cwd, "apps", appSlug);
  }

  const repoSubdir = repoArg || "ian/startupkit/templates/next#startup-156-template-generation";

  if (fs.existsSync(destDir)) {
    console.error(`\nError: ${destDir} already exists. Please remove it or choose a different app name.`);
    process.exit(1);
  }

  await spinner(`Cloning template into ${destDir}`, async () => {
    const emitter = degit(repoSubdir, { cache: false, force: true, verbose: true });
    await emitter.clone(destDir);
  })

  // Recursively replace all instances of PROJECT with slug in the cloned repo
  await replaceInFile({
    files: path.join(destDir, '**/*'),
    from: /PROJECT/g,
    to: appSlug,
    ignore: ['**/node_modules/**', '**/.git/**']
  });

  // Install dependencies
  await spinner(`Installing dependencies`, async () => {
    await exec('pnpm install --no-frozen-lockfile', { cwd: destDir });
  });
  
  // const exec = promisify(execCb);

  // await spinner(`Installing dependencies`, async () => {
  //   try {
  //     const { stdout, stderr } = await exec('pnpm install', { cwd: destDir });
  //     if (stdout) process.stdout.write(stdout);
  //     if (stderr) process.stderr.write(stderr);
  //   } catch (err: any) {
  //     if (err.stdout) process.stdout.write(err.stdout);
  //     if (err.stderr) process.stderr.write(err.stderr);
  //     // Print the error message itself for context
  //     console.error('Install failed:', err.message || err);
  //     throw err;
  //   }
  // });

  console.log(`\nNext.js app added at: ${destDir}`);


}

export { addApp as add };
