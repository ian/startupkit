# @repo/analytics

> ✅ **Recommended**: This is the recommended analytics package for product applications.

Type-safe product analytics with PostHog. Simple, direct integration with both client-side and server-side tracking plus feature flags.

## Features

- 🎯 **Type-safe event tracking** - Define events with TypeScript interfaces
- 🖥️ **Server-side tracking** - Accurate metrics for billing and usage
- 🌐 **Client-side tracking** - Track user interactions in real-time
- 🚩 **Feature flags** - Built-in PostHog feature flags
- 📊 **PostHog** - Simple, powerful product analytics
- 🔒 **Privacy-focused** - Full control over your data

## Why PostHog Only?

Simple is better. PostHog handles everything you need:

- ✅ Product analytics (events, funnels, cohorts)
- ✅ Feature flags with targeting
- ✅ Session recordings
- ✅ A/B testing
- ✅ Server-side + client-side SDKs
- ✅ No need for multiple tools (RudderStack, Segment, etc.)

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
import { AnalyticsProvider } from "@repo/analytics";
import { getFeatureFlags } from "@repo/analytics/server";

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
# PostHog (for everything)
POSTHOG_API_KEY=your_api_key
POSTHOG_HOST=https://app.posthog.com  # or your self-hosted instance
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

Simple, direct PostHog integration:

- **Client-side**: `posthog-js/react` for browser tracking
- **Server-side**: `posthog-node` for backend events
- **Feature flags**: Built-in PostHog API

One tool, zero complexity.

## Best Practices

1. **Track server-side when possible** - More accurate and can't be blocked
2. **Define all events in types.ts** - TypeScript will catch errors
3. **Use meaningful event names** - ALL_CAPS_SNAKE_CASE convention
4. **Include relevant context** - userId, teamId, etc.
5. **Don't track PII without consent** - Be GDPR compliant

## Why Not Multiple Providers?

You might be tempted to send data to multiple analytics tools. **Don't.**

**Problems with multiple providers:**
- ❌ More dependencies to manage
- ❌ More bills to pay
- ❌ Data inconsistencies between platforms
- ❌ Complex setup and maintenance

**PostHog does it all:**
- ✅ One tool, one bill
- ✅ Consistent data
- ✅ Simple setup
- ✅ Can export to data warehouses if needed

## Support

For issues or questions:
- GitHub: https://github.com/01-studio/startupkit
- Docs: https://startupkit.com/docs

## License

ISC
