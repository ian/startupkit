import { createRequire } from "node:module"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import type { StorybookConfig } from "@storybook/react-vite"

const require = createRequire(import.meta.url)
const emptyStub = fileURLToPath(new URL("./stubs/empty.ts", import.meta.url))

const config: StorybookConfig = {
	stories: [
		"../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
		"../../../packages/auth/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
		"../../../packages/emails/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
		"../../../packages/analytics/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
	],

	addons: [
		getAbsolutePath("@storybook/addon-docs"),
		getAbsolutePath("@storybook/addon-essentials"),
		getAbsolutePath("@storybook/addon-onboarding")
	],

	framework: {
		name: getAbsolutePath("@storybook/react-vite"),
		options: {}
	},

	viteFinal: async (config) => {
		config.define = {
			...(config.define ?? {}),
			"process.env": {}
		}
		config.resolve = {
			...(config.resolve ?? {}),
			alias: [
				...(Array.isArray(config.resolve?.alias) ? config.resolve.alias : []),
				{
					find: "@repo/ui/styles.css",
					replacement: fileURLToPath(
						new URL(
							"../../../packages/ui/src/styles/index.css",
							import.meta.url
						)
					)
				},
				{
					find: "@repo/db",
					replacement: fileURLToPath(new URL("./stubs/db.ts", import.meta.url))
				},
				{
					find: "@prisma/client",
					replacement: fileURLToPath(
						new URL("./stubs/prisma-client.ts", import.meta.url)
					)
				},
				{ find: "posthog-node", replacement: emptyStub },
				{ find: "@sentry/node", replacement: emptyStub },
				{ find: /^@sentry\/node\/.*/, replacement: emptyStub },
				{ find: "open", replacement: emptyStub },
				{ find: "default-browser", replacement: emptyStub },
				{ find: "default-browser-id", replacement: emptyStub },
				{ find: "is-inside-container", replacement: emptyStub },
				{ find: "is-docker", replacement: emptyStub },
				{ find: "is-wsl", replacement: emptyStub },
				{ find: "wsl-utils", replacement: emptyStub },
				{ find: "run-applescript", replacement: emptyStub },
				{ find: "module-details-from-path", replacement: emptyStub }
			]
		}
		config.optimizeDeps = {
			...(config.optimizeDeps ?? {}),
			exclude: [
				...(config.optimizeDeps?.exclude ?? []),
				"@sentry/node",
				"open",
				"default-browser",
				"default-browser-id",
				"is-inside-container",
				"is-docker",
				"is-wsl",
				"wsl-utils",
				"run-applescript",
				"module-details-from-path"
			]
		}
		config.plugins = [
			...(config.plugins ?? []),
			{
				name: "stub-server-only-modules",
				enforce: "pre",
				resolveId(source: string, importer: string | undefined) {
					if (
						(source.endsWith("/lib/preview-email") ||
							source.endsWith("/lib/preview-email.ts")) &&
						importer?.includes("packages/emails/src")
					) {
						return "\0stub:emails/preview-email"
					}
					if (
						source.includes("config/instrumentation") &&
						(source.endsWith("/node") || source.endsWith("/node.ts"))
					) {
						return "\0stub:instrumentation/node"
					}
					return null
				},
				load(id: string) {
					if (id === "\0stub:emails/preview-email") {
						return "export const previewEmailInBrowser = () => {}; export default {};"
					}
					if (id === "\0stub:instrumentation/node") {
						return `
							export const Sentry = {};
							export const defaultSentryConfig = () => ({});
							export const withModelTracing = (model) => model;
							export const LangfuseSpanProcessor = class {};
							export const posthog = { instance: null };
							export default {};
						`
					}
					return null
				}
			}
		]
		return config
	}
}

export default config

function getAbsolutePath(value: string): string {
	return dirname(require.resolve(`${value}/package.json`))
}
