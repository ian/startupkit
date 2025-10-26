"use client"

import { pruneEmpty } from "@repo/utils"
import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import { PostHogProvider, usePostHog } from "posthog-js/react"
import {
	type ReactNode,
	createContext,
	useEffect,
	useMemo
} from "react"
import type { Flags } from "../types"

type TagKey = Lowercase<string>
type Properties = Record<TagKey, string | number | boolean | null | undefined>

// Client-side events (most tracking happens server-side)
type TrackEvent = never

const {
	POSTHOG_API_KEY,
	POSTHOG_HOST
} = process.env

export interface AnalyticsContextType {
	flags: Flags
	identify: (userId: string | null, traits?: Properties) => void
	track: (event: TrackEvent, properties?: Properties) => void
	reset: () => void
}

export const AnalyticsContext = createContext<AnalyticsContextType>({
	flags: {},
	identify: () => { },
	track: () => { },
	reset: () => { }
})

type AnalyticsProviderProps = {
	children: ReactNode
	flags: Flags
}

/**
 * Analytics Provider - Direct integration with PostHog
 * 
 * Simple, direct PostHog integration. You control the version and can upgrade anytime.
 */
export function AnalyticsProvider({ children, flags }: AnalyticsProviderProps) {
	return (
		<PostHogProvider
			apiKey={POSTHOG_API_KEY as string}
			options={{
				api_host: POSTHOG_HOST
			}}
		>
			<AnalyticsProviderInner flags={flags}>{children}</AnalyticsProviderInner>
		</PostHogProvider>
	)
}

function AnalyticsProviderInner({ children, flags }: AnalyticsProviderProps) {
	const pathname = usePathname()
	const segments = useSelectedLayoutSegments()
	const posthog = usePostHog()

	// Auto-track page views with clean route names
	useEffect(() => {
		const name = segments
			.filter((segment) => {
				return !segment.startsWith("(")
			})
			.map((segment) => {
				return /\d/.test(segment) && segment.length > 6 ? ":id" : segment
			})
			.join("/")

		posthog.capture("$pageview", {
			$current_url: pathname,
			route: `/${name}`
		})
	}, [pathname, segments, posthog])

	const context = useMemo(() => {
		return {
			identify: (userId: string | null, properties: Properties = {}) => {
				if (userId) {
					posthog.identify(userId, pruneEmpty(properties))
				} else {
					posthog.reset()
				}
			},
			reset: () => {
				posthog.reset()
			},
			track: (event: string, properties?: Properties) => {
				posthog.capture(event, pruneEmpty(properties))
			},
			flags
		}
	}, [flags, posthog])

	return (
		<AnalyticsContext.Provider value={context}>
			{children}
		</AnalyticsContext.Provider>
	)
}
