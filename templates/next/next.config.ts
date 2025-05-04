import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
		// We use biome for linting, so we can ignore ESLint errors during builds
		ignoreDuringBuilds: true
	},
  /* ... config options here */
};

export default nextConfig;
