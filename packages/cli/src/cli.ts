#!/usr/bin/env node

import { Command } from "commander"
import { skills } from "./cmd/skills"

export async function run() {
	const program = new Command()

	program
		.name("startupkit")
		.description(
			"Startup skills for AI agents. Equip your project with entrepreneur, dev, marketing, and product skills."
		)
		.version("1.0.0")

	program
		.command("skills")
		.description("Manage startup skills for your project")
		.argument("[action]", "Action to perform (add, list)", "list")
		.option(
			"-c, --category <category>",
			"Install specific category (entrepreneur, dev, marketing, product, growth)"
		)
		.option("-a, --all", "Install all skills")
		.option("-l, --list", "List available skills")
		.option(
			"--agent <agents...>",
			"Target agents (default: opencode, claude-code)"
		)
		.option("-g, --global", "Install skills globally")
		.action(async (action, options) => {
			if (action === "add" || action === "install") {
				await skills({
					category: options.category,
					all: options.all,
					list: false,
					agent: options.agent,
					global: options.global
				})
			} else {
				await skills({ list: true })
			}
		})

	program
		.command("add")
		.description(
			"Add startup skills to your project (shortcut for 'skills add')"
		)
		.option("-c, --category <category>", "Install specific category")
		.option("-a, --all", "Install all skills")
		.option(
			"--agent <agents...>",
			"Target agents (default: opencode, claude-code)"
		)
		.option("-g, --global", "Install skills globally")
		.action(async (options) => {
			await skills({
				category: options.category,
				all: options.all,
				list: false,
				agent: options.agent,
				global: options.global
			})
		})

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
