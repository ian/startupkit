"use client";

import { Subscription } from "@prisma/client";
import { AnalyticsProvider } from "@startupkit/analytics";
import {
  AnalyticsPlugin,
  googleAnalyticsPlugin,
  plausiblePlugin,
  posthogPlugin,
} from "@startupkit/analytics/plugins";
import { AuthProvider } from "@startupkit/auth";
import { SessionData } from "@startupkit/auth/server";
import { SubscriptionProvider } from "@startupkit/payments";

/**
 * Add your custom Analytics plugins here.
 * You can use any plugins from the npm `analytics` package:
 * https://github.com/DavidWells/analytics?tab=readme-ov-file#analytic-plugins
 */
const analyticsPlugin: AnalyticsPlugin[] = [
  googleAnalyticsPlugin({
    measurementIds: [process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID],
  }),
  plausiblePlugin({
    domain: "startup.example",
    trackLocalhost: true,
  }),
  posthogPlugin({
    token: process.env.NEXT_PUBLIC_POSTHOG_TOKEN!,
    enabled: true,
    options: {
      persistence: "memory",
      disable_cookie: true,
    },
  }),
];

export const ClientProviders = ({
  children,
  session,
  subscription,
}: {
  children: React.ReactNode;
  session?: SessionData;
  subscription?: Subscription | null;
}) => {
  return (
    <AnalyticsProvider plugins={analyticsPlugin}>
      <AuthProvider session={session}>
        <SubscriptionProvider subscription={subscription}>
          {children}
        </SubscriptionProvider>
      </AuthProvider>
    </AnalyticsProvider>
  );
};
