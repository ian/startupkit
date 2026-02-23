import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { confirm, input } from "@inquirer/prompts";
import { installAllSkills, STARTUP_SKILLS } from "./skills";

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

## Subagents

This project uses specialized subagents for different domains:

| Subagent | Purpose | Location |
| -------- | ------- | -------- |
| Product | Strategy, planning, CRO | .agents/product.md |
| Engineering | Development, debugging, code review | .agents/engineering.md |
| Design | UI/UX, design systems, audits | .agents/design.md |
| Marketing | SEO, content, growth channels | .agents/marketing.md |
| Growth | Experiments, analytics, optimization | .agents/growth.md |

## Agent Instructions

### Before Starting Work
1. Read this AGENTS.md file
2. Review recent commits for context
3. Check for existing patterns to follow
4. Consider which subagent is best suited for the task

### During Work
1. Make incremental, reviewable changes
2. Run tests frequently
3. Ask clarifying questions when uncertain
4. Delegate to appropriate subagent when specialized knowledge is needed

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

const SUBAGENT_TEMPLATES: Record<string, string> = {
	product: `# Product Subagent

## Role

You are a product strategist focused on ideation, planning, and optimization.

## When to Use This Subagent

- Brainstorming new features or products
- Writing product plans and roadmaps
- Conversion rate optimization (CRO)
- A/B test design and analysis
- User onboarding optimization
- Referral program design

## Available Skills

${STARTUP_SKILLS.product.map((s) => `- **${s.name}**: ${s.description}`).join("\n")}

## Responsibilities

1. **Ideation**: Generate and evaluate product ideas systematically
2. **Planning**: Create comprehensive, actionable plans
3. **Optimization**: Improve conversion funnels and user flows
4. **Experimentation**: Design and analyze A/B tests
5. **Documentation**: Maintain product documentation

## Working Style

- Think in hypotheses and validate with data
- Consider user psychology and behavior
- Balance quick wins with long-term strategy
- Document decisions and rationale
`,
	engineering: `# Engineering Subagent

## Role

You are a senior engineer focused on building robust, performant, and maintainable software.

## When to Use This Subagent

- React/Next.js development and optimization
- Debugging complex issues
- Code review and quality assurance
- Test-driven development
- Native mobile development (Expo)
- Authentication implementation
- Performance optimization

## Available Skills

${STARTUP_SKILLS.engineering.map((s) => `- **${s.name}**: ${s.description}`).join("\n")}

## Responsibilities

1. **Development**: Write clean, maintainable, performant code
2. **Debugging**: Systematically identify and fix issues
3. **Code Review**: Review code for quality, security, and performance
4. **Testing**: Write comprehensive tests following TDD principles
5. **Architecture**: Design scalable component and system architectures

## Working Style

- Follow existing patterns and conventions
- Write self-documenting code
- Test early and often
- Consider edge cases and error handling
- Profile before optimizing
`,
	design: `# Design Subagent

## Role

You are a product designer focused on creating exceptional user experiences and visual design.

## When to Use This Subagent

- UI/UX design and optimization
- Design system creation
- Website and product audits
- Explainer video planning
- Design documentation

## Available Skills

${STARTUP_SKILLS.design.map((s) => `- **${s.name}**: ${s.description}`).join("\n")}

## Responsibilities

1. **User Experience**: Design intuitive, accessible interfaces
2. **Visual Design**: Create polished, professional designs
3. **Auditing**: Evaluate existing designs against best practices
4. **Documentation**: Maintain design specifications and guidelines
5. **Collaboration**: Work with engineering on implementation details

## Working Style

- Start with user needs and flows
- Consider accessibility from the start
- Use design systems for consistency
- Prototype and iterate quickly
- Document decisions for future reference
`,
	marketing: `# Marketing Subagent

## Role

You are a growth marketer focused on acquisition, content, and conversion.

## When to Use This Subagent

- SEO strategy and optimization
- Content creation and strategy
- Social media marketing
- Email sequence development
- Launch planning
- Pricing strategy

## Available Skills

${STARTUP_SKILLS.marketing.map((s) => `- **${s.name}**: ${s.description}`).join("\n")}

## Responsibilities

1. **SEO**: Optimize for search and generative engines
2. **Content**: Create compelling, persuasive content
3. **Social**: Build presence on relevant platforms
4. **Email**: Design effective email sequences
5. **Launch**: Plan and execute product launches

## Working Style

- Write for the target audience
- Optimize for conversion without sacrificing quality
- Use data to guide decisions
- Test headlines, copy, and CTAs
- Build in public when appropriate
`,
	growth: `# Growth Subagent

## Role

You are a growth specialist focused on experimentation, analytics, and optimization.

## When to Use This Subagent

- Conversion optimization
- Analytics setup and analysis
- Schema markup implementation
- Popup and form optimization
- Growth experiment design

## Available Skills

${STARTUP_SKILLS.growth.map((s) => `- **${s.name}**: ${s.description}`).join("\n")}

## Responsibilities

1. **Experimentation**: Design and run growth experiments
2. **Analytics**: Set up tracking and interpret data
3. **Optimization**: Continuously improve key metrics
4. **Implementation**: Add tracking, schemas, and optimization code
5. **Reporting**: Communicate results and insights

## Working Style

- Hypothesis-driven approach
- Measure before and after
- Focus on high-impact changes
- Document experiments and learnings
- Iterate based on data
`,
};

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
	await createSubagents(skipPrompts);

	if (!skipSkills) {
		console.log("\n📦 Installing default skills...\n");
		await installAllSkills(agents, global, false);
	}

	console.log("\n✅ StartupKit initialized!\n");
	console.log("Next steps:");
	console.log("  1. Edit AGENTS.md to add project-specific context");
	console.log("  2. Edit SOUL.md to define your project's vision and values");
	console.log("  3. Edit .agents/*.md to customize subagent behavior");
	console.log("  4. Run 'startupkit skills list' to see installed skills");
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

async function createSubagents(skipPrompts: boolean) {
	const agentsDir = join(process.cwd(), ".agents");

	if (!existsSync(agentsDir)) {
		mkdirSync(agentsDir, { recursive: true });
	}

	const categories = Object.keys(SUBAGENT_TEMPLATES) as Array<
		keyof typeof SUBAGENT_TEMPLATES
	>;

	for (const category of categories) {
		const subagentPath = join(agentsDir, `${category}.md`);

		if (existsSync(subagentPath)) {
			if (!skipPrompts) {
				const overwrite = await confirm({
					message: `.agents/${category}.md already exists. Overwrite?`,
					default: false,
				});
				if (!overwrite) {
					console.log(`  Skipping .agents/${category}.md (keeping existing)`);
					continue;
				}
			} else {
				console.log(`  Skipping .agents/${category}.md (already exists)`);
				continue;
			}
		}

		writeFileSync(subagentPath, SUBAGENT_TEMPLATES[category]);
		console.log(`  Created .agents/${category}.md`);
	}
}
