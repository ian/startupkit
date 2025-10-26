import degit from "degit";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { replaceInFile } from 'replace-in-file';
import { spinner } from "../lib/spinner";
import { exec } from '../lib/system';

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
  { name: "Local Package (@repo/*) - Project-specific, fast iteration", value: "pkg-local" },
  { name: "Centralized Package (@startupkit/*) - Shared across projects", value: "pkg-centralized" },
];

// Slugify copied from init
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
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

  if (!["next", "vite", "pkg-local", "pkg-centralized"].includes(appType)) {
    printComingSoon(appType);
    return;
  }

  // Determine template type and package strategy
  let templateType = "app";
  let packageStrategy: "local" | "centralized" | null = null;

  if (appType === "pkg-local") {
    templateType = "package";
    packageStrategy = "local";
  } else if (appType === "pkg-centralized") {
    templateType = "package";
    packageStrategy = "centralized";
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
    if (packageStrategy === "centralized") {
      // Centralized packages go in packages/
      if (cwdBase === "packages") {
        destDir = path.resolve(cwd, appSlug);
      } else {
        destDir = path.resolve(cwd, "packages", appSlug);
      }
      console.log("\n📦 Creating centralized package (@startupkit/*)");
      console.log("   This package will be:");
      console.log("   - Published to NPM");
      console.log("   - Compiled with rollup");
      console.log("   - Versioned with semantic versioning");
    } else {
      // Local packages go in templates/repo/packages/ or packages/ in a template
      if (cwdBase === "packages") {
        destDir = path.resolve(cwd, appSlug);
      } else if (fs.existsSync(path.resolve(cwd, "templates", "repo", "packages"))) {
        // We're in the root of startupkit monorepo
        destDir = path.resolve(cwd, "templates", "repo", "packages", appSlug);
      } else if (fs.existsSync(path.resolve(cwd, "packages"))) {
        // We're in a project root with packages/
        destDir = path.resolve(cwd, "packages", appSlug);
      } else {
        destDir = path.resolve(cwd, "packages", appSlug);
      }
      console.log("\n📦 Creating local package (@repo/*)");
      console.log("   This package will be:");
      console.log("   - Private to your monorepo");
      console.log("   - Source consumed directly (no compilation)");
      console.log("   - Fast iteration and customization");
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
    templatePath = repoArg || "ian/startupkit/templates/next";
  } else if (appType === "vite") {
    templatePath = repoArg || "ian/startupkit/templates/vite";
  } else if (appType === "pkg-local" || appType === "pkg-centralized") {
    templatePath = repoArg || "ian/startupkit/templates/package";
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
    await exec('pnpm install --no-frozen-lockfile', { cwd: destDir, stdio: 'inherit' });
  });

  // Note: pnpm should automatically link workspace dependencies when installing in a workspace

  const itemTypeLabel = templateType === "package" ? "Package" : "App";
  console.log(`\n✅ ${itemTypeLabel} added at: ${destDir}`);

  // Provide package-specific guidance
  if (templateType === "package") {
    console.log("\n📝 Next steps:");

    if (packageStrategy === "centralized") {
      console.log("   1. Update package.json:");
      console.log(`      - name: "@startupkit/${appSlug}"`);
      console.log(`      - version: "0.4.0" (or current version)`);
      console.log("      - Ensure exports are configured for compilation");
      console.log("\n   2. Add build scripts:");
      console.log('      - build: "rollup -c && tsc --emitDeclarationOnly"');
      console.log('      - clean: "rm -rf ./dist ./.turbo"');
      console.log("\n   3. Configure rollup.config.mjs for compilation");
      console.log("\n   4. When ready to publish:");
      console.log("      - Build the package: pnpm build");
      console.log("      - Publish to NPM: npm publish");
      console.log("\n   📖 See docs/PACKAGE_STRATEGY.md for more details");
    } else {
      console.log("   1. Update package.json:");
      console.log(`      - name: "@repo/${appSlug}"`);
      console.log('      - private: true');
      console.log("      - Configure exports to point to source files");
      console.log("\n   2. Add TypeScript configuration");
      console.log("\n   3. Import in other packages using:");
      console.log(`      "@repo/${appSlug}": "workspace:*"`);
      console.log("\n   4. No build step needed - source consumed directly!");
      console.log("\n   📖 See docs/PACKAGE_STRATEGY.md for examples");
    }
  }

}

export { addApp as add };

