import type { Metadata } from "next"

/**
 * Parameters for generating page-specific metadata.
 */
export interface GenerateMetadataParams {
	/** Page title */
	title: string
	/** Page description for meta tags and OpenGraph */
	description: string
	/** Relative path from base URL (e.g., "/about" or "blog/post") */
	path?: string
	/** OpenGraph image URL or path */
	ogImage?: string
	/** If true, adds noindex/nofollow robots meta tags */
	noIndex?: boolean
	/** Full base URL of the site (e.g., "https://example.com") */
	baseUrl: string
	/** Name of the site for OpenGraph */
	siteName: string
}

/**
 * Generate Next.js metadata for a specific page with SEO optimization.
 *
 * Creates a complete metadata object including:
 * - Title and description
 * - Canonical URL
 * - OpenGraph tags for social sharing
 * - Twitter Card tags
 * - Optional noindex/nofollow for robots
 *
 * @example
 * ```typescript
 * export const metadata = generateMetadata({
 *   title: "About Us",
 *   description: "Learn about our company",
 *   path: "/about",
 *   baseUrl: "https://example.com",
 *   siteName: "Example Corp"
 * })
 * ```
 *
 * @param params - Configuration object for metadata generation
 * @returns Next.js Metadata object
 */
export function generateMetadata({
	title,
	description,
	path = "",
	ogImage = "/hero/og.avif",
	noIndex = false,
	baseUrl,
	siteName
}: GenerateMetadataParams): Metadata {
	const fullPath = path
		? `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`
		: baseUrl

	const metadata: Metadata = {
		title,
		description,
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: fullPath
		},
		openGraph: {
			title,
			description,
			url: fullPath,
			siteName,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: title
				}
			],
			locale: "en_US",
			type: "website"
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage]
		}
	}

	if (noIndex) {
		metadata.robots = {
			index: false,
			follow: false
		}
	}

	return metadata
}

/**
 * Generate default metadata for the root layout with title template support.
 *
 * Creates base metadata that applies to all pages, including:
 * - Title with template for child pages (e.g., "Page Title | Site Name")
 * - Default OpenGraph and Twitter Card configuration
 * - Favicon and icon configuration
 * - Web manifest
 * - SEO keywords
 *
 * Use this in your root `layout.tsx` to set site-wide defaults.
 * Individual pages can override specific values using `generateMetadata()`.
 *
 * @example
 * ```typescript
 * // In app/layout.tsx
 * export const metadata = defaultMetadata({
 *   title: "My SaaS App",
 *   description: "Build faster with our platform",
 *   baseUrl: "https://mysaas.com",
 *   siteName: "My SaaS",
 *   twitterHandle: "@mysaas",
 *   keywords: ["SaaS", "productivity", "tools"]
 * })
 * ```
 *
 * @param params - Configuration object for default metadata
 * @returns Next.js Metadata object with title template
 */
export function defaultMetadata({
	title,
	description,
	baseUrl,
	siteName,
	twitterHandle,
	ogImage = "/hero/og.avif",
	keywords = [],
	icons = {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" }
		],
		apple: "/apple-touch-icon.png"
	},
	manifest = "/site.webmanifest"
}: {
	/** Default page title */
	title: string
	/** Default description */
	description: string
	/** Full base URL of the site */
	baseUrl: string
	/** Site name for branding */
	siteName: string
	/** Twitter username (e.g., "@username") */
	twitterHandle?: string
	/** Default OpenGraph image URL or path */
	ogImage?: string
	/** SEO keywords array */
	keywords?: string[]
	/** Custom icon configuration */
	icons?: {
		icon: { url: string; sizes?: string; type?: string }[]
		apple: string
	}
	/** Path to web manifest file */
	manifest?: string
}): Metadata {
	return {
		title: {
			default: title,
			template: `%s | ${siteName}`
		},
		description,
		keywords,
		authors: [{ name: siteName }],
		creator: siteName,
		metadataBase: new URL(baseUrl),
		openGraph: {
			type: "website",
			locale: "en_US",
			url: baseUrl,
			siteName,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: title
				}
			]
		},
		twitter: {
			card: "summary_large_image",
			creator: twitterHandle
		},
		icons,
		manifest
	}
}
