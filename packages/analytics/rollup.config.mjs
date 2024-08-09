import esbuild from 'rollup-plugin-esbuild'
import preserveDirectives from "rollup-preserve-directives";

import { readFileSync } from "fs"; // Import fs to read package.json
import { resolve } from "path"; // Import path to resolve paths
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8')); // Read package.json
const external = Object.keys(pkg.dependencies || {}) // Make all dependencies external

export default {
  input: [
    "src/index.ts",
    "src/ext/ga.ts",
    "src/ext/plausible.ts",
    "src/ext/posthog.ts",
  ],
  output: [
    {
      dir: "dist/cjs",
      format: "cjs",
    },
    {
      dir: "dist/esm",
      format: "esm",
    }
  ],
  external,
  plugins: [
    esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'esnext', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // define: {
      //   __VERSION__: pkg.version,
      // },
      tsconfig: 'tsconfig.json', // default
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        '.json': 'json',
        // Enable JSX in .js files too
        '.js': 'jsx',
      },
    }),
    preserveDirectives(),
  ],
};