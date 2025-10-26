# @startupkit/analytics

Provider-agnostic analytics helpers for StartupKit projects.

## Installation

```bash
pnpm add @startupkit/analytics
```

## What This Package Provides

This package provides a **provider-agnostic** analytics context pattern with built-in conveniences:

- ✅ **React context** for analytics methods
- ✅ **Auto page tracking** (with Next.js App Router)
- ✅ **Memoized handlers** for performance
- ✅ **Type-safe hooks** (`useAnalytics`, `useFlag`)
- ✅ **No vendor lock-in** - bring your own analytics providers

## Philosophy

This package follows the StartupKit minimal package philosophy:

**What it does:** 
- Provides reusable React patterns for analytics
- Handles auto page tracking (filters route groups, replaces IDs)
- Memoizes handlers for performance

**What it doesn't do:** 
- Force you to use specific analytics providers
- Bundle analytics SDKs

You implement the handlers in your project with PostHog, OpenMeter, Google Analytics, Mixpanel, or whatever you want.

## Usage

### 1. Implement Your Analytics Provider

In your `@repo/analytics` or project:

```typescript
// packages/analytics/src/components/analytics-provider.tsx
import { AnalyticsProvider as StartupKitAnalyticsProvider } from "@startupkit/analytics"
import { usePostHog } from "posthog-js/react"

export function AnalyticsProvider({ children, flags }) {
  const posthog = usePostHog()
  
  return (
    <StartupKitAnalyticsProvider
      flags={flags}
      handlers={{
        identify: (userId, properties) => {
          if (userId) {
            posthog.identify(userId, properties)
            // Add other providers: openMeter.identify(userId)
          }
        },
        track: (event, properties) => {
          posthog.capture(event, properties)
          // openMeter.track(event, properties)
          // ga('send', 'event', event)
        },
        page: (name, properties) => {
          posthog.capture("$pageview", { route: name, ...properties })
        },
        reset: () => {
          posthog.reset()
        }
      }}
    >
      {children}
    </StartupKitAnalyticsProvider>
  )
}
```

### 2. Use Analytics Hooks

```typescript
import { useAnalytics, useFlag } from "@startupkit/analytics"

export function MyComponent() {
  const { track, identify } = useAnalytics()
  const secretFlag = useFlag("secret-flag")

  return (
    <button onClick={() => track("BUTTON_CLICKED", { button: "cta" })}>
      Click me
    </button>
  )
}
```

## API

### `AnalyticsProvider`

Provider component that accepts flags and handlers.

```typescript
interface AnalyticsProviderProps<TFlags> {
  flags: TFlags
  handlers: {
    identify: (userId: string | null, traits?: Record<string, unknown>) => void
    track: (event: string, properties?: Record<string, unknown>) => void
    page: (name?: string, properties?: Record<string, unknown>) => void
    reset: () => void
  }
  autoPageTracking?: boolean  // Default: true
  children: ReactNode
}

<AnalyticsProvider flags={flags} handlers={handlers}>
  {children}
</AnalyticsProvider>
```

**Auto Page Tracking:**
- Automatically tracks page views using Next.js App Router hooks
- Filters out route groups like `(dashboard)`
- Replaces long numeric segments with `:id`
- Can be disabled with `autoPageTracking: false`

### `useAnalytics()`

Hook to access analytics context.

```typescript
const { identify, track, page, reset, flags } = useAnalytics()
```

### `useFlag(name)`

Hook to access a specific feature flag.

```typescript
const myFlag = useFlag("my-flag")
```

## What Value Does This Add?

Unlike simple re-exports, this package provides:

1. **Auto Page Tracking** - Smart route name generation for Next.js
2. **Memoization** - Handlers are memoized for performance
3. **Consistent API** - Same interface across all StartupKit projects
4. **Type safety** - TypeScript types for analytics methods
5. **Zero vendor lock-in** - Use any analytics provider(s) you want

## Example: Multiple Providers

You can easily integrate multiple analytics providers:

```typescript
<StartupKitAnalyticsProvider
  flags={flags}
  handlers={{
    identify: (userId, properties) => {
      // PostHog for product analytics
      posthog.identify(userId, properties)
      
      // OpenMeter for usage tracking
      openMeter.identify(userId)
      
      // Google Analytics for marketing
      gtag('set', 'user_id', userId)
    },
    track: (event, properties) => {
      posthog.capture(event, properties)
      openMeter.track(event, properties)
      gtag('event', event, properties)
    },
    page: (name, properties) => {
      posthog.capture("$pageview", { route: name })
      ga('send', 'pageview', name)
    },
    reset: () => {
      posthog.reset()
      openMeter.reset()
    }
  }}
>
  {children}
</StartupKitAnalyticsProvider>
```

## Auto Page Tracking Details

The package automatically tracks page views with clean route names:

**Input:** `/dashboard/(settings)/profile/abc123def456`
**Output:** `/dashboard/profile/:id`

- Filters out route groups: `(settings)` → removed
- Replaces long IDs: `abc123def456` → `:id`
- Preserves meaningful segments: `dashboard`, `profile`

The `page` handler is called with:
- `name`: The clean route (e.g., `/dashboard/profile/:id`)
- `properties.pathname`: The actual pathname

## Architecture

```
@startupkit/analytics (published package)
└── Provides: Context, auto page tracking, memoization

@repo/analytics (your project)
└── Implements: Handlers with PostHog, OpenMeter, GA, etc.
```

This follows the same pattern as `@startupkit/auth` - minimal core with project-specific implementation.

## Peer Dependencies

- `next` >= 14.0.0 (for App Router hooks)
- `react` >= 18.2.0

No analytics provider dependencies. You control everything.
