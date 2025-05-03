import { useContext } from "react";
import { AnalyticsContext } from "../components/analytics-provider";

export function useAnalytics() {
	return useContext(AnalyticsContext);
}
