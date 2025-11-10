import { generateMetadata } from "@startupkit/seo"

export { generateMetadata } from "@startupkit/seo"
export type { GenerateMetadataParams } from "@startupkit/seo"

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:7548"

export const metadata = generateMetadata({
	title: "StartupKit",
	description: "Build and ship your SaaS faster with StartupKit",
	baseUrl,
	siteName: "StartupKit",
	titleTemplate: "%s | StartupKit",
	twitterHandle: "@startupkit",
	keywords: [
		"SaaS",
		"Startup",
		"Next.js",
		"React",
		"TypeScript",
		"Tailwind CSS"
	]
})
