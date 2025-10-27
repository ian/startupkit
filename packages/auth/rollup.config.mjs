import esbuild from "rollup-plugin-esbuild"
import preserveDirectives from "rollup-preserve-directives"

import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkg = JSON.parse(
	readFileSync(resolve(__dirname, "package.json"), "utf-8")
)
const external = Object.keys(pkg.dependencies || {}) // Make all dependencies external

export default {
	input: ["src/index.ts", "src/server.ts"],
	output: [
		{
			dir: "dist/cjs",
			format: "cjs"
		},
		{
			dir: "dist/esm",
			format: "esm"
		}
	],
	external,
	plugins: [
		esbuild({
			include: /\.[jt]sx?$/,
			exclude: /node_modules/,
			sourceMap: true,
			minify: process.env.NODE_ENV === "production",
			target: "esnext",
			jsx: "transform",
			jsxFactory: "React.createElement",
			jsxFragment: "React.Fragment",
			tsconfig: "tsconfig.json",
			loaders: {
				".json": "json"
			}
		}),
		preserveDirectives()
	]
}
