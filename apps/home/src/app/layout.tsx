import "@fontsource-variable/inter"
import type { Metadata } from "next"
import { RootProvider } from "fumadocs-ui/provider/next"
import {
	generateOrganizationSchema,
	generateWebsiteSchema
} from "@startupkit/seo"
import { Providers } from "./providers"
import "./globals.css"

const BASE_URL = "https://startupkit.com"
const SITE_NAME = "StartupKit"

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

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	title: {
		default: `${SITE_NAME} - The startup stack for the AI era`,
		template: `%s | ${SITE_NAME}`
	},
	description:
		"Built for founders who move fast. Loved by the AI tools that help them. Pre-configured auth, analytics, SEO, and database with clear patterns your copilot can follow.",
	keywords: [
		"startup",
		"saas",
		"boilerplate",
		"next.js",
		"typescript",
		"ai",
		"copilot"
	],
	authors: [{ name: "01 Studio", url: "https://01.studio" }],
	creator: "01 Studio",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: BASE_URL,
		siteName: SITE_NAME,
		title: `${SITE_NAME} - The startup stack for the AI era`,
		description:
			"Built for founders who move fast. Loved by the AI tools that help them.",
		images: [
			{
				url: `${BASE_URL}/og-image.png`,
				width: 1200,
				height: 630,
				alt: SITE_NAME
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: `${SITE_NAME} - The startup stack for the AI era`,
		description:
			"Built for founders who move fast. Loved by the AI tools that help them.",
		creator: "@startupkit",
		images: [`${BASE_URL}/og-image.png`]
	},
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
		],
		apple: "/apple-touch-icon.png"
	},
	manifest: "/site.webmanifest"
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationSchema)
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
				/>
			</head>
		<body className="min-h-screen bg-black text-white antialiased">
			<Providers>
				<RootProvider>{children}</RootProvider>
			</Providers>
		</body>
		</html>
	)
}
