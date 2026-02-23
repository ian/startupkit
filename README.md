# StartupKit

Startup skills for AI agents.

**startupkit.com** | [GitHub](https://github.com/ian/startupkit)

## What is StartupKit?

StartupKit equips your project with a comprehensive set of AI agent skills covering product, engineering, design, and marketing expertise. Works with OpenCode and Claude Code.

One command to initialize:

```bash
npx startupkit init
```

This creates:

- **AGENTS.md** - Project context and agent instructions
- **SOUL.md** - Vision, mission, and values
- Installs all default skills

## Why StartupKit?

AI agents are only as good as their instructions. StartupKit provides curated skills that give your agents the expertise of a full startup team:

| Category        | Skills Include                                                    |
| --------------- | ----------------------------------------------------------------- |
| **Product**     | Brainstorming, planning, CRO, A/B testing, growth loops           |
| **Engineering** | React/Next.js patterns, debugging, TDD, code review, auth, mobile |
| **Design**      | UI/UX patterns, design documentation, website audits              |
| **Marketing**   | Copywriting, SEO, content strategy, social media, pricing         |

## Quick Start

```bash
# Initialize project (creates AGENTS.md, SOUL.md, installs skills)
npx startupkit init

# Skip prompts, use defaults
npx startupkit init -y

# Install globally
npx startupkit init --global

# Preview without installing skills
npx startupkit init --skip-skills

# Add skills interactively
npx startupkit skills add

# Install all skills
npx startupkit skills add --all

# Install specific category
npx startupkit skills add --category engineering

# Install single skill
npx startupkit skills add brainstorming

# Preview without installing
npx startupkit skills add --all --dry-run
```

## Supported Agents

- ✅ **OpenCode**
- ✅ **Claude Code**

Skills are installed to both `.opencode/skills/` and `.claude/skills/` by default.

## Commands

```bash
startupkit init                           # Initialize project with AGENTS.md, SOUL.md, and skills
startupkit init -y                        # Skip prompts, use defaults
startupkit init --global                  # Install skills globally
startupkit init --skip-skills             # Skip skill installation
startupkit skills                         # List available skills
startupkit skills add                     # Add skills interactively
startupkit skills add --all               # Install all skills
startupkit skills add --category product  # Install specific category
startupkit skills add brainstorming       # Install specific skill
startupkit skills list --installed        # List installed skills
startupkit skills remove <skill>          # Remove a skill
startupkit skills add --global            # Install globally
startupkit skills add --dry-run           # Preview without installing
```

## Skill Categories

### Product

- `brainstorming` - Ideation techniques
- `writing-plans` - Comprehensive planning
- `executing-plans` - Systematic execution
- `verification-before-completion` - Quality assurance
- `page-cro` - Landing page optimization
- `onboarding-cro` - Onboarding flows
- `ab-test-setup` - A/B testing
- `referral-program` - Referral systems

### Engineering

- `vercel-react-best-practices` - React/Next.js performance
- `vercel-composition-patterns` - Scalable component patterns
- `web-design-guidelines` - Web interface compliance
- `v0-automation` - V0 automation for rapid UI
- `premium-frontend-design` - Premium frontend patterns
- `better-auth-best-practices` - Better Auth patterns
- `building-native-ui` - Native UI with Expo
- `systematic-debugging` - Debug methodology
- `test-driven-development` - TDD practices

### Design

- `design-md` - Design documentation
- `ui-ux-pro-max` - Pro-level UI/UX patterns
- `explainer-video-guide` - Explainer video creation
- `audit-website` - Website audit methodology

### Marketing

- `copywriting` - Persuasive writing
- `marketing-psychology` - Consumer psychology
- `seo-audit` - SEO optimization
- `seo` - SEO best practices
- `seo-geo` - Generative Engine Optimization
- `keyword-research` - Keyword research
- `backlink-analyzer` - Backlink analysis
- `reddit` - Reddit marketing
- `twitter` - Twitter/X marketing
- `producthunt` - Product Hunt launch
- `pricing-strategy` - Pricing models
- `launch-strategy` - Product launches
- `email-sequence` - Email campaigns
- `paid-ads` - Advertising strategies

## Tech Stack

This CLI wraps the [skills.sh](https://skills.sh) ecosystem. Skills are SKILL.md files that work across AI agent platforms.

## License

ISC © 2025 01 Studio
