import { getUrl } from "@repo/utils"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getUrl()

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/dashboard/", "/auth/"]
			}
		],
		sitemap: `${baseUrl}/sitemap.xml`
	}
}
