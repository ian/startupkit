import { getUrl } from "@repo/utils"
import { generateMetadata } from "@startupkit/seo"

export { generateMetadata } from "@startupkit/seo"
export type { GenerateMetadataParams } from "@startupkit/seo"

export const metadata = generateMetadata({
	title: "StartupKit - The startup stack for the AI era",
	description:
		"Built for founders who move fast. Loved by the AI tools that help them. Pre-configured auth, analytics, SEO, and database with clear patterns your copilot can follow.",
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
		"Tailwind CSS",
		"Boilerplate",
		"Monorepo",
		"AI",
		"Better Auth",
		"Drizzle"
	]
})
