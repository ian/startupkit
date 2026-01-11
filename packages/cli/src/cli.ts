#!/usr/bin/env node

import { Command } from "commander"
import { add } from "./cmd/add"
import { init } from "./cmd/init"
import { make, initRalphConfig } from "./cmd/make"
import { upgrade } from "./cmd/upgrade"

export async function run() {
	const program = new Command()

	program.name("startupkit").description("The Zero to One Startup Framework")

	program
		.command("init")
		.description("Initialize a new project or setup")
		.option("--name <name>", "Name of the app")
		.option("--repo <repo>", "Template repo to use")
		.option("--dir <dir>", "Directory to create project in (use . for current)")
		.action(async (options) => {
			await init({
				name: options.name,
				repoArg: options.repo,
				dir: options.dir
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
		.option("-i, --iterations <number>", "Maximum number of iterations", Number.parseInt)
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
