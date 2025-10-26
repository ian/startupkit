# @repo/analytics

> ✅ **Recommended**: This is the recommended analytics package for product applications.

Type-safe product analytics with RudderStack and PostHog integration. Supports both client-side and server-side tracking with feature flags.

## Features

- 🎯 **Type-safe event tracking** - Define events with TypeScript interfaces
- 🖥️ **Server-side tracking** - Accurate metrics for billing and usage
- 🌐 **Client-side tracking** - Track user interactions in real-time
- 🚩 **Feature flags** - PostHog feature flags integration
- 📊 **RudderStack + PostHog** - Best-in-class analytics platforms
- 🔒 **Privacy-focused** - Full control over data

## Why This Package?

Unlike `@startupkit/analytics` (which is client-side only and uses analytics.js), `@repo/analytics`:

- ✅ Tracks events server-side for accurate billing
- ✅ Uses TypeScript for type-safe event definitions
- ✅ Integrates directly with RudderStack and PostHog
- ✅ Supports feature flags
- ✅ Better for product analytics vs marketing analytics

## Installation

This package is part of the StartupKit monorepo template. It's already configured in `templates/repo/packages/analytics`.

## Usage

### Server-Side Tracking (Recommended)

We track events at the backend so we can accurately measure and bill for platform usage.

```typescript
import { track } from "@repo/analytics/server";

// Track a sign-in (will handle identifying the user)
await track({
  event: "USER_SIGNED_IN",
  user,
});

// Track a team switch, will handle grouping user <-> team
await track({
  event: "TEAM_SWITCHED",
  userId: user.id,
  teamId: team.id,
});
```

### Client-Side Tracking

```typescript
"use client";

import { useAnalytics } from "@repo/analytics";

export function MyComponent() {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("BUTTON_CLICKED", { buttonId: "cta" });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Setup Analytics Provider

```typescript
import { AnalyticsProvider, getFeatureFlags } from "@repo/analytics";

export async function RootLayout({ children }) {
  const flags = await getFeatureFlags(userId);

  return (
    <AnalyticsProvider flags={flags}>
      {children}
    </AnalyticsProvider>
  );
}
```

### Feature Flags

```typescript
import { useFlag } from "@repo/analytics";

export function MyFeature() {
  const isEnabled = useFlag("new-feature");

  if (!isEnabled) return null;

  return <div>New Feature!</div>;
}
```

Server-side:
```typescript
import { getFeatureFlags } from "@repo/analytics/server";

const flags = await getFeatureFlags(userId);
if (flags["new-feature"]) {
  // Show new feature
}
```

## Extending Events

To add a new event, add it to the `types.ts` file:

```typescript
// src/types.ts
export type MyCustomEvent = {
  event: "MY_CUSTOM_EVENT";
  message: string;
  userId: string;
};

// Update AnalyticsEvent union
export type AnalyticsEvent = 
  | AuthEvent 
  | TrackableEvent
  | MyCustomEvent;  // Add your event
```

Then track it:

```typescript
await track({
  event: "MY_CUSTOM_EVENT",
  message: "Hello from my custom event",
  userId: user.id,
});
```

TypeScript will enforce that you provide all required properties!

## Configuration

Set these environment variables:

```bash
# RudderStack (for event tracking)
RUDDERSTACK_WRITE_KEY=your_write_key
RUDDERSTACK_DATA_PLANE_URL=https://your-data-plane.com

# PostHog (for feature flags)
POSTHOG_API_KEY=your_api_key
POSTHOG_HOST=https://app.posthog.com
```

## API Reference

### Server-Side

#### `track(event)`

Track one or more analytics events:

```typescript
import { track } from "@repo/analytics/server";

await track({
  event: "USER_SIGNED_UP",
  user: { id: "123", email: "user@example.com" }
});

// Track multiple events
await track([event1, event2, event3]);
```

#### `getFeatureFlags(userId)`

Get feature flags for a user:

```typescript
import { getFeatureFlags } from "@repo/analytics/server";

const flags = await getFeatureFlags(userId);
// { "new-feature": true, "beta-feature": false }
```

### Client-Side

#### `useAnalytics()`

Hook for analytics operations:

```typescript
const { identify, track, reset, flags } = useAnalytics();

// Identify a user
identify(userId, { email: "user@example.com" });

// Track an event
track("BUTTON_CLICKED", { buttonId: "cta" });

// Reset on logout
reset();

// Access flags
const isEnabled = flags["new-feature"];
```

#### `useFlag(flagName)`

Hook for a specific feature flag:

```typescript
const isEnabled = useFlag("new-feature");
```

## Architecture

This package integrates two analytics platforms:

1. **RudderStack**: Customer data platform for event tracking
   - Server-side: `@rudderstack/rudder-sdk-node`
   - Client-side: `@rudderstack/analytics-js`

2. **PostHog**: Product analytics and feature flags
   - Client-side: `posthog-js/react`
   - Server-side: Feature flag API

Events are sent to both platforms simultaneously for redundancy and different use cases.

## Best Practices

1. **Track server-side when possible** - More accurate and can't be blocked
2. **Define all events in types.ts** - TypeScript will catch errors
3. **Use meaningful event names** - ALL_CAPS_SNAKE_CASE convention
4. **Include relevant context** - userId, teamId, etc.
5. **Don't track PII without consent** - Be GDPR compliant

## Comparison with @startupkit/analytics

| Feature | @repo/analytics | @startupkit/analytics |
|---------|----------------|----------------------|
| Server-side tracking | ✅ Yes | ❌ No |
| Client-side tracking | ✅ Yes | ✅ Yes |
| Type-safe events | ✅ Yes | ❌ No |
| Feature flags | ✅ Yes | ❌ No |
| RudderStack | ✅ Direct integration | ❌ No |
| Multiple providers | ⚠️ RudderStack + PostHog | ✅ GA + Plausible + PostHog |
| Use case | Product analytics | Marketing analytics |

## Support

For issues or questions:
- GitHub: https://github.com/01-studio/startupkit
- Docs: https://startupkit.com/docs

## License

ISC
