import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin"
import * as Sentry from "@sentry/node"
import { BuildExtension, esbuildPlugin } from "@trigger.dev/build/extensions"
import { defineConfig } from "@trigger.dev/sdk"

const ONE_HOUR = 3600

const extensions: BuildExtension[] = []

if (process.env.SENTRY_AUTH_TOKEN) {
	extensions.push(
		esbuildPlugin(
			sentryEsbuildPlugin({
				org: "PROJECT",
				project: "PROJECT-jobs",
				authToken: process.env.SENTRY_AUTH_TOKEN,
				sourcemaps: {
					assets: [".trigger/**.map"]
				}
			}),
			{
				placement: "last",
				target: "deploy"
			}
		)
	)
} else {
	console.log(
		"[TRIGGER] Sentry auth token not found, skipping Sentry extension"
	)
}

export default defineConfig({
	project: "PROJECT",
	runtime: "node",
	logLevel: "log",
	dirs: ["src/trigger"],
	// See https://trigger.dev/docs/runs/maxduration
	// maxDuration: timeout.None,
	maxDuration: ONE_HOUR,
	retries: {
		enabledInDev: true,
		default: {
			maxAttempts: 3,
			minTimeoutInMs: 1000,
			maxTimeoutInMs: 10000,
			factor: 2,
			randomize: true
		}
	},
	init: async () => {
		if (process.env.SENTRY_DSN) {
			Sentry.init({
				dsn: process.env.SENTRY_DSN,
				environment:
					process.env.NODE_ENV === "production" ? "production" : "development",
				tracesSampleRate: 1.0,
				integrations: [Sentry.vercelAIIntegration()]
			})
		}
	},
	build: {
		extensions
	},
	onFailure: async ({ payload, error, ctx }) => {
		if (process.env.SENTRY_DSN) {
			Sentry.captureException(error, {
				extra: {
					payload,
					ctx
				}
			})
		}
	}
})
