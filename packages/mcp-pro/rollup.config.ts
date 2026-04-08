import { defineConfig } from "rollup"
import esbuild from "rollup-plugin-esbuild"
import json from "@rollup/plugin-json"

export default defineConfig({
	input: "src/index.ts",
	output: {
		file: "dist/index.js",
		format: "esm",
		sourcemap: true,
		shims: true
	},
	external: [],
	plugins: [
		json(),
		esbuild({
			target: "node20",
			tsconfig: "tsconfig.json",
			sourceMap: true
		})
	]
})
