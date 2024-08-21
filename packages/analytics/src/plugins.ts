import { type GoogleAnalyticsConfig } from "./plugins/ga";
import { type PlausibleConfig } from "./plugins/plausible";
import { type PosthogConfig } from "./plugins/posthog";

export type AnalyticsPlugins = {
  googleAnalytics: GoogleAnalyticsConfig;
  posthog: PosthogConfig;
  plausible: PlausibleConfig;
};
