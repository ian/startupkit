import type { MetadataRoute } from "next"

export function generateRobots({
	baseUrl,
	disallowPaths = ["/api/", "/dashboard/", "/auth/"]
}: {
	baseUrl: string
	disallowPaths?: string[]
}): MetadataRoute.Robots {
	const sitemapUrl = `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}sitemap.xml`

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: disallowPaths
			}
		],
		sitemap: sitemapUrl
	}
}
