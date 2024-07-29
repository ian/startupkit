"use client";

import { AnalyticsProvider } from "@startupkit/analytics";
import { googleAnalytics } from "@startupkit/analytics/ga";
import { plausiblePlugin } from "@startupkit/analytics/plausible";
import { posthogPlugin } from "@startupkit/analytics/posthog";

const plugins = [
  googleAnalytics({
    measurementIds: [process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID],
  }),
  plausiblePlugin({
    domain: "startupkit.com",
    trackLocalhost: true,
  }),
  posthogPlugin({
    token: process.env.NEXT_PUBLIC_POSTHOG_TOKEN!,
    enabled: true,
    options: {
      debug: process.env.NODE_ENV === "development",
      persistence: "memory",
      disable_cookie: true,
      disable_session_recording: true,
    },
  }),
];

export const ClientProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <AnalyticsProvider plugins={plugins}>{children}</AnalyticsProvider>;
};
