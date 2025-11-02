import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@repo/analytics", "@repo/auth", "@repo/ui", "@repo/utils"]
};

export default nextConfig;
