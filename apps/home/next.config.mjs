import { startupkitCMS } from "@startupkit/cms/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
		// We use biome for linting, so we can ignore ESLint errors during builds
		ignoreDuringBuilds: true
	},
  rewrites: () => [
    {
      "source": "/docs",
      "destination": "https://startupkit.mintlify.dev/docs"
    },
    {
      "source": "/docs/:match*",
      "destination": "https://startupkit.mintlify.dev/docs/:match*"
    }
  ]
};

export default startupkitCMS({})(nextConfig);
