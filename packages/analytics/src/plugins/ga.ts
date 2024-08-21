// @ts-ignore - google-analytics is not typed argh!
import { default as googleAnalyticsPlugin } from "@analytics/google-analytics";
export { googleAnalyticsPlugin };
export type GoogleAnalyticsConfig = {
  measurementIds: string[];
};
