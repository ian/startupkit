"use client"

import { AnalyticsProvider } from "@repo/analytics"
import type { Flags } from "@repo/analytics/server"
import { UIProvider } from "@repo/ui/providers"

export function Providers({
	children,
	flags
}: {
	children: React.ReactNode
	flags: Flags
}) {
	return (
		<UIProvider themes={["dark"]} defaultTheme="dark" forcedTheme="dark">
			<AnalyticsProvider flags={flags}>{children}</AnalyticsProvider>
		</UIProvider>
	)
}
