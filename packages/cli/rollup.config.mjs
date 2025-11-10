import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import commandPlugin from "rollup-plugin-command"
import esbuild from "rollup-plugin-esbuild"
import preserveDirectives from "rollup-preserve-directives"

import { readFileSync } from "node:fs"
import { dirname, resolve as pathResolve } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkg = JSON.parse(
	readFileSync(pathResolve(__dirname, "package.json"), "utf-8")
)
const external = Object.keys({
	...pkg.dependencies,
	...pkg.devDependencies
})

export default {
	input: ["src/cli.ts", "src/config.ts", "src/post-install-check.ts"],
	output: [
		{
			dir: "dist/",
			format: "esm"
		}
	],
	external,
	plugins: [
		resolve({
			extensions: [".js", ".ts", ".json"]
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
				".json": "json"
			},
			define: {
				"process.env.VERSION": JSON.stringify(pkg.version)
			}
		}),
		preserveDirectives(),
		commandPlugin("chmod +x dist/cli.js")
	]
}
