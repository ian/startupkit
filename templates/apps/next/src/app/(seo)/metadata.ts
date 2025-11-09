import { getUrl } from "@repo/utils"
import type { Metadata } from "next"

interface GenerateMetadataParams {
	title: string
	description: string
	path?: string
	ogImage?: string
	noIndex?: boolean
}

export function generateMetadata({
	title,
	description,
	path = "",
	ogImage = "/hero/og.avif",
	noIndex = false
}: GenerateMetadataParams): Metadata {
	const baseUrl = getUrl()
	const url = `${baseUrl}${path}`

	const metadata: Metadata = {
		title,
		description,
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: url
		},
		openGraph: {
			title,
			description,
			url,
			siteName: "StartupKit",
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

export const defaultMetadata: Metadata = {
	title: {
		default: "StartupKit Next Template",
		template: "%s | StartupKit"
	},
	description: "Build and ship your SaaS faster with StartupKit",
	keywords: [
		"SaaS",
		"Startup",
		"Next.js",
		"React",
		"TypeScript",
		"Tailwind CSS"
	],
	authors: [{ name: "StartupKit" }],
	creator: "StartupKit",
	metadataBase: new URL(getUrl()),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: getUrl(),
		siteName: "StartupKit",
		images: [
			{
				url: "/hero/og.avif",
				width: 1200,
				height: 630,
				alt: "StartupKit Next Template"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		creator: "@startupkit"
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png"
	},
	manifest: "/site.webmanifest"
}
