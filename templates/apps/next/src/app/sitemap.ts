import { getUrl } from "@repo/utils"
import { generateSitemap } from "@startupkit/seo"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
	return generateSitemap({
		baseUrl: getUrl(),
		routes: [
			{
				path: "",
				changeFrequency: "daily",
				priority: 1
			},
			{
				path: "privacy",
				changeFrequency: "monthly",
				priority: 0.5
			},
			{
				path: "terms",
				changeFrequency: "monthly",
				priority: 0.5
			}
		]
	})
}
