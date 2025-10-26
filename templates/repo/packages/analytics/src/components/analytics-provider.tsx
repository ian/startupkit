"use client"

import { pruneEmpty } from "@repo/utils"
import { AnalyticsProvider as StartupKitAnalyticsProvider } from "@startupkit/analytics"
import { PostHogProvider, usePostHog } from "posthog-js/react"
import type { ReactNode } from "react"
import type { Flags } from "../types"

export { AnalyticsContext } from "@startupkit/analytics"
export type { AnalyticsContextType } from "@startupkit/analytics"

interface AnalyticsProviderProps {
	children: ReactNode
	flags: Flags
}

/**
 * Analytics Provider - Direct integration with PostHog
 * 
 * Uses @startupkit/analytics for context pattern and auto page tracking.
 * You control PostHog version and can add other providers (OpenMeter, GA, etc.).
 */
export function AnalyticsProvider({ children, flags }: AnalyticsProviderProps) {
	return (
		<PostHogProvider
			apiKey={process.env.POSTHOG_API_KEY as string}
			options={{
				api_host: process.env.POSTHOG_HOST
			}}
		>
			<AnalyticsProviderInner flags={flags}>{children}</AnalyticsProviderInner>
		</PostHogProvider>
	)
}

function AnalyticsProviderInner({ children, flags }: AnalyticsProviderProps) {
	const posthog = usePostHog()

	return (
		<StartupKitAnalyticsProvider
			flags={flags}
			handlers={{
				identify: (userId, properties) => {
					if (userId) {
						posthog.identify(userId, pruneEmpty(properties))
					} else {
						posthog.reset()
					}
				},
				track: (event, properties) => {
					posthog.capture(event, pruneEmpty(properties))
				},
				page: (name, properties) => {
					posthog.capture("$pageview", {
						...pruneEmpty(properties),
						...(name ? { route: name } : {})
					})
				},
				reset: () => {
					posthog.reset()
				}
			}}
		>
			{children}
		</StartupKitAnalyticsProvider>
	)
}
