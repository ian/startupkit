import { PrismaInstrumentation } from "@prisma/instrumentation"
import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin"
import * as Sentry from "@sentry/node"
import { BuildExtension, esbuildPlugin } from "@trigger.dev/build/extensions"
import { prismaExtension } from "@trigger.dev/build/extensions/prisma"
import { defineConfig } from "@trigger.dev/sdk"

const ONE_HOUR = 3600

const extensions: BuildExtension[] = [
	prismaExtension({
		schema: "../db/prisma/schema.prisma"
	})
]

if (process.env.SENTRY_AUTH_TOKEN) {
	extensions.push(
		esbuildPlugin(
			sentryEsbuildPlugin({
				org: "my-hotsheet",
				project: "brokerbot-jobs",
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
	project: "proj_gohusdnfngnrmtcgfguh",
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
	instrumentations: [new PrismaInstrumentation()],
	init: async () => {
		if (process.env.SENTRY_DSN) {
			Sentry.init({
				dsn: process.env.SENTRY_DSN,
				environment:
					process.env.NODE_ENV === "production" ? "production" : "development",
				tracesSampleRate: 1.0,
				integrations: [Sentry.vercelAIIntegration(), Sentry.prismaIntegration()]
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
