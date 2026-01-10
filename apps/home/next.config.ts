import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	transpilePackages: ["@startupkit/seo"],
	reactStrictMode: true,
	serverExternalPackages: ["typescript", "twoslash"]
}

const withMDX = createMDX()

export default withMDX(nextConfig)
