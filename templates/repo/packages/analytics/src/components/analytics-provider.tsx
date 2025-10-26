"use client"

import { pruneEmpty } from "@repo/utils"
import { createAnalyticsProvider } from "@startupkit/analytics"
import type { ReactNode } from "react"
import type { Flags } from "../types"

export { AnalyticsContext } from "@startupkit/analytics"
export type { AnalyticsContextType } from "@startupkit/analytics"

const AnalyticsProviderBase = createAnalyticsProvider<Flags>()

interface AnalyticsProviderProps {
	children: ReactNode
	flags: Flags
}

/**
 * Analytics Provider - Uses @startupkit/analytics with PostHog
 * 
 * Wraps @startupkit/analytics provider with project-specific configuration.
 * You control PostHog version and can upgrade anytime.
 */
export function AnalyticsProvider({ children, flags }: AnalyticsProviderProps) {
	return (
		<AnalyticsProviderBase
			config={{
				apiKey: process.env.POSTHOG_API_KEY as string,
				apiHost: process.env.POSTHOG_HOST,
				flags,
				pruneEmpty
			}}
		>
			{children}
		</AnalyticsProviderBase>
	)
}
