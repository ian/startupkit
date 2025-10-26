# @startupkit/analytics

> ⚠️ **Status**: Legacy / Marketing Use Only
> 
> **For product analytics, use `@repo/analytics` instead.** This package is maintained for marketing website analytics but is not recommended for new product applications.

Client-side analytics package for marketing websites using the `analytics.js` abstraction layer.

## Features

- 🔌 Plugin-based architecture (Google Analytics, Plausible, PostHog)
- 🎯 Client-side tracking only
- 📊 Marketing and website analytics
- ⚛️ React integration with provider pattern

## When to Use This Package

✅ **Use for**:
- Marketing websites
- Public landing pages
- Multi-provider analytics (Google Analytics + Plausible + PostHog)
- Client-side only tracking

❌ **Do NOT use for**:
- Product analytics (use `@repo/analytics` instead)
- Server-side tracking (use `@repo/analytics` instead)
- Type-safe event tracking (use `@repo/analytics` instead)
- Feature flags (use `@repo/analytics` instead)
- Billing and usage metrics (use `@repo/analytics` instead)

## Installation

```bash
pnpm add @startupkit/analytics
```

## Usage

### Setup Provider

```tsx
import { AnalyticsProvider } from "@startupkit/analytics";
import googleAnalytics from "@startupkit/analytics/ga";
import plausiblePlugin from "@startupkit/analytics/plausible";
import posthogPlugin from "@startupkit/analytics/posthog";

const plugins = [
  googleAnalytics({
    measurementIds: [process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID],
  }),
  plausiblePlugin({
    domain: "example.com",
  }),
  posthogPlugin({
    token: process.env.NEXT_PUBLIC_POSTHOG_TOKEN,
  }),
];

export function App({ children }) {
  return (
    <AnalyticsProvider plugins={plugins}>
      {children}
    </AnalyticsProvider>
  );
}
```

### Track Events

```tsx
import { useAnalytics } from "@startupkit/analytics";

function MyComponent() {
  const analytics = useAnalytics();

  const handleClick = () => {
    analytics.track("button_clicked", {
      button_id: "cta",
    });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

## Supported Providers

- **Google Analytics**: Full GA4 support via `@analytics/google-analytics`
- **Plausible**: Privacy-friendly analytics via `analytics-plugin-plausible`
- **PostHog**: Product analytics via `@metro-fs/analytics-plugin-posthog`

## API Reference

### AnalyticsProvider

```tsx
<AnalyticsProvider plugins={plugins}>
  {children}
</AnalyticsProvider>
```

### useAnalytics()

Returns the analytics instance with methods:

- `analytics.page()` - Track page views (automatic)
- `analytics.track(event, properties)` - Track custom events
- `analytics.identify(userId, traits)` - Identify users

## Migration to @repo/analytics

For product applications, we recommend migrating to `@repo/analytics` which provides:

- ✅ Server-side tracking
- ✅ Type-safe event definitions
- ✅ Feature flags via PostHog
- ✅ Better RudderStack integration
- ✅ Accurate billing and usage metrics

### Migration Steps

1. **Install @repo/analytics** in your monorepo:
   ```bash
   # Already available in templates/repo/packages/analytics
   ```

2. **Define your event types**:
   ```typescript
   // packages/analytics/src/types.ts
   export type ButtonClicked = {
     event: "BUTTON_CLICKED";
     buttonId: string;
   };
   ```

3. **Replace client-side tracking**:
   ```typescript
   // Before
   import { useAnalytics } from "@startupkit/analytics";
   const analytics = useAnalytics();
   analytics.track("button_clicked", { button_id: "cta" });

   // After
   import { useAnalytics } from "@repo/analytics";
   const { track } = useAnalytics();
   track("BUTTON_CLICKED", { buttonId: "cta" });
   ```

4. **Add server-side tracking**:
   ```typescript
   import { track } from "@repo/analytics/server";

   await track({
     event: "USER_SIGNED_UP",
     userId: user.id,
     email: user.email,
   });
   ```

5. **Remove @startupkit/analytics**:
   ```bash
   pnpm remove @startupkit/analytics
   ```

## Support

For issues or questions:
- GitHub: https://github.com/01-studio/startupkit
- Docs: https://startupkit.com/docs

## License

ISC

