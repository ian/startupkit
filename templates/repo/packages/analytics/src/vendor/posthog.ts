const POSTHOG_HOST = process.env.POSTHOG_HOST
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY

export const DISTINCT_ID_COOKIE_NAME = "distinct_id"

export type Flags = {
	"20250121-rag-ingestion"?: "llamaparse" | "ragie" | "extend" | undefined
	"20250410-hotline-manager"?: true | false | undefined
	"20250426-brokerbot-agent-beta"?: true | false | undefined
}

// export type FlagValue = boolean | string | undefined;
export type FlagName = keyof Flags

/**
 * Fetches feature flags for the specified user from the PostHog service.
 *
 * Returns an object mapping feature flag names to their values for the given user.
 *
 * @param distinctUserId - The unique identifier for the user whose feature flags are being retrieved.
 * @returns An object containing feature flag values for the user. Boolean values indicate A/B test flags; string values indicate multivariate flags.
 *
 * @throws {Error} If required environment variables are missing or if the request to the PostHog service fails.
 */
export async function getFeatureFlags(distinctUserId: string): Promise<Flags> {
	if (!POSTHOG_HOST) {
		console.warn(
			"No PostHog environment variables found, skipping feature flag lookup."
		)
		console.warn(
			"Set POSTHOG_API_KEY and POSTHOG_HOST in your environment variables."
		)
		return {}
	}
	if (!POSTHOG_API_KEY) {
		throw new Error("The environment variable POSTHOG_API_KEY is missing.")
	}

	if (!distinctUserId) {
		// throw new Error(`distinctUserId is required and it can't be empty`);
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
