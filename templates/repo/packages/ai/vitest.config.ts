import { defineConfig } from "vitest/config"

export default defineConfig(({ mode }) => ({
	test: {
		environment: "node",
		setupFiles: ["./src/vitest.setup.ts"],
		singleThread: true,
		include: ["src/**/*.test.ts"],
		testTimeout: 5 * 60 * 1000,
		hookTimeout: 60 * 1000
	}
}))
