import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import preserveDirectives from "rollup-preserve-directives";

import { readFileSync } from "fs"; // Import fs to read package.json
import { resolve as pathResolve } from "path"; // Import path to resolve paths
import { fileURLToPath } from "url";
import { dirname } from "path";
import { env } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(
  readFileSync(pathResolve(__dirname, "package.json"), "utf-8")
); // Read package.json
const external = Object.keys(pkg.dependencies, pkg.devDependencies);

export default {
  input: ["src/cli.ts"],
  output: [
    {
      dir: "dist/",
      format: "esm",
    },
  ],
  external,
  plugins: [
    resolve({
      extensions: [".js", ".ts", ".json"],
    }),
    commonjs(),
    json(),
    esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === "production",
      target: "esnext", // default, or 'es20XX', 'esnext'
      tsconfig: "tsconfig.json", // default
      loaders: {
        ".json": "json",
      },
      define: {
        VERSION: JSON.stringify(
          process.env.npm_package_version?.toString() || "0.0.0"
        ),
      },
    }),
    preserveDirectives(),
  ],
};
