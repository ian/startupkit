#!/usr/bin/env node

import { Command } from "commander";
import { initProject } from "./cmd/init";
import {
	addSkills,
	listInstalledSkills,
	listSkills,
	removeSkill,
} from "./cmd/skills";

export async function run() {
	const program = new Command();

	program
		.name("startupkit")
		.description(
			"Startup skills for AI agents. Equip your project with entrepreneur, dev, marketing, and product skills.",
		)
		.version("1.0.0");

	program
		.command("init")
		.description(
			"Initialize project with AGENTS.md, SOUL.md, and default skills",
		)
		.option("-y, --yes", "Skip prompts and use defaults")
		.option("-g, --global", "Install skills globally")
		.option("--skip-skills", "Skip installing skills")
		.option(
			"--agent <agents...>",
			"Target agents (default: opencode, claude-code)",
		)
		.action(async (options) => {
			await initProject({
				skipPrompts: options.yes,
				global: options.global,
				skipSkills: options.skipSkills,
				agents: options.agent,
			});
		});

	program
		.command("skills")
		.description("Manage startup skills for your project")
		.argument("[action]", "Action to perform (list, add, remove)", "list")
		.argument("[skill]", "Skill name (for add/remove)")
		.option(
			"-c, --category <category>",
			"Install specific category (entrepreneur, dev, marketing, product, growth)",
		)
		.option("-a, --all", "Install all skills")
		.option("-i, --installed", "List installed skills")
		.option(
			"--agent <agents...>",
			"Target agents (default: opencode, claude-code)",
		)
		.option("-g, --global", "Install/remove skills globally")
		.option("--dry-run", "Preview without making changes")
		.action(async (action, skill, options) => {
			if (action === "add" || action === "install") {
				await addSkills({
					skill: skill,
					category: options.category,
					all: options.all,
					agent: options.agent,
					global: options.global,
					dryRun: options.dryRun,
				});
			} else if (action === "remove" || action === "rm") {
				await removeSkill({
					skill: skill || options.category,
					agent: options.agent,
					global: options.global,
				});
			} else if (options.installed) {
				await listInstalledSkills(options.global ?? false);
			} else {
				listSkills();
			}
		});

	if (!process.argv.slice(2).length) {
		program.outputHelp();
		process.exit(0);
	}

	await program.parseAsync();
}

run().catch((error) => {
	console.error(error);
	process.exit(1);
});
