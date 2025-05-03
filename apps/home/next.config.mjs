import { startupkitCMS } from "@startupkit/cms/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  // images: { unoptimized: true },
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
