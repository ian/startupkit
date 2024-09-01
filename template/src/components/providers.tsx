"use client";

import { Subscription } from "@prisma/client";
import { AnalyticsPlugins, AnalyticsProvider } from "@startupkit/analytics";
import { AuthProvider } from "@startupkit/auth";
import { SessionData } from "@startupkit/auth/server";
import { SubscriptionProvider } from "@startupkit/payments";

const analyticsPlugins = {
	googleAnalytics: {
		measurementIds: [process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!],
	},
	plausible: {
		domain: process.env.PLAUSIBLE_DOMAIN!,
		trackLocalhost: true,
	},
	posthog: {
		token: process.env.NEXT_PUBLIC_POSTHOG_TOKEN!,
		enabled: true,
		options: {
			persistence: "memory",
			disable_cookie: true,
		},
	},
} satisfies AnalyticsPlugins;

export const Providers = ({
	children,
	session,
	subscription,
}: {
	children: React.ReactNode;
	session?: SessionData;
	subscription?: Subscription | null;
}) => {
	return (
		<AnalyticsProvider plugins={analyticsPlugins}>
			<AuthProvider session={session}>
				<SubscriptionProvider subscription={subscription}>
					{children}
				</SubscriptionProvider>
			</AuthProvider>
		</AnalyticsProvider>
	);
};
