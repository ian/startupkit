# @startupkit/analytics

Provider-agnostic analytics helpers for StartupKit projects.

Part of [**StartupKit**](https://startupkit.com) - The Zero to One Startup Framework.

## Installation

```bash
pnpm add @startupkit/analytics
```

Or use the [StartupKit CLI](https://startupkit.com) to get started with a complete monorepo setup:

```bash
npx startupkit init
```

## What This Package Provides

This package provides a **provider-agnostic** analytics context pattern with built-in conveniences:

- ✅ **Plugin architecture** - Compose multiple analytics providers
- ✅ **Auto page tracking** (with Next.js App Router)
- ✅ **Memoized handlers** for performance
- ✅ **Type-safe hooks** (`useAnalytics`, `useFlag`)
- ✅ **No vendor lock-in** - use any analytics providers

## Built-in Plugins

The package includes ready-to-use plugins for popular analytics services:

- **PostHogPlugin** - Product analytics and feature flags
- **GoogleAnalytics** - Google Analytics 4 integration
- **OpenPanelPlugin** - Privacy-focused analytics
- **AhrefsPlugin** - SEO and traffic analytics

## Usage

### Plugin Mode (Recommended)

The plugin architecture makes it easy to use multiple analytics providers:

```typescript
"use client"

import { 
  AnalyticsProvider,
  PostHogPlugin,
  GoogleAnalytics,
  OpenPanelPlugin
} from "@startupkit/analytics"

const plugins = [
  PostHogPlugin({
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST // optional
  }),
  GoogleAnalytics({
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  }),
  OpenPanelPlugin({
    clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID
  })
]

export function Providers({ children, flags }) {
  return (
    <AnalyticsProvider flags={flags} plugins={plugins}>
      {children}
    </AnalyticsProvider>
  )
}
```

### Using Analytics in Components

```typescript
"use client"

import { useAnalytics } from "@startupkit/analytics"

export function MyComponent() {
  const { track, identify, page, reset, flags } = useAnalytics()

  const handleClick = () => {
    track("BUTTON_CLICKED", { 
      buttonId: "cta",
      page: "home" 
    })
  }

  const handleSignIn = (userId: string, email: string) => {
    identify(userId, {
      email,
      plan: "pro"
    })
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  )
}
```

### Feature Flags

```typescript
import { useFlag } from "@startupkit/analytics"

export function MyFeature() {
  const isEnabled = useFlag("new-feature")

  if (!isEnabled) {
    return null
  }

  return <div>New Feature!</div>
}
```

## API Reference

### `AnalyticsProvider`

Provider component that accepts flags and plugins or handlers.

```typescript
interface AnalyticsProviderProps<TFlags> {
  flags: TFlags
  plugins?: AnalyticsPlugin[]
  handlers?: AnalyticsHandlers
  autoPageTracking?: boolean  // Default: true
  children: ReactNode
}
```

**Plugin Mode (Recommended):**
```typescript
<AnalyticsProvider 
  flags={flags} 
  plugins={[
    PostHogPlugin({ apiKey: "..." }),
    GoogleAnalytics({ measurementId: "..." })
  ]}
>
  {children}
</AnalyticsProvider>
```

**Manual Handlers Mode (Advanced):**
```typescript
<AnalyticsProvider 
  flags={flags}
  handlers={{
    identify: (userId, traits) => { /* your code */ },
    track: (event, properties) => { /* your code */ },
    page: (name, properties) => { /* your code */ },
    reset: () => { /* your code */ }
  }}
>
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

// Identify a user
identify("user_123", {
  email: "user@example.com",
  plan: "pro"
})

// Track an event
track("PURCHASE_COMPLETED", {
  amount: 99.99,
  currency: "USD"
})

// Track a page view
page("/dashboard", { 
  pathname: "/dashboard/settings" 
})

// Reset analytics (on logout)
reset()
```

### `useFlag(name)`

Hook to access a specific feature flag.

```typescript
const isNewFeatureEnabled = useFlag("new-feature")

if (isNewFeatureEnabled) {
  // Show new feature
}
```

## Built-in Plugins

### PostHogPlugin

```typescript
import { PostHogPlugin } from "@startupkit/analytics"

const plugin = PostHogPlugin({
  apiKey: "phc_...",
  apiHost: "https://app.posthog.com" // optional
})
```

**Features:**
- Product analytics
- Feature flags
- Session recordings
- A/B testing

### GoogleAnalytics

```typescript
import { GoogleAnalytics } from "@startupkit/analytics"

const plugin = GoogleAnalytics({
  measurementId: "G-XXXXXXXXXX"
})
```

**Features:**
- Page view tracking
- Event tracking
- Google Analytics 4 integration

### OpenPanelPlugin

```typescript
import { OpenPanelPlugin } from "@startupkit/analytics"

const plugin = OpenPanelPlugin({
  clientId: "your-client-id"
})
```

**Features:**
- Privacy-focused analytics
- Real-time dashboards
- Event tracking

### AhrefsPlugin

```typescript
import { AhrefsPlugin } from "@startupkit/analytics"

const plugin = AhrefsPlugin()
```

**Features:**
- SEO tracking
- Traffic source analytics

## Creating Custom Plugins

You can create your own analytics plugins:

```typescript
import type { AnalyticsPlugin } from "@startupkit/analytics"
import { useCallback } from "react"

export function MyAnalyticsPlugin(): AnalyticsPlugin {
  return {
    name: "MyAnalytics",
    Provider: ({ children }) => {
      // Optional: Wrap in your provider
      return <>{children}</>
    },
    useHandlers: () => {
      const identify = useCallback(
        (userId: string | null, traits?: Record<string, unknown>) => {
          // Your identify logic
          console.log("Identify:", userId, traits)
        },
        []
      )

      const track = useCallback(
        (event: string, properties?: Record<string, unknown>) => {
          // Your track logic
          console.log("Track:", event, properties)
        },
        []
      )

      const page = useCallback(
        (name?: string, properties?: Record<string, unknown>) => {
          // Your page view logic
          console.log("Page:", name, properties)
        },
        []
      )

      const reset = useCallback(() => {
        // Your reset logic
        console.log("Reset")
      }, [])

      return {
        identify,
        track,
        page,
        reset
      }
    }
  }
}
```

## Multi-Provider Setup

Events are sent to **all** configured plugins simultaneously:

```typescript
const plugins = [
  PostHogPlugin({ apiKey: "..." }),      // Product analytics
  GoogleAnalytics({ measurementId: "..." }), // Marketing analytics
  OpenPanelPlugin({ clientId: "..." })   // Privacy-focused analytics
]

<AnalyticsProvider flags={flags} plugins={plugins}>
  {children}
</AnalyticsProvider>
```

When you call `track()`, the event is sent to all three providers automatically.

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

## TypeScript Types

```typescript
// Plugin interface
interface AnalyticsPlugin {
  name: string
  Provider?: ComponentType<{ children: ReactNode }>
  useHandlers: () => Partial<AnalyticsHandlers>
}

// Handlers interface
interface AnalyticsHandlers {
  identify: (userId: string | null, traits?: Record<string, unknown>) => void
  track: (event: string, properties?: Record<string, unknown>) => void
  page: (name?: string, properties?: Record<string, unknown>) => void
  reset: () => void
}

// Context interface
interface AnalyticsContextType<TFlags> {
  flags: TFlags
  identify: (userId: string | null, traits?: Record<string, unknown>) => void
  track: (event: string, properties?: Record<string, unknown>) => void
  page: (name?: string, properties?: Record<string, unknown>) => void
  reset: () => void
}
```

## Philosophy

This package follows the StartupKit minimal package philosophy:

**What it does:** 
- Provides reusable React patterns for analytics
- Handles auto page tracking (filters route groups, replaces IDs)
- Memoizes handlers for performance
- Includes ready-to-use plugins for popular services

**What it doesn't do:** 
- Force you to use specific analytics providers
- Make decisions about your analytics architecture

You can use the built-in plugins, create your own, or implement custom handlers.

## Peer Dependencies

- `next` >= 14.0.0 (for App Router hooks)
- `react` >= 18.2.0

Plugin-specific dependencies (only install what you use):
- `posthog-js` - For PostHogPlugin
- `@openpanel/nextjs` - For OpenPanelPlugin
- (Google Analytics and Ahrefs work via script injection)

## Learn More

- **StartupKit Website:** [startupkit.com](https://startupkit.com)
- **GitHub Repository:** [github.com/ian/startupkit](https://github.com/ian/startupkit)
- **Full Documentation:** [startupkit.com](https://startupkit.com)

## Support

Having issues? [Open an issue on GitHub](https://github.com/ian/startupkit/issues)

## License

ISC © 2025 01 Studio
