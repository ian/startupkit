import type { AnalyticsEvent, AuthEvent, IdentityOptions, TeamCreated, TeamJoined, TeamSwitched, TrackableEvent } from "./types"
import { rudderstack } from "./vendor/rudderstack"

export { getFeatureFlags } from "./vendor/posthog";
export type { Flags } from "./vendor/posthog";


/**
 * Tracks one or more analytics events by publishing them to a specified URL using Upstash Qstash.
 *
 * @param eventData - An AnalyticsEvent object or an array of AnalyticsEvent objects to track.
 * @returns An object containing the status of the tracking operation and the Upstash Qstash message ID.
 */
async function track(eventData: AnalyticsEvent | AnalyticsEvent[]) {
	const events = Array.isArray(eventData) ? eventData : [eventData];

	await Promise.all(
		events.map(event => {
			if (event.startsWith("USER_")) {
				const { user } = rest as AuthEvent

				// Automatically identify the user in rudderstack
				await rudderstack.identify(user.id, {
					email: user.email,
					name: [user.firstName, user.lastName].filter(Boolean).join(" "),
					firstName: user.firstName,
					lastName: user.lastName
				})

				await rudderstack.track({
					event,
					userId: user.id
				})

				return
			}

			if (event.startsWith("TEAM_")) {
				type TeamEvent = (TeamCreated | TeamJoined | TeamSwitched) & IdentityOptions
				const { userId, teamId, ...properties } = rest as TeamEvent

				// Automatically group to the team the user in rudderstack
				await rudderstack.group({
					groupId: teamId,
					userId
				})

				await rudderstack.track({
					event,
					userId,
					properties
				})

				return
			}

			const { userId, ...properties } = rest as TrackableEvent
			await rudderstack.track({
				event,
				userId,
				properties
			})
		})
	);
}

export const analytics = {
	track,
};