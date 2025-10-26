# Package Strategy Guidelines

> **Linear Ticket**: STARTUP-93 - "Figure out packages strategy"

StartupKit uses a hybrid package approach with both centralized NPM packages (`@startupkit/*`) and local workspace packages (`@repo/*`). This document provides clear guidelines for when to use each approach and how to structure packages effectively.

## Table of Contents

- [Package Types](#package-types)
- [When to Use Each Type](#when-to-use-each-type)
- [The Hybrid Pattern (Recommended)](#the-hybrid-pattern-recommended)
- [Decision Framework](#decision-framework)
- [Current Package Inventory](#current-package-inventory)
- [Analytics Package Strategy](#analytics-package-strategy)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Package Types

### Centralized Packages (@startupkit/*)

**Location**: `packages/`

**Characteristics**:
- Published to NPM
- Version-controlled with semantic versioning
- Compiled and optimized (rollup + TypeScript)
- Consumed via `package.json` dependencies
- Updates require version bumps and installation
- Slower iteration cycle

**Use Cases**:
- Reusable across multiple independent projects
- Core business logic with stable APIs
- Framework-agnostic utilities
- Packages that benefit from compilation/tree-shaking

### Local Workspace Packages (@repo/*)

**Location**: `templates/repo/packages/`

**Characteristics**:
- Private to the monorepo (`"private": true`)
- Not published to NPM
- Source consumed directly (no compilation)
- Linked via workspace protocol (`workspace:*`)
- Fast iteration and customization
- Project-specific

**Use Cases**:
- Project-specific integrations
- UI components requiring frequent customization
- Database schemas and migrations
- Email templates
- Configuration wrappers

## When to Use Each Type

### Use Centralized Packages (@startupkit/*) When:

✅ **Sharing across multiple projects**
- The package will be used in multiple independent codebases
- Not all consumers will be in the same monorepo

✅ **Stable, well-defined APIs**
- The API is mature and won't change frequently
- Breaking changes are infrequent and well-communicated

✅ **Framework-agnostic functionality**
- Pure business logic or utilities
- No tight coupling to project infrastructure

✅ **Compilation benefits**
- Tree-shaking provides meaningful bundle size reduction
- TypeScript compilation catches errors early
- Distribution requires optimization

### Use Local Packages (@repo/*) When:

✅ **Project-specific implementations**
- Tightly coupled to your database schema
- Uses project-specific environment variables
- Requires access to other local packages

✅ **Frequent customization needed**
- UI components that teams will modify heavily
- Configuration that varies per deployment
- Rapidly evolving features

✅ **Infrastructure integration**
- Database access (Prisma schemas)
- Email templates with project-specific branding
- Background job definitions

✅ **Source transparency desired**
- Teams should see and modify the source easily
- No compilation step speeds up iteration
- Example: shadcn/ui methodology

## The Hybrid Pattern (Recommended)

**The Shadcn Principle**: Import directly from upstream libraries. Only use `@startupkit/*` when it adds real value.

### Pattern Structure

```
Upstream Library           @startupkit/* Core      @repo/* Local
(posthog-js, stripe)   →   (minimal utils)    →   (your code)
    ↓ (YOU control)            ↓ (optional)         ↓ (customize)
Direct import              Use if helpful       Your implementation
```

### Benefits

1. **No Version Lock-in**: Upgrade posthog/stripe/better-auth anytime
2. **You Own The Code**: Full source transparency and customization
3. **Minimal Core**: @startupkit/* provides only utilities, not wrappers
4. **Direct Imports**: Like shadcn - import what you need directly

### When to Use Each Layer

**Import Directly (No @startupkit/*)**:
- Upstream library is good as-is (better-auth, posthog-js)
- Just need configuration (most cases)

**Use @startupkit/* Core (Minimal Utilities)**:
- Need multi-provider orchestration (analytics)
- Complex workflow management (billing lifecycle)
- Shared utilities across providers

**Always Have @repo/* Layer**:
- Your customizable implementation
- Project-specific configuration
- Integration with your @repo/db, @repo/emails, etc.

### Examples

**Direct Import** (No @startupkit/* needed):
```typescript
// @repo/auth/src/index.ts
import { createAuthClient } from "better-auth/react"; // DIRECT

export const authClient = createAuthClient({ /* your config */ });
```

**Minimal Core** (When it adds value):
```typescript
// @repo/analytics uses @startupkit/analytics utilities
import { createAnalyticsOrchestrator } from "@startupkit/analytics";
import posthog from "posthog-js"; // DIRECT
import rudderstack from "@rudderstack/analytics-js"; // DIRECT

export const analytics = createAnalyticsOrchestrator([
  posthogPlugin,
  rudderstackPlugin
]);
```

## Decision Framework

Use this flowchart to decide on package strategy:

```
┌─────────────────────────────────────┐
│ Will this be used across multiple   │
│ independent projects/codebases?     │
└─────────────┬───────────────────────┘
              │
         Yes  │  No
              │
    ┌─────────┴─────────┐
    │                   │
    v                   v
┌───────────┐   ┌──────────────┐
│Centralized│   │ Local Package│
│ Package   │   │   (@repo/*)  │
│(@startupkit/*) │   └──────────────┘
└───────────┘
    │
    v
┌─────────────────────────────────────┐
│ Does the project need custom        │
│ integrations or configuration?      │
└─────────────┬───────────────────────┘
              │
         Yes  │  No
              │
    ┌─────────┴─────────┐
    │                   │
    v                   v
┌───────────┐   ┌──────────────┐
│  Hybrid   │   │ Centralized  │
│  Pattern  │   │     Only     │
└───────────┘   └──────────────┘
```

### Decision Criteria

| Criterion | Centralized | Local | Hybrid |
|-----------|-------------|-------|--------|
| Multi-project use | ✅ Yes | ❌ No | ✅ Yes |
| Rapid iteration | ❌ No | ✅ Yes | ⚠️ Local layer only |
| Stable API | ✅ Required | ⚠️ Not required | ✅ Core only |
| Project-specific | ❌ No | ✅ Yes | ✅ Wrapper layer |
| Compilation needed | ✅ Yes | ❌ No | ✅ Core only |
| Source transparency | ❌ Hidden | ✅ Visible | ⚠️ Wrapper visible |

## Current Package Inventory

### Centralized Packages (@startupkit/*)

Located in `packages/`:

| Package | Version | Strategy | Purpose | Status |
|---------|---------|----------|---------|--------|
| `@startupkit/analytics` | 0.4.0 | **Minimal Core** | Analytics orchestration utilities (pruneEmpty, createOrchestrator) | ✅ Active |
| `@startupkit/auth` | 0.4.0 | **Minimal Core** | Auth helpers with StartupKit conventions (createAuth, AuthProvider) | ✅ Active |
| `@startupkit/utils` | 0.4.0 | **Centralized** | Basic utility functions (URL helpers) | ✅ Active |
| `@startupkit/cli` | - | **Centralized** | CLI tooling for StartupKit | ✅ Active |

**Note**: All @startupkit/* packages use **peer dependencies** - projects control upstream library versions (posthog-js, better-auth, etc.)

### Local Packages (@repo/*)

Located in `templates/repo/packages/`:

| Package | Strategy | Purpose | Upstream Dependencies |
|---------|----------|---------|--------------|
| `@repo/analytics` | **Direct Imports** | Type-safe analytics with PostHog + RudderStack | `posthog-js`, `@rudderstack/*` (you control versions) |
| `@repo/auth` | **Direct + Helpers** | Auth with better-auth + StartupKit helpers | `better-auth` (you control version) + `@startupkit/auth` |
| `@repo/ui` | **Pure Local** | shadcn-based UI components (source exports) | `@radix-ui/*` (you control versions) |
| `@repo/db` | **Pure Local** | Prisma database schema and client | `@prisma/client` |
| `@repo/emails` | **Pure Local** | React Email templates | `@react-email/*` |
| `@repo/jobs` | **Pure Local** | Trigger.dev background jobs | `@trigger.dev/*` |
| `@repo/utils` | **Pure Local** | Project-specific utilities (AWS, Slack, etc.) | Various |

**Key Point**: All @repo/* packages import directly from upstream libraries. You control all dependency versions and can upgrade anytime.

## Analytics Package Strategy

### The Solution

**@startupkit/analytics** has been refactored to be a **minimal core**:
- Provides orchestration utilities (for multi-provider setups)
- No bundled dependencies - uses peer dependencies
- Optional - only use if coordinating multiple providers

**@repo/analytics** imports directly from upstream:
- Direct imports: `posthog-js`, `@rudderstack/analytics-js`
- You control all dependency versions
- Can use `@startupkit/analytics` utilities if helpful
- Type-safe event tracking
- Server-side support

### Architecture

```typescript
// @repo/analytics imports DIRECTLY from upstream
import posthog from "posthog-js";                    // YOU control version
import { RudderAnalytics } from "@rudderstack/..."; // YOU control version

// Optionally use @startupkit/analytics utilities
import { pruneEmpty, stringifyValues } from "@startupkit/analytics";

// Your implementation
export const analytics = {
  track: (event, props) => {
    posthog.capture(event, pruneEmpty(props));
    rudderstack.track(event, stringifyValues(props));
  }
};
```

### Benefits

1. **No Version Lock-in**: Upgrade posthog/rudderstack anytime
2. **You Own The Code**: @repo/analytics code is yours to modify
3. **Minimal Core**: @startupkit/analytics is tiny (just utilities)
4. **Type Safety**: Define events in your types.ts

## Best Practices

### Versioning

**Centralized Packages**:
- Use semantic versioning (semver)
- Breaking changes increment major version
- Use the `scripts/bump` script to version all centralized packages together
- Keep centralized packages at the same version for consistency

**Local Packages**:
- No versioning needed
- Use `workspace:*` protocol in dependencies
- Changes are immediate across the monorepo

### Dependencies

**Centralized Packages**:
```json
{
  "dependencies": {
    "third-party-lib": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "next": "^14"
  }
}
```

**Local Packages**:
```json
{
  "dependencies": {
    "@repo/other-package": "workspace:*",
    "@startupkit/core-package": "0.4.0",
    "third-party-lib": "^1.0.0"
  }
}
```

**Hybrid Wrapper**:
```json
{
  "dependencies": {
    "@repo/db": "workspace:*",
    "@repo/emails": "workspace:*",
    "@startupkit/auth": "0.4.0"
  }
}
```

### Export Patterns

**Centralized (Compiled)**:
```json
{
  "main": "./dist/esm/index.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/esm/index.js"
    }
  }
}
```

**Local (Source)**:
```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

**Local (Component Library Pattern - shadcn)**:
```json
{
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./hooks": "./src/hooks/index.ts",
    "./utils": "./src/lib/utils.ts"
  }
}
```

### Build Scripts

**Centralized Package**:
```json
{
  "scripts": {
    "clean": "rm -rf ./dist ./.turbo",
    "build": "rollup -c && tsc --emitDeclarationOnly",
    "build:watch": "npx chokidar-cli \"src/**/*\" -c \"pnpm run build\" --initial",
    "type-check": "tsc --noEmit"
  }
}
```

**Local Package**:
```json
{
  "scripts": {
    "lint": "biome lint --unsafe",
    "lint:fix": "biome lint --write --unsafe",
    "typecheck": "tsc --noEmit"
  }
}
```

## Examples

### Example 1: Pure Centralized Package

**@startupkit/utils** provides framework-agnostic utility functions:

```typescript
// packages/utils/src/url.ts
export function parseUrl(url: string) {
  // Utility logic
}
```

**Usage**:
```json
{
  "dependencies": {
    "@startupkit/utils": "^0.4.0"
  }
}
```

```typescript
import { parseUrl } from "@startupkit/utils";
```

### Example 2: Pure Local Package

**@repo/ui** uses the shadcn methodology for maximum customizability:

```json
{
  "exports": {
    "./components/*": "./src/components/*.tsx"
  }
}
```

**Usage**:
```typescript
import { Button } from "@repo/ui/components/button";
```

Benefits:
- Full source transparency
- Easy customization
- No compilation step
- Direct TypeScript imports

### Example 3: Hybrid Pattern (Recommended)

**@repo/auth** wraps **@startupkit/auth** with project-specific integrations:

**Centralized Core** (`@startupkit/auth`):
```typescript
// Stable auth logic
export { createAuthClient } from "better-auth/react";
export * from "better-auth/client/plugins";
```

**Local Wrapper** (`@repo/auth`):
```typescript
// templates/repo/packages/auth/src/index.ts
import { createAuthClient } from "@startupkit/auth";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  basePath: "/auth",
  plugins: [adminClient()],
});
```

**Usage in app**:
```typescript
import { authClient } from "@repo/auth";
```

Benefits:
- Stable core auth logic from @startupkit/auth
- Project-specific configuration in @repo/auth
- Easy to update core package
- Custom integrations don't pollute core package

### Example 4: Server-Side Integration

**@repo/analytics** provides type-safe server-side tracking:

```typescript
// templates/repo/packages/analytics/src/types.ts
export type UserSignedUp = {
  event: "USER_SIGNED_UP";
  user: AuthUser;
};
```

```typescript
// templates/repo/packages/analytics/src/server.ts
export async function track(eventData: AnalyticsEvent) {
  // RudderStack integration
}
```

**Usage**:
```typescript
import { track } from "@repo/analytics/server";

await track({
  event: "USER_SIGNED_UP",
  user: { id: "123", email: "user@example.com" }
});
```

Benefits:
- Type-safe event tracking
- Server-side tracking for accurate metrics
- Custom event definitions per project

## CLI Support

The `@startupkit/cli` has been updated to support the package strategy:

```bash
# Add a new package (local)
pnpm add-package

# Add a new app
pnpm add-app next
```

The CLI will prompt for:
- Package type (centralized vs local)
- Package name
- Template selection

## Version Management

The `scripts/bump` script handles version management:

```bash
# Bump patch version (default)
./scripts/bump

# Bump minor version
./scripts/bump minor

# Bump major version
./scripts/bump major
```

The script:
1. Bumps all centralized packages (`packages/*`) to the same version
2. Updates template references to use the new version
3. Creates a commit with the version bump

## Summary

- **Centralized packages** (@startupkit/*): For stable, reusable logic across projects
- **Local packages** (@repo/*): For project-specific implementations and rapid iteration
- **Hybrid pattern**: Centralized core + local wrapper (recommended for complex features)
- **@repo/analytics**: Use this for product analytics (deprecate @startupkit/analytics)
- **@repo/auth**: Gold standard example of hybrid pattern
- **@repo/ui**: Gold standard example of pure local package (shadcn methodology)

When in doubt, start with a **local package**. It's easier to extract to a centralized package later than to deal with the overhead of a centralized package prematurely.

