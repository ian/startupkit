#!/usr/bin/env node

import { Command } from "commander"
import { add } from "./cmd/add"
import { init } from "./cmd/init"
import { initRalphConfig, make } from "./cmd/make"
import { upgrade } from "./cmd/upgrade"

interface InitCommandOptions {
	name?: string
	repo?: string
	dir?: string
	packageManager?: string
}

function parsePackageManager(
	value: string | undefined
): "pnpm" | "bun" | undefined {
	if (!value) return undefined
	const normalized = value.trim().toLowerCase()
	if (normalized === "pnpm" || normalized === "bun") return normalized
	throw new Error(`Unsupported package manager: ${value}. Use "pnpm" or "bun".`)
}

export async function run() {
	const program = new Command()

	program.name("startupkit").description("The Zero to One Startup Framework")

	program
		.command("init")
		.description("Initialize a new project or setup")
		.option("--name <name>", "Name of the app")
		.option("--repo <repo>", "Template repo to use")
		.option("--dir <dir>", "Directory to create project in (use . for current)")
		.option(
			"--package-manager <packageManager>",
			"Package manager to use (pnpm or bun)"
		)
		.action(async (options: InitCommandOptions) => {
			const packageManager = parsePackageManager(options.packageManager)
			await init({
				name: options.name,
				repoArg: options.repo,
				dir: options.dir,
				packageManager
			})
		})

	program
		.command("add [type]")
		.description("Add a new app to the apps/ folder")
		.option("--name <name>", "Name of the app")
		.option("--repo <repo>", "Template repo to use")
		.action(async (type, options) => {
			await add({ type, name: options.name, repo: options.repo })
		})

	program
		.command("upgrade")
		.alias("up")
		.description("Upgrade StartupKit packages and config to latest versions")
		.option("--packages", "Only upgrade @startupkit/* npm packages")
		.option("--config", "Only sync config files from latest template")
		.option("--dry-run", "Show what would be upgraded without making changes")
		.action(async (options) => {
			await upgrade({
				packages: options.packages,
				config: options.config,
				dryRun: options.dryRun
			})
		})

	program
		.command("make [specfile]")
		.alias("ralph")
		.description("Run iterative AI-assisted development from a spec file")
		.option(
			"-i, --iterations <number>",
			"Maximum number of iterations",
			(value) => {
				const parsed = Number.parseInt(value, 10)
				return Number.isNaN(parsed) ? undefined : parsed
			}
		)
		.option("-p, --progress <file>", "Progress file path")
		.action(async (specfile, options) => {
			await make({
				specfile,
				iterations: options.iterations,
				progress: options.progress
			})
		})

	program
		.command("make:init")
		.description("Initialize ralph config file at .startupkit/ralph.json")
		.action(() => {
			initRalphConfig()
		})

	program
		.command("help")
		.description("Show help information")
		.action(() => {
			program.help()
		})

	// Show help if no command is provided
	if (!process.argv.slice(2).length) {
		program.outputHelp()
		process.exit(0)
	}

	await program.parseAsync()
}

run().catch((error) => {
	console.error(error)
	process.exit(1)
})
