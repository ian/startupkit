"use client"

import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useMemo } from "react"
import { AnalyticsContext } from "./context"
import type { AnalyticsHandlers } from "./types"

interface AnalyticsProviderProps<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
> {
	children: ReactNode
	flags: TFlags
	handlers: AnalyticsHandlers
	autoPageTracking?: boolean
}

export function AnalyticsProvider<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
>({
	children,
	flags,
	handlers,
	autoPageTracking = true
}: AnalyticsProviderProps<TFlags>) {
	const pathname = usePathname()
	const segments = useSelectedLayoutSegments()

	useEffect(() => {
		if (!autoPageTracking) return

		const name = segments
			?.filter((segment) => !segment.startsWith("("))
			.map((segment) =>
				/\d/.test(segment) && segment.length > 6 ? ":id" : segment
			)
			.join("/") ?? ""

		handlers.page(`/${name}`, {
			pathname
		})
	}, [pathname, segments, handlers, autoPageTracking])

	const context = useMemo(
		() => ({
			identify: handlers.identify,
			track: handlers.track,
			page: handlers.page,
			reset: handlers.reset,
			flags
		}),
		[handlers, flags]
	)

	return (
		<AnalyticsContext.Provider value={context}>
			{children}
		</AnalyticsContext.Provider>
	)
}
