import { getUrl } from "@repo/utils"

interface OrganizationSchema {
	name: string
	url: string
	logo?: string
	description?: string
	sameAs?: string[]
}

interface WebsiteSchema {
	name: string
	url: string
	description: string
}

interface BreadcrumbItem {
	name: string
	url: string
}

export function generateOrganizationSchema({
	name,
	url,
	logo,
	description,
	sameAs = []
}: OrganizationSchema) {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name,
		url,
		logo,
		description,
		sameAs
	}
}

export function generateWebsiteSchema({
	name,
	url,
	description
}: WebsiteSchema) {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name,
		url,
		description
	}
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	}
}

export function generateArticleSchema({
	headline,
	description,
	datePublished,
	dateModified,
	authorName,
	imageUrl
}: {
	headline: string
	description: string
	datePublished: string
	dateModified?: string
	authorName: string
	imageUrl: string
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline,
		description,
		image: imageUrl,
		datePublished,
		dateModified: dateModified || datePublished,
		author: {
			"@type": "Person",
			name: authorName
		}
	}
}

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
