import fs from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import {
	buildPrompt,
	DEFAULT_CONFIG,
	DEFAULT_PROMPT,
	loadRalphConfig,
	parseStreamLine,
	type RalphConfig
} from "./make"

describe("make command - unit tests", () => {
	describe("parseStreamLine", () => {
		it("should extract text from stream_event with delta", () => {
			const line = JSON.stringify({
				type: "stream_event",
				event: { delta: { text: "Hello world" } }
			})

			const result = parseStreamLine(line)

			expect(result).toBe("Hello world")
		})

		it("should return null for empty lines", () => {
			expect(parseStreamLine("")).toBeNull()
			expect(parseStreamLine("   ")).toBeNull()
			expect(parseStreamLine("\t")).toBeNull()
		})

		it("should return null for stream_event without delta text", () => {
			const line = JSON.stringify({
				type: "stream_event",
				event: { other: "data" }
			})

			const result = parseStreamLine(line)

			expect(result).toBeNull()
		})

		it("should return null for non-stream_event types", () => {
			const line = JSON.stringify({
				type: "other_event",
				event: { delta: { text: "ignored" } }
			})

			const result = parseStreamLine(line)

			expect(result).toBeNull()
		})

		it("should return raw line for invalid JSON", () => {
			const line = "This is not JSON"

			const result = parseStreamLine(line)

			expect(result).toBe("This is not JSON")
		})

		it("should handle partial JSON gracefully", () => {
			const line = '{"type": "stream_event"'

			const result = parseStreamLine(line)

			expect(result).toBe('{"type": "stream_event"')
		})
	})

	describe("buildPrompt", () => {
		it("should use default prompt when config.prompt is undefined", () => {
			const config: RalphConfig = {}

			const result = buildPrompt(config, "SPEC.md", "progress.txt")

			expect(result).toBe(DEFAULT_PROMPT)
		})

		it("should replace SPEC.md with custom specfile", () => {
			const config: RalphConfig = {
				prompt: "Read SPEC.md and do things"
			}

			const result = buildPrompt(config, "MYSPEC.md", "progress.txt")

			expect(result).toBe("Read MYSPEC.md and do things")
		})

		it("should replace progress.txt with custom progress file", () => {
			const config: RalphConfig = {
				prompt: "Read progress.txt for status"
			}

			const result = buildPrompt(config, "SPEC.md", "status.log")

			expect(result).toBe("Read status.log for status")
		})

		it("should replace multiple occurrences of SPEC.md", () => {
			const config: RalphConfig = {
				prompt: "Read SPEC.md first. Update SPEC.md when done."
			}

			const result = buildPrompt(config, "TODO.md", "progress.txt")

			expect(result).toBe("Read TODO.md first. Update TODO.md when done.")
		})

		it("should replace multiple occurrences of progress.txt", () => {
			const config: RalphConfig = {
				prompt: "Check progress.txt. Write to progress.txt."
			}

			const result = buildPrompt(config, "SPEC.md", "log.txt")

			expect(result).toBe("Check log.txt. Write to log.txt.")
		})

		it("should handle both replacements together", () => {
			const config: RalphConfig = {
				prompt: "Read SPEC.md and progress.txt. Update SPEC.md."
			}

			const result = buildPrompt(config, "plan.md", "history.txt")

			expect(result).toBe("Read plan.md and history.txt. Update plan.md.")
		})
	})

	describe("loadRalphConfig", () => {
		const testDir = path.join(process.cwd(), "tmp/test-ralph-config")
		const configDir = path.join(testDir, ".startupkit")

		beforeEach(() => {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true })
			}
			fs.mkdirSync(configDir, { recursive: true })
		})

		afterEach(() => {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true })
			}
		})

		it("should return default config when no config file exists", () => {
			fs.rmSync(configDir, { recursive: true, force: true })

			const result = loadRalphConfig(testDir)

			expect(result).toEqual(DEFAULT_CONFIG)
		})

		it("should load and merge config from ralph.json", () => {
			const customConfig = {
				iterations: 20,
				specfile: "CUSTOM.md"
			}
			fs.writeFileSync(
				path.join(configDir, "ralph.json"),
				JSON.stringify(customConfig)
			)

			const result = loadRalphConfig(testDir)

			expect(result.iterations).toBe(20)
			expect(result.specfile).toBe("CUSTOM.md")
			expect(result.ai).toBe("claude")
			expect(result.command).toBe("claude")
		})

		it("should override all default values with config file values", () => {
			const customConfig: RalphConfig = {
				ai: "gpt",
				command: "openai",
				args: ["--model", "gpt-4"],
				iterations: 5,
				specfile: "TODO.md",
				progress: "log.txt",
				complete: ".done",
				prompt: "Custom prompt"
			}
			fs.writeFileSync(
				path.join(configDir, "ralph.json"),
				JSON.stringify(customConfig)
			)

			const result = loadRalphConfig(testDir)

			expect(result).toEqual(customConfig)
		})

		it("should return default config for invalid JSON", () => {
			fs.writeFileSync(
				path.join(configDir, "ralph.json"),
				"{ invalid json }"
			)

			const result = loadRalphConfig(testDir)

			expect(result).toEqual(DEFAULT_CONFIG)
		})

		it("should handle empty config file", () => {
			fs.writeFileSync(path.join(configDir, "ralph.json"), "{}")

			const result = loadRalphConfig(testDir)

			expect(result).toEqual(DEFAULT_CONFIG)
		})

		it("should preserve custom args array", () => {
			const customConfig = {
				args: ["-p", "--verbose"]
			}
			fs.writeFileSync(
				path.join(configDir, "ralph.json"),
				JSON.stringify(customConfig)
			)

			const result = loadRalphConfig(testDir)

			expect(result.args).toEqual(["-p", "--verbose"])
		})
	})

	describe("DEFAULT_CONFIG", () => {
		it("should have claude as default AI", () => {
			expect(DEFAULT_CONFIG.ai).toBe("claude")
			expect(DEFAULT_CONFIG.command).toBe("claude")
		})

		it("should have correct default args for claude", () => {
			expect(DEFAULT_CONFIG.args).toContain("--permission-mode")
			expect(DEFAULT_CONFIG.args).toContain("acceptEdits")
			expect(DEFAULT_CONFIG.args).toContain("--output-format")
			expect(DEFAULT_CONFIG.args).toContain("stream-json")
			expect(DEFAULT_CONFIG.args).toContain("-p")
		})

		it("should have sensible defaults", () => {
			expect(DEFAULT_CONFIG.iterations).toBe(10)
			expect(DEFAULT_CONFIG.specfile).toBe("SPEC.md")
			expect(DEFAULT_CONFIG.progress).toBe("progress.txt")
			expect(DEFAULT_CONFIG.complete).toBe(".ralph-complete")
		})

		it("should have a default prompt", () => {
			expect(DEFAULT_CONFIG.prompt).toBeDefined()
			expect(DEFAULT_CONFIG.prompt).toContain("SPEC.md")
			expect(DEFAULT_CONFIG.prompt).toContain("progress.txt")
			expect(DEFAULT_CONFIG.prompt).toContain(".ralph-complete")
		})
	})

	describe("DEFAULT_PROMPT", () => {
		it("should mention reading SPEC.md", () => {
			expect(DEFAULT_PROMPT).toContain("Read SPEC.md")
		})

		it("should mention progress.txt", () => {
			expect(DEFAULT_PROMPT).toContain("progress.txt")
		})

		it("should mention single task constraint", () => {
			expect(DEFAULT_PROMPT).toContain("ONLY WORK ON A SINGLE TASK")
		})

		it("should mention completion file", () => {
			expect(DEFAULT_PROMPT).toContain(".ralph-complete")
		})

		it("should mention committing changes", () => {
			expect(DEFAULT_PROMPT).toContain("Commit your changes")
		})

		it("should mention running tests", () => {
			expect(DEFAULT_PROMPT).toContain("Run tests")
		})
	})
})
