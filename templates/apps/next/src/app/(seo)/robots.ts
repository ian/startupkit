import { getUrl } from "@repo/utils"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/dashboard/", "/auth/"]
			}
		],
		sitemap: getUrl("sitemap.xml")
	}
}
