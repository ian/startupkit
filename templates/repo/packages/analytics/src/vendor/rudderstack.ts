import RudderAnalytics from "@rudderstack/rudder-sdk-node";
import { stringifyValues } from "@repo/utils";
import type { IdentityOptions } from "../types";

export type Properties = Record<string, unknown>;
export type TrackEvent = string;

const {
	RUDDERSTACK_DATA_PLANE_URL,
	RUDDERSTACK_WRITE_KEY,
} = process.env

const RUDDERSTACK_ENABLED =  RUDDERSTACK_WRITE_KEY && RUDDERSTACK_DATA_PLANE_URL

function getRudder() {
	if (!RUDDERSTACK_WRITE_KEY || !RUDDERSTACK_DATA_PLANE_URL) {
		throw new Error(
			"RUDDERSTACK_WRITE_KEY and RUDDERSTACK_DATA_PLANE_URL must be set",
		);
	}

	return new RudderAnalytics(RUDDERSTACK_WRITE_KEY, {
		dataPlaneUrl: RUDDERSTACK_DATA_PLANE_URL,
	});
}

/**
 * Identifies a user in RudderStack with optional traits
 * @param identity - User identification options
 * @param traits - Optional user properties
 * @returns Promise that resolves when identification is complete
 */
export function identify(userId: string, traits?: Properties) {
	console.debug(
		`[RUDDERSTACK:${RUDDERSTACK_ENABLED ? "enabled" : "disabled"}] identify`,
		userId,
	);

	if (!RUDDERSTACK_ENABLED) {
		return;
	}

	return new Promise((resolve) => {
		const msg = {
			userId,
			traits: stringifyValues(traits),
		};
		getRudder().identify(msg, () => {
			resolve(void 0);
		});
	});
}

/**
 * Tracks a user event in RudderStack
 * @param identity - User identification options
 * @param event - The event name to track
 * @param properties - Optional event properties
 * @returns Promise that resolves when tracking is complete
 */
export function track({
	event,
	properties,
	...identity
}: IdentityOptions & { event: TrackEvent; properties?: Properties }) {
	console.debug(
		`[RUDDERSTACK:${RUDDERSTACK_ENABLED ? "enabled" : "disabled"}] tracking event`,
		event,
	);

	if (!RUDDERSTACK_ENABLED) {
		return;
	}

	return new Promise((resolve) => {
		const msg = {
			event,
			properties: stringifyValues(properties),
			...identity,
		};
		getRudder().track(msg, () => {
			resolve(void 0);
		});
	});
}

/**
 * Associates a user with a group in RudderStack
 * @param identity - User identification options
 * @param groupId - The group identifier
 * @param traits - Optional group properties
 * @returns Promise that resolves when group association is complete
 */
export function group(
	{ groupId, ...identity }: IdentityOptions & { groupId: string },
	traits?: Properties,
) {
	console.debug(
		`[RUDDERSTACK:${RUDDERSTACK_ENABLED ? "enabled" : "disabled"}] group association`,
		groupId,
	);

	if (!RUDDERSTACK_ENABLED) {
		return;
	}

	return new Promise((resolve) => {
		const msg = {
			groupId,
			traits: stringifyValues(traits),
			...identity,
		};
		getRudder().group(msg, () => {
			resolve(void 0);
		});
	});
}

export const rudderstack = {
	identify,
	track,
	group,
};
