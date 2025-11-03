# AI Development Agent Guidelines

This is a **pnpm monorepo** built with **TypeScript**, **Next.js 16**, **React 19**, and **Turbo** for task orchestration. The repository follows a modular architecture with shared packages and Next.js applications.

---

## Project Structure

### Workspace Layout

```
/
├── apps/                    # Next.js applications (empty by default)
├── packages/                # Shared packages
│   ├── analytics/          # PostHog analytics integration
│   ├── auth/               # Better-auth authentication (client & server)
│   ├── db/                 # Drizzle ORM database layer (PostgreSQL)
│   ├── emails/             # React Email templates
│   ├── ui/                 # Shadcn UI component library
│   └── utils/              # Shared utility functions
├── config/                 # Shared configurations
│   ├── biome/              # Biome linter/formatter config
│   └── typescript/         # TypeScript base configurations
└── pnpm-workspace.yaml     # Workspace & catalog definitions
```

### Package Architecture

All packages are **workspace packages** (not published to npm) and use:
- **Source imports**: Packages import directly from `./src` (no build step required during development)
- **Workspace protocol**: Dependencies use `workspace:*` to reference other packages
- **pnpm catalogs**: Version management for shared dependencies (see `pnpm-workspace.yaml`)

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
pnpm --filter @repo/ui build
pnpm --filter @repo/db db:generate
```

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

All UI components live in:
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

// API route handler (app/api/auth/[...all]/route.ts):
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

| File Type | Location | Example |
|-----------|----------|---------|
| Next.js pages | `apps/{app-name}/src/app/` | `apps/web/src/app/dashboard/page.tsx` |
| React components (app-specific) | `apps/{app-name}/src/components/` | `apps/web/src/components/header.tsx` |
| UI components (shared) | `packages/ui/src/components/` | `packages/ui/src/components/button.tsx` |
| Database schema | `packages/db/src/schema.ts` | Add tables to existing schema |
| Database migrations | `packages/db/drizzle/` | Auto-generated via `pnpm db:generate` |
| Auth logic | `packages/auth/src/` | Extend `lib/auth.ts` or add hooks |
| Email templates | `packages/emails/src/templates/` | `packages/emails/src/templates/welcome.tsx` |
| Utility functions | `packages/utils/src/lib/` | `packages/utils/src/lib/string.ts` |
| Hooks | `packages/ui/src/hooks/` or app-specific hooks dir | |
| API routes | `apps/{app-name}/src/app/api/` | `apps/web/src/app/api/users/route.ts` |

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

1. Edit `packages/db/src/schema.ts`
2. Add table definition and relations
3. Export types (`User`, `NewUser`)
4. Generate migration: `pnpm db:generate`
5. Apply migration: `pnpm db:migrate`

### Add a new UI component

1. Run: `pnpm shadcn add component-name`
2. Component added to `packages/ui/src/components/`
3. Import: `import { Component } from "@repo/ui/components/component-name"`

### Add a new page to Next.js app

1. Create: `apps/{app}/src/app/my-page/page.tsx`
2. Use Server Component by default
3. Add client interactivity only where needed

### Add an email template

1. Create: `packages/emails/src/templates/my-email.tsx`
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

1. ✅ **Use strict TypeScript** - No `any`, prefer `interface`, avoid `enum`
2. ✅ **Follow Biome formatting** - Tabs, double quotes, 80-char lines
3. ✅ **Prefer Server Components** - Minimize `"use client"`
4. ✅ **Use workspace packages** - Import from `@repo/*`
5. ✅ **Use pnpm catalogs** - Reference `catalog:stack`, `catalog:react19`, etc.
6. ✅ **Database changes** → `pnpm db:generate` → `pnpm db:migrate`
7. ✅ **UI components** → `pnpm shadcn add component-name`
8. ✅ **Run tasks via Turbo** - `pnpm dev`, `pnpm build`, `pnpm lint:fix`
9. ✅ **Use env wrappers** - `pnpm with-env` for dev, `pnpm with-test-env` for tests
10. ✅ **Place files correctly** - See "File Placement Guidelines" above
11. ✅ **No unnecessary comments** - Code should be self-documenting
