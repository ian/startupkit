export interface AnalyticsHandlers {
	identify: (userId: string | null, traits?: Record<string, unknown>) => void
	track: (event: string, properties?: Record<string, unknown>) => void
	page: (name?: string, properties?: Record<string, unknown>) => void
	reset: () => void
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
