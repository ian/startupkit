# Analytics

## Usage

We track events at the backend so we can accurately measure and bill for platform usage.

To track an event, you can use the `analytics` client. This is strongly typed and will ensure you don't forget to add the correct properties.

```ts
import { analytics } from "@local/analytics/server";

// Track a sign-in (will handle identifying the user)
analytics.track({
	event: "USER_SIGNED_IN",
  user,
});
