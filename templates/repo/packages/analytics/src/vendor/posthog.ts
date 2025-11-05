const POSTHOG_HOST = process.env.POSTHOG_HOST
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY

export const DISTINCT_ID_COOKIE_NAME = "distinct_id"

// Match these to the flags in PostHog
export type Flags = {
	"secret-flag"?: true | false | undefined
}

// export type FlagValue = boolean | string | undefined;
export type FlagName = keyof Flags

/**
 * Fetches feature flags for the specified user from the PostHog service.
 *
 * Returns an object mapping feature flag names to their values for the given user.
 * If PostHog is not configured (missing API key or host), returns an empty object.
 *
 * @param distinctUserId - The unique identifier for the user whose feature flags are being retrieved.
 * @returns An object containing feature flag values for the user. Boolean values indicate A/B test flags; string values indicate multivariate flags.
 *
 * @throws {Error} If the request to the PostHog service fails.
 */
export async function getFeatureFlags(distinctUserId: string): Promise<Flags> {
	if (!POSTHOG_HOST || !POSTHOG_API_KEY) {
		return {}
	}

	if (!distinctUserId) {
		return {} as Flags
	}

	const res = await fetch(`${POSTHOG_HOST}/decide?v=2`, {
		method: "POST",
		body: JSON.stringify({
			api_key: POSTHOG_API_KEY,
			distinct_id: distinctUserId
		})
	})

	if (!res.ok) {
		throw new Error(
			`Fetch request to retrieve flag status failed with: (${res.status}) ${res.statusText}`
		)
	}

	const data = (await res.json()) as { featureFlags: Flags }

	return data.featureFlags as Flags
}
