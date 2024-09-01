"use client";

import type { Subscription } from "@prisma/client";
import {
	type AnalyticsPlugins,
	AnalyticsProvider,
} from "@startupkit/analytics";
import { AuthProvider } from "@startupkit/auth";
import type { SessionData } from "@startupkit/auth/server";
import { SubscriptionProvider } from "@startupkit/payments";

/**
 * TODO: Customize these to your project's analytics config.
 */
const analyticsPlugins = {
	// googleAnalytics: {
	// 	measurementIds: ["YOUR ANALYTICS ID"],
	// },
	// plausible: {
	// 	domain: "YOUR DOMAIN",
	// 	trackLocalhost: true,
	// },
	// posthog: {
	// 	token: "YOUR TOKEN",
	// 	enabled: true,
	// 	options: {
	// 		persistence: "memory",
	// 		disable_cookie: true,
	// 	},
	// },
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
