import { PrismaInstrumentation } from "@prisma/instrumentation";
import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
import * as Sentry from "@sentry/node";
import { esbuildPlugin } from "@trigger.dev/build/extensions";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";
import { defineConfig } from "@trigger.dev/sdk/v3";

const ONE_HOUR = 3600;

export default defineConfig({
	project: "proj_gohusdnfngnrmtcgfguh",
	runtime: "node",
	logLevel: "log",
	dirs: ["src/trigger"],
	// Set the maxDuration to 300 seconds for all tasks. See https://trigger.dev/docs/runs/maxduration
	// maxDuration: timeout.None,
	maxDuration: ONE_HOUR,
	retries: {
		enabledInDev: true,
		default: {
			maxAttempts: 3,
			minTimeoutInMs: 1000,
			maxTimeoutInMs: 10000,
			factor: 2,
			randomize: true,
		},
	},
	instrumentations: [new PrismaInstrumentation()],
	init: async () => {
		console.log("Initializing Sentry");
		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			environment:
				process.env.NODE_ENV === "production" ? "production" : "development",
			tracesSampleRate: 1.0,
			integrations: [
				Sentry.prismaIntegration(),
			],
		});
	},
	build: {
		extensions: [
			prismaExtension({
				schema: "../db/prisma/schema.prisma",
			}),
			esbuildPlugin(
				sentryEsbuildPlugin({
					org: "my-hotsheet",
					project: "brokerbot-jobs",
					authToken: process.env.SENTRY_AUTH_TOKEN,
					sourcemaps: {
						assets: [".trigger/**.map"],
					},
				}),
				{ placement: "last", target: "deploy" },
			),
		],
	},
	onFailure: async (payload, error, { ctx }) => {
		Sentry.captureException(error, {
			extra: {
				payload,
				ctx,
			},
		});
	},
});
