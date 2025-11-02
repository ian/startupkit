"use client"

import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useMemo } from "react"
import { AnalyticsContext } from "./context"
import type { AnalyticsHandlers, AnalyticsPlugin } from "./types"

interface AnalyticsProviderProps<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
> {
	children: ReactNode
	flags: TFlags
	plugins?: AnalyticsPlugin[]
	handlers?: AnalyticsHandlers
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
	plugins = [],
	handlers: providedHandlers,
	autoPageTracking = true
}: AnalyticsProviderProps<TFlags>) {
	if (plugins.length > 0) {
		return (
			<PluginComposer plugins={plugins}>
				<AnalyticsProviderInner
					flags={flags}
					plugins={plugins}
					autoPageTracking={autoPageTracking}
				>
					{children}
				</AnalyticsProviderInner>
			</PluginComposer>
		)
	}

	if (!providedHandlers) {
		throw new Error(
			"AnalyticsProvider requires either plugins or handlers prop"
		)
	}

	return (
		<AnalyticsProviderCore
			flags={flags}
			handlers={providedHandlers}
			autoPageTracking={autoPageTracking}
		>
			{children}
		</AnalyticsProviderCore>
	)
}

function PluginComposer({
	plugins,
	children
}: {
	plugins: AnalyticsPlugin[]
	children: ReactNode
}) {
	return plugins.reduceRight((acc, plugin) => {
		if (plugin.Provider) {
			return <plugin.Provider>{acc}</plugin.Provider>
		}
		return acc
	}, children)
}

interface AnalyticsProviderInnerProps<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
> {
	children: ReactNode
	flags: TFlags
	plugins: AnalyticsPlugin[]
	autoPageTracking?: boolean
}

function AnalyticsProviderInner<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
>({
	children,
	flags,
	plugins,
	autoPageTracking = true
}: AnalyticsProviderInnerProps<TFlags>) {
	const pluginHandlers = plugins.map((plugin) => plugin.useHandlers())

	const handlers = useMemo<AnalyticsHandlers>(() => {
		const mergedHandlers: AnalyticsHandlers = {
			identify: (userId, traits) => {
				for (const handler of pluginHandlers) {
					handler.identify?.(userId, traits)
				}
			},
			track: (event, properties) => {
				for (const handler of pluginHandlers) {
					handler.track?.(event, properties)
				}
			},
			page: (name, properties) => {
				for (const handler of pluginHandlers) {
					handler.page?.(name, properties)
				}
			},
			reset: () => {
				for (const handler of pluginHandlers) {
					handler.reset?.()
				}
			}
		}
		return mergedHandlers
	}, [pluginHandlers])

	return (
		<AnalyticsProviderCore
			flags={flags}
			handlers={handlers}
			autoPageTracking={autoPageTracking}
		>
			{children}
		</AnalyticsProviderCore>
	)
}

interface AnalyticsProviderCoreProps<
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

function AnalyticsProviderCore<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
>({
	children,
	flags,
	handlers,
	autoPageTracking = true
}: AnalyticsProviderCoreProps<TFlags>) {
	const pathname = usePathname()
	const segments = useSelectedLayoutSegments()

	useEffect(() => {
		if (!autoPageTracking) return

		const name =
			segments
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
