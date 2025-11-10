import type { Metadata } from "next"

/**
 * Base parameters shared by all metadata configurations.
 */
interface BaseMetadataParams {
	/** Page title (or default title for root layout) */
	title: string
	/** Page description for meta tags and OpenGraph */
	description: string
	/** Full base URL of the site (e.g., "https://example.com") */
	baseUrl: string
	/** Name of the site for OpenGraph */
	siteName: string
	/** OpenGraph image URL or path */
	ogImage?: string
	/** Twitter username (e.g., "@username") */
	twitterHandle?: string
}

/**
 * Parameters for root layout metadata with title template.
 */
interface RootLayoutMetadataParams extends BaseMetadataParams {
	/** Title template for child pages (e.g., "%s | Site Name") */
	titleTemplate: string
	/** SEO keywords array */
	keywords?: string[]
	/** Custom icon configuration */
	icons?: {
		icon: { url: string; sizes?: string; type?: string }[]
		apple: string
	}
	/** Path to web manifest file */
	manifest?: string
}

/**
 * Parameters for individual page metadata.
 */
interface PageMetadataParams extends BaseMetadataParams {
	/** Relative path from base URL (e.g., "/about" or "blog/post") */
	path?: string
	/** If true, adds noindex/nofollow robots meta tags */
	noIndex?: boolean
}

/**
 * Union type of all metadata parameter types.
 */
export type GenerateMetadataParams =
	| RootLayoutMetadataParams
	| PageMetadataParams

/**
 * Generate Next.js metadata for root layouts with title template.
 *
 * Creates base metadata that applies to all pages with a title template.
 *
 * @example
 * ```typescript
 * // In app/layout.tsx (root layout)
 * export const metadata = generateMetadata({
 *   title: "My SaaS App",
 *   description: "Build faster with our platform",
 *   baseUrl: "https://mysaas.com",
 *   siteName: "My SaaS",
 *   titleTemplate: "%s | My SaaS",  // Required for root layouts
 *   twitterHandle: "@mysaas",
 *   keywords: ["SaaS", "productivity"],
 *   icons: { ... },
 *   manifest: "/site.webmanifest"
 * })
 * ```
 *
 * @param params - Configuration object for root layout metadata
 * @returns Next.js Metadata object with title template
 */
export function generateMetadata(params: RootLayoutMetadataParams): Metadata

/**
 * Generate Next.js metadata for individual pages.
 *
 * Creates page-specific metadata that inherits from the root layout.
 *
 * @example
 * ```typescript
 * // In app/about/page.tsx (individual page)
 * export const metadata = generateMetadata({
 *   title: "About Us",
 *   description: "Learn about our company",
 *   path: "/about",
 *   baseUrl: "https://mysaas.com",
 *   siteName: "My SaaS"
 * })
 * ```
 *
 * @param params - Configuration object for page metadata
 * @returns Next.js Metadata object
 */
export function generateMetadata(params: PageMetadataParams): Metadata

export function generateMetadata(params: GenerateMetadataParams): Metadata {
	const {
		title,
		description,
		baseUrl,
		siteName,
		ogImage = "/hero/og.avif",
		twitterHandle
	} = params

	const path = "path" in params ? params.path : undefined
	const noIndex = "noIndex" in params ? params.noIndex : false
	const titleTemplate =
		"titleTemplate" in params ? params.titleTemplate : undefined
	const keywords = "keywords" in params ? params.keywords : undefined
	const icons = "icons" in params ? params.icons : undefined
	const manifest = "manifest" in params ? params.manifest : undefined
	const fullPath = path
		? `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`
		: baseUrl

	const metadata: Metadata = {
		title: titleTemplate
			? {
					default: title,
					template: titleTemplate
				}
			: title,
		description,
		metadataBase: new URL(baseUrl),
		openGraph: {
			type: "website",
			locale: "en_US",
			url: fullPath,
			siteName,
			title,
			description,
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
			title,
			description,
			images: [ogImage],
			creator: twitterHandle
		}
	}

	if (path) {
		metadata.alternates = {
			canonical: fullPath
		}
	}

	if (noIndex) {
		metadata.robots = {
			index: false,
			follow: false
		}
	}

	if (keywords) {
		metadata.keywords = keywords
	}

	if (titleTemplate) {
		metadata.authors = [{ name: siteName }]
		metadata.creator = siteName
	}

	if (icons) {
		metadata.icons = icons
	}

	if (manifest) {
		metadata.manifest = manifest
	}

	return metadata
}
