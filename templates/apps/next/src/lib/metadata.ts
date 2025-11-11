import { getUrl } from "@repo/utils"
import { generateMetadata } from "@startupkit/seo"

export { generateMetadata } from "@startupkit/seo"
export type { GenerateMetadataParams } from "@startupkit/seo"

export const metadata = generateMetadata({
	title: "StartupKit Next Template",
	description: "Build and ship your SaaS faster with StartupKit",
	baseUrl: getUrl(),
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
