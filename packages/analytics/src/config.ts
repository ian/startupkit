import { NextConfig } from "next";

type AnalyticsConfig = {
  debug?: boolean;
};

// googleAnalytics({
//   measurementIds: [process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID],
// }),
// plausiblePlugin({
//   domain: "startupkit.com",
//   trackLocalhost: true,
// }),
// posthogPlugin({
//   token: process.env.NEXT_PUBLIC_POSTHOG_TOKEN!,
//   enabled: true,
//   options: {
//     // debug: process.env.NODE_ENV === "development",
//     persistence: "memory",
//     disable_cookie: true,
//   },
// }),

const withAnalytics = (
  pluginConfig: AnalyticsConfig,
): ((nextConfig: NextConfig) => NextConfig) => {
  return function withAnalytics(nextConfig: NextConfig) {
    return nextConfig;
  };
};

export default withAnalytics;
