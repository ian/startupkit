"use client"

import {
	AnalyticsProvider,
	DatafastPlugin,
	GoogleAnalyticsPlugin
} from "@startupkit/analytics"
import type { ReactNode } from "react"

const plugins = [
	DatafastPlugin({
		websiteId: "dfid_9JQlCP9rRXtdCuhTdUPQ1",
		domain: "startupkit.com"
	}),
	GoogleAnalyticsPlugin({ measurementId: "G-E5X54QBJ07" })
]

interface ProvidersProps {
	children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
	return (
		<AnalyticsProvider flags={{}} plugins={plugins}>
			{children}
		</AnalyticsProvider>
	)
}
