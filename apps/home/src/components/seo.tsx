import { Helmet } from "react-helmet-async"
import {
	generateOrganizationSchema,
	generateWebsiteSchema
} from "@startupkit/seo"

const BASE_URL = "https://startupkit.com"
const SITE_NAME = "StartupKit"
const TWITTER_HANDLE = "@startupkit"
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`

interface SEOProps {
	title?: string
	description?: string
	path?: string
	ogImage?: string
	noIndex?: boolean
	article?: {
		publishedTime?: string
		modifiedTime?: string
		author?: string
	}
}

const organizationSchema = generateOrganizationSchema({
	name: SITE_NAME,
	url: BASE_URL,
	logo: `${BASE_URL}/logo.png`,
	description:
		"The startup stack for the AI era. Build faster with pre-configured auth, analytics, SEO, and database.",
	sameAs: [
		"https://twitter.com/startupkit",
		"https://github.com/ian/startupkit"
	]
})

const websiteSchema = generateWebsiteSchema({
	name: SITE_NAME,
	url: BASE_URL,
	description:
		"The startup stack for the AI era. Build faster with pre-configured auth, analytics, SEO, and database."
})

export function SEO({
	title,
	description = "Built for founders who move fast. Loved by the AI tools that help them. Pre-configured auth, analytics, SEO, and database with clear patterns your copilot can follow.",
	path = "",
	ogImage = DEFAULT_OG_IMAGE,
	noIndex = false,
	article
}: SEOProps) {
	const fullTitle = title
		? `${title} | ${SITE_NAME}`
		: `${SITE_NAME} - The startup stack for the AI era`

	const canonicalUrl = `${BASE_URL}${path}`

	return (
		<Helmet>
			{/* Primary Meta Tags */}
			<title>{fullTitle}</title>
			<meta name="title" content={fullTitle} />
			<meta name="description" content={description} />
			<link rel="canonical" href={canonicalUrl} />

			{/* Favicon */}
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />

			{noIndex && <meta name="robots" content="noindex, nofollow" />}

			{/* Open Graph */}
			<meta property="og:type" content={article ? "article" : "website"} />
			<meta property="og:url" content={canonicalUrl} />
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={ogImage} />
			<meta property="og:site_name" content={SITE_NAME} />

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:url" content={canonicalUrl} />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={ogImage} />
			<meta name="twitter:creator" content={TWITTER_HANDLE} />

			{/* Article specific */}
			{article?.publishedTime && (
				<meta property="article:published_time" content={article.publishedTime} />
			)}
			{article?.modifiedTime && (
				<meta property="article:modified_time" content={article.modifiedTime} />
			)}
			{article?.author && (
				<meta property="article:author" content={article.author} />
			)}

			{/* Structured Data */}
			<script type="application/ld+json">
				{JSON.stringify(organizationSchema)}
			</script>
			<script type="application/ld+json">
				{JSON.stringify(websiteSchema)}
			</script>
		</Helmet>
	)
}

export { BASE_URL, SITE_NAME, TWITTER_HANDLE }
