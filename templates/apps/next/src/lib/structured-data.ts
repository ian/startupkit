import { generateOrganizationSchema, generateWebsiteSchema } from "@startupkit/seo"
import { getUrl } from "@repo/utils"

export {
	generateOrganizationSchema,
	generateWebsiteSchema,
	generateBreadcrumbSchema,
	generateArticleSchema
} from "@startupkit/seo"

export const defaultOrganizationSchema = generateOrganizationSchema({
	name: "StartupKit",
	url: getUrl(),
	logo: getUrl("logo.png"),
	description: "Build and ship your SaaS faster with StartupKit",
	sameAs: [
		"https://twitter.com/startupkit",
		"https://github.com/startupkit",
		"https://linkedin.com/company/startupkit"
	]
})

export const defaultWebsiteSchema = generateWebsiteSchema({
	name: "StartupKit",
	url: getUrl(),
	description: "Build and ship your SaaS faster with StartupKit"
})

