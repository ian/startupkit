"use client"

import {
	AnalyticsProvider,
	GoogleAnalytics,
	OpenPanelPlugin
} from "@startupkit/analytics"
import type { ReactNode } from "react"

const plugins = [
	GoogleAnalytics({
		measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string
	}),
	OpenPanelPlugin({
		clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID as string
	})
]

export function StartupKitProvider({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<AnalyticsProvider flags={{}} plugins={plugins}>
			{children}
		</AnalyticsProvider>
	)
}
