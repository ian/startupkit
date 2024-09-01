import withMDX from "@next/mdx";
import { NextConfig } from "next";
import { frontmatter } from "./lib/frontmatter";

const DEFAULT_EXTENSIONS = ["js", "jsx", "ts", "tsx"];
const MARKDOWN_EXTENSIONS = ["md", "mdx"];

type CMSConfig = {
  debug?: boolean;
};

export const withCMS = (
  cmsConfig: CMSConfig
): ((nextConfig: NextConfig) => NextConfig) => {
  return function withCMS(nextConfig: NextConfig) {
    const config = {
      ...nextConfig,
      pageExtensions: [
        ...(nextConfig.pageExtensions || DEFAULT_EXTENSIONS),
        ...MARKDOWN_EXTENSIONS,
      ],
    } satisfies NextConfig;

    return withMDX({
      options: {
        remarkPlugins: [frontmatter],
        rehypePlugins: [],
        providerImportSource: "@startupkit/cms/mdx",
      },
    })(config);
  };
};
