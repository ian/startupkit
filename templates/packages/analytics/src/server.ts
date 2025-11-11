// @repo/analytics/server - Server-side analytics (PostHog only)
// Imports directly from posthog-node

import { PostHog } from "posthog-node"
import type { TrackableEvent } from "./types"
export { getFeatureFlags } from "./vendor/posthog"

export type { Flags } from "./types"

function client() {
	const apiKey = process.env.POSTHOG_API_KEY

	if (!apiKey) {
		return null
	}

	return new PostHog(apiKey, {
		host: process.env.POSTHOG_HOST || "https://app.posthog.com"
	})
}

/**
 * Tracks one or more analytics events server-side using PostHog.
 *
 * @param eventData - An AnalyticsEvent object or an array of AnalyticsEvent objects to track.
 */
export async function track(eventData: TrackableEvent | TrackableEvent[]) {
	const posthog = client()

	if (!posthog) {
		return
	}

	const events = Array.isArray(eventData) ? eventData : [eventData]

	events.forEach(({ event, userId, anonymousId, ...properties }) => {
		posthog.capture({
			distinctId: userId ?? anonymousId,
			event,
			properties
		})
	})

	await posthog.flush()
}
