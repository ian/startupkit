import { execSync } from "node:child_process"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { checkbox, confirm, input } from "@inquirer/prompts"

export const STARTUP_SKILLS = {
	product: [
		{
			name: "brainstorming",
			repo: "obra/superpowers",
			description: "Brainstorming and ideation techniques"
		},
		{
			name: "writing-plans",
			repo: "obra/superpowers",
			description: "Writing comprehensive plans"
		},
		{
			name: "executing-plans",
			repo: "obra/superpowers",
			description: "Executing plans systematically"
		},
		{
			name: "verification-before-completion",
			repo: "obra/superpowers",
			description: "Verify work before marking complete"
		},
		{
			name: "page-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Landing page optimization"
		},
		{
			name: "onboarding-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Onboarding conversion optimization"
		},
		{
			name: "form-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Form conversion optimization"
		},
		{
			name: "signup-flow-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Signup flow optimization"
		},
		{
			name: "paywall-upgrade-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Paywall and upgrade flows"
		},
		{
			name: "ab-test-setup",
			repo: "coreyhaines31/marketingskills",
			description: "A/B testing methodology"
		},
		{
			name: "referral-program",
			repo: "coreyhaines31/marketingskills",
			description: "Referral program design"
		},
		{
			name: "free-tool-strategy",
			repo: "coreyhaines31/marketingskills",
			description: "Free tool as lead magnet"
		},
		{
			name: "competitor-alternatives",
			repo: "coreyhaines31/marketingskills",
			description: "Competitor alternative pages"
		}
	],
	engineering: [
		{
			name: "vercel-react-best-practices",
			repo: "vercel-labs/agent-skills",
			description: "React/Next.js performance patterns"
		},
		{
			name: "vercel-composition-patterns",
			repo: "vercel-labs/agent-skills",
			description: "React composition patterns that scale"
		},
		{
			name: "web-design-guidelines",
			repo: "vercel-labs/agent-skills",
			description: "Web interface guidelines compliance"
		},
		{
			name: "v0-automation",
			repo: "composiohq/awesome-claude-skills",
			description: "V0 automation for rapid UI development"
		},
		{
			name: "premium-frontend-design",
			repo: "kv0906/cc-skills",
			description: "Premium frontend design patterns"
		},
		{
			name: "better-auth-best-practices",
			repo: "better-auth/skills",
			description: "Better Auth implementation patterns"
		},
		{
			name: "building-native-ui",
			repo: "expo/skills",
			description: "Building native UI with Expo"
		},
		{
			name: "systematic-debugging",
			repo: "obra/superpowers",
			description: "Systematic debugging methodology"
		},
		{
			name: "test-driven-development",
			repo: "obra/superpowers",
			description: "TDD best practices"
		},
		{
			name: "requesting-code-review",
			repo: "obra/superpowers",
			description: "Request effective code reviews"
		},
		{
			name: "receiving-code-review",
			repo: "obra/superpowers",
			description: "Handle code review feedback"
		},
		{
			name: "subagent-driven-development",
			repo: "obra/superpowers",
			description: "Use subagents effectively"
		},
		{
			name: "dispatching-parallel-agents",
			repo: "obra/superpowers",
			description: "Parallel agent orchestration"
		},
		{
			name: "finishing-a-development-branch",
			repo: "obra/superpowers",
			description: "Clean branch completion workflow"
		},
		{
			name: "using-git-worktrees",
			repo: "obra/superpowers",
			description: "Git worktree best practices"
		},
		{
			name: "writing-skills",
			repo: "obra/superpowers",
			description: "Write effective agent skills"
		}
	],
	design: [
		{
			name: "frontend-design",
			repo: "anthropics/skills",
			description: "Frontend design best practices"
		},
		{
			name: "design-md",
			repo: "google-labs-code/stitch-skills",
			description: "Design documentation in markdown"
		},
		{
			name: "ui-ux-pro-max",
			repo: "nextlevelbuilder/ui-ux-pro-max-skill",
			description: "Pro-level UI/UX design patterns"
		},
		{
			name: "explainer-video-guide",
			repo: "inference-sh-6/skills",
			description: "Explainer video creation guide"
		},
		{
			name: "audit-website",
			repo: "squirrelscan/skills",
			description: "Website audit methodology"
		}
	],
	marketing: [
		{
			name: "copywriting",
			repo: "coreyhaines31/marketingskills",
			description: "Persuasive copywriting"
		},
		{
			name: "marketing-psychology",
			repo: "coreyhaines31/marketingskills",
			description: "Psychology in marketing"
		},
		{
			name: "seo-audit",
			repo: "coreyhaines31/marketingskills",
			description: "SEO audit and optimization"
		},
		{
			name: "programmatic-seo",
			repo: "coreyhaines31/marketingskills",
			description: "Programmatic SEO strategies"
		},
		{
			name: "content-strategy",
			repo: "coreyhaines31/marketingskills",
			description: "Content strategy planning"
		},
		{
			name: "product-marketing-context",
			repo: "coreyhaines31/marketingskills",
			description: "Product marketing fundamentals"
		},
		{
			name: "marketing-ideas",
			repo: "coreyhaines31/marketingskills",
			description: "Creative marketing ideas"
		},
		{
			name: "social-content",
			repo: "coreyhaines31/marketingskills",
			description: "Social media content creation"
		},
		{
			name: "copy-editing",
			repo: "coreyhaines31/marketingskills",
			description: "Copy editing best practices"
		},
		{
			name: "pricing-strategy",
			repo: "coreyhaines31/marketingskills",
			description: "Pricing strategy development"
		},
		{
			name: "launch-strategy",
			repo: "coreyhaines31/marketingskills",
			description: "Product launch planning"
		},
		{
			name: "analytics-tracking",
			repo: "coreyhaines31/marketingskills",
			description: "Analytics and tracking setup"
		},
		{
			name: "email-sequence",
			repo: "coreyhaines31/marketingskills",
			description: "Email sequence creation"
		},
		{
			name: "paid-ads",
			repo: "coreyhaines31/marketingskills",
			description: "Paid advertising strategies"
		},
		{
			name: "seo",
			repo: "addyosmani/web-quality-skills",
			description: "SEO optimization"
		},
		{
			name: "seo-geo",
			repo: "resciencelab/opc-skills",
			description: "SEO for GEO (Generative Engine Optimization)"
		},
		{
			name: "backlink-analyzer",
			repo: "aaron-he-zhu/seo-geo-claude-skills",
			description: "Backlink analysis"
		},
		{
			name: "keyword-research",
			repo: "aaron-he-zhu/seo-geo-claude-skills",
			description: "Keyword research"
		},
		{
			name: "reddit",
			repo: "resciencelab/opc-skills",
			description: "Reddit marketing"
		},
		{
			name: "twitter",
			repo: "resciencelab/opc-skills",
			description: "Twitter/X marketing"
		},
		{
			name: "producthunt",
			repo: "resciencelab/opc-skills",
			description: "Product Hunt launch"
		},
		{
			name: "domain-hunter",
			repo: "resciencelab/opc-skills",
			description: "Domain finding"
		},
		{
			name: "requesthunt",
			repo: "resciencelab/opc-skills",
			description: "Request hunting"
		}
	],
	growth: [
		{
			name: "schema-markup",
			repo: "coreyhaines31/marketingskills",
			description: "Schema markup implementation"
		},
		{
			name: "popup-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Popup conversion optimization"
		}
	]
}

export type SkillCategory = keyof typeof STARTUP_SKILLS

const ALL_SKILLS = Object.values(STARTUP_SKILLS).flat()
const SKILL_MAP = new Map(ALL_SKILLS.map((s) => [s.name, s]))

export function listSkills() {
	console.log("\n📦 StartupKit Skills\n")
	console.log("Available skill categories:\n")
	for (const [category, skills] of Object.entries(STARTUP_SKILLS)) {
		console.log(`  ${category} (${skills.length} skills)`)
		for (const skill of skills) {
			console.log(`    - ${skill.name}: ${skill.description}`)
		}
	}
	console.log("\nCommands:")
	console.log(
		"  startupkit init                           # Initialize project with AGENTS.md, SOUL.md, and skills"
	)
	console.log(
		"  startupkit skills add                     # Interactive selection"
	)
	console.log(
		"  startupkit skills add --all               # Install all skills"
	)
	console.log(
		"  startupkit skills add --category dev      # Install dev skills"
	)
	console.log(
		"  startupkit skills add brainstorming       # Install specific skill"
	)
	console.log(
		"  startupkit skills list --installed        # List installed skills"
	)
	console.log("  startupkit skills remove <skill>          # Remove a skill")
	console.log("  startupkit skills add --global            # Install globally")
	console.log(
		"  startupkit skills add --dry-run           # Preview without installing"
	)
}

export async function listInstalledSkills(global: boolean) {
	const globalFlag = global ? "--global" : ""
	const cmd = `npx skills list ${globalFlag}`.trim()
	try {
		execSync(cmd, { stdio: "inherit" })
	} catch {
		console.log("No skills installed.")
	}
}

export async function addSkills(options: {
	skill?: string
	category?: string
	all?: boolean
	agent?: string[]
	global?: boolean
	dryRun?: boolean
}) {
	const agents = options.agent?.length
		? options.agent
		: ["opencode", "claude-code"]
	const global = options.global ?? false
	const dryRun = options.dryRun ?? false

	if (options.skill) {
		await installSingleSkill(options.skill, agents, global, dryRun)
		return
	}

	if (options.all) {
		console.log("\n🚀 Installing all StartupKit skills...\n")
		await installAllSkills(agents, global, dryRun)
		return
	}

	if (options.category) {
		const category = options.category as SkillCategory
		if (!STARTUP_SKILLS[category]) {
			console.error(`Unknown category: ${options.category}`)
			console.log(
				`Available categories: ${Object.keys(STARTUP_SKILLS).join(", ")}`
			)
			process.exit(1)
		}
		console.log(`\n📦 Installing ${category} skills...\n`)
		await installCategorySkills(category, agents, global, dryRun)
		return
	}

	const categories = await checkbox({
		message: "Select skill categories to install:",
		choices: Object.keys(STARTUP_SKILLS).map((k) => ({
			name: `${k} (${STARTUP_SKILLS[k as SkillCategory].length} skills)`,
			value: k
		}))
	})

	if (categories.length === 0) {
		console.log("No categories selected. Exiting.")
		return
	}

	for (const category of categories) {
		console.log(`\n📦 Installing ${category} skills...\n`)
		await installCategorySkills(
			category as SkillCategory,
			agents,
			global,
			dryRun
		)
	}
}

async function installSingleSkill(
	skillName: string,
	agents: string[],
	global: boolean,
	dryRun: boolean
) {
	const skill = SKILL_MAP.get(skillName)
	if (!skill) {
		console.error(`Unknown skill: ${skillName}`)
		console.log("\nAvailable skills:")
		for (const [name, s] of SKILL_MAP) {
			console.log(`  - ${name}: ${s.description}`)
		}
		process.exit(1)
	}

	console.log(`\n📦 Installing ${skillName}...\n`)
	await installSkillsFromRepo(skill.repo, [skillName], agents, global, dryRun)
}

export async function installAllSkills(
	agents: string[],
	global: boolean,
	dryRun: boolean
) {
	for (const category of Object.keys(STARTUP_SKILLS)) {
		await installCategorySkills(
			category as SkillCategory,
			agents,
			global,
			dryRun
		)
	}
}

async function installCategorySkills(
	category: SkillCategory,
	agents: string[],
	global: boolean,
	dryRun: boolean
) {
	const skills = STARTUP_SKILLS[category]
	const repoMap = new Map<string, string[]>()
	for (const skill of skills) {
		const existing = repoMap.get(skill.repo) ?? []
		existing.push(skill.name)
		repoMap.set(skill.repo, existing)
	}

	for (const [repo, skillNames] of repoMap) {
		await installSkillsFromRepo(repo, skillNames, agents, global, dryRun)
	}
}

async function installSkillsFromRepo(
	repo: string,
	skillNames: string[],
	agents: string[],
	global: boolean,
	dryRun: boolean
) {
	const agentFlags = agents.map((a) => `--agent ${a}`).join(" ")
	const globalFlag = global ? "--global" : ""
	const skillFlags = skillNames.map((s) => `--skill ${s}`).join(" ")

	if (dryRun) {
		console.log(`  [DRY RUN] Would install from ${repo}:`)
		for (const name of skillNames) {
			console.log(`    - ${name}`)
		}
		console.log(`    Agents: ${agents.join(", ")}`)
		console.log(`    Global: ${global}`)
		return
	}

	const cmd =
		`npx skills add ${repo} ${agentFlags} ${skillFlags} ${globalFlag} -y`.trim()
	console.log(`  Installing from ${repo}...`)
	try {
		execSync(cmd, { stdio: "inherit" })
	} catch {
		console.error(`  Failed to install from ${repo}`)
	}
}

export async function removeSkill(options: {
	skill?: string
	agent?: string[]
	global?: boolean
}) {
	if (!options.skill) {
		const skillName = await input({ message: "Enter skill name to remove:" })
		if (!skillName) {
			console.log("No skill name provided.")
			return
		}
		options.skill = skillName
	}

	const agents = options.agent?.length
		? options.agent
		: ["opencode", "claude-code"]
	const agentFlags = agents.map((a) => `--agent ${a}`).join(" ")
	const globalFlag = options.global ? "--global" : ""
	const cmd =
		`npx skills remove --skill ${options.skill} ${agentFlags} ${globalFlag} -y`.trim()

	try {
		execSync(cmd, { stdio: "inherit" })
	} catch {
		console.error(`Failed to remove skill: ${options.skill}`)
	}
}

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
`

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
`

function getSubagentTemplate(category: keyof typeof STARTUP_SKILLS): string {
	const skills = STARTUP_SKILLS[category]
	const skillsList = skills
		.map((s) => `- **${s.name}**: ${s.description}`)
		.join("\n")

	const templates: Record<keyof typeof STARTUP_SKILLS, string> = {
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

${skillsList}

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

${skillsList}

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

${skillsList}

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

${skillsList}

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

${skillsList}

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
`
	}

	return templates[category]
}

export async function initSkills(options: {
	skipPrompts?: boolean
	global?: boolean
	skipSkills?: boolean
	agents?: string[]
}) {
	const agents = options.agents?.length
		? options.agents
		: ["opencode", "claude-code"]
	const skipPrompts = options.skipPrompts ?? false
	const global = options.global ?? false
	const skipSkills = options.skipSkills ?? false

	console.log("\n🚀 Initializing StartupKit Skills...\n")

	await createAgentsMd(skipPrompts)
	await createSoulMd(skipPrompts)
	await createSubagents(skipPrompts)

	if (!skipSkills) {
		console.log("\n📦 Installing default skills...\n")
		await installAllSkills(agents, global, false)
	}

	console.log("\n✅ StartupKit Skills initialized!\n")
	console.log("Next steps:")
	console.log("  1. Edit AGENTS.md to add project-specific context")
	console.log("  2. Edit SOUL.md to define your project's vision and values")
	console.log("  3. Edit .agents/*.md to customize subagent behavior")
	console.log("  4. Run 'startupkit skills list' to see installed skills")
}

async function createAgentsMd(skipPrompts: boolean) {
	const agentsPath = join(process.cwd(), "AGENTS.md")

	if (existsSync(agentsPath)) {
		if (!skipPrompts) {
			const overwrite = await confirm({
				message: "AGENTS.md already exists. Overwrite?",
				default: false
			})
			if (!overwrite) {
				console.log("  Skipping AGENTS.md (keeping existing)")
				return
			}
		} else {
			console.log("  Skipping AGENTS.md (already exists)")
			return
		}
	}

	writeFileSync(agentsPath, AGENTS_TEMPLATE)
	console.log("  Created AGENTS.md")
}

async function createSoulMd(skipPrompts: boolean) {
	const soulPath = join(process.cwd(), "SOUL.md")

	if (existsSync(soulPath)) {
		if (!skipPrompts) {
			const overwrite = await confirm({
				message: "SOUL.md already exists. Overwrite?",
				default: false
			})
			if (!overwrite) {
				console.log("  Skipping SOUL.md (keeping existing)")
				return
			}
		} else {
			console.log("  Skipping SOUL.md (already exists)")
			return
		}
	}

	let soulContent = SOUL_TEMPLATE

	if (!skipPrompts) {
		const projectName = await input({
			message: "Project name:",
			default: process.cwd().split("/").pop() || "My Project"
		})

		const vision = await input({
			message: "Project vision (one sentence):"
		})

		if (projectName || vision) {
			soulContent = soulContent.replace(
				"<!-- What is the ultimate vision for this project? -->",
				vision || ""
			)
		}
	}

	writeFileSync(soulPath, soulContent)
	console.log("  Created SOUL.md")
}

async function createSubagents(skipPrompts: boolean) {
	const agentsDir = join(process.cwd(), ".agents")

	if (!existsSync(agentsDir)) {
		mkdirSync(agentsDir, { recursive: true })
	}

	const categories = Object.keys(STARTUP_SKILLS) as Array<
		keyof typeof STARTUP_SKILLS
	>

	for (const category of categories) {
		const subagentPath = join(agentsDir, `${category}.md`)

		if (existsSync(subagentPath)) {
			if (!skipPrompts) {
				const overwrite = await confirm({
					message: `.agents/${category}.md already exists. Overwrite?`,
					default: false
				})
				if (!overwrite) {
					console.log(`  Skipping .agents/${category}.md (keeping existing)`)
					continue
				}
			} else {
				console.log(`  Skipping .agents/${category}.md (already exists)`)
				continue
			}
		}

		writeFileSync(subagentPath, getSubagentTemplate(category))
		console.log(`  Created .agents/${category}.md`)
	}
}
