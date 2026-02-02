# StartupKit

The startup stack for the AI era.

[**startupkit.com**](https://startupkit.com) | [GitHub](https://github.com/ian/startupkit) | [Documentation](https://startupkit.com)

## What is StartupKit?

StartupKit is a meta-framework for building SaaS applications. Built for founders who move fast, loved by the AI tools that help them. Pre-configured auth, analytics, database, and UI components with clear patterns your copilot can follow.

One command to start:

```bash
npx startupkit init
```

## Why StartupKit?

### AI Needs Constraints to Be Useful

Without structure, every project becomes a different architecture. That's **AI slop**.

| Without StartupKit                  | With StartupKit                             |
| ----------------------------------- | ------------------------------------------- |
| Where should auth logic live?       | `@repo/auth` → Better Auth, ready           |
| Prisma or Drizzle? Which pattern?   | `@repo/db` → Drizzle + Postgres, configured |
| App router or pages? RSC or client? | Next.js 16 App Router, RSC by default       |
| How do I structure shared code?     | Monorepo → share everything                 |
| Which analytics provider?           | `@repo/analytics` → Provider-agnostic hooks |

**Start at 70%.** AI handles the details, not the foundation.

### Built for the New Era of Development

StartupKit is designed to work seamlessly with AI development tools:

- ✅ **Devin** ready
- ✅ **Claude** ready
- ✅ **Amp** ready
- ✅ **OpenCode** ready

Every project includes `AGENTS.md` with clear conventions, file placement guidelines, and architecture patterns that AI tools understand.

## Quick Start

```bash
npx startupkit init
cd my-project
cp .env.example .env.local
pnpm dev    # or: bun dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Package Manager:** StartupKit supports both [pnpm](https://pnpm.io) and [bun](https://bun.sh). Use whichever you prefer.

## What's Included

### 📦 Pre-Built Packages

- **`@repo/auth`** - Authentication with Better Auth (Google OAuth, Email OTP)
- **`@repo/analytics`** - Provider-agnostic analytics hooks and context
- **`@repo/db`** - Database with Drizzle ORM + PostgreSQL
- **`@repo/ui`** - 60+ Shadcn components, pre-configured
- **`@repo/emails`** - Email templates with React Email
- **`@repo/utils`** - Common utilities for SaaS applications

### 🏗️ Monorepo Architecture

- **pnpm workspaces** - Efficient dependency management
- **Turbo** - Fast task orchestration (build, dev, lint)
- **TypeScript** - Strict type checking across all packages
- **Biome** - Fast linting and formatting

### 🎨 UI & Styling

- **Shadcn UI** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Clean, consistent icons

### 🗄️ Database

- **Drizzle ORM** - Type-safe database access
- **PostgreSQL** - Production-ready database setup
- **Migrations** - Version-controlled schema changes

## Project Structure

```
my-project/
├── apps/
│   └── web/              # Main Next.js application
├── packages/
│   ├── analytics/        # Analytics implementation
│   ├── auth/             # Authentication setup
│   ├── db/               # Database schema & migrations
│   ├── emails/           # Email templates
│   ├── ui/               # Shared UI components
│   └── utils/            # Utility functions
├── config/
│   ├── biome/            # Linter configuration
│   └── typescript/       # TypeScript configs
├── AGENTS.md             # AI development guidelines
└── pnpm-workspace.yaml   # Workspace definition
```

## Common Tasks

### Development

```bash
pnpm dev                  # Start all apps (or: bun dev)
pnpm --filter web dev     # Start specific app (or: bun --filter web dev)
pnpm build                # Build all packages (or: bun run build)
```

### Database

```bash
pnpm db:generate          # Generate migration files (or: bun db:generate)
pnpm db:migrate           # Apply migrations (or: bun db:migrate)
pnpm db:studio            # Open database GUI (or: bun db:studio)
```

### UI Components

```bash
pnpm shadcn add button    # or: bun shadcn add button
pnpm shadcn add dialog    # or: bun shadcn add dialog
```

### Code Quality

```bash
pnpm lint                 # Check all files (or: bun lint)
pnpm lint:fix             # Fix issues (or: bun lint:fix)
pnpm typecheck            # Type check all packages (or: bun typecheck)
```

## Add New Services

Expand your monorepo with new apps instantly:

- **Next.js** - Full-stack React framework ✅
- **Vite** - Lightning fast frontend tooling ✅
- **Expo** - React Native for mobile (coming soon)

## Environment Setup

Configure your environment variables in `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Shadcn UI + Tailwind CSS
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth
- **Email:** React Email + Resend
- **Monorepo:** pnpm or bun + Turbo
- **Linting:** Biome

## Support & Resources

- **Website:** [startupkit.com](https://startupkit.com)
- **GitHub:** [github.com/ian/startupkit](https://github.com/ian/startupkit)
- **Issues:** [github.com/ian/startupkit/issues](https://github.com/ian/startupkit/issues)

## License

ISC © 2025 01 Studio

---

**Stop burning tokens. Start shipping faster.** 🚀
