# StartupKit Framework - AI Development Agent Guidelines

**StartupKit** is a meta-framework for building SaaS applications. This repository contains the framework CLI, npm packages, and templates that developers scaffold with.

This is a **pnpm monorepo** built with **TypeScript**, **Next.js 16**, **React 19**, and **Turbo** for task orchestration.

---

## Project Structure

### Workspace Layout

```
/
├── apps/                    # Example Next.js applications
│   └── home/               # Marketing site for startupkit.com
├── packages/               # Published npm packages (@startupkit/*)
│   ├── analytics/         # @startupkit/analytics npm package
│   ├── auth/              # @startupkit/auth npm package
│   └── cli/               # startupkit CLI tool
├── templates/             # Scaffolding templates (used by CLI)
│   ├── next/              # Next.js app template
│   ├── package/           # Generic package template
│   ├── repo/              # Full monorepo template (@repo/* packages)
│   └── vite/              # Vite app template
├── config/                # Shared configurations
│   ├── biome/             # Biome linter/formatter config
│   └── typescript/        # TypeScript base configurations
└── pnpm-workspace.yaml    # Workspace & catalog definitions
```

### Package Architecture

**Published packages** (in root `packages/` - published to npm as `@startupkit/*`):
- **`packages/cli`** - The `startupkit` CLI tool for scaffolding projects
- **`packages/analytics`** - Published to npm as `@startupkit/analytics`
- **`packages/auth`** - Published to npm as `@startupkit/auth`

**Templates** (in `templates/` - used by CLI for scaffolding):
- **`templates/repo`** - Full monorepo template with `@repo/*` packages (most comprehensive)
- **`templates/next`** - Next.js app template
- **`templates/package`** - Generic package template
- **`templates/vite`** - Vite app template

**Important distinction**:
- `packages/*` → Published npm packages (`@startupkit/*`)
- `templates/repo/packages/*` → Workspace packages for scaffolded projects (`@repo/*`)

---

## Templates Architecture

**CRITICAL: Understanding the Templates Structure**

This repository contains **two types of templates** that work together differently than you might expect.

### Template Types

#### 1. `templates/repo` - Complete Monorepo Template

The **source of truth** for all workspace packages. Contains:

```
templates/repo/
├── packages/
│   ├── analytics/      # @repo/analytics - Analytics with PostHog
│   ├── auth/           # @repo/auth - Authentication (Better Auth wrapper)
│   ├── db/             # @repo/db - Database with Drizzle ORM
│   ├── emails/         # @repo/emails - Email templates
│   ├── ui/             # @repo/ui - Shadcn UI components
│   └── utils/          # @repo/utils - Utility functions
└── apps/               # (empty, apps go here when scaffolded)
```

**Key characteristics**:
- Contains **complete implementations** of all workspace packages
- Has its own Better Auth configuration in `packages/auth/src/lib/auth.ts`
- Has `authClient` exported from `packages/auth/src/index.ts`
- Uses `basePath: "/auth"` for auth routes
- This is what gets copied when users run `startupkit init`

#### 2. `templates/next` - Standalone Next.js App Template

A **Next.js app that expects to live in a workspace with `packages/`**. This is NOT standalone.

```
templates/next/
└── src/
    ├── app/
    │   ├── auth/[...all]/      # Auth API route (imports from @repo/auth/server)
    │   ├── dashboard/          # Example protected page
    │   ├── sign-in/            # Example sign-in page
    │   ├── layout.tsx          # Uses withAuth from @repo/auth/server
    │   └── providers.tsx       # Uses AuthProvider from @repo/auth
    └── components/
        ├── header.tsx          # Uses useAuth from @repo/auth
        └── ...
```

**Key characteristics**:
- **DOES NOT contain lib/auth.ts or lib/auth-client.ts** - these live in `@repo/auth`
- Imports from workspace packages: `@repo/auth`, `@repo/ui`, `@repo/db`, etc.
- Assumes these packages exist in `packages/*` directory at workspace root
- This template demonstrates **how to use** the workspace packages

### How Templates Relate to Each Other

```
When developers scaffold with StartupKit CLI:

1. Run `startupkit init` 
   → Copies `templates/repo/*` to project root
   → Creates packages/analytics, packages/auth, packages/db, etc.

2. Later: Add a new Next.js app
   → Copies `templates/next/*` to `apps/my-app/`
   → This app can now import from `@repo/auth`, `@repo/ui`, etc.
```

### Critical Rules for Working with Templates

#### ❌ DO NOT: Add Configuration Files to `templates/next`

**WRONG**:
```typescript
// ❌ DON'T create templates/next/src/lib/auth.ts
import { betterAuth } from "better-auth"
export const auth = betterAuth({ ... })
```

**WRONG**:
```typescript
// ❌ DON'T create templates/next/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({ ... })
```

**WHY**: These already exist in `templates/repo/packages/auth/` and are imported via workspace packages.

#### ✅ DO: Import from Workspace Packages

**CORRECT**:
```typescript
// templates/next/src/app/layout.tsx
import { withAuth } from "@repo/auth/server"

export default async function RootLayout({ children }) {
  const { user } = await withAuth()
  // ...
}
```

**CORRECT**:
```typescript
// templates/next/src/app/providers.tsx
import { AuthProvider } from "@repo/auth"

export function Providers({ children, user }) {
  return <AuthProvider user={user}>{children}</AuthProvider>
}
```

**CORRECT**:
```typescript
// templates/next/src/app/auth/[...all]/route.ts
import { handler } from "@repo/auth/server"

export const { GET, POST } = handler()
```

#### ❌ DO NOT: Add package dependencies already in workspace packages

**WRONG**:
```json
// templates/next/package.json
{
  "dependencies": {
    "better-auth": "^1.3.6",  // ❌ Already in @repo/auth
    "drizzle-orm": "^0.38.0"  // ❌ Already in @repo/db
  }
}
```

**CORRECT**:
```json
// templates/next/package.json
{
  "dependencies": {
    "@repo/auth": "workspace:*",    // ✅ Use workspace package
    "@repo/db": "workspace:*",      // ✅ Use workspace package
    "@repo/ui": "workspace:*"       // ✅ Use workspace package
  }
}
```

### Authentication Configuration Example

This is a perfect example of the templates relationship:

**In `templates/repo/packages/auth/src/lib/auth.ts`** (source of truth):
```typescript
export const auth = betterAuth({
  basePath: "/auth",
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [emailOTP({ sendVerificationOTP }), nextCookies()],
  socialProviders: { google: { ... } }
})
```

**In `templates/repo/packages/auth/src/index.ts`** (client export):
```typescript
export const authClient = createAuthClient({
  basePath: "/auth",
  plugins: [emailOTPClient()]
})
```

**In `templates/repo/packages/auth/src/server.ts`** (server export):
```typescript
export { auth } from "./lib/auth"
export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
export function handler() {
	return toNextJsHandler(auth.handler)
}
export async function withAuth(opts?: { flags?: boolean }) { ... }
```

**In `templates/next/src/app/auth/[...all]/route.ts`** (usage):
```typescript
import { handler } from "@repo/auth/server"  // ✅ Imports from workspace
export const { GET, POST } = handler()
```

### Auth Routes Configuration

**Critical**: The auth routes path must match the `basePath` configuration:

- `templates/repo/packages/auth/src/lib/auth.ts` sets `basePath: "/auth"`
- Therefore, Next.js apps need routes at `app/auth/[...all]/route.ts`
- **NOT** at `app/api/auth/[...all]/route.ts`
- Auth endpoints are served at `/auth/*` (e.g., `/auth/sign-in/google`)

### When to Modify Each Template

**Modify `templates/repo/packages/*`** when:
- Changing authentication configuration (providers, session duration)
- Adding new database tables or schema changes
- Adding new UI components to the shared library
- Changing email templates
- Modifying analytics tracking

**Modify `templates/next/`** when:
- Adding example pages that demonstrate package usage
- Creating new app-specific components
- Adding new routes or layouts
- Showing authentication patterns

### Testing Template Changes

When you modify templates, test in this order:

1. **Test `templates/repo` packages directly**:
   ```bash
   cd templates/repo
   pnpm install
   pnpm build
   pnpm typecheck
   ```

2. **Test `templates/next` in a workspace context**:
   ```bash
   # Create a test workspace
   mkdir test-workspace
   cp -r templates/repo/* test-workspace/
   cp -r templates/next test-workspace/apps/web
   cd test-workspace
   pnpm install
   pnpm --filter web build
   ```

### Common Mistakes to Avoid

1. ❌ **Creating duplicate configuration files in `templates/next`**
   - Don't create `lib/auth.ts` or `lib/auth-client.ts`
   - These belong in `templates/repo/packages/auth/`

2. ❌ **Adding dependencies that are already in workspace packages**
   - Check `templates/repo/packages/*/package.json` first
   - Use `workspace:*` references instead

3. ❌ **Using wrong import paths**
   - Use `@repo/auth` not `../../../packages/auth`
   - Use `@repo/auth/server` for server-side auth

4. ❌ **Mismatching auth route paths**
   - If `basePath: "/auth"` → use `app/auth/[...all]/route.ts`
   - If `basePath: "/api/auth"` → use `app/api/auth/[...all]/route.ts`

5. ❌ **Importing from wrong entry points**
   - Client: `import { useAuth } from "@repo/auth"`
   - Server: `import { withAuth } from "@repo/auth/server"`
   - Don't: `import { auth } from "@repo/auth"` (auth is server-only)

### Package Exports Pattern

All `templates/repo/packages/*` follow this pattern:

```typescript
// package.json
{
  "exports": {
    ".": "./src/index.ts",           // Client exports
    "./server": "./src/server.ts"    // Server exports (if needed)
  }
}
```

This allows dual-client/server packages like `@repo/auth`:
- `@repo/auth` → client exports (AuthProvider, useAuth, authClient)
- `@repo/auth/server` → server exports (auth, withAuth, handler)

### Adding New Features to Templates

**Example: Adding GitHub OAuth**

1. **Update the workspace package** (`templates/repo/packages/auth/src/lib/auth.ts`):
   ```typescript
   socialProviders: {
     google: { ... },
     github: {  // ← Add here
       clientId: process.env.GITHUB_CLIENT_ID as string,
       clientSecret: process.env.GITHUB_CLIENT_SECRET as string
     }
   }
   ```

2. **Update example usage** (`templates/next/src/app/sign-in/page.tsx`):
   ```typescript
   import { useAuth } from "@repo/auth"
   
   export function SignIn() {
     const { googleAuth, githubAuth } = useAuth()  // ← Use from @repo/auth
     return (
       <>
         <button onClick={googleAuth}>Google</button>
         <button onClick={githubAuth}>GitHub</button>  {/* ← Add example */}
       </>
     )
   }
   ```

3. **Update documentation** (`templates/next/README.md`):
   - Add GitHub to the list of auth methods
   - Show environment variables needed
   - Provide usage examples

**Key principle**: Configuration goes in `templates/repo/packages/*`, usage examples go in `templates/next/`.

---

## TypeScript & Code Quality Standards

### Strict TypeScript Configuration

The base TypeScript config (`config/typescript/base.json`) enforces:
- ✅ **`strict: true`** - All strict checks enabled
- ✅ **`strictNullChecks: true`** - Explicit null/undefined handling
- ✅ **`noUncheckedIndexedAccess: true`** - Array/object access returns `T | undefined`
- ✅ **`checkJs: true`** - Type-check JavaScript files
- ✅ **`moduleResolution: "bundler"`** - Modern module resolution

### Code Style Rules

**NEVER use `any`** - Biome's `noExplicitAny` is intentionally turned **OFF** in the config, but you should still avoid it. Use proper types, `unknown`, or generics instead.

**NEVER use `never`** unless modeling impossible states (e.g., exhaustive type guards or functions that throw).

**Prefer `interface` over `type`** for object shapes:
```typescript
interface UserProps {
  name: string;
  email: string;
}
```

**Avoid enums** - Use const objects with `as const` or string literal unions:
```typescript
const Role = {
  OWNER: "owner",
  MEMBER: "member"
} as const;

type RoleType = typeof Role[keyof typeof Role];
```

**Use functional components with explicit interfaces**:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

**Use the `function` keyword for pure functions**:
```typescript
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

---

## Package Management (pnpm)

### Core Commands

**Install dependencies**:
```bash
pnpm install
```

**Run tasks across packages** (via Turbo):
```bash
pnpm dev              # Start all dev servers
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm lint:fix         # Auto-fix linting issues
pnpm typecheck        # Type-check all packages
pnpm clean            # Clean build artifacts
```

**Run commands in specific packages**:
```bash
pnpm --filter @startupkit/analytics build
pnpm --filter startupkit build
```

### Publishing to npm

🚨 **CRITICAL: AI agents must NEVER run publish commands.**

Publishing packages to npm (`pnpm publish`, `npm publish`, or any variant) must **ONLY** be performed by humans. This includes:
- ❌ `pnpm publish`
- ❌ `npm publish`
- ❌ `pnpm --filter @startupkit/* publish`
- ❌ Any automated publishing scripts or CI commands

If a user requests package publishing, inform them that this must be done manually and cannot be automated by AI agents.

### Dependency Catalogs

The workspace uses **pnpm catalogs** to manage shared dependency versions in `pnpm-workspace.yaml`:

**Available catalogs**:
- `catalog:stack` - Core stack (`next`, `@types/node`, `zod`)
- `catalog:react19` - React 19 and type definitions
- `catalog:react18` - React 18 (fallback)
- `catalog:ui` - UI dependencies (`lucide-react`, `framer-motion`, `tailwindcss`, etc.)
- `catalog:analytics` - Analytics packages
- `catalog:otel` - OpenTelemetry, Sentry

**Using catalogs in `package.json`**:
```json
{
  "dependencies": {
    "next": "catalog:stack",
    "react": "catalog:react19",
    "lucide-react": "catalog:ui"
  }
}
```

---

## Database (Drizzle ORM)

### Schema Location

Database schema is defined in `@repo/db` package:
```
templates/repo/packages/db/src/schema.ts
```

In a scaffolded project, this will be at:
```
packages/db/src/schema.ts
```

### Migration Commands

**Generate migrations** (after modifying `schema.ts`):
```bash
pnpm db:generate
```
This creates SQL migration files in `packages/db/drizzle/`.

**Apply migrations** to database:
```bash
pnpm db:migrate
```

**Push schema** without migrations (dev only):
```bash
pnpm db:push
```

**Open Drizzle Studio** (database GUI):
```bash
pnpm db:studio
```

### Schema Patterns

Always export inferred types from tables:
```typescript
export const users = pgTable("User", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

Use `relations` for joins:
```typescript
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions)
}));
```

### Environment Variables

Drizzle reads `DATABASE_URL` from environment:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

If it's a ENV var meant to be used for frontend, don't prefix with EXPO_PUBLIC or NEXT_PUBLIC. Instead, add it to turbo.json and the appropriate env initializer (eg next.config.ts under env: { ... })

---

## UI Components (Shadcn)

### Component Location

All UI components live in `@repo/ui` package:
```
templates/repo/packages/ui/src/components/
```

In a scaffolded project, this will be at:
```
packages/ui/src/components/
```

### Adding Components

Use the custom Shadcn wrapper script:
```bash
pnpm shadcn add button
pnpm shadcn add dialog
```

This installs components into `packages/ui/` with the correct configuration.

### Importing Components

```typescript
import { Button } from "@repo/ui/components/button";
import { Dialog } from "@repo/ui/components/dialog";
```

### Styling

- **Tailwind config**: `packages/ui/tailwind.config.ts`
- **Global styles**: `packages/ui/src/styles/index.css`
- **CSS output**: `packages/ui/dist/styles.css` (built via `pnpm build`)

Import styles in your Next.js app:
```typescript
import "@repo/ui/styles.css";
```

---

## Authentication (@repo/auth)

Built on [better-auth](https://better-auth.com) with dual exports.

### Client-Side Usage

```typescript
import { AuthProvider, useAuth } from "@repo/auth";

// In root layout:
<AuthProvider user={user}>{children}</AuthProvider>

// In components:
const { user, isAuthenticated, logout, googleAuth, sendAuthCode, verifyAuthCode } = useAuth();
```

### Server-Side Usage

```typescript
import { withAuth, handler, auth } from "@repo/auth/server";

// In Server Components:
const { user, session } = await withAuth();

// API route handler (app/auth/[...all]/route.ts):
export const { GET, POST } = handler();
```

### Authentication Methods

1. **Google OAuth** - Configure via `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. **Email OTP** - One-time password via email (10-minute expiration)

### Session Configuration

- **Expiration**: 7 days
- **Auto-refresh**: Every 24 hours when active

---

## Analytics (@repo/analytics)

PostHog integration with feature flags.

### Client-Side

```typescript
import { AnalyticsProvider, useAnalytics } from "@repo/analytics";

<AnalyticsProvider flags={flags}>{children}</AnalyticsProvider>

const { identify, track, flags } = useAnalytics();
```

### Server-Side

```typescript
import { getFeatureFlags, identifyUser, trackEvent } from "@repo/analytics/server";

const flags = await getFeatureFlags(userId);
```

---

## File Placement Guidelines

### Where to Put New Files

**Note**: When referencing `packages/*` below, this refers to `templates/repo/packages/*` (for template development) or the user's scaffolded project `packages/*` (for app development). This is NOT the root `packages/*` which contains published npm packages.

| File Type | Location | Example |
|-----------|----------|---------|
| Next.js pages | `apps/{app-name}/src/app/` | `apps/web/src/app/dashboard/page.tsx` |
| React components (app-specific) | `apps/{app-name}/src/components/` | `apps/web/src/components/header.tsx` |
| UI components (shared) | `templates/repo/packages/ui/src/components/` | `button.tsx`, `dialog.tsx` |
| Database schema | `templates/repo/packages/db/src/schema.ts` | Add tables to existing schema |
| Database migrations | `templates/repo/packages/db/drizzle/` | Auto-generated via `pnpm db:generate` |
| Auth logic | `templates/repo/packages/auth/src/` | Extend `lib/auth.ts` or add hooks |
| Email templates | `templates/repo/packages/emails/src/templates/` | `welcome.tsx`, `verify-code.tsx` |
| Utility functions | `templates/repo/packages/utils/src/lib/` | `string.ts`, `date.ts`, `array.ts` |
| Hooks (shared) | `templates/repo/packages/ui/src/hooks/` | `use-is-mobile.ts` |
| Hooks (app-specific) | `apps/{app-name}/src/hooks/` | App-specific hooks |
| API routes | `apps/{app-name}/src/app/api/` | `apps/web/src/app/api/users/route.ts` |
| Auth API routes | `apps/{app-name}/src/app/auth/[...all]/` | Auth handler (NOT in `/api/auth/`) |

### Creating New Apps

To add a new Next.js app:
1. Copy the template: `cp -r templates/next apps/my-app`
2. Update `apps/my-app/package.json` name and description
3. Update imports and metadata in `apps/my-app/src/app/layout.tsx`

### Creating New Packages

To add a new package:
1. Copy the template: `cp -r templates/package packages/my-package`
2. Update `packages/my-package/package.json` name
3. Add exports in `src/index.ts`
4. Run `pnpm install` to register in workspace

---

## Linting & Formatting

### Biome Configuration

The project uses [Biome](https://biomejs.dev) for linting and formatting.

**Config location**: `config/biome/biome.jsonc`

**Key settings**:
- **Indentation**: Tabs (width: 2)
- **Line width**: 80 characters
- **Quotes**: Double quotes
- **Semicolons**: As needed (ASI)
- **Trailing commas**: None
- **Arrow parens**: Always

### Running Biome

```bash
pnpm lint         # Check all files
pnpm lint:fix     # Auto-fix issues
pnpm format       # Format code
```

### Important Lint Rules

- ✅ `noUnusedImports` - Remove unused imports
- ✅ `noUselessStringConcat` - Simplify string concatenation
- ❌ `noExplicitAny` - OFF (but you should still avoid `any`)
- ❌ `noForEach` - OFF (`.forEach()` is allowed)
- ❌ `useExhaustiveDependencies` - OFF (use ESLint if needed)

---

## React & Next.js Best Practices

### Server Components First

**Minimize `"use client"`** - Default to Server Components unless you need:
- Browser APIs (localStorage, window, etc.)
- Event handlers (onClick, onChange)
- React hooks (useState, useEffect)

**Bad**:
```typescript
"use client";

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(/* ... */);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

**Good**:
```typescript
async function UserProfile({ userId }: { userId: string }) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });
  
  return <div>{user?.name}</div>;
}
```

### Client Component Patterns

When you need client-side state, **wrap in Suspense**:
```typescript
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientComponent />
    </Suspense>
  );
}
```

**Use `nuqs` for URL state management** (search params):
```typescript
import { useQueryState } from "nuqs";

const [search, setSearch] = useQueryState("q");
```

### Performance Optimization

- **Images**: Use Next.js `<Image>`, WebP format, include dimensions, lazy load
- **Dynamic imports**: For non-critical components
- **Avoid unnecessary re-renders**: Use React.memo, useMemo, useCallback sparingly

---

## Environment Variables

### Required Variables

**Database**:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

**Authentication**:
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Analytics (optional)**:
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Monitoring (optional)**:
```bash
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
```

### Loading Variables

**Always use `with-env` and `with-test-env` wrappers** when running commands that need environment variables.

The project uses **dotenv-cli** to automatically load environment variables:
- `pnpm with-env` → Loads `.env.local` (for development)
- `pnpm with-test-env` → Loads `.env.test` (for testing)

**Development commands**:
```bash
pnpm with-env pnpm dev                              # Start dev servers
pnpm with-env pnpm --filter @repo/db db:migrate     # Run migrations
pnpm with-env pnpm --filter @repo/web dev           # Start specific app
```

**Test commands**:
```bash
pnpm with-test-env pnpm test                           # Run all tests
pnpm with-test-env pnpm --filter ./packages/analytics test  # Test specific package
pnpm with-test-env turbo run test --ui stream          # Run tests via Turbo
```

**Why use these wrappers?**
- ✅ Automatically loads correct environment file
- ✅ Works across all packages in monorepo
- ✅ Prevents accidentally using wrong environment
- ✅ No need to manually export variables

**Don't** run commands without the wrapper:
```bash
pnpm dev                    # ❌ Missing environment variables
pnpm --filter @repo/web dev # ❌ Won't load .env.local
```

---

## Testing

### Running Tests

**Always use `with-test-env` when running tests** to ensure proper environment variables are loaded.

```bash
pnpm with-test-env pnpm test                           # Run all tests
pnpm with-test-env pnpm --filter ./packages/analytics test  # Test specific package
pnpm with-test-env turbo run test --ui stream          # Run tests via Turbo
```

Tests use the `.env.test` file for environment variables (automatically loaded by `with-test-env`).

---

## AI Agent Instructions (Ruler)

This project uses [Ruler](https://github.com/intellectronica/ruler) to generate concatenated AI instructions.

### Updating Agent Instructions

Modify files in:
```
.ruler/AGENTS.md
.ruler/*.md
```

Then regenerate:
```bash
pnpm agents.md
```

This updates `AGENTS.md`, `CLAUDE.md`, `WARP.md`, etc. at the repository root.

---

## Common Tasks Cheatsheet

### Add a new database table

1. Edit `templates/repo/packages/db/src/schema.ts` (or `packages/db/src/schema.ts` in scaffolded project)
2. Add table definition and relations
3. Export types (`User`, `NewUser`)
4. Generate migration: `pnpm db:generate`
5. Apply migration: `pnpm db:migrate`

### Add a new UI component

1. Run: `pnpm shadcn add component-name`
2. Component added to `templates/repo/packages/ui/src/components/` (or `packages/ui/src/components/` in scaffolded project)
3. Import: `import { Component } from "@repo/ui/components/component-name"`

### Add a new page to Next.js app

1. Create: `apps/{app}/src/app/my-page/page.tsx`
2. Use Server Component by default
3. Add client interactivity only where needed

### Add an email template

1. Create: `templates/repo/packages/emails/src/templates/my-email.tsx` (or `packages/emails/src/templates/` in scaffolded project)
2. Use React Email components
3. Export from `packages/emails/src/index.tsx`

---

## Troubleshooting

### Build Failures

```bash
pnpm clean   # Clear build caches
pnpm install # Reinstall dependencies
pnpm build   # Rebuild all packages
```

### Type Errors

```bash
pnpm typecheck  # Check all packages
```

If workspace types are stale, restart your TypeScript server.

### Database Issues

```bash
pnpm db:push    # Sync schema without migrations (dev only)
pnpm db:studio  # Inspect database with GUI
```

### Module Resolution

If imports fail, ensure:
- Package is listed in `pnpm-workspace.yaml`
- Package has correct `exports` in `package.json`
- You've run `pnpm install` after adding new packages

---

## Code Comments Policy

**Do NOT include useless comments.** Only add comments if **ABSOLUTELY NECESSARY** to explain:
- Complex algorithms or business logic
- Non-obvious TypeScript type assertions
- Workarounds for library bugs
- Performance-critical code

**Bad**:
```typescript
const total = items.reduce((sum, item) => sum + item.price, 0);
```

**Good** (only if calculation is non-obvious):
```typescript
const total = items.reduce((sum, item) => {
  return sum + (item.price * item.quantity) - item.discount;
}, 0);
```

---

## Summary for AI Agents

When working on this codebase:

1. ✅ **Understand the dual package structure**:
   - `packages/*` → Published npm packages (`@startupkit/*`)
   - `templates/repo/packages/*` → Template workspace packages (`@repo/*`)
2. ✅ **Never duplicate auth config in `templates/next`** - It imports from `@repo/auth`
3. ✅ **Auth routes go in `app/auth/[...all]/`** - NOT `app/api/auth/[...all]/`
4. ✅ **Use strict TypeScript** - No `any`, prefer `interface`, avoid `enum`
5. ✅ **Follow Biome formatting** - Tabs, double quotes, 80-char lines
6. ✅ **Prefer Server Components** - Minimize `"use client"`
7. ✅ **Import from workspace packages** - Use `@repo/*` in templates/next
8. ✅ **Use pnpm catalogs** - Reference `catalog:stack`, `catalog:react19`, etc.
9. ✅ **Database changes** → `pnpm db:generate` → `pnpm db:migrate`
10. ✅ **UI components** → `pnpm shadcn add component-name`
11. ✅ **Run tasks via Turbo** - `pnpm dev`, `pnpm build`, `pnpm lint:fix`
12. ✅ **Use env wrappers** - `pnpm with-env` for dev, `pnpm with-test-env` for tests
13. ✅ **Place files correctly** - See "File Placement Guidelines" and "Templates Architecture"
14. ✅ **No unnecessary comments** - Code should be self-documenting
15. 🚨 **NEVER publish to npm** - Publishing packages (`pnpm publish`, `npm publish`) must ONLY be done by humans, never by AI agents
