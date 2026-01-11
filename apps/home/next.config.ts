import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	output: "export",
	images: { unoptimized: true },
	transpilePackages: ["@startupkit/seo"],
	reactStrictMode: true,
	serverExternalPackages: ["typescript", "twoslash"]
}

const withMDX = createMDX()

export default withMDX(nextConfig)
