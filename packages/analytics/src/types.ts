import type { ComponentType, ReactNode } from "react"

export interface AnalyticsHandlers {
	identify: (userId: string | null, traits?: Record<string, unknown>) => void
	track: (event: string, properties?: Record<string, unknown>) => void
	page: (name?: string, properties?: Record<string, unknown>) => void
	reset: () => void
}

export type PluginHandlersMap = Record<string, Partial<AnalyticsHandlers>>

export interface AnalyticsPlugin {
	name: string
	Provider?: ComponentType<{ children: ReactNode }>
	useHandlers: () => Partial<AnalyticsHandlers>
}

export type PluginsToHandlersMap<TPlugins extends readonly AnalyticsPlugin[]> =
	{
		[K in TPlugins[number]["name"]]: Partial<AnalyticsHandlers>
	}

export interface CustomAnalyticsHandlers<
	TPlugins extends readonly AnalyticsPlugin[] = readonly AnalyticsPlugin[]
> {
	identify: (params: {
		plugins: PluginsToHandlersMap<TPlugins>
		userId: string | null
		traits?: Record<string, unknown>
	}) => void
	track: (params: {
		plugins: PluginsToHandlersMap<TPlugins>
		event: string
		properties?: Record<string, unknown>
	}) => void
	page: (params: {
		plugins: PluginsToHandlersMap<TPlugins>
		name?: string
		properties?: Record<string, unknown>
	}) => void
	reset: (params: { plugins: PluginsToHandlersMap<TPlugins> }) => void
}

export interface AnalyticsContextType<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>
> {
	flags: TFlags
	identify: (userId: string | null, traits?: Record<string, unknown>) => void
	track: (event: string, properties?: Record<string, unknown>) => void
	page: (name?: string, properties?: Record<string, unknown>) => void
	reset: () => void
}
