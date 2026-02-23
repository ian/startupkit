import { execSync } from "node:child_process";
import { checkbox, input } from "@inquirer/prompts";

export const STARTUP_SKILLS = {
	product: [
		{
			name: "brainstorming",
			repo: "obra/superpowers",
			description: "Brainstorming and ideation techniques",
		},
		{
			name: "writing-plans",
			repo: "obra/superpowers",
			description: "Writing comprehensive plans",
		},
		{
			name: "executing-plans",
			repo: "obra/superpowers",
			description: "Executing plans systematically",
		},
		{
			name: "verification-before-completion",
			repo: "obra/superpowers",
			description: "Verify work before marking complete",
		},
		{
			name: "page-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Landing page optimization",
		},
		{
			name: "onboarding-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Onboarding conversion optimization",
		},
		{
			name: "form-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Form conversion optimization",
		},
		{
			name: "signup-flow-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Signup flow optimization",
		},
		{
			name: "paywall-upgrade-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Paywall and upgrade flows",
		},
		{
			name: "ab-test-setup",
			repo: "coreyhaines31/marketingskills",
			description: "A/B testing methodology",
		},
		{
			name: "referral-program",
			repo: "coreyhaines31/marketingskills",
			description: "Referral program design",
		},
		{
			name: "free-tool-strategy",
			repo: "coreyhaines31/marketingskills",
			description: "Free tool as lead magnet",
		},
		{
			name: "competitor-alternatives",
			repo: "coreyhaines31/marketingskills",
			description: "Competitor alternative pages",
		},
	],
	engineering: [
		{
			name: "vercel-react-best-practices",
			repo: "vercel-labs/agent-skills",
			description: "React/Next.js performance patterns",
		},
		{
			name: "vercel-composition-patterns",
			repo: "vercel-labs/agent-skills",
			description: "React composition patterns that scale",
		},
		{
			name: "web-design-guidelines",
			repo: "vercel-labs/agent-skills",
			description: "Web interface guidelines compliance",
		},
		{
			name: "v0-automation",
			repo: "composiohq/awesome-claude-skills",
			description: "V0 automation for rapid UI development",
		},
		{
			name: "premium-frontend-design",
			repo: "kv0906/cc-skills",
			description: "Premium frontend design patterns",
		},
		{
			name: "better-auth-best-practices",
			repo: "better-auth/skills",
			description: "Better Auth implementation patterns",
		},
		{
			name: "building-native-ui",
			repo: "expo/skills",
			description: "Building native UI with Expo",
		},
		{
			name: "systematic-debugging",
			repo: "obra/superpowers",
			description: "Systematic debugging methodology",
		},
		{
			name: "test-driven-development",
			repo: "obra/superpowers",
			description: "TDD best practices",
		},
		{
			name: "requesting-code-review",
			repo: "obra/superpowers",
			description: "Request effective code reviews",
		},
		{
			name: "receiving-code-review",
			repo: "obra/superpowers",
			description: "Handle code review feedback",
		},
		{
			name: "subagent-driven-development",
			repo: "obra/superpowers",
			description: "Use subagents effectively",
		},
		{
			name: "dispatching-parallel-agents",
			repo: "obra/superpowers",
			description: "Parallel agent orchestration",
		},
		{
			name: "finishing-a-development-branch",
			repo: "obra/superpowers",
			description: "Clean branch completion workflow",
		},
		{
			name: "using-git-worktrees",
			repo: "obra/superpowers",
			description: "Git worktree best practices",
		},
		{
			name: "writing-skills",
			repo: "obra/superpowers",
			description: "Write effective agent skills",
		},
	],
	design: [
		{
			name: "design-md",
			repo: "google-labs-code/stitch-skills",
			description: "Design documentation in markdown",
		},
		{
			name: "ui-ux-pro-max",
			repo: "nextlevelbuilder/ui-ux-pro-max-skill",
			description: "Pro-level UI/UX design patterns",
		},
		{
			name: "explainer-video-guide",
			repo: "inference-sh-6/skills",
			description: "Explainer video creation guide",
		},
		{
			name: "audit-website",
			repo: "squirrelscan/skills",
			description: "Website audit methodology",
		},
	],
	marketing: [
		{
			name: "copywriting",
			repo: "coreyhaines31/marketingskills",
			description: "Persuasive copywriting",
		},
		{
			name: "marketing-psychology",
			repo: "coreyhaines31/marketingskills",
			description: "Psychology in marketing",
		},
		{
			name: "seo-audit",
			repo: "coreyhaines31/marketingskills",
			description: "SEO audit and optimization",
		},
		{
			name: "programmatic-seo",
			repo: "coreyhaines31/marketingskills",
			description: "Programmatic SEO strategies",
		},
		{
			name: "content-strategy",
			repo: "coreyhaines31/marketingskills",
			description: "Content strategy planning",
		},
		{
			name: "product-marketing-context",
			repo: "coreyhaines31/marketingskills",
			description: "Product marketing fundamentals",
		},
		{
			name: "marketing-ideas",
			repo: "coreyhaines31/marketingskills",
			description: "Creative marketing ideas",
		},
		{
			name: "social-content",
			repo: "coreyhaines31/marketingskills",
			description: "Social media content creation",
		},
		{
			name: "copy-editing",
			repo: "coreyhaines31/marketingskills",
			description: "Copy editing best practices",
		},
		{
			name: "pricing-strategy",
			repo: "coreyhaines31/marketingskills",
			description: "Pricing strategy development",
		},
		{
			name: "launch-strategy",
			repo: "coreyhaines31/marketingskills",
			description: "Product launch planning",
		},
		{
			name: "analytics-tracking",
			repo: "coreyhaines31/marketingskills",
			description: "Analytics and tracking setup",
		},
		{
			name: "email-sequence",
			repo: "coreyhaines31/marketingskills",
			description: "Email sequence creation",
		},
		{
			name: "paid-ads",
			repo: "coreyhaines31/marketingskills",
			description: "Paid advertising strategies",
		},
		{
			name: "seo",
			repo: "addyosmani/web-quality-skills",
			description: "SEO optimization",
		},
		{
			name: "seo-geo",
			repo: "resciencelab/opc-skills",
			description: "SEO for GEO (Generative Engine Optimization)",
		},
		{
			name: "backlink-analyzer",
			repo: "aaron-he-zhu/seo-geo-claude-skills",
			description: "Backlink analysis",
		},
		{
			name: "keyword-research",
			repo: "aaron-he-zhu/seo-geo-claude-skills",
			description: "Keyword research",
		},
		{
			name: "reddit",
			repo: "resciencelab/opc-skills",
			description: "Reddit marketing",
		},
		{
			name: "twitter",
			repo: "resciencelab/opc-skills",
			description: "Twitter/X marketing",
		},
		{
			name: "producthunt",
			repo: "resciencelab/opc-skills",
			description: "Product Hunt launch",
		},
		{
			name: "domain-hunter",
			repo: "resciencelab/opc-skills",
			description: "Domain finding",
		},
		{
			name: "requesthunt",
			repo: "resciencelab/opc-skills",
			description: "Request hunting",
		},
	],
	growth: [
		{
			name: "schema-markup",
			repo: "coreyhaines31/marketingskills",
			description: "Schema markup implementation",
		},
		{
			name: "popup-cro",
			repo: "coreyhaines31/marketingskills",
			description: "Popup conversion optimization",
		},
	],
};

export type SkillCategory = keyof typeof STARTUP_SKILLS;

const ALL_SKILLS = Object.values(STARTUP_SKILLS).flat();
const SKILL_MAP = new Map(ALL_SKILLS.map((s) => [s.name, s]));

export function listSkills() {
	console.log("\n📦 StartupKit Skills\n");
	console.log("Available skill categories:\n");
	for (const [category, skills] of Object.entries(STARTUP_SKILLS)) {
		console.log(`  ${category} (${skills.length} skills)`);
		for (const skill of skills) {
			console.log(`    - ${skill.name}: ${skill.description}`);
		}
	}
	console.log("\nCommands:");
	console.log(
		"  startupkit init                           # Initialize project with AGENTS.md, SOUL.md, and skills",
	);
	console.log(
		"  startupkit skills add                     # Interactive selection",
	);
	console.log(
		"  startupkit skills add --all               # Install all skills",
	);
	console.log(
		"  startupkit skills add --category dev      # Install dev skills",
	);
	console.log(
		"  startupkit skills add brainstorming       # Install specific skill",
	);
	console.log(
		"  startupkit skills list --installed        # List installed skills",
	);
	console.log("  startupkit skills remove <skill>          # Remove a skill");
	console.log("  startupkit skills add --global            # Install globally");
	console.log(
		"  startupkit skills add --dry-run           # Preview without installing",
	);
}

export async function listInstalledSkills(global: boolean) {
	const globalFlag = global ? "--global" : "";
	const cmd = `npx skills list ${globalFlag}`.trim();
	try {
		execSync(cmd, { stdio: "inherit" });
	} catch {
		console.log("No skills installed.");
	}
}

export async function addSkills(options: {
	skill?: string;
	category?: string;
	all?: boolean;
	agent?: string[];
	global?: boolean;
	dryRun?: boolean;
}) {
	const agents = options.agent?.length
		? options.agent
		: ["opencode", "claude-code"];
	const global = options.global ?? false;
	const dryRun = options.dryRun ?? false;

	if (options.skill) {
		await installSingleSkill(options.skill, agents, global, dryRun);
		return;
	}

	if (options.all) {
		console.log("\n🚀 Installing all StartupKit skills...\n");
		await installAllSkills(agents, global, dryRun);
		return;
	}

	if (options.category) {
		const category = options.category as SkillCategory;
		if (!STARTUP_SKILLS[category]) {
			console.error(`Unknown category: ${options.category}`);
			console.log(
				`Available categories: ${Object.keys(STARTUP_SKILLS).join(", ")}`,
			);
			process.exit(1);
		}
		console.log(`\n📦 Installing ${category} skills...\n`);
		await installCategorySkills(category, agents, global, dryRun);
		return;
	}

	const categories = await checkbox({
		message: "Select skill categories to install:",
		choices: Object.keys(STARTUP_SKILLS).map((k) => ({
			name: `${k} (${STARTUP_SKILLS[k as SkillCategory].length} skills)`,
			value: k,
		})),
	});

	if (categories.length === 0) {
		console.log("No categories selected. Exiting.");
		return;
	}

	for (const category of categories) {
		console.log(`\n📦 Installing ${category} skills...\n`);
		await installCategorySkills(
			category as SkillCategory,
			agents,
			global,
			dryRun,
		);
	}
}

async function installSingleSkill(
	skillName: string,
	agents: string[],
	global: boolean,
	dryRun: boolean,
) {
	const skill = SKILL_MAP.get(skillName);
	if (!skill) {
		console.error(`Unknown skill: ${skillName}`);
		console.log("\nAvailable skills:");
		for (const [name, s] of SKILL_MAP) {
			console.log(`  - ${name}: ${s.description}`);
		}
		process.exit(1);
	}

	console.log(`\n📦 Installing ${skillName}...\n`);
	await installSkillsFromRepo(skill.repo, [skillName], agents, global, dryRun);
}

export async function installAllSkills(
	agents: string[],
	global: boolean,
	dryRun: boolean,
) {
	for (const category of Object.keys(STARTUP_SKILLS)) {
		await installCategorySkills(
			category as SkillCategory,
			agents,
			global,
			dryRun,
		);
	}
}

async function installCategorySkills(
	category: SkillCategory,
	agents: string[],
	global: boolean,
	dryRun: boolean,
) {
	const skills = STARTUP_SKILLS[category];
	const repoMap = new Map<string, string[]>();
	for (const skill of skills) {
		const existing = repoMap.get(skill.repo) ?? [];
		existing.push(skill.name);
		repoMap.set(skill.repo, existing);
	}

	for (const [repo, skillNames] of repoMap) {
		await installSkillsFromRepo(repo, skillNames, agents, global, dryRun);
	}
}

async function installSkillsFromRepo(
	repo: string,
	skillNames: string[],
	agents: string[],
	global: boolean,
	dryRun: boolean,
) {
	const agentFlags = agents.map((a) => `--agent ${a}`).join(" ");
	const globalFlag = global ? "--global" : "";
	const skillFlags = skillNames.map((s) => `--skill ${s}`).join(" ");

	if (dryRun) {
		console.log(`  [DRY RUN] Would install from ${repo}:`);
		for (const name of skillNames) {
			console.log(`    - ${name}`);
		}
		console.log(`    Agents: ${agents.join(", ")}`);
		console.log(`    Global: ${global}`);
		return;
	}

	const cmd =
		`npx skills add ${repo} ${agentFlags} ${skillFlags} ${globalFlag} -y`.trim();
	console.log(`  Installing from ${repo}...`);
	try {
		execSync(cmd, { stdio: "inherit" });
	} catch {
		console.error(`  Failed to install from ${repo}`);
	}
}

export async function removeSkill(options: {
	skill?: string;
	agent?: string[];
	global?: boolean;
}) {
	if (!options.skill) {
		const skillName = await input({ message: "Enter skill name to remove:" });
		if (!skillName) {
			console.log("No skill name provided.");
			return;
		}
		options.skill = skillName;
	}

	const agents = options.agent?.length
		? options.agent
		: ["opencode", "claude-code"];
	const agentFlags = agents.map((a) => `--agent ${a}`).join(" ");
	const globalFlag = options.global ? "--global" : "";
	const cmd =
		`npx skills remove --skill ${options.skill} ${agentFlags} ${globalFlag} -y`.trim();

	try {
		execSync(cmd, { stdio: "inherit" });
	} catch {
		console.error(`Failed to remove skill: ${options.skill}`);
	}
}
