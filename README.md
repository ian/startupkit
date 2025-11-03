# StartupKit

The Zero to One Startup Framework - Bootstrap production-ready SaaS projects in seconds.

[**startupkit.com**](https://startupkit.com) | [GitHub](https://github.com/ian/startupkit) | [Documentation](https://startupkit.com)

## What is StartupKit?

StartupKit is a meta-framework for building SaaS applications. It's built on **Next.js 16**, **React 19**, **TypeScript**, and **Turbo** with authentication, analytics, database, and UI components pre-configured. Perfect for startups that want to focus on building features instead of infrastructure.

## Quick Start

```bash
npx startupkit init
cd my-project
cp .env.example .env.local
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## What's Included

### 📦 Pre-Built Packages

- **`@startupkit/auth`** - Authentication with Better Auth (Google OAuth, Email OTP)
- **`@startupkit/analytics`** - Provider-agnostic analytics hooks and context
- **`@startupkit/utils`** - Common utilities for SaaS applications

### 🏗️ Monorepo Setup

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

### 📧 Email

- **React Email** - Beautiful email templates with React
- **Resend** - Transactional email delivery

## Project Structure

```
my-project/
├── apps/
│   ├── web/              # Main Next.js application
│   └── mobile/           # Optional: Expo/React Native
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
└── pnpm-workspace.yaml   # Workspace definition
```

## Common Tasks

### Development

```bash
pnpm dev                  # Start all apps
pnpm --filter web dev     # Start specific app
pnpm build                # Build all packages
```

### Database

```bash
pnpm db:generate          # Generate migration files
pnpm db:migrate           # Apply migrations
pnpm db:studio            # Open database GUI
```

### UI Components

```bash
pnpm shadcn add button
pnpm shadcn add dialog
```

### Code Quality

```bash
pnpm lint                 # Check all files
pnpm lint:fix             # Fix issues
pnpm typecheck            # Type check all packages
```

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
- **Monorepo:** pnpm + Turbo
- **Linting:** Biome

## Why StartupKit?

**⚡ Ship Faster** - Skip weeks of setup. Authentication, database, analytics, and UI components are pre-configured and ready to use.

**🏗️ Production Ready** - Built with best practices: TypeScript strict mode, type-safe database queries, secure authentication, and optimized builds.

**🔧 Fully Customizable** - You own the code. Extend, modify, or replace any part of the framework. No vendor lock-in.

**📦 Monorepo Architecture** - Share code between apps effortlessly. Build once, import everywhere.

**🚀 Optimized for AI Development** - Clear structure and conventions make it easy for AI assistants to navigate and build features.

## Support & Resources

- **Website:** [startupkit.com](https://startupkit.com)
- **GitHub:** [github.com/ian/startupkit](https://github.com/ian/startupkit)
- **Issues:** [github.com/ian/startupkit/issues](https://github.com/ian/startupkit/issues)

## License

ISC © 2025 01 Studio

---

**Built for founders, optimized for AI.** 🚀

