// @repo/analytics/server - Server-side analytics (direct imports)
// Imports directly from @rudderstack/rudder-sdk-node and posthog

import type { AnalyticsEvent, AuthEvent } from "./types"
import { rudderstack } from "./vendor/rudderstack"
export { getFeatureFlags } from "./vendor/posthog"

export type { Flags } from "./types"

/**
 * Tracks one or more analytics events server-side.
 * 
 * Imports directly from RudderStack SDK - you control the version.
 *
 * @param eventData - An AnalyticsEvent object or an array of AnalyticsEvent objects to track.
 */
export async function track(eventData: AnalyticsEvent | AnalyticsEvent[]) {
	const events = Array.isArray(eventData) ? eventData : [eventData]

	const trackHandler = ({ event, ...rest }: AnalyticsEvent) => {
		const { user, ...properties } = rest as AuthEvent
		return [
			rudderstack.track({
				event,
				userId: user.id,
				properties
			})
		]
	}

	await Promise.all(events.flatMap(trackHandler))
}
