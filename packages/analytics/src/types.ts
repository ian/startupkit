export interface AnalyticsContextType<TFlags = Record<string, boolean | string | undefined>> {
    flags: TFlags
    identify: (userId: string | null, traits?: Record<string, string | number | boolean | null | undefined>) => void
    track: (event: string, properties?: Record<string, string | number | boolean | null | undefined>) => void
    reset: () => void
}

