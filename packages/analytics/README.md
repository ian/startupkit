# @startupkit/analytics

Minimal analytics helpers for StartupKit projects with PostHog integration.

## Installation

```bash
pnpm add @startupkit/analytics posthog-js
```

## What This Package Provides

This package provides reusable PostHog integration helpers following the StartupKit minimal package philosophy:

- ✅ **Auto page view tracking** with clean route names (filters out Next.js route groups, replaces IDs)
- ✅ **Provider pattern** with React context
- ✅ **Type-safe hooks** for analytics and feature flags
- ✅ **Peer dependencies** - you control PostHog version

## Usage

### 1. Create Your Analytics Provider

In your `@repo/analytics` or project:

```typescript
// packages/analytics/src/components/analytics-provider.tsx
import { createAnalyticsProvider } from "@startupkit/analytics"
import { pruneEmpty } from "@repo/utils"
import type { Flags } from "../types"

export const AnalyticsProvider = createAnalyticsProvider<Flags>()

interface AnalyticsProviderWrapperProps {
  children: React.ReactNode
  flags: Flags
}

export function AnalyticsProviderWrapper({ 
  children, 
  flags 
}: AnalyticsProviderWrapperProps) {
  return (
    <AnalyticsProvider
      config={{
        apiKey: process.env.POSTHOG_API_KEY as string,
        apiHost: process.env.POSTHOG_HOST,
        flags,
        pruneEmpty
      }}
    >
      {children}
    </AnalyticsProvider>
  )
}
```

### 2. Use Analytics Hooks

```typescript
import { useAnalytics, useFlag } from "@startupkit/analytics"

export function MyComponent() {
  const { track, identify } = useAnalytics()
  const secretFlag = useFlag<Flags, "secret-flag">("secret-flag")

  return (
    <button onClick={() => track("BUTTON_CLICKED", { button: "cta" })}>
      Click me
    </button>
  )
}
```

## What Value Does This Add?

Unlike simple re-exports, this package provides:

1. **Auto page view tracking** - Automatically tracks page views with clean route names by:
   - Filtering out Next.js route groups `(group)`
   - Replacing long numeric segments with `:id`
   - Using `usePathname` and `useSelectedLayoutSegments` for accurate tracking

2. **Simplified provider pattern** - Pre-configured PostHog provider with:
   - Context setup
   - Type-safe analytics methods
   - Feature flags integration

3. **Reusable hooks** - Type-safe hooks that work across all StartupKit projects

## Architecture

```
@startupkit/analytics (published package)
└── Provides: createAnalyticsProvider, hooks, types

@repo/analytics (your project)
└── Uses: @startupkit/analytics + your event types + config
```

This follows the same pattern as `@startupkit/auth` - minimal core with project-specific customization.

## Peer Dependencies

- `next` >= 14.0.0
- `posthog-js` >= 1.0.0
- `react` >= 18.2.0

You control all upstream dependency versions and can upgrade anytime.

