"use client"

import { pruneEmpty } from "@repo/utils"
import type { RudderAnalytics } from "@rudderstack/analytics-js"
import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import { PostHogProvider, usePostHog } from "posthog-js/react"
import {
    type ReactNode,
    createContext,
    useEffect,
    useMemo,
    useState
} from "react"
import type { Flags } from "../types"

type TagKey = Lowercase<string>
type Properties = Record<TagKey, string | number | boolean | null | undefined>

// Client-side events (most tracking happens server-side)
type TrackEvent = never

const {
	POSTHOG_API_KEY,
	POSTHOG_HOST,
	RUDDERSTACK_DATA_PLANE_URL,
	RUDDERSTACK_WRITE_KEY,
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
 * Analytics Provider - Direct integration with PostHog and RudderStack
 * 
 * This implementation imports directly from posthog-js and @rudderstack/analytics-js.
 * You control the versions and can upgrade them independently.
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
	const [analytics, setAnalytics] = useState<RudderAnalytics | null>(null)

	useEffect(() => {
		const name = segments
			.filter((segment) => {
				return !segment.startsWith("(")
			})
			.map((segment) => {
				return /\d/.test(segment) && segment.length > 6 ? ":id" : segment
			})
			.join("/")

		analytics?.page(name, {
			path: pathname,
			route: `/${name}`
		})
	}, [analytics, pathname, segments])

	useEffect(() => {
		if (RUDDERSTACK_WRITE_KEY && RUDDERSTACK_DATA_PLANE_URL) {
			import("@rudderstack/analytics-js").then(({ RudderAnalytics }) => {
				const analytics = new RudderAnalytics()
				analytics.load(RUDDERSTACK_WRITE_KEY, RUDDERSTACK_DATA_PLANE_URL)
				setAnalytics(analytics)
			})
		}
	}, [])

	const context = useMemo(() => {
		return {
			identify: (userId: string | null, properties: Properties = {}) => {
				if (userId) {
					const pruned = pruneEmpty(properties)
					analytics?.identify(userId, pruned)
					posthog.identify(userId, pruned)
				} else {
					analytics?.reset()
					posthog.reset()
				}
			},
			reset: () => {
				analytics?.reset()
				posthog.reset()
			},
			track: (event: string, properties?: Properties) => {
				analytics?.track(event, pruneEmpty(properties))
				posthog.capture(event, pruneEmpty(properties))
			},
			flags
		}
	}, [analytics, flags, posthog])

	return (
		<AnalyticsContext.Provider value={context}>
			{children}
		</AnalyticsContext.Provider>
	)
}
