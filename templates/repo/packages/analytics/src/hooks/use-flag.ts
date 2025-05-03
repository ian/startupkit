import { useContext } from "react";

import { AnalyticsContext } from "../components/analytics-provider";
import type { FlagName, Flags } from "../vendor/posthog";

export function useFlag<T extends FlagName>(name: T) {
	const context = useContext(AnalyticsContext);

	if (!context) {
		// throw new Error("useFlag must be used within an AnalyticsProvider");
		return null;
	}

	return context.flags[name] as Flags[T];
}
