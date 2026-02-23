import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { confirm, input } from "@inquirer/prompts";
import { installAllSkills } from "./skills";

const AGENTS_TEMPLATE = `# Project Agents

## Overview

This file configures AI agents working on this project.

## Project Context

<!-- Describe your project here -->

## Tech Stack

<!-- List your tech stack: frameworks, languages, databases, etc. -->

## Conventions

### Code Style
- Follow existing patterns in the codebase
- Write clean, readable, self-documenting code

### Commit Messages
- Use conventional commits format
- Keep commits atomic and focused

### Testing
- Write tests for new features
- Maintain existing test coverage

## Agent Instructions

### Before Starting Work
1. Read this AGENTS.md file
2. Review recent commits for context
3. Check for existing patterns to follow

### During Work
1. Make incremental, reviewable changes
2. Run tests frequently
3. Ask clarifying questions when uncertain

### Before Completing
1. Ensure all tests pass
2. Update documentation if needed
3. Review your own changes first
`;

const SOUL_TEMPLATE = `# Project Soul

## Vision

<!-- What is the ultimate vision for this project? -->

## Mission

<!-- What does this project do? Who does it serve? -->

## Core Values

<!-- List 3-5 core values that guide decisions -->

1. 
2. 
3. 

## Target Users

<!-- Who are your primary users? What problems do they have? -->

## Success Metrics

<!-- How do you measure success? -->

## Constraints

<!-- What constraints must be respected? Technical, business, or otherwise -->

## Non-Goals

<!-- What is explicitly out of scope? -->

## Brand Voice

<!-- How should the product communicate? Tone, style, personality -->

## Competitive Landscape

<!-- Who are the competitors? What makes this different? -->
`;

export async function initProject(options: {
	skipPrompts?: boolean;
	global?: boolean;
	skipSkills?: boolean;
	agents?: string[];
}) {
	const agents = options.agents?.length
		? options.agents
		: ["opencode", "claude-code"];
	const skipPrompts = options.skipPrompts ?? false;
	const global = options.global ?? false;
	const skipSkills = options.skipSkills ?? false;

	console.log("\n🚀 Initializing StartupKit...\n");

	await createAgentsMd(skipPrompts);
	await createSoulMd(skipPrompts);

	if (!skipSkills) {
		console.log("\n📦 Installing default skills...\n");
		await installAllSkills(agents, global, false);
	}

	console.log("\n✅ StartupKit initialized!\n");
	console.log("Next steps:");
	console.log("  1. Edit AGENTS.md to add project-specific context");
	console.log("  2. Edit SOUL.md to define your project's vision and values");
	console.log("  3. Run 'startupkit skills list' to see installed skills");
}

async function createAgentsMd(skipPrompts: boolean) {
	const agentsPath = join(process.cwd(), "AGENTS.md");

	if (existsSync(agentsPath)) {
		if (!skipPrompts) {
			const overwrite = await confirm({
				message: "AGENTS.md already exists. Overwrite?",
				default: false,
			});
			if (!overwrite) {
				console.log("  Skipping AGENTS.md (keeping existing)");
				return;
			}
		} else {
			console.log("  Skipping AGENTS.md (already exists)");
			return;
		}
	}

	writeFileSync(agentsPath, AGENTS_TEMPLATE);
	console.log("  Created AGENTS.md");
}

async function createSoulMd(skipPrompts: boolean) {
	const soulPath = join(process.cwd(), "SOUL.md");

	if (existsSync(soulPath)) {
		if (!skipPrompts) {
			const overwrite = await confirm({
				message: "SOUL.md already exists. Overwrite?",
				default: false,
			});
			if (!overwrite) {
				console.log("  Skipping SOUL.md (keeping existing)");
				return;
			}
		} else {
			console.log("  Skipping SOUL.md (already exists)");
			return;
		}
	}

	let soulContent = SOUL_TEMPLATE;

	if (!skipPrompts) {
		const projectName = await input({
			message: "Project name:",
			default: process.cwd().split("/").pop() || "My Project",
		});

		const vision = await input({
			message: "Project vision (one sentence):",
		});

		if (projectName || vision) {
			soulContent = soulContent.replace(
				"<!-- What is the ultimate vision for this project? -->",
				vision || "",
			);
		}
	}

	writeFileSync(soulPath, soulContent);
	console.log("  Created SOUL.md");
}
