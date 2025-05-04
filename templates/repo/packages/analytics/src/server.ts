import type { AnalyticsEvent, AuthEvent } from "./types"
export { getFeatureFlags } from "./vendor/posthog"
import { rudderstack } from "./vendor/rudderstack"

export type { Flags } from "./vendor/posthog"

/**
 * Tracks one or more analytics events by publishing them to a specified URL using Upstash Qstash.
 *
 * @param eventData - An AnalyticsEvent object or an array of AnalyticsEvent objects to track.
 * @returns An object containing the status of the tracking operation and the Upstash Qstash message ID.
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
