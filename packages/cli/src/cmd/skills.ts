import { execSync } from "node:child_process";
import { checkbox } from "@inquirer/prompts";

export const STARTUP_SKILLS = {
  entrepreneur: [
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
  ],
  dev: [
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
  ],
  product: [
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

export async function skills(options: {
  category?: string;
  all?: boolean;
  list?: boolean;
  agent?: string[];
  global?: boolean;
}) {
  if (options.list) {
    console.log("\n📦 StartupKit Skills\n");
    console.log("Available skill categories:\n");
    for (const [category, skills] of Object.entries(STARTUP_SKILLS)) {
      console.log(`  ${category} (${skills.length} skills)`);
      for (const skill of skills) {
        console.log(`    - ${skill.name}: ${skill.description}`);
      }
    }
    console.log("\nUsage:");
    console.log("  startupkit skills add              # Interactive selection");
    console.log("  startupkit skills add --all        # Install all skills");
    console.log("  startupkit skills add --category dev  # Install dev skills");
    console.log("  startupkit skills add --global     # Install globally");
    return;
  }

  const agents = options.agent?.length
    ? options.agent
    : ["opencode", "claude-code"];

  if (options.all) {
    console.log("\n🚀 Installing all StartupKit skills...\n");
    await installAllSkills(agents, options.global ?? false);
    return;
  }

  if (options.category) {
    const category = options.category as SkillCategory;
    if (!STARTUP_SKILLS[category]) {
      console.error(`Unknown category: ${category}`);
      console.log(
        `Available categories: ${Object.keys(STARTUP_SKILLS).join(", ")}`,
      );
      process.exit(1);
    }
    console.log(`\n📦 Installing ${category} skills...\n`);
    await installCategorySkills(category, agents, options.global ?? false);
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
      options.global ?? false,
    );
  }
}

async function installAllSkills(agents: string[], global: boolean) {
  for (const category of Object.keys(STARTUP_SKILLS)) {
    await installCategorySkills(category as SkillCategory, agents, global);
  }
}

async function installCategorySkills(
  category: SkillCategory,
  agents: string[],
  global: boolean,
) {
  const skills = STARTUP_SKILLS[category];
  const agentFlags = agents.map((a) => `--agent ${a}`).join(" ");
  const globalFlag = global ? "--global" : "";

  const repoMap = new Map<string, string[]>();
  for (const skill of skills) {
    const existing = repoMap.get(skill.repo) ?? [];
    existing.push(skill.name);
    repoMap.set(skill.repo, existing);
  }

  for (const [repo, skillNames] of repoMap) {
    const skillFlags = skillNames.map((s) => `--skill ${s}`).join(" ");
    const cmd =
      `npx skills add ${repo} ${agentFlags} ${skillFlags} ${globalFlag} -y`.trim();
    console.log(`  Installing from ${repo}...`);
    try {
      execSync(cmd, { stdio: "inherit" });
    } catch {
      console.error(`  Failed to install from ${repo}`);
    }
  }
}
