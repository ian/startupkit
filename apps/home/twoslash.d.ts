declare module "@startupkit/auth" {
	export interface AuthContextType<
		TUser extends Record<string, unknown> = Record<string, unknown>
	> {
		isAuthenticated: boolean
		isLoading: boolean
		user: TUser | null | undefined
		logout: () => Promise<void>
		sendAuthCode: (email: string) => Promise<void>
		verifyAuthCode: (email: string, code: string) => Promise<void>
		googleAuth: () => Promise<void>
	}

	export function useAuth<
		TUser extends Record<string, unknown> = Record<string, unknown>
	>(): AuthContextType<TUser>

	export function AuthProvider(props: {
		children: React.ReactNode
		authClient: unknown
		user?: unknown
		onIdentify?: (user: unknown) => void
		onReset?: () => void
	}): JSX.Element
}

declare module "@startupkit/analytics" {
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

	export function useAnalytics<
		TFlags extends Record<string, unknown> = Record<
			string,
			boolean | string | undefined
		>
	>(): AnalyticsContextType<TFlags>

	export function AnalyticsProvider(props: {
		children: React.ReactNode
		flags?: Record<string, unknown>
		plugins: unknown[]
	}): JSX.Element

	export function PostHogPlugin(config: { apiKey: string }): unknown
	export function GoogleAnalyticsPlugin(config: {
		measurementId: string
	}): unknown
	export function OpenPanelPlugin(config: { clientId: string }): unknown
}

declare module "@startupkit/seo" {
	export function generateSEOMetadata(config: {
		title: string
		description: string
		url?: string
		image?: string
	}): Record<string, unknown>

	export function generateRobots(config?: {
		allow?: string[]
		disallow?: string[]
		sitemap?: string
	}): Record<string, unknown>

	export function generateSitemap(config: {
		baseUrl: string
		routes: string[]
	}): unknown[]
}
