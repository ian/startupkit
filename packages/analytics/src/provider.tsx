"use client"

import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useMemo } from "react"
import { AnalyticsContext } from "./context"
import type {
	AnalyticsContextType,
	AnalyticsHandlers,
	AnalyticsPlugin,
	CustomAnalyticsHandlers
} from "./types"

/**
 * Props for the AnalyticsProvider component
 *
 * @template TFlags - Type definition for feature flags, defaults to a record of boolean, string, or undefined values
 */
interface AnalyticsProviderProps<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>,
	TPlugins extends readonly AnalyticsPlugin[] = readonly AnalyticsPlugin[]
> {
	/** React children to render within the provider */
	children: ReactNode
	/** Feature flags object to be made available throughout the app */
	flags: TFlags
	/** Optional array of analytics plugins (GoogleAnalytics, OpenPanel, PostHog, etc.) */
	plugins?: TPlugins
	/** Optional manual handlers - can be simple handlers OR custom handlers with plugin access. When used with plugins, handlers can be partial - unspecified handlers will use default behavior */
	handlers?: AnalyticsHandlers | Partial<CustomAnalyticsHandlers<TPlugins>>
	/** Whether to automatically track page views on navigation. Defaults to true */
	autoPageTracking?: boolean
}

/**
 * AnalyticsProvider - Main provider component for analytics integration
 *
 * Supports two modes of operation:
 * 1. **Plugin mode (recommended)**: Pass an array of plugins for clean, composable analytics
 * 2. **Manual handlers mode**: Pass custom handlers directly (for advanced use cases)
 *
 * Features:
 * - Automatic page view tracking on route changes
 * - Multi-provider support (send events to multiple services simultaneously)
 * - Feature flag access via context
 * - Type-safe API
 *
 * @example
 * ```tsx
 * // Plugin mode (recommended)
 * const plugins = [
 *   GoogleAnalyticsPlugin({ measurementId: 'G-XXXXXXXXXX' }),
 *   OpenPanelPlugin({ clientId: 'your-client-id' }),
 * ];
 *
 * <AnalyticsProvider flags={{ newFeature: true }} plugins={plugins}>
 *   <App />
 * </AnalyticsProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Manual handlers mode
 * const handlers = {
 *   identify: (userId, traits) => { ... },
 *   track: (event) => { ... },
 *   page: (name, properties) => { ... },
 *   reset: () => { ... },
 * };
 *
 * <AnalyticsProvider flags={{}} handlers={handlers}>
 *   <App />
 * </AnalyticsProvider>
 * ```
 *
 * @template TFlags - Type definition for feature flags
 */
export function AnalyticsProvider<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>,
	TPlugins extends readonly AnalyticsPlugin[] = readonly AnalyticsPlugin[]
>({
	children,
	flags,
	plugins = [] as unknown as TPlugins,
	handlers: providedHandlers,
	autoPageTracking = true
}: AnalyticsProviderProps<TFlags, TPlugins>) {
	if (plugins.length > 0 && providedHandlers) {
		return (
			<PluginComposer plugins={plugins}>
				<AnalyticsProviderInnerWithCustomHandlers
					flags={flags}
					plugins={plugins}
					handlers={providedHandlers as CustomAnalyticsHandlers<TPlugins>}
					autoPageTracking={autoPageTracking}
				>
					{children}
				</AnalyticsProviderInnerWithCustomHandlers>
			</PluginComposer>
		)
	}

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
			handlers={providedHandlers as AnalyticsHandlers}
			autoPageTracking={autoPageTracking}
		>
			{children}
		</AnalyticsProviderCore>
	)
}

/**
 * PluginComposer - Composes multiple plugin providers into a nested provider tree
 *
 * Takes an array of plugins and wraps the children in each plugin's Provider component
 * using right-to-left composition. This ensures plugins are initialized in the correct order.
 *
 * @internal This is an internal component used by AnalyticsProvider
 *
 * @example
 * If plugins = [GoogleAnalytics, OpenPanel], the output is:
 * ```tsx
 * <GoogleAnalyticsProvider>
 *   <OpenPanelProvider>
 *     {children}
 *   </OpenPanelProvider>
 * </GoogleAnalyticsProvider>
 * ```
 */
function PluginComposer({
	plugins,
	children
}: {
	plugins: readonly AnalyticsPlugin[]
	children: ReactNode
}) {
	return plugins.reduceRight((acc, plugin) => {
		if (plugin.Provider) {
			return <plugin.Provider>{acc}</plugin.Provider>
		}
		return acc
	}, children)
}

/**
 * Props for AnalyticsProviderInner component
 *
 * @template TFlags - Type definition for feature flags
 * @internal
 */
interface AnalyticsProviderInnerProps<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
> {
	/** React children to render */
	children: ReactNode
	/** Feature flags object */
	flags: TFlags
	/** Array of analytics plugins to merge handlers from */
	plugins: readonly AnalyticsPlugin[]
	/** Whether to enable automatic page tracking */
	autoPageTracking?: boolean
}

/**
 * AnalyticsProviderInner - Merges handlers from all plugins and creates unified analytics interface
 *
 * This component is responsible for:
 * 1. Calling each plugin's useHandlers() hook to get their handlers
 * 2. Merging all handlers into a single AnalyticsHandlers object
 * 3. When an analytics method is called, it forwards the call to all plugin handlers
 *
 * @internal This is an internal component used by AnalyticsProvider
 *
 * @template TFlags - Type definition for feature flags
 */
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

/**
 * Props for AnalyticsProviderInnerWithCustomHandlers component
 *
 * @template TFlags - Type definition for feature flags
 * @template TPlugins - Type definition for plugins array
 * @internal
 */
interface AnalyticsProviderInnerWithCustomHandlersProps<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>,
	TPlugins extends readonly AnalyticsPlugin[] = readonly AnalyticsPlugin[]
> {
	/** React children to render */
	children: ReactNode
	/** Feature flags object */
	flags: TFlags
	/** Array of analytics plugins */
	plugins: TPlugins
	/** Custom handlers with plugin access - can be partial */
	handlers: Partial<CustomAnalyticsHandlers<TPlugins>>
	/** Whether to enable automatic page tracking */
	autoPageTracking?: boolean
}

/**
 * AnalyticsProviderInnerWithCustomHandlers - Provides plugin handlers to custom handlers
 *
 * This component is responsible for:
 * 1. Calling each plugin's useHandlers() hook to get their handlers
 * 2. Creating a typed map of plugin names to handlers
 * 3. Calling the custom handlers with the plugin map for full customization
 *
 * @internal This is an internal component used by AnalyticsProvider
 *
 * @template TFlags - Type definition for feature flags
 * @template TPlugins - Type definition for plugins array
 */
function AnalyticsProviderInnerWithCustomHandlers<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>,
	TPlugins extends readonly AnalyticsPlugin[] = readonly AnalyticsPlugin[]
>({
	children,
	flags,
	plugins,
	handlers: customHandlers,
	autoPageTracking = true
}: AnalyticsProviderInnerWithCustomHandlersProps<TFlags, TPlugins>) {
	const pluginHandlers = plugins.map((plugin) => plugin.useHandlers())

	const pluginMap = useMemo(() => {
		const map: Record<string, Partial<AnalyticsHandlers>> = {}
		for (let i = 0; i < plugins.length; i++) {
			const plugin = plugins[i]
			if (plugin) {
				map[plugin.name] = pluginHandlers[i] ?? {}
			}
		}
		return map as import("./types").PluginsToHandlersMap<TPlugins>
	}, [plugins, pluginHandlers])

	const handlers = useMemo<AnalyticsHandlers>(() => {
		const pluginHandlersList = Object.values(
			pluginMap
		) as Partial<AnalyticsHandlers>[]

		return {
			identify: (userId, traits) => {
				if (customHandlers.identify) {
					customHandlers.identify({
						plugins: pluginMap,
						userId,
						traits
					})
				} else {
					for (const handler of pluginHandlersList) {
						handler.identify?.(userId, traits)
					}
				}
			},
			track: (event, properties) => {
				if (customHandlers.track) {
					customHandlers.track({
						plugins: pluginMap,
						event,
						properties
					})
				} else {
					for (const handler of pluginHandlersList) {
						handler.track?.(event, properties)
					}
				}
			},
			page: (name, properties) => {
				if (customHandlers.page) {
					customHandlers.page({
						plugins: pluginMap,
						name,
						properties
					})
				} else {
					for (const handler of pluginHandlersList) {
						handler.page?.(name, properties)
					}
				}
			},
			reset: () => {
				if (customHandlers.reset) {
					customHandlers.reset({
						plugins: pluginMap
					})
				} else {
					for (const handler of pluginHandlersList) {
						handler.reset?.()
					}
				}
			}
		}
	}, [customHandlers, pluginMap])

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

/**
 * Props for AnalyticsProviderCore component
 *
 * @template TFlags - Type definition for feature flags
 * @internal
 */
interface AnalyticsProviderCoreProps<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
> {
	/** React children to render */
	children: ReactNode
	/** Feature flags object */
	flags: TFlags
	/** Analytics handlers for identify, track, page, and reset operations */
	handlers: AnalyticsHandlers
	/** Whether to enable automatic page tracking */
	autoPageTracking?: boolean
}

/**
 * AnalyticsProviderCore - Core provider that manages analytics context and automatic page tracking
 *
 * This component is responsible for:
 * 1. Setting up automatic page view tracking on route changes (using Next.js router)
 * 2. Creating the analytics context with handlers and flags
 * 3. Providing the context to all child components
 *
 * Page tracking behavior:
 * - Tracks page views automatically when pathname changes
 * - Filters out Next.js route group segments (those starting with "(")
 * - Replaces long numeric segments (likely IDs) with ":id" for cleaner analytics
 * - Sends sanitized route name and current pathname to analytics providers
 *
 * @internal This is an internal component used by AnalyticsProvider
 *
 * @template TFlags - Type definition for feature flags
 */
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
		<AnalyticsContext.Provider
			value={context as AnalyticsContextType<Record<string, unknown>>}
		>
			{children}
		</AnalyticsContext.Provider>
	)
}
