import { getUrl } from "@repo/utils"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		{
			url: getUrl(),
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1
		},
		{
			url: getUrl("privacy"),
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5
		},
		{
			url: getUrl("terms"),
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5
		}
	]

	return routes
}
