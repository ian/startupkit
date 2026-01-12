import fs from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
	buildCommand,
	buildPrompt,
	DEFAULT_CONFIG,
	DEFAULT_PROMPT,
	loadRalphConfig,
	parseStreamLine,
	runIteration,
	type RalphConfig,
	type SpawnFn
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

	describe("buildCommand", () => {
		it("should use claude as default command", () => {
			const config: RalphConfig = {}
			const { command, args } = buildCommand(config, "test prompt")

			expect(command).toBe("claude")
		})

		it("should use custom command from config", () => {
			const config: RalphConfig = { command: "openai" }
			const { command } = buildCommand(config, "test prompt")

			expect(command).toBe("openai")
		})

		it("should append prompt to args", () => {
			const config: RalphConfig = { args: ["--flag", "value"] }
			const { args } = buildCommand(config, "my prompt")

			expect(args).toEqual(["--flag", "value", "my prompt"])
		})

		it("should use default args when not specified", () => {
			const config: RalphConfig = {}
			const { args } = buildCommand(config, "test")

			expect(args).toContain("--permission-mode")
			expect(args).toContain("acceptEdits")
			expect(args).toContain("--output-format")
			expect(args).toContain("stream-json")
			expect(args[args.length - 1]).toBe("test")
		})

		it("should build correct claude command with default config", () => {
			const { command, args } = buildCommand(DEFAULT_CONFIG, "Do the task")

			expect(command).toBe("claude")
			expect(args).toEqual([
				"--permission-mode", "acceptEdits",
				"--output-format", "stream-json",
				"--include-partial-messages",
				"--verbose",
				"-p",
				"Do the task"
			])
		})
	})

	describe("runIteration - Claude invocation", () => {
		it("should call spawn with claude command and correct args", async () => {
			const spawnCalls: Array<{ command: string; args: string[] }> = []

			const mockSpawn: SpawnFn = (command, args) => {
				spawnCalls.push({ command, args })
				return {
					stdout: { on: vi.fn() },
					stderr: { on: vi.fn() },
					on: (event: string, cb: (code: number) => void) => {
						if (event === "close") setTimeout(() => cb(0), 0)
					}
				}
			}

			const config: RalphConfig = {
				command: "claude",
				args: ["--permission-mode", "acceptEdits", "-p"]
			}

			await runIteration(config, "Test prompt", mockSpawn)

			expect(spawnCalls).toHaveLength(1)
			expect(spawnCalls[0].command).toBe("claude")
			expect(spawnCalls[0].args).toContain("--permission-mode")
			expect(spawnCalls[0].args).toContain("acceptEdits")
			expect(spawnCalls[0].args).toContain("-p")
			expect(spawnCalls[0].args[spawnCalls[0].args.length - 1]).toBe("Test prompt")
		})

		it("should call custom AI command when configured", async () => {
			const spawnCalls: Array<{ command: string; args: string[] }> = []

			const mockSpawn: SpawnFn = (command, args) => {
				spawnCalls.push({ command, args })
				return {
					stdout: { on: vi.fn() },
					stderr: { on: vi.fn() },
					on: (event: string, cb: (code: number) => void) => {
						if (event === "close") setTimeout(() => cb(0), 0)
					}
				}
			}

			const config: RalphConfig = {
				ai: "gpt-4",
				command: "openai-cli",
				args: ["--model", "gpt-4", "--prompt"]
			}

			await runIteration(config, "Custom prompt", mockSpawn)

			expect(spawnCalls[0].command).toBe("openai-cli")
			expect(spawnCalls[0].args).toEqual(["--model", "gpt-4", "--prompt", "Custom prompt"])
		})

		it("should reject when command exits with non-zero code", async () => {
			const mockSpawn: SpawnFn = () => ({
				stdout: { on: vi.fn() },
				stderr: { on: vi.fn() },
				on: (event: string, cb: (code: number) => void) => {
					if (event === "close") setTimeout(() => cb(1), 0)
				}
			})

			await expect(
				runIteration(DEFAULT_CONFIG, "test", mockSpawn)
			).rejects.toThrow("claude exited with code 1")
		})

		it("should reject when spawn errors", async () => {
			const mockSpawn: SpawnFn = () => ({
				stdout: { on: vi.fn() },
				stderr: { on: vi.fn() },
				on: (event: string, cb: (err: Error) => void) => {
					if (event === "error") setTimeout(() => cb(new Error("spawn failed")), 0)
				}
			})

			await expect(
				runIteration(DEFAULT_CONFIG, "test", mockSpawn)
			).rejects.toThrow("spawn failed")
		})

		it("should process stdout through parseStreamLine", async () => {
			const writtenOutput: string[] = []
			const originalWrite = process.stdout.write.bind(process.stdout)
			process.stdout.write = ((chunk: string) => {
				writtenOutput.push(chunk)
				return true
			}) as typeof process.stdout.write

			const mockSpawn: SpawnFn = () => {
				let stdoutCallback: ((data: Buffer) => void) | null = null
				return {
					stdout: {
						on: (event: string, cb: (data: Buffer) => void) => {
							if (event === "data") stdoutCallback = cb
						}
					},
					stderr: { on: vi.fn() },
					on: (event: string, cb: (code: number) => void) => {
						if (event === "close") {
							setTimeout(() => {
								const jsonLine = JSON.stringify({
									type: "stream_event",
									event: { delta: { text: "Hello from Claude" } }
								})
								stdoutCallback?.(Buffer.from(jsonLine))
								cb(0)
							}, 0)
						}
					}
				}
			}

			await runIteration(DEFAULT_CONFIG, "test", mockSpawn)

			process.stdout.write = originalWrite

			expect(writtenOutput).toContain("Hello from Claude")
		})
	})
})
