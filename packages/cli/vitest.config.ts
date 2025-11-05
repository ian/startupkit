import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts"],
		exclude: ["**/node_modules/**", "**/dist/**", "**/tmp/**"],
		testTimeout: 120000,
		hookTimeout: 120000,
		fileParallelism: false,
		sequence: {
			concurrent: false
		},
		poolOptions: {
			threads: {
				singleThread: true
			}
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.test.ts", "src/**/*.spec.ts", "**/tmp/**"]
		}
	}
})

