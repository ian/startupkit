# StartupKit CLI

The Zero to One Startup Framework - Bootstrap production-ready SaaS projects in seconds.

[**startupkit.com**](https://startupkit.com) | [GitHub](https://github.com/ian/startupkit) | [Documentation](https://startupkit.com)

## What is StartupKit?

StartupKit is a meta-framework for building SaaS applications. It's built on **Next.js 16**, **React 19**, **TypeScript**, and **Turbo** with authentication, analytics, database, and UI components pre-configured. Perfect for startups that want to focus on building features instead of infrastructure.

## Quick Start

### Create a New Project

```bash
npx startupkit init
```

This will:
- ✅ Prompt for your project name
- ✅ Clone the complete monorepo template
- ✅ Install all dependencies
- ✅ Set up workspace packages

### Add an App to Existing Project

```bash
npx startupkit add
```

Choose from:
- **Next.js** - Full-stack React application
- **Vite** - Lightweight frontend application
- **Package** - Shared workspace package

Or specify directly:

```bash
npx startupkit add next --name my-app
npx startupkit add vite --name landing
npx startupkit add pkg --name utils
```

## What's Included

The StartupKit monorepo includes:

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

## CLI Commands

### `init`

Initialize a new StartupKit project.

```bash
npx startupkit init
npx startupkit init --name my-project
```

**Options:**
- `--name <name>` - Project name (will be prompted if not provided)
- `--repo <repo>` - Custom template repository

### `add`

Add a new app or package to your workspace.

```bash
npx startupkit add
npx startupkit add next --name dashboard
npx startupkit add vite --name landing
npx startupkit add pkg --name shared-utils
```

**Options:**
- `--name <name>` - App/package name
- `--repo <repo>` - Custom template repository

### `help`

Show help information.

```bash
npx startupkit help
```

## Usage Examples

### Create a New SaaS Project

```bash
# Initialize project
npx startupkit init

# Navigate to project
cd my-project

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev

# Visit http://localhost:3000
```

### Add a Marketing Site

```bash
# Inside your StartupKit project
npx startupkit add next --name marketing

# Start only the marketing app
pnpm --filter marketing dev
```

### Add a Custom Package

```bash
# Inside your StartupKit project
npx startupkit add pkg --name api-client

# The package will be added to packages/api-client
# Import it in your apps: import { client } from "@repo/api-client"
```

## Common Tasks

### Start Development Server

```bash
pnpm dev                           # All apps
pnpm --filter web dev             # Specific app
```

### Build for Production

```bash
pnpm build                        # All packages
pnpm --filter web build          # Specific app
```

### Run Database Migrations

```bash
pnpm db:generate                  # Generate migration files
pnpm db:migrate                   # Apply migrations
pnpm db:studio                    # Open database GUI
```

### Add UI Components

```bash
pnpm shadcn add button
pnpm shadcn add dialog
```

### Lint & Format

```bash
pnpm lint                         # Check all files
pnpm lint:fix                     # Fix issues
```

### Type Check

```bash
pnpm typecheck                    # Check all packages
```

## Environment Setup

After initialization, configure your environment variables:

```bash
# .env.local

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

### ⚡ Ship Faster

Skip weeks of setup. Authentication, database, analytics, and UI components are pre-configured and ready to use.

### 🏗️ Production Ready

Built with best practices: TypeScript strict mode, type-safe database queries, secure authentication, and optimized builds.

### 🔧 Fully Customizable

You own the code. Extend, modify, or replace any part of the framework. No vendor lock-in.

### 📦 Monorepo Architecture

Share code between apps effortlessly. Build once, import everywhere.

### 🚀 Optimized for AI Development

Clear structure and conventions make it easy for AI assistants to navigate and build features.

## Support & Resources

- **Website:** [startupkit.com](https://startupkit.com)
- **GitHub:** [github.com/ian/startupkit](https://github.com/ian/startupkit)
- **Issues:** [github.com/ian/startupkit/issues](https://github.com/ian/startupkit/issues)

## License

ISC © 2025 01 Studio

---

**Built for founders, optimized for AI.** 🚀

