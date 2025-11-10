import {
	generateOrganizationSchema,
	generateWebsiteSchema
} from "@startupkit/seo"

export {
	generateOrganizationSchema,
	generateWebsiteSchema,
	generateBreadcrumbSchema,
	generateArticleSchema
} from "@startupkit/seo"

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:7548"

export const defaultOrganizationSchema = generateOrganizationSchema({
	name: "StartupKit",
	url: baseUrl,
	logo: `${baseUrl}/logo.png`,
	description: "Build and ship your SaaS faster with StartupKit",
	sameAs: [
		"https://twitter.com/startupkit",
		"https://github.com/startupkit",
		"https://linkedin.com/company/startupkit"
	]
})

export const defaultWebsiteSchema = generateWebsiteSchema({
	name: "StartupKit",
	url: baseUrl,
	description: "Build and ship your SaaS faster with StartupKit"
})
