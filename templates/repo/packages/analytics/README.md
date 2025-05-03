# Analytics Architecture

## Usage

We track events at the backend so we can accurately measure and bill for platform usage.

To track an event, you can use the `analytics` client. This is strongly typed and will ensure you don't forget to add the correct properties.

```ts
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

## Extending Events

To add a new event, you can add it to the `types.ts` file.

export type MyCustomEvent = {
	event: "MY_CUSTOM_EVENT"
	message: string
}

// Track a custom event

await track({
	event: "MY_CUSTOM_EVENT",
	message: "Hello from my custom event"
});

```
