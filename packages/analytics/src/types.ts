import type { ComponentType, ReactNode } from "react"

export interface AnalyticsHandlers<TEvent = Record<string, unknown>> {
	identify: (userId: string | null, traits?: Record<string, unknown>) => void
	track: (event: TEvent) => void
	page: (name?: string, properties?: Record<string, unknown>) => void
	reset: () => void
}

export interface AnalyticsContextType<
	TFlags extends Record<string, unknown> = Record<
		string,
		boolean | string | undefined
	>,
	TEvent = Record<string, unknown>
> {
	flags: TFlags
	identify: (userId: string | null, traits?: Record<string, unknown>) => void
	track: (event: TEvent) => void
	page: (name?: string, properties?: Record<string, unknown>) => void
	reset: () => void
}

export interface AnalyticsPlugin<TEvent = Record<string, unknown>> {
	name: string
	Provider?: ComponentType<{ children: ReactNode }>
	useHandlers: () => Partial<AnalyticsHandlers<TEvent>>
}
