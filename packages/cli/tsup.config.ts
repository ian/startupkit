import type { Options } from "tsup";

const config: Options = {
  entry: ["src/cli.ts"],
  format: ["esm"],
  sourcemap: true,
  splitting: false,
  bundle: true,
  env: {
    VERSION: process.env.npm_package_version?.toString() || "0.0.0",
  },
};

export default config;
