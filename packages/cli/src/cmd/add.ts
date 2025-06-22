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
  { name: "Vite", value: "vite" },
  { name: "Astro", value: "astro" },
  { name: "Hono", value: "hono" },
  { name: "Fastify", value: "fastify" },
];

const PACKAGE_TYPES = [
  { name: "Package", value: "pkg" },
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
    const allTypes = [...APP_TYPES, ...PACKAGE_TYPES];
    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message: "Which type would you like to add?",
        choices: allTypes.map((t) => ({ name: t.name, value: t.value })),
      },
    ]);
    appType = selected;
  }

  if (!["next", "vite", "pkg"].includes(appType)) {
    printComingSoon(appType);
    return;
  }

  // Determine template type
  let templateType = "app";
  if (appType === "pkg") {
    templateType = "package";
  }

  // Ask for name if not provided
  let itemName = nameArg;
  if (!itemName) {
    const itemTypeLabel = templateType === "package" ? "package" : "app";
    const { inputName } = await inquirer.prompt([
      {
        type: "input",
        name: "inputName",
        message: `What is the name of your ${itemTypeLabel}?`,
        validate: (input: string) => input ? true : `${itemTypeLabel} name is required`,
      },
    ]);
    itemName = inputName;
  }
  const appSlug = slugify(itemName);

  // Determine where to place the new directory
  let destDir: string;
  const cwd = process.cwd();
  const cwdBase = path.basename(cwd);
  
  if (templateType === "package") {
    if (cwdBase === "packages") {
      destDir = path.resolve(cwd, appSlug);
    } else {
      destDir = path.resolve(cwd, "packages", appSlug);
    }
  } else {
    if (cwdBase === "apps") {
      destDir = path.resolve(cwd, appSlug);
    } else {
      destDir = path.resolve(cwd, "apps", appSlug);
    }
  }

  // Determine template path
  let templatePath;
  
  if (appType === "next") {
    templatePath = repoArg || "ian/startupkit/templates/next#startup-156-template-generation";
  } else if (appType === "vite") {
    templatePath = repoArg || "ian/startupkit/templates/vite#devin/STARTUP-177-1750604753";
  } else if (appType === "pkg") {
    templatePath = repoArg || "ian/startupkit/templates/package#devin/STARTUP-177-1750604753";
  }

  if (fs.existsSync(destDir)) {
    console.error(`\nError: ${destDir} already exists. Please remove it or choose a different app name.`);
    process.exit(1);
  }

  await spinner(`Cloning template into ${destDir}`, async () => {
    const emitter = degit(templatePath, { cache: false, force: true, verbose: true });
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

  const itemTypeLabel = templateType === "package" ? "Package" : "App";
  console.log(`\n${itemTypeLabel} added at: ${destDir}`);


}

export { addApp as add };
