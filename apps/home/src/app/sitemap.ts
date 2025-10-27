import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://startupkit.com",
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1
		},
		{
			url: "https://startupkit.com/blog",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8
		},
		{
			url: "https://startupkit.com/blog/pocket-guide-to-saas-metrics",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5
		}
	]
}
