/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  turbopack: {},
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@startupkit/analytics',
    '@startupkit/auth',
    '@startupkit/utils',
  ],
  //   rewrites: () => [
  //     {
  //       source: '/docs',
  //       destination: 'https://startupkit.mintlify.dev/docs',
  //     },
  //     {
  //       source: '/docs/:match*',
  //       destination: 'https://startupkit.mintlify.dev/docs/:match*',
  //     },
  //   ],
};

export default nextConfig;
