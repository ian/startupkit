import { swc } from "rollup-plugin-swc3";
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
    "src/plugin.ts",
    "src/mdx-config.tsx",
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
    swc({
      include: /\.[mc]?[jt]sx?$/, // default
      exclude: /node_modules/, // default
      tsconfig: "tsconfig.json", // default
      jsc: {},
    }),
    preserveDirectives(),
  ],
};