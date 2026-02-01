/**
 * Add command - Scaffolds new apps into a StartupKit workspace with automatic dependency resolution.
 *
 * Key features:
 * - Detects and installs missing workspace packages (@repo/*)
 * - Detects and installs missing config packages (@config/*)
 * - Clones templates from GitHub using degit
 * - Replaces placeholder names with user-provided app names
 */

import fs from "node:fs"
import path from "node:path"
import degit from "degit"
import inquirer from "inquirer"
import type { StartupKitConfig } from "../config"
import { spinner } from "../lib/spinner"
import { exec } from "../lib/system"

const TEMPLATE_TYPES = [
	{ name: "Next.js", value: "next" },
	{ name: "Vite", value: "vite" },
	{ name: "Storybook", value: "storybook" },
	new inquirer.Separator("---- coming soon ----"),
	{ name: "Expo", value: "expo", disabled: true },
	{ name: "Capacitor Mobile", value: "capacitor", disabled: true },
	{ name: "Electron", value: "electron", disabled: true },
	{ name: "Astro", value: "astro", disabled: true },
	{ name: "Hono", value: "hono", disabled: true },
	{ name: "Fastify", value: "fastify", disabled: true }
]

interface AddOptions {
	type?: string
	name?: string
	repo?: string
}

interface TemplateInfo {
	type: string
	templatePath: string
	replacementPattern: RegExp
}

/**
 * Converts a user-provided name into a URL-safe slug.
 * Example: "My Cool App" → "my-cool-app"
 */
function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/_/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+|-+$/g, "")
}

/**
 * Determines the workspace root directory.
 * Handles cases where user runs the command from /apps or /packages subdirectories.
 */
function getWorkspaceRoot(): string {
	const cwd = process.cwd()
	const cwdBase = path.basename(cwd)
	return cwdBase === "apps" || cwdBase === "packages" ? path.dirname(cwd) : cwd
}

/**
 * Returns template configuration for a given app type.
 * @param appType - The type of app to add (e.g., 'next', 'vite')
 * @param repoArg - Optional custom GitHub repo path for the template
 */
function getTemplateInfo(appType: string, repoArg?: string): TemplateInfo {
	const templates: Record<string, TemplateInfo> = {
		next: {
			type: "next",
			templatePath: repoArg || "ian/startupkit/templates/apps/next",
			replacementPattern: /PROJECT_NEXT/g
		},
		vite: {
			type: "vite",
			templatePath: repoArg || "ian/startupkit/templates/apps/vite",
			replacementPattern: /PROJECT_VITE/g
		},
		storybook: {
			type: "storybook",
			templatePath: repoArg || "ian/startupkit/templates/apps/storybook",
			replacementPattern: /NEVER_REPLACE_ANYTHING/g
		}
	}

	const template = templates[appType]
	if (!template) {
		throw new Error(`Unknown template type: ${appType}`)
	}
	return template
}

/**
 * Loads and parses the startupkit.config.ts file from a template.
 *
 * Since templates are remote GitHub repos, we:
 * 1. Clone the template to a temp directory
 * 2. Read and parse the config file using regex (can't import TS directly)
 * 3. Clean up the temp directory
 * 4. Return the parsed dependency information
 *
 * @param templatePath - GitHub repo path (e.g., 'ian/startupkit/templates/apps/next')
 * @returns Parsed config or null if config doesn't exist
 */
async function loadTemplateConfig(
	templatePath: string
): Promise<StartupKitConfig | null> {
	try {
		const tempDir = path.join(process.cwd(), ".startupkit-temp")
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true })
		}

		const emitter = degit(templatePath, {
			cache: false,
			force: true,
			verbose: false
		})
		await emitter.clone(tempDir)

		const configPath = path.join(tempDir, "startupkit.config.ts")
		if (!fs.existsSync(configPath)) {
			return null
		}

		const configContent = fs.readFileSync(configPath, "utf-8")

		// Parse dependencies using regex since we can't import TypeScript directly
		const packageMatch = configContent.match(/packages:\s*\[(.*?)\]/s)?.[1]
		const configMatch = configContent.match(/config:\s*\[(.*?)\]/s)?.[1]

		const packages = packageMatch
			? packageMatch
					.split(",")
					.map((p) => p.trim().replace(/['"]/g, ""))
					.filter(Boolean)
			: []

		const config = configMatch
			? configMatch
					.split(",")
					.map((c) => c.trim().replace(/['"]/g, ""))
					.filter(Boolean)
			: []

		fs.rmSync(tempDir, { recursive: true, force: true })

		return {
			type: configContent.includes('"app"') ? "app" : "package",
			dependencies: {
				packages: packages.length > 0 ? packages : undefined,
				config: config.length > 0 ? config : undefined
			}
		}
	} catch (error) {
		console.error("Failed to load template config:", error)
		return null
	}
}

interface MissingDependencies {
	packages: string[]
	config: string[]
}

/**
 * Checks which dependencies declared in the template config are missing from the workspace.
 * Scans for:
 * - packages/* - Workspace packages like @repo/auth, @repo/db
 * - config/* - Config packages like @config/nextjs, @config/typescript
 *
 * @returns Lists of missing package and config dependencies
 */
function checkMissingDependencies(
	config: StartupKitConfig | null,
	workspaceRoot: string
): MissingDependencies {
	const missing: MissingDependencies = {
		packages: [],
		config: []
	}

	if (!config?.dependencies) {
		return missing
	}

	if (config.dependencies.packages) {
		for (const pkg of config.dependencies.packages) {
			const pkgPath = path.join(workspaceRoot, "packages", pkg)
			if (!fs.existsSync(pkgPath)) {
				missing.packages.push(pkg)
			}
		}
	}

	if (config.dependencies.config) {
		for (const cfg of config.dependencies.config) {
			const cfgPath = path.join(workspaceRoot, "config", cfg)
			if (!fs.existsSync(cfgPath)) {
				missing.config.push(cfg)
			}
		}
	}

	return missing
}

/**
 * Prompts user to install missing dependencies and performs the installation.
 *
 * Installation process:
 * 1. Display what's missing to the user
 * 2. Ask for confirmation
 * 3. Clone each missing package/config from GitHub templates
 * 4. Run pnpm install to link everything together
 *
 * If user declines, the command exits with error.
 */
async function installMissingDependencies(
	missing: MissingDependencies,
	workspaceRoot: string
): Promise<void> {
	const totalMissing = missing.packages.length + missing.config.length

	if (totalMissing === 0) {
		return
	}

	console.log(
		`\n⚠️  This template requires ${totalMissing} workspace ${totalMissing === 1 ? "dependency" : "dependencies"} that are not installed:\n`
	)

	if (missing.packages.length > 0) {
		console.log("  Packages:")
		for (const pkg of missing.packages) {
			console.log(`    - @repo/${pkg}`)
		}
	}

	if (missing.config.length > 0) {
		console.log("  Config:")
		for (const cfg of missing.config) {
			console.log(`    - @config/${cfg}`)
		}
	}

	const { shouldInstall } = await inquirer.prompt([
		{
			type: "confirm",
			name: "shouldInstall",
			message: "Would you like to install these dependencies now?",
			default: true
		}
	])

	if (!shouldInstall) {
		console.log("\n❌ Cannot proceed without required dependencies. Exiting...")
		process.exit(1)
	}

	for (const pkg of missing.packages) {
		await spinner(`Installing @repo/${pkg}`, async () => {
			const templatePath = `ian/startupkit/templates/packages/${pkg}`
			const destDir = path.join(workspaceRoot, "packages", pkg)

			const emitter = degit(templatePath, {
				cache: false,
				force: true,
				verbose: false
			})
			await emitter.clone(destDir)
		})
	}

	for (const cfg of missing.config) {
		await spinner(`Installing @config/${cfg}`, async () => {
			const templatePath = `ian/startupkit/templates/repo/config/${cfg}`
			const destDir = path.join(workspaceRoot, "config", cfg)

			const emitter = degit(templatePath, {
				cache: false,
				force: true,
				verbose: false
			})
			await emitter.clone(destDir)
		})
	}

	try {
		await spinner("Installing dependencies", async () => {
			await exec("pnpm install --no-frozen-lockfile", {
				cwd: workspaceRoot,
				stdio: "pipe"
			})
		})
		console.log("✅ All dependencies installed successfully\n")
	} catch (error) {
		console.log(
			"\n❌ Failed to install dependencies. Please run pnpm install manually."
		)
		if (error instanceof Error && "stdout" in error) {
			const stdout = (error as { stdout: Buffer }).stdout
			const errorOutput = stdout.toString("utf-8")
			if (errorOutput) {
				console.log("\nError details:")
				console.log(errorOutput)
			}
		}
		process.exit(1)
	}
}

/**
 * Recursively replaces placeholder text in all files within a directory.
 * Used to replace PROJECT_NEXT, PROJECT_VITE, etc. with the actual app name.
 * Skips node_modules and .git directories, and silently skips binary files.
 */
function replaceInDirectory(
	dir: string,
	pattern: RegExp,
	replacement: string
): void {
	const entries = fs.readdirSync(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)

		if (entry.name === "node_modules" || entry.name === ".git") {
			continue
		}

		if (entry.isDirectory()) {
			replaceInDirectory(fullPath, pattern, replacement)
		} else if (entry.isFile()) {
			try {
				const content = fs.readFileSync(fullPath, "utf8")
				const newContent = content.replace(pattern, replacement)
				if (content !== newContent) {
					fs.writeFileSync(fullPath, newContent, "utf8")
				}
			} catch {
				// Skip binary files or files that can't be read as text
			}
		}
	}
}

/**
 * Main command function to add a new app to the workspace.
 *
 * Workflow:
 * 1. Prompt for app type if not provided (Next.js, Vite, etc.)
 * 2. Prompt for app name if not provided
 * 3. Check template dependencies (@repo/auth, @repo/db, etc.)
 * 4. Install any missing dependencies automatically
 * 5. Clone the template from GitHub
 * 6. Replace placeholder names with actual app name
 * 7. Run pnpm install to set everything up
 *
 * @param options - Command line options (type, name, repo)
 */
async function addApp(options: AddOptions): Promise<void> {
	const { type, name: nameArg, repo: repoArg } = options

	let appType = type
	if (!appType) {
		const { selected } = await inquirer.prompt([
			{
				type: "list",
				name: "selected",
				message: "Which app would you like to add?",
				choices: TEMPLATE_TYPES
			}
		])
		appType = selected
	}

	if (!["next", "vite", "storybook"].includes(appType)) {
		console.log(`\n${appType} support coming soon, we've recorded your vote!`)
		return
	}

	const templateInfo = getTemplateInfo(appType, repoArg)

	let itemName = nameArg
	if (!itemName) {
		const { inputName } = await inquirer.prompt([
			{
				type: "input",
				name: "inputName",
				message: "What is the name of your app?",
				validate: (input: string) => (input ? true : "App name is required")
			}
		])
		itemName = inputName
	}

	const slug = slugify(itemName)
	const workspaceRoot = getWorkspaceRoot()
	const destDir = path.join(workspaceRoot, "apps", slug)

	if (fs.existsSync(destDir)) {
		console.error(
			`\n❌ Error: ${destDir} already exists. Please remove it or choose a different name.`
		)
		process.exit(1)
	}

	console.log("\n🔍 Checking template dependencies...")
	const config = await loadTemplateConfig(templateInfo.templatePath)

	const missing = checkMissingDependencies(config, workspaceRoot)
	await installMissingDependencies(missing, workspaceRoot)

	await spinner(`Cloning template into apps/${slug}`, async () => {
		const emitter = degit(templateInfo.templatePath, {
			cache: false,
			force: true,
			verbose: false
		})
		await emitter.clone(destDir)
	})

	replaceInDirectory(destDir, templateInfo.replacementPattern, slug)

	try {
		await spinner("Installing dependencies", async () => {
			await exec("pnpm install --no-frozen-lockfile", {
				cwd: workspaceRoot,
				stdio: "pipe"
			})
		})
	} catch (error) {
		console.log(
			`\n⚠️  App added but dependency installation failed. You may need to run 'pnpm install' manually.`
		)
		if (error instanceof Error && "stdout" in error) {
			const stdout = (error as { stdout: Buffer }).stdout
			const errorOutput = stdout.toString("utf-8")
			if (errorOutput.includes("ERR_PNPM_CATALOG")) {
				console.log(
					"\n💡 Tip: This usually happens when catalog dependencies are not properly configured."
				)
				console.log("   Try running: pnpm install --no-frozen-lockfile\n")
			} else {
				console.log("\nError details:")
				console.log(errorOutput)
			}
		}
	}

	// Regenerate AI agent instructions
	await spinner("Regenerating AI agent instructions", async () => {
		await exec("pnpm agents.md", { cwd: workspaceRoot, stdio: "pipe" })
	})

	console.log(`\n✅ App added successfully at: apps/${slug}`)
}

export { addApp as add }
