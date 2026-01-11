declare module "@startupkit/auth" {
	import type { ReactNode } from "react"

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
		children: ReactNode
		authClient: unknown
		user?: unknown
		onIdentify?: (user: unknown) => void
		onReset?: () => void
	}): ReactNode
}

declare module "@startupkit/analytics" {
	import type { ReactNode } from "react"

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

	export function useFlag<T = boolean>(
		flagName: string,
		defaultValue?: T
	): T | undefined

	export function AnalyticsProvider(props: {
		children: ReactNode
		flags?: Record<string, unknown>
		plugins: unknown[]
	}): ReactNode

	export function PostHogPlugin(config: {
		apiKey: string
		apiHost?: string
	}): unknown
	export function GoogleAnalyticsPlugin(config: {
		measurementId: string
	}): unknown
	export function OpenPanelPlugin(config: {
		clientId: string
		trackScreenViews?: boolean
	}): unknown
	export function AhrefsPlugin(config: { siteId: string }): unknown
}

declare module "@repo/db" {
	import type { PgDatabase } from "drizzle-orm/pg-core"

	export interface User {
		id: string
		firstName: string | null
		lastName: string | null
		name: string | null
		image: string | null
		email: string | null
		emailVerified: boolean
		phone: string | null
		role: string
		createdAt: Date
		updatedAt: Date
		lastSeenAt: Date | null
	}

	export interface NewUser {
		id: string
		firstName?: string | null
		lastName?: string | null
		name?: string | null
		image?: string | null
		email?: string | null
		emailVerified?: boolean
		phone?: string | null
		role?: string
		createdAt?: Date
		updatedAt?: Date
		lastSeenAt?: Date | null
	}

	export interface Team {
		id: string
		name: string
		slug: string
		createdAt: Date
		updatedAt: Date | null
	}

	export interface NewTeam {
		id: string
		name: string
		slug: string
		createdAt?: Date
		updatedAt?: Date | null
	}

	export interface TeamMember {
		teamId: string
		userId: string
		role: "owner" | "member"
		createdAt: Date
		updatedAt: Date | null
		joinedAt: Date | null
	}

	export interface NewTeamMember {
		teamId: string
		userId: string
		role?: "owner" | "member"
		createdAt?: Date
		updatedAt?: Date | null
		joinedAt?: Date | null
	}

	export const db: PgDatabase<Record<string, unknown>>
	export const users: unknown
	export const teams: unknown
	export const teamMembers: unknown
	export const accounts: unknown
	export const sessions: unknown
	export const verifications: unknown
}

declare module "@startupkit/seo" {
	import type { Metadata } from "next"

	export interface GenerateMetadataParams {
		title: string
		description: string
		url?: string
		image?: string
		siteName?: string
		locale?: string
		type?: "website" | "article"
		twitterCard?: "summary" | "summary_large_image"
		twitterSite?: string
		noIndex?: boolean
	}

	export function generateMetadata(params: GenerateMetadataParams): Metadata

	export function generateRobots(config?: {
		rules?: {
			userAgent?: string | string[]
			allow?: string | string[]
			disallow?: string | string[]
		}[]
		sitemap?: string | string[]
		host?: string
	}): { rules: unknown[]; sitemap?: string | string[]; host?: string }

	export function generateSitemap(
		urls: {
			url: string
			lastModified?: Date | string
			changeFrequency?:
				| "always"
				| "hourly"
				| "daily"
				| "weekly"
				| "monthly"
				| "yearly"
				| "never"
			priority?: number
		}[]
	): {
		url: string
		lastModified?: Date | string
		changeFrequency?: string
		priority?: number
	}[]

	export function generateOrganizationSchema(config: {
		name: string
		url: string
		logo?: string
		description?: string
		sameAs?: string[]
	}): { "@context": string; "@type": "Organization"; [key: string]: unknown }

	export function generateWebsiteSchema(config: {
		name: string
		url: string
		description: string
	}): { "@context": string; "@type": "WebSite"; [key: string]: unknown }

	export function generateBreadcrumbSchema(
		items: { name: string; url: string }[]
	): { "@context": string; "@type": "BreadcrumbList"; [key: string]: unknown }

	export function generateArticleSchema(config: {
		headline: string
		description: string
		datePublished: string
		dateModified?: string
		authorName: string
		imageUrl: string
	}): { "@context": string; "@type": "Article"; [key: string]: unknown }
}
