# AI Development Agent Guidelines

**This is a SaaS application built with StartupKit** - a pnpm monorepo using **TypeScript**, **Next.js 16**, **React 19**, and **Turbo** for task orchestration.

The repository follows a modular architecture with workspace packages (`@repo/*`) and Next.js applications.

---

## Project Structure

### Workspace Layout

```
/
├── apps/                    # Your Next.js applications
│   └── (your apps go here)
├── packages/                # Shared workspace packages (@repo/*)
│   ├── analytics/          # @repo/analytics - Analytics integration
│   ├── auth/               # @repo/auth - Authentication (Better Auth)
│   ├── db/                 # @repo/db - Database with Drizzle ORM
│   ├── emails/             # @repo/emails - Email templates
│   ├── ui/                 # @repo/ui - Shadcn UI components
│   └── utils/              # @repo/utils - Utility functions
├── config/                 # Shared configurations
│   ├── biome/              # Biome linter/formatter config
│   └── typescript/         # TypeScript base configurations
└── pnpm-workspace.yaml     # Workspace & catalog definitions
```

### Package Architecture

**All packages are workspace packages** (not published to npm):
- **Package prefix**: `@repo/*` (e.g., `@repo/auth`, `@repo/ui`)
- **Source imports**: Packages import directly from `./src` (no build required in dev)
- **Workspace protocol**: Use `workspace:*` to reference other packages
- **pnpm catalogs**: Centralized version management (see `pnpm-workspace.yaml`)

**Optional: StartupKit published packages**:
- You can optionally use `@startupkit/*` packages from npm
- Example: `@startupkit/analytics`, `@startupkit/auth`
- These are published wrappers you can import instead of local `@repo/*` packages

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
	name: string
	email: string
}
```

**Avoid enums** - Use const objects with `as const` or string literal unions:
```typescript
const Role = {
	OWNER: "owner",
	MEMBER: "member"
} as const

type RoleType = typeof Role[keyof typeof Role]
```

**Use functional components with explicit interfaces**:
```typescript
interface ButtonProps {
	label: string
	onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
	return <button onClick={onClick}>{label}</button>
}
```

**Use the `function` keyword for pure functions**:
```typescript
function calculateTotal(items: Item[]): number {
	return items.reduce((sum, item) => sum + item.price, 0)
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
pnpm --filter @repo/ui build
pnpm --filter @repo/db db:generate
pnpm --filter web dev                    # Run specific app
```

### Dependency Catalogs

The workspace uses **pnpm catalogs** to manage shared dependency versions in `pnpm-workspace.yaml`:

**Available catalogs**:
- `catalog:stack` - Core stack (`next`, `@types/node`, `zod`)
- `catalog:react19` - React 19 and type definitions
- `catalog:react18` - React 18 (fallback)
- `catalog:ui` - UI dependencies (`lucide-react`, `framer-motion`, `tailwindcss`)
- `catalog:analytics` - Analytics packages (PostHog, etc.)
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

Database schema is defined in:
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
	createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

Use `relations` for joins:
```typescript
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions)
}))
```

### Environment Variables

Drizzle reads `DATABASE_URL` from environment:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

**Note**: For frontend environment variables, don't prefix with `NEXT_PUBLIC`. Instead, add them to `turbo.json` and the appropriate env initializer (e.g., `next.config.ts` under `env: { ... }`).

---

## UI Components (Shadcn)

### Component Location

All UI components live in:
```
packages/ui/src/components/
```

### Adding Components

Use the custom Shadcn wrapper script:
```bash
pnpm shadcn add button
pnpm shadcn add dialog
pnpm shadcn add card
```

This installs components into `packages/ui/` with the correct configuration.

### Importing Components

```typescript
import { Button } from "@repo/ui/components/button"
import { Dialog } from "@repo/ui/components/dialog"
import { Card } from "@repo/ui/components/card"
```

### Styling

- **Tailwind config**: `packages/ui/tailwind.config.ts`
- **Global styles**: `packages/ui/src/styles/index.css`
- **CSS output**: `packages/ui/dist/styles.css` (built via `pnpm build`)

Import styles in your Next.js app:
```typescript
import "@repo/ui/styles.css"
```

---

## Authentication (@repo/auth)

Built on [better-auth](https://better-auth.com) with dual client/server exports.

### Configuration

Authentication is configured in:
```
packages/auth/src/lib/auth.ts
```

This is where you:
- Configure authentication providers (Google, GitHub, etc.)
- Set session duration and refresh intervals
- Configure email sending for OTP
- Add authentication hooks and middleware

### Client-Side Usage

```typescript
import { AuthProvider, useAuth } from "@repo/auth"

// In root layout (wrap your app):
<AuthProvider user={user}>{children}</AuthProvider>

// In components:
function MyComponent() {
	const { user, isAuthenticated, logout, googleAuth, sendAuthCode, verifyAuthCode } = useAuth()
	
	return (
		<div>
			{isAuthenticated ? (
				<button onClick={logout}>Sign Out</button>
			) : (
				<button onClick={googleAuth}>Sign In with Google</button>
			)}
		</div>
	)
}
```

### Server-Side Usage

```typescript
import { withAuth, handler, auth } from "@repo/auth/server"

// In Server Components:
export default async function DashboardPage() {
	const { user, session } = await withAuth()
	
	if (!user) {
		redirect("/sign-in")
	}
	
	return <div>Welcome, {user.name}</div>
}

// In API routes (app/auth/[...all]/route.ts):
export const { GET, POST } = handler()
```

### Authentication Methods

1. **Google OAuth** - Configure via `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. **Email OTP** - One-time password via email (10-minute expiration)

Configure in `packages/auth/src/lib/auth.ts`:
```typescript
socialProviders: {
	google: {
		clientId: process.env.GOOGLE_CLIENT_ID as string,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
	}
}
```

### Auth Route Location

**CRITICAL**: Auth routes must be at `app/auth/[...all]/route.ts`, **NOT** `app/api/auth/[...all]/route.ts`.

```typescript
// apps/web/src/app/auth/[...all]/route.ts
import { handler } from "@repo/auth/server"

export const { GET, POST } = handler()
```

This matches the `basePath: "/auth"` configuration in `packages/auth/src/lib/auth.ts`.

### Session Configuration

Default configuration:
- **Expiration**: 7 days (604,800 seconds)
- **Update Age**: 24 hours (86,400 seconds) - sessions refresh every 24 hours when active

Customize in `packages/auth/src/lib/auth.ts`:
```typescript
session: {
	expiresIn: 60 * 60 * 24 * 7,  // 7 days
	updateAge: 60 * 60 * 24        // 24 hours
}
```

---

## Analytics (@repo/analytics)

PostHog integration with feature flags.

### Client-Side Usage

```typescript
import { AnalyticsProvider, useAnalytics } from "@repo/analytics"

// Wrap your app:
<AnalyticsProvider flags={flags}>{children}</AnalyticsProvider>

// In components:
function MyComponent() {
	const { identify, track, flags } = useAnalytics()
	
	useEffect(() => {
		track("page_viewed", { page: "dashboard" })
	}, [])
	
	return <div>Feature enabled: {flags.newFeature}</div>
}
```

### Server-Side Usage

```typescript
import { getFeatureFlags, identifyUser, trackEvent } from "@repo/analytics/server"

// Get feature flags for a user:
const flags = await getFeatureFlags(userId)

// Track events server-side:
await trackEvent({
	event: "user_signed_up",
	user: { id, email }
})
```

---

## File Placement Guidelines

### Where to Put New Files

| File Type | Location | Example |
|-----------|----------|---------|
| Next.js pages | `apps/{app}/src/app/` | `apps/web/src/app/dashboard/page.tsx` |
| App components | `apps/{app}/src/components/` | `apps/web/src/components/header.tsx` |
| Shared UI components | `packages/ui/src/components/` | `packages/ui/src/components/button.tsx` |
| Database tables | `packages/db/src/schema.ts` | Add to existing schema file |
| Database migrations | `packages/db/drizzle/` | Auto-generated via `pnpm db:generate` |
| Auth configuration | `packages/auth/src/lib/auth.ts` | Configure providers, session |
| Email templates | `packages/emails/src/templates/` | `packages/emails/src/templates/welcome.tsx` |
| Utility functions | `packages/utils/src/lib/` | `packages/utils/src/lib/string.ts` |
| Shared hooks | `packages/ui/src/hooks/` | `packages/ui/src/hooks/use-is-mobile.ts` |
| App-specific hooks | `apps/{app}/src/hooks/` | App-specific custom hooks |
| API routes | `apps/{app}/src/app/api/` | `apps/web/src/app/api/users/route.ts` |
| Auth API routes | `apps/{app}/src/app/auth/[...all]/` | `route.ts` (NOT in `/api/auth/`) |

### Creating New Apps

Add a new Next.js app to your monorepo:

1. **Use StartupKit CLI** (recommended):
   ```bash
   startupkit add next my-app
   ```

2. **Or manually**:
   - Create directory: `mkdir -p apps/my-app`
   - Copy structure from existing app
   - Update `apps/my-app/package.json` with app name
   - Add app-specific dependencies
   - Import from workspace packages: `@repo/auth`, `@repo/ui`, etc.

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
- ❌ `useExhaustiveDependencies` - OFF (for React hooks)

---

## React & Next.js Best Practices

### Server Components First

**Minimize `"use client"`** - Default to Server Components unless you need:
- Browser APIs (localStorage, window, etc.)
- Event handlers (onClick, onChange)
- React hooks (useState, useEffect)

**Bad**:
```typescript
"use client"

export function UserProfile({ userId }: { userId: string }) {
	const [user, setUser] = useState(null)
	
	useEffect(() => {
		fetch(`/api/users/${userId}`).then(/* ... */)
	}, [userId])
	
	return <div>{user?.name}</div>
}
```

**Good**:
```typescript
import { db } from "@repo/db"
import { eq } from "drizzle-orm"
import { users } from "@repo/db/schema"

async function UserProfile({ userId }: { userId: string }) {
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId)
	})
	
	return <div>{user?.name}</div>
}
```

### Client Component Patterns

When you need client-side state, **wrap in Suspense**:
```typescript
import { Suspense } from "react"

export default function Page() {
	return (
		<Suspense fallback={<Loading />}>
			<ClientComponent />
		</Suspense>
	)
}
```

**Use `nuqs` for URL state management** (search params):
```typescript
import { useQueryState } from "nuqs"

function SearchComponent() {
	const [search, setSearch] = useQueryState("q")
	
	return <input value={search ?? ""} onChange={(e) => setSearch(e.target.value)} />
}
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
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
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

**Use environment variable wrappers**:
- `pnpm with-env` → Loads `.env.local` (for development)
- `pnpm with-test-env` → Loads `.env.test` (for testing)

**Development commands**:
```bash
pnpm with-env pnpm dev                           # Start dev servers
pnpm with-env pnpm --filter @repo/db db:migrate  # Run migrations
pnpm with-env pnpm --filter web dev              # Start specific app
```

**Test commands**:
```bash
pnpm with-test-env pnpm test                         # Run all tests
pnpm with-test-env pnpm --filter @repo/analytics test  # Test specific package
```

**Why use these wrappers?**
- ✅ Automatically loads correct environment file
- ✅ Works across all packages in monorepo
- ✅ Prevents accidentally using wrong environment
- ✅ No need to manually export variables

---

## Testing

### Running Tests

**Always use `with-test-env` when running tests**:

```bash
pnpm with-test-env pnpm test                           # Run all tests
pnpm with-test-env pnpm --filter @repo/analytics test  # Test specific package
pnpm with-test-env turbo run test --ui stream          # Run tests via Turbo
```

Tests use the `.env.test` file for environment variables.

---

## AI Agent Instructions (Ruler)

This project uses [Ruler](https://github.com/intellectronica/ruler) to generate concatenated AI instructions.

### Updating Agent Instructions

Modify files in `.ruler/` directory:
```
.ruler/AGENTS.md       # Main agent guidelines
.ruler/*.md            # Additional context files
```

Then regenerate agent files:
```bash
pnpm agents.md
```

This updates `AGENTS.md`, `CLAUDE.md`, `WARP.md`, etc. at the repository root.

---

## Common Tasks Cheatsheet

### Add a new database table

1. Edit `packages/db/src/schema.ts`
2. Add table definition with proper types
3. Export inferred types: `export type User = typeof users.$inferSelect`
4. Add relations if needed
5. Generate migration: `pnpm db:generate`
6. Apply migration: `pnpm db:migrate`

Example:
```typescript
export const posts = pgTable("Post", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	content: text("content"),
	authorId: text("authorId").references(() => users.id),
	createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull()
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
```

### Add a new UI component

1. Run: `pnpm shadcn add component-name`
2. Component added to `packages/ui/src/components/`
3. Import in your app: `import { Component } from "@repo/ui/components/component-name"`

### Add a new page to Next.js app

1. Create file: `apps/{app}/src/app/my-page/page.tsx`
2. Use Server Component by default
3. Add client interactivity only where needed with `"use client"`

Example:
```typescript
// apps/web/src/app/dashboard/page.tsx
import { withAuth } from "@repo/auth/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
	const { user } = await withAuth()
	
	if (!user) {
		redirect("/sign-in")
	}
	
	return <div>Welcome, {user.name}</div>
}
```

### Add an email template

1. Create file: `packages/emails/src/templates/my-email.tsx`
2. Use React Email components
3. Export from `packages/emails/src/index.tsx`

Example:
```typescript
// packages/emails/src/templates/welcome.tsx
import { Html, Text, Button } from "@react-email/components"

export function WelcomeEmail({ name }: { name: string }) {
	return (
		<Html>
			<Text>Welcome, {name}!</Text>
			<Button href="https://example.com">Get Started</Button>
		</Html>
	)
}
```

### Add authentication provider

1. Edit `packages/auth/src/lib/auth.ts`
2. Add to `socialProviders`:
   ```typescript
   socialProviders: {
   	google: { /* ... */ },
   	github: {
   		clientId: process.env.GITHUB_CLIENT_ID as string,
   		clientSecret: process.env.GITHUB_CLIENT_SECRET as string
   	}
   }
   ```
3. Add environment variables to `.env.local`
4. Update sign-in page to use new provider

---

## Troubleshooting

### Build Failures

```bash
pnpm clean       # Clear build caches
pnpm install     # Reinstall dependencies
pnpm build       # Rebuild all packages
```

### Type Errors

```bash
pnpm typecheck   # Check all packages for type errors
```

If workspace types are stale, restart your TypeScript server in your IDE.

### Database Issues

```bash
pnpm db:push    # Sync schema without migrations (dev only)
pnpm db:studio  # Inspect database with GUI
```

Common issues:
- **Connection errors**: Check `DATABASE_URL` in `.env.local`
- **Migration conflicts**: Reset database with `pnpm db:push` in dev
- **Schema drift**: Always generate migrations before pushing to production

### Module Resolution

If imports fail:
- Ensure package is listed in `pnpm-workspace.yaml`
- Check package has correct `exports` in `package.json`
- Run `pnpm install` after adding new packages
- Restart TypeScript server

### Auth Issues

Common auth problems:
- **Routes not working**: Ensure auth route is at `app/auth/[...all]/route.ts` NOT `app/api/auth/[...all]/route.ts`
- **Session not persisting**: Check cookie settings and `basePath` configuration
- **OAuth errors**: Verify environment variables are set correctly
- **Email OTP not sending**: Configure `sendVerificationOTP` in `packages/auth/src/lib/auth.ts`

---

## Code Comments Policy

**Do NOT include useless comments.** Only add comments if **ABSOLUTELY NECESSARY** to explain:
- Complex algorithms or business logic
- Non-obvious TypeScript type assertions
- Workarounds for library bugs
- Performance-critical code

**Bad**:
```typescript
// Calculate total
const total = items.reduce((sum, item) => sum + item.price, 0)
```

**Good** (only if calculation is non-obvious):
```typescript
// Apply bulk discount: 10% off when quantity * price exceeds $1000
const total = items.reduce((sum, item) => {
	const subtotal = item.price * item.quantity
	const discount = subtotal > 1000 ? subtotal * 0.1 : 0
	return sum + subtotal - discount
}, 0)
```

---

## Summary for AI Agents

When working on this codebase:

1. ✅ **Auth routes at `app/auth/[...all]/`** - NOT `app/api/auth/[...all]/`
2. ✅ **Import from workspace packages** - Use `@repo/*` for all shared code
3. ✅ **Use strict TypeScript** - No `any`, prefer `interface`, avoid `enum`
4. ✅ **Follow Biome formatting** - Tabs, double quotes, 80-char lines
5. ✅ **Prefer Server Components** - Minimize `"use client"`
6. ✅ **Use pnpm catalogs** - Reference `catalog:stack`, `catalog:react19`, etc.
7. ✅ **Database workflow** - Edit schema → `pnpm db:generate` → `pnpm db:migrate`
8. ✅ **UI components** - Use `pnpm shadcn add component-name`
9. ✅ **Run tasks via Turbo** - `pnpm dev`, `pnpm build`, `pnpm lint:fix`
10. ✅ **Use env wrappers** - `pnpm with-env` for dev, `pnpm with-test-env` for tests
11. ✅ **Configure auth in** - `packages/auth/src/lib/auth.ts`
12. ✅ **Place files correctly** - See "File Placement Guidelines"
13. ✅ **No unnecessary comments** - Code should be self-documenting
