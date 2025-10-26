# Analytics Package Refactor Summary

## Overview

Created `@startupkit/analytics` as a **provider-agnostic** minimal package following the shadcn philosophy. This package provides reusable patterns (context, auto page tracking, memoization) while letting you implement handlers with whatever analytics providers you want.

## Key Principle

**@startupkit/analytics handles the "how" (patterns), you handle the "what" (providers).**

## What `@startupkit/analytics` Provides

✅ **Auto Page Tracking**
- Uses Next.js App Router hooks (`usePathname`, `useSelectedLayoutSegments`)
- Filters out route groups like `(dashboard)`
- Replaces long IDs with `:id` for cleaner analytics
- Can be disabled with `autoPageTracking: false`

✅ **Memoization**
- Handlers are memoized for performance
- Re-renders minimized

✅ **React Context Pattern**
- Context setup with proper TypeScript types
- `useAnalytics()` and `useFlag()` hooks

❌ **NO vendor lock-in**
- No PostHog imports
- No analytics SDK dependencies
- You implement handlers with YOUR providers

## Architecture

### Before (Template had all the logic):
```typescript
// 84 lines of complex logic in template
export function AnalyticsProvider({ children, flags }) {
  const posthog = usePostHog()
  const pathname = usePathname()
  const segments = useSelectedLayoutSegments()
  
  // Auto page tracking logic
  useEffect(() => {
    const name = segments.filter(...).map(...).join("/")
    posthog.capture("$pageview", { route: name })
  }, [pathname, segments, posthog])
  
  // Memoization
  const handlers = useMemo(() => ({ ... }), [posthog, flags])
  
  // Context setup
  return <Context.Provider value={handlers}>...</Context.Provider>
}
```

### After (Template just passes handlers):
```typescript
// Clean 69-line implementation
export function AnalyticsProviderInner({ children, flags }) {
  const posthog = usePostHog()
  
  return (
    <StartupKitAnalyticsProvider
      config={{
        flags,
        handlers: {
          identify: (userId, props) => posthog.identify(userId, props),
          track: (event, props) => posthog.capture(event, props),
          page: (name, props) => posthog.capture("$pageview", { route: name, ...props }),
          reset: () => posthog.reset()
        }
      }}
    >
      {children}
    </StartupKitAnalyticsProvider>
  )
}
```

**@startupkit/analytics handles:**
- ✅ Auto page tracking with useEffect
- ✅ Memoization of handlers
- ✅ Context setup
- ✅ Smart route name generation

**Template handles:**
- ✅ Implementing handlers with your providers
- ✅ Choosing which analytics tools to use

## Package Structure

```
packages/analytics/
├── src/
│   ├── provider.tsx        # Has useEffect for auto tracking + memoization
│   ├── context.ts          # React context
│   ├── use-analytics.ts    # Hook to access context
│   ├── use-flag.ts         # Hook for feature flags
│   └── types.ts            # AnalyticsHandlers, AnalyticsConfig, etc.
└── package.json            # Peer deps: next, react (NO analytics SDKs)
```

## Example: Multiple Providers

Users can easily integrate multiple analytics providers:

```typescript
<StartupKitAnalyticsProvider
  config={{
    flags,
    handlers: {
      identify: (userId, properties) => {
        posthog.identify(userId, properties)     // Product analytics
        openMeter.identify(userId)               // Usage tracking  
        gtag('set', 'user_id', userId)          // Marketing
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
    }
  }}
>
  {children}
</StartupKitAnalyticsProvider>
```

## Benefits

1. **Separation of Concerns**
   - Package: Patterns, auto tracking, memoization
   - Template: Provider implementation

2. **No Vendor Lock-in**
   - Use PostHog, OpenMeter, GA, Mixpanel, or anything
   - No analytics SDK dependencies in the package

3. **Multiple Providers**
   - Easily integrate multiple services
   - Just add calls to your handlers

4. **Reusable Logic**
   - Auto page tracking logic shared across all StartupKit projects
   - Smart route name generation
   - Memoization handled once

5. **Flexibility**
   - Can disable auto tracking if needed
   - Full control over handler implementation

## Comparison with Old Approach

### ❌ Old Approach (v0.2.0-0.3.0):
- Forced PostHog
- Had peer dependency on `posthog-js`
- Version lock-in
- Hard to add other providers
- All logic in template (duplicated across projects)

### ✅ New Approach (v0.4.0):
- Provider-agnostic
- No analytics dependencies
- Reusable patterns in package
- Simple handler implementation in template
- Easy to add multiple providers

## Files Changed

### New Files:
- `packages/analytics/` (entire package)
  - `src/provider.tsx` - Has useEffect + memoization
  - `src/context.ts` - React context
  - `src/use-analytics.ts` - Hook
  - `src/use-flag.ts` - Flag hook
  - `src/types.ts` - TypeScript types
  - `package.json` - Peer deps: next, react
  - `README.md` - Documentation

### Modified Files:
- `templates/repo/packages/analytics/package.json` - Added @startupkit/analytics
- `templates/repo/packages/analytics/src/components/analytics-provider.tsx` - Simplified to 69 lines
- `templates/repo/packages/analytics/src/hooks/use-analytics.ts` - Re-exports from @startupkit/analytics
- `templates/repo/packages/analytics/src/hooks/use-flag.ts` - Wraps @startupkit/analytics
- `packages/auth/src/index.ts` - Removed unnecessary re-exports
- `templates/repo/packages/auth/src/components/provider.tsx` - Typed user parameter

## API

### AnalyticsProvider Config

```typescript
interface AnalyticsConfig<TFlags> {
  autoPageTracking?: boolean  // Default: true
  flags: TFlags
  handlers: {
    identify: (userId: string | null, traits?: Record<string, unknown>) => void
    track: (event: string, properties?: Record<string, unknown>) => void
    page: (name?: string, properties?: Record<string, unknown>) => void
    reset: () => void
  }
}
```

### Auto Page Tracking

Input: `/dashboard/(settings)/profile/abc123def456`
Output: `/dashboard/profile/:id`

- Filters route groups: `(settings)` → removed
- Replaces IDs: `abc123def456` → `:id`
- Preserves segments: `dashboard`, `profile`

## Next Steps

1. ✅ Package built and ready
2. **Publish** `@startupkit/analytics` v0.4.0 to npm
3. **Publish** `@startupkit/auth` v0.5.0 (with cleaned up exports)
4. **Update** PACKAGE_STRATEGY.md
5. **Test** template with published packages

## Summary

This refactor achieves the StartupKit philosophy:

- **Minimal core** - Package provides patterns, not implementations
- **No assumptions** - Don't force specific tools
- **User control** - Implement handlers however you want
- **Reusable logic** - Auto tracking, memoization handled once
- **Flexibility** - Easy to add multiple providers

The package handles the complex parts (auto tracking, memoization) while giving you complete control over which analytics providers to use.
