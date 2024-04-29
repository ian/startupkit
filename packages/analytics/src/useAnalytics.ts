import { useContext } from "react";
import { RudderAnalytics } from "@rudderstack/analytics-js";
import { AnalyticsContext } from "./Provider";

export const useAnalytics = (): RudderAnalytics | undefined => {
  return useContext(AnalyticsContext);
};
