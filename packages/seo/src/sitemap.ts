import type { MetadataRoute } from "next"

export interface SitemapRoute {
	path: string
	lastModified?: Date
	changeFrequency?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never"
	priority?: number
}

export function generateSitemap({
	baseUrl,
	routes
}: {
	baseUrl: string
	routes: SitemapRoute[]
}): MetadataRoute.Sitemap {
	return routes.map((route) => ({
		url: `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}${route.path.startsWith("/") ? route.path.slice(1) : route.path}`,
		lastModified: route.lastModified || new Date(),
		changeFrequency: route.changeFrequency || "daily",
		priority: route.priority || 1
	}))
}
