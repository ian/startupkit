"use client"

import { AnalyticsProvider } from "@startupkit/analytics"
import googleAnalytics from "@startupkit/analytics/ga"
import plausiblePlugin from "@startupkit/analytics/plausible"
import posthogPlugin from "@startupkit/analytics/posthog"

const plugins: any[] = [
	googleAnalytics({
		measurementIds: [process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID]
	}),
	plausiblePlugin({
		domain: "startupkit.com",
		trackLocalhost: true
	}),
	posthogPlugin({
		token: process.env.NEXT_PUBLIC_POSTHOG_TOKEN || "",
		enabled: true,
		options: {
			persistence: "memory",
			disable_cookie: true
		}
	})
]

export const StartupKitProvider = ({
	children
}: Readonly<{
	children: React.ReactNode
}>) => {
	return <AnalyticsProvider plugins={plugins}>{children}</AnalyticsProvider>
}
