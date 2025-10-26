# Analytics Package Refactor Summary

## Overview

Created `@startupkit/analytics` as a minimal package following the same pattern as `@startupkit/auth`. This provides reusable PostHog integration helpers while allowing projects to control their own dependencies and event types.

## Changes Made

### 1. Created `packages/analytics` (NEW)

A new published package `@startupkit/analytics` v0.5.0 with:

#### What It Provides (Value-Adding Features):
- ✅ **`createAnalyticsProvider()`** - Factory function that creates a PostHog-integrated provider with:
  - Auto page view tracking
  - Clean route name generation (filters out Next.js route groups, replaces IDs with `:id`)
  - Context with identify/track/reset methods
  - Feature flags integration
  - Optional `pruneEmpty` utility support

- ✅ **`useAnalytics()`** - Hook to access analytics context
- ✅ **`useFlag()`** - Type-safe feature flag hook
- ✅ **Types and Context** - Reusable TypeScript types

#### Files Created:
```
packages/analytics/
├── package.json
├── tsconfig.json
├── rollup.config.mjs
├── README.md
└── src/
    ├── index.ts
    ├── types.ts
    ├── context.ts
    ├── provider.tsx
    ├── use-analytics.ts
    └── use-flag.ts
```

#### Peer Dependencies:
- `next` >= 14.0.0
- `posthog-js` >= 1.0.0
- `react` >= 18.2.0

You control all upstream dependency versions.

### 2. Updated `templates/repo/packages/analytics`

Refactored to use `@startupkit/analytics`:

#### Before (109 lines):
```typescript
// All logic implemented inline
export function AnalyticsProvider({ children, flags }) {
  // PostHog provider setup
  // Auto page tracking logic
  // Context setup
  // ... 100+ lines
}
```

#### After (37 lines):
```typescript
import { createAnalyticsProvider } from "@startupkit/analytics"

const AnalyticsProviderBase = createAnalyticsProvider<Flags>()

export function AnalyticsProvider({ children, flags }) {
  return (
    <AnalyticsProviderBase
      config={{
        apiKey: process.env.POSTHOG_API_KEY as string,
        apiHost: process.env.POSTHOG_HOST,
        flags,
        pruneEmpty
      }}
    >
      {children}
    </AnalyticsProviderBase>
  )
}
```

#### Files Modified:
- `src/components/analytics-provider.tsx` - Now uses `@startupkit/analytics`
- `src/hooks/use-analytics.ts` - Re-exports from `@startupkit/analytics`
- `src/hooks/use-flag.ts` - Wraps `@startupkit/analytics` with project types
- `package.json` - Added `@startupkit/analytics: 0.5.0` dependency

### 3. Cleaned Up `packages/auth`

Removed 28 unnecessary re-exports from `packages/auth/src/index.ts`:

#### Before:
```typescript
export {
  anonymousClient,
  apiKeyClient,
  clientSideHasPermission,
  customSessionClient,
  emailOTPClient,
  // ... 23 more plugins
} from "better-auth/client/plugins"
export { createAuthClient } from "better-auth/react"
```

#### After:
```typescript
export * from "./components"
export { createAuth } from "./lib/auth"
export * from "./types"
```

These were just pass-throughs that added no value. The template already imports directly from `better-auth`.

### 4. Typed `AuthProvider` User Parameter

In `templates/repo/packages/auth/src/components/provider.tsx`:

#### Before:
```typescript
onIdentify={(user: unknown) => {
  if (user && typeof user === "object" && ...) {
    const typedUser = user as Record<string, unknown> & { id: string; email: string }
    // Manual type checking...
  }
}}
```

#### After:
```typescript
import type { User } from "../types"

onIdentify={(user: User) => {
  // Direct access to typed user properties
  identify(user.id, analyticsProps)
}}
```

## Architecture Pattern

Both `@startupkit/auth` and `@startupkit/analytics` now follow the same pattern:

```
┌─────────────────────────────────────────────────────┐
│ @startupkit/[package] (Published Package)          │
│                                                     │
│ - Provides reusable helpers that ADD VALUE          │
│ - Uses peer dependencies (you control versions)    │
│ - Type-safe, generic implementation                 │
└─────────────────────────────────────────────────────┘
                        ▼ used by
┌─────────────────────────────────────────────────────┐
│ @repo/[package] (Template/Your Project)            │
│                                                     │
│ - Project-specific configuration                    │
│ - Custom event types                                │
│ - Environment variables                             │
│ - Direct imports from upstream libraries            │
└─────────────────────────────────────────────────────┘
```

### Example: Analytics

```typescript
// @startupkit/analytics - Reusable core
export function createAnalyticsProvider<TFlags>() {
  // Auto page tracking logic
  // Provider setup
  // Context management
}

// @repo/analytics - Your configuration
const AnalyticsProvider = createAnalyticsProvider<Flags>()
// + Your event types
// + Your configuration
// + Direct PostHog imports
```

## Benefits

1. **DRY Principle** - Reusable logic extracted to `@startupkit/analytics`
2. **No Version Lock-in** - Peer dependencies, you control PostHog version
3. **Type Safety** - Generic types allow project-specific typing
4. **Maintainability** - Core logic in one place, easier to update
5. **Consistency** - Same pattern as `@startupkit/auth`

## Next Steps

1. **Publish** `@startupkit/analytics` v0.5.0 to npm
2. **Update Documentation** - Add to PACKAGE_STRATEGY.md
3. **Test** - Ensure template works with new package
4. **Consider** - Apply same pattern to other packages if applicable

## What About Old `@startupkit/analytics`?

The old `@startupkit/analytics` (v0.4.0 and below) was a different approach that bundled multiple analytics providers (PostHog, RudderStack, etc.). It was removed because:
- Too much abstraction
- Version lock-in
- Not following shadcn principles

The new `@startupkit/analytics` (v0.5.0+) is different:
- Minimal, focused on PostHog only
- Peer dependencies (no lock-in)
- Only exports value-adding helpers (auto page tracking, provider pattern)
- Follows the same pattern as `@startupkit/auth`

## Files Changed

### New Files:
- `packages/analytics/` (entire package)
- `ANALYTICS_PACKAGE_SUMMARY.md` (this file)

### Modified Files:
- `packages/auth/src/index.ts` - Removed unnecessary re-exports
- `templates/repo/packages/analytics/package.json` - Added @startupkit/analytics dependency
- `templates/repo/packages/analytics/src/components/analytics-provider.tsx` - Uses @startupkit/analytics
- `templates/repo/packages/analytics/src/hooks/use-analytics.ts` - Re-exports from @startupkit/analytics
- `templates/repo/packages/analytics/src/hooks/use-flag.ts` - Wraps @startupkit/analytics
- `templates/repo/packages/auth/src/components/provider.tsx` - Typed user parameter

