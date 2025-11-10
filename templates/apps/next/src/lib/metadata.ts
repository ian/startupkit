import { defaultMetadata } from "@startupkit/seo"
import { getUrl } from "@repo/utils"

export { generateMetadata } from "@startupkit/seo"
export type { GenerateMetadataParams } from "@startupkit/seo"

export const metadata = defaultMetadata({
	title: "StartupKit Next Template",
	description: "Build and ship your SaaS faster with StartupKit",
	baseUrl: getUrl(),
	siteName: "StartupKit",
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
