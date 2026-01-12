import { execSync, spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

function assertClaudeAvailable(): void {
	if (!process.env.ANTHROPIC_API_KEY) {
		throw new Error("ANTHROPIC_API_KEY environment variable is required")
	}
	try {
		execSync("claude --version", { encoding: "utf-8", timeout: 5000 })
	} catch {
		throw new Error(
			"Claude CLI is not installed. Run: npm install -g @anthropic-ai/claude-code"
		)
	}
}

describe("CLI make - Simple Claude Output Test", () => {
	const testDir = path.join(process.cwd(), "tmp/test-make-hello")

	beforeAll(() => {
		assertClaudeAvailable()
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true })
		}
		fs.mkdirSync(path.join(testDir, ".startupkit"), { recursive: true })

		fs.writeFileSync(
			path.join(testDir, "SPEC.md"),
			`# Simple Test

Just output the word "HELLO_FROM_SPEC" to the console. Nothing else. Do not create any files.
Then create .ralph-complete to signal you're done.
`
		)

		fs.writeFileSync(path.join(testDir, "progress.txt"), "")

		fs.writeFileSync(
			path.join(testDir, ".startupkit", "ralph.json"),
			JSON.stringify(
				{
					ai: "claude",
					command: "claude",
					args: [
						"--permission-mode",
						"acceptEdits",
						"--output-format",
						"stream-json",
						"--include-partial-messages",
						"--verbose",
						"-p"
					],
					iterations: 1,
					specfile: "SPEC.md",
					progress: "progress.txt",
					complete: ".ralph-complete",
					prompt:
						"Read SPEC.md and do exactly what it says. Output HELLO_FROM_SPEC to console then create .ralph-complete"
				},
				null,
				"\t"
			)
		)
	})

	afterAll(() => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true })
		}
	})

	it("should call claude and output text from SPEC.md", async () => {
		const cliPath = path.join(process.cwd(), "dist/cli.js")

		if (!fs.existsSync(cliPath)) {
			throw new Error("CLI not built - run pnpm build first")
		}

		const output = await new Promise<string>((resolve, reject) => {
			let stdout = ""
			let stderr = ""

			const child = spawn("node", [cliPath, "make"], {
				cwd: testDir,
				env: { ...process.env },
				stdio: ["ignore", "pipe", "pipe"]
			})

			child.stdout.on("data", (data: Buffer) => {
				const text = data.toString()
				stdout += text
				process.stdout.write(text)
			})

			child.stderr.on("data", (data: Buffer) => {
				const text = data.toString()
				stderr += text
				process.stderr.write(text)
			})

			child.on("close", (code) => {
				if (code === 0) {
					resolve(stdout + stderr)
				} else {
					reject(new Error(`CLI exited with code ${code}\nstderr: ${stderr}`))
				}
			})

			child.on("error", reject)

			setTimeout(() => {
				child.kill()
				reject(new Error("Test timed out after 60s"))
			}, 60000)
		})

		console.log("\n--- Output ---")
		console.log(output)
		console.log("--- End ---\n")

		expect(output).toContain("Starting ralph")
		expect(output).toContain("AI: claude")
		expect(output).toContain("Iteration 1")
		expect(output).toContain("HELLO_FROM_SPEC")
	}, 90000)
})

describe("CLI make - Dry run without Claude", () => {
	const testDir = path.join(process.cwd(), "tmp/test-make-dry")

	beforeAll(() => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true })
		}
		fs.mkdirSync(testDir, { recursive: true })

		fs.writeFileSync(path.join(testDir, "SPEC.md"), "# Simple spec")
	})

	afterAll(() => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true })
		}
	})

	it("should fail gracefully when spec file is missing", async () => {
		const cliPath = path.join(process.cwd(), "dist/cli.js")

		if (!fs.existsSync(cliPath)) {
			console.log("CLI not built, skipping test")
			return
		}

		const emptyDir = path.join(testDir, "empty")
		fs.mkdirSync(emptyDir, { recursive: true })

		const result = await new Promise<{ code: number; output: string }>(
			(resolve) => {
				let output = ""

				const child = spawn("node", [cliPath, "make"], {
					cwd: emptyDir
				})

				child.stdout?.on("data", (data: Buffer) => {
					output += data.toString()
				})

				child.stderr?.on("data", (data: Buffer) => {
					output += data.toString()
				})

				child.on("close", (code) => {
					resolve({ code: code ?? 1, output })
				})
			}
		)

		expect(result.code).toBe(1)
		expect(result.output).toContain("Spec file not found")
	})

	it("should show help for make command", async () => {
		const cliPath = path.join(process.cwd(), "dist/cli.js")

		if (!fs.existsSync(cliPath)) {
			console.log("CLI not built, skipping test")
			return
		}

		const result = await new Promise<string>((resolve) => {
			let output = ""

			const child = spawn("node", [cliPath, "make", "--help"])

			child.stdout?.on("data", (data: Buffer) => {
				output += data.toString()
			})

			child.on("close", () => {
				resolve(output)
			})
		})

		expect(result).toContain("Run iterative AI-assisted development")
		expect(result).toContain("--iterations")
		expect(result).toContain("--progress")
	})
})
