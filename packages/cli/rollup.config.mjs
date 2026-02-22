import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commandPlugin from "rollup-plugin-command";
import esbuild from "rollup-plugin-esbuild";

import { readFileSync } from "node:fs";
import { dirname, resolve as pathResolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(
  readFileSync(pathResolve(__dirname, "package.json"), "utf-8"),
);
const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.devDependencies,
});

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
    json(),
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: true,
      minify: process.env.NODE_ENV === "production",
      target: "esnext",
      tsconfig: "tsconfig.json",
      loaders: {
        ".json": "json",
      },
      define: {
        "process.env.VERSION": JSON.stringify(pkg.version),
      },
    }),
    commandPlugin("chmod +x dist/cli.js"),
  ],
};
