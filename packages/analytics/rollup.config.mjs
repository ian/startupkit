import esbuild from "rollup-plugin-esbuild"
import preserveDirectives from "rollup-preserve-directives"

const esbuildPlugin = esbuild({
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
})

const commonExternal = ["react", "react/jsx-runtime", "next/navigation"]

export default [
	{
		input: "src/index.ts",
		output: {
			dir: "dist/esm",
			format: "esm",
			preserveModules: false
		},
		external: commonExternal,
		plugins: [esbuildPlugin, preserveDirectives()]
	},
	{
		input: "src/posthog/index.ts",
		output: {
			file: "dist/esm/posthog.js",
			format: "esm"
		},
		external: [...commonExternal, "posthog-js", "posthog-js/react"],
		plugins: [esbuildPlugin, preserveDirectives()]
	},
	{
		input: "src/openpanel/index.ts",
		output: {
			file: "dist/esm/openpanel.js",
			format: "esm"
		},
		external: [...commonExternal, "@openpanel/sdk"],
		plugins: [esbuildPlugin, preserveDirectives()]
	}
]
