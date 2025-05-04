"use client"

import {
	type ReactNode,
	createContext,
	useEffect,
	useMemo,
	useState
} from "react"
import { pruneEmpty } from "@repo/utils"
import type { RudderAnalytics } from "@rudderstack/analytics-js"
import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import { PostHogProvider, usePostHog } from "posthog-js/react"
import type { Flags } from "../vendor/posthog"

type TagKey = Lowercase<string>
type Properties = Record<TagKey, string | number | boolean | null | undefined>

// TODO: We track most events server side, what will be client side only?
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
				// Filter out Next.js folder patterns wrapped in parentheses
				return !segment.startsWith("(")
			})
			.map((segment) => {
				// Check if segment contains numbers and is longer than 6 characters
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
	}, [analytics, flags])

	return (
		<AnalyticsContext.Provider value={context}>
			{children}
		</AnalyticsContext.Provider>
	)
}
