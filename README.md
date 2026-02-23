# StartupKit

Startup skills for AI agents.

**startupkit.com** | [GitHub](https://github.com/ian/startupkit)

## What is StartupKit?

StartupKit equips your project with a comprehensive set of AI agent skills covering entrepreneur, dev, marketing, and product expertise. Works with OpenCode and Claude Code.

One command to install:

```bash
npx startupkit skills add
```

## Why StartupKit?

AI agents are only as good as their instructions. StartupKit provides curated skills that give your agents the expertise of a full startup team:

| Category         | Skills Include                                      |
| ---------------- | --------------------------------------------------- |
| **Entrepreneur** | Brainstorming, planning, execution, verification    |
| **Dev**          | React/Next.js patterns, debugging, TDD, code review |
| **Marketing**    | Copywriting, SEO, content strategy, pricing         |
| **Product**      | CRO, onboarding, A/B testing, growth loops          |

## Quick Start

```bash
# Interactive selection
npx startupkit skills add

# Install all skills
npx startupkit skills add --all

# Install specific category
npx startupkit skills add --category dev

# Install single skill
npx startupkit skills add brainstorming

# Preview without installing
npx startupkit skills add --all --dry-run

# Install globally (to ~/.agents/skills/)
npx startupkit skills add --global
```

## Supported Agents

- ✅ **OpenCode**
- ✅ **Claude Code**

Skills are installed to both `.opencode/skills/` and `.claude/skills/` by default.

## Commands

```bash
startupkit skills                        # List available skills
startupkit skills add                    # Add skills interactively
startupkit skills add --all              # Install all skills
startupkit skills add --category dev     # Install specific category
startupkit skills add brainstorming      # Install specific skill
startupkit skills list --installed       # List installed skills
startupkit skills remove <skill>         # Remove a skill
startupkit skills add --global           # Install globally
startupkit skills add --dry-run          # Preview without installing
```

## Skill Categories

### Entrepreneur

- `brainstorming` - Ideation techniques
- `writing-plans` - Comprehensive planning
- `executing-plans` - Systematic execution
- `verification-before-completion` - Quality assurance

### Dev

- `vercel-react-best-practices` - React/Next.js performance
- `vercel-composition-patterns` - Scalable component patterns
- `web-design-guidelines` - Web interface compliance
- `systematic-debugging` - Debug methodology
- `test-driven-development` - TDD practices
- `requesting-code-review` - Effective code reviews
- `receiving-code-review` - Handling feedback
- `subagent-driven-development` - Subagent patterns
- `dispatching-parallel-agents` - Parallel orchestration

### Marketing

- `copywriting` - Persuasive writing
- `marketing-psychology` - Consumer psychology
- `seo-audit` - SEO optimization
- `programmatic-seo` - Scale SEO strategies
- `content-strategy` - Content planning
- `pricing-strategy` - Pricing models
- `launch-strategy` - Product launches
- `email-sequence` - Email campaigns
- `paid-ads` - Advertising strategies

### Product

- `page-cro` - Landing page optimization
- `onboarding-cro` - Onboarding flows
- `signup-flow-cro` - Signup optimization
- `ab-test-setup` - A/B testing
- `referral-program` - Referral systems

## Tech Stack

This CLI wraps the [skills.sh](https://skills.sh) ecosystem. Skills are SKILL.md files that work across AI agent platforms.

## License

ISC © 2025 01 Studio
