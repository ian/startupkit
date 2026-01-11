import fs from "node:fs"
import path from "node:path"
import { execSync, spawn } from "node:child_process"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("CLI make - Integration Test with Claude", () => {
	const testDir = path.join(process.cwd(), "tmp/test-make-ralph")

	beforeAll(() => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true })
		}
		fs.mkdirSync(testDir, { recursive: true })

		fs.writeFileSync(
			path.join(testDir, "SPEC.md"),
			`# Test Spec

## Tasks

- [ ] Create a file called hello.txt with the content "Hello from Ralph"

## Completion

When done, create the file .ralph-complete
`
		)

		fs.writeFileSync(path.join(testDir, "progress.txt"), "")
	})

	afterAll(() => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true })
		}
	})

	it(
		"should run claude and execute a simple task",
		() => {
			const cliPath = path.join(process.cwd(), "dist/cli.js")

			if (!fs.existsSync(cliPath)) {
				console.log("CLI not built, skipping integration test")
				return
			}

			const output = execSync(`node ${cliPath} make --iterations 1`, {
				cwd: testDir,
				encoding: "utf-8",
				stdio: ["inherit", "pipe", "pipe"],
				timeout: 120000
			})

			console.log(output)

			expect(output).toContain("Starting ralph")
			expect(output).toContain("Iteration 1")

			const helloFile = path.join(testDir, "hello.txt")

			console.log("\n--- Test Results ---")
			console.log(`hello.txt exists: ${fs.existsSync(helloFile)}`)

			if (fs.existsSync(helloFile)) {
				const content = fs.readFileSync(helloFile, "utf-8")
				console.log(`hello.txt content: ${content}`)
				expect(content).toContain("Hello from Ralph")
			}

			expect(fs.existsSync(helloFile)).toBeTruthy()
		},
		180000
	)
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
