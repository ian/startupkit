import { getUrl } from "@repo/utils"
import { generateRobots } from "@startupkit/seo"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
	return generateRobots({
		baseUrl: getUrl(),
		disallowPaths: ["/api/", "/dashboard/", "/auth/"]
	})
}
