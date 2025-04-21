const POSTHOG_HOST = process.env.POSTHOG_HOST;
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;

export const DISTINCT_ID_COOKIE_NAME = "distinct_id";

export type Flags = {
	"20250121-rag-ingestion"?: "llamaparse" | "ragie" | "extend" | undefined;
	"20250410-hotline-manager"?: true | false | undefined;
}

// export type FlagValue = boolean | string | undefined;
export type FlagName = keyof Flags;

/**
 * Retrieves the feature flags for a given user.
 *
 * @param distinctUserId A unique identifier for the user
 * @returns If the feature flag is an A/B test, then the value may be true or undefined.
 *          If the feature flag is a multvariate, then the value will be a string
 */
export async function getFeatureFlags(distinctUserId: string): Promise<Flags> {
	if (!POSTHOG_HOST) {
		throw new Error(
			"The environment variable NEXT_PUBLIC_POSTHOG_HOST is missing.",
		);
	}
	if (!POSTHOG_API_KEY) {
		throw new Error("The environment variable POSTHOG_API_KEY is missing.");
	}

	if (!distinctUserId) {
		// throw new Error(`distinctUserId is required and it can't be empty`);
		return {} as Flags;
	}

	const res = await fetch(`${POSTHOG_HOST}/decide?v=2`, {
		method: "POST",
		body: JSON.stringify({
			api_key: POSTHOG_API_KEY,
			distinct_id: distinctUserId,
		}),
	});

	if (!res.ok) {
		throw new Error(
			`Fetch request to retrieve flag status failed with: (${res.status}) ${res.statusText}`,
		);
	}

	const data = (await res.json()) as { featureFlags: Flags };

	console.log(distinctUserId, data.featureFlags)

	return data.featureFlags as Flags;
}
