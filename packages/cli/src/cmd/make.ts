import { spawn as nodeSpawn } from "node:child_process"
import {
	existsSync,
	mkdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync
} from "node:fs"
import path from "node:path"

export interface RalphConfig {
	ai?: string
	command?: string
	args?: string[]
	iterations?: number
	specfile?: string
	progress?: string
	complete?: string
	prompt?: string
}

interface MakeOptions {
	specfile?: string
	iterations?: number
	progress?: string
}

export const DEFAULT_PROMPT = `Read SPEC.md and progress.txt. Find the highest-priority incomplete task and implement it. Run tests and type checks. Update SPEC.md to mark what was done. Append progress to progress.txt. Commit your changes. ONLY WORK ON A SINGLE TASK. If all tasks complete, create file .ralph-complete`

export const DEFAULT_CONFIG: RalphConfig = {
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
	iterations: 10,
	specfile: "SPEC.md",
	progress: "progress.txt",
	complete: ".ralph-complete",
	prompt: DEFAULT_PROMPT
}

export function loadRalphConfig(cwd: string): RalphConfig {
	const configPath = path.join(cwd, ".startupkit", "ralph.json")

	if (!existsSync(configPath)) {
		return DEFAULT_CONFIG
	}

	try {
		const content = readFileSync(configPath, "utf-8")
		const config = JSON.parse(content) as RalphConfig
		return { ...DEFAULT_CONFIG, ...config }
	} catch {
		console.warn(`Warning: Could not parse ${configPath}, using defaults`)
		return DEFAULT_CONFIG
	}
}

function ensureConfigDir(cwd: string): void {
	const configDir = path.join(cwd, ".startupkit")
	if (!existsSync(configDir)) {
		mkdirSync(configDir, { recursive: true })
	}
}

export function buildPrompt(
	config: RalphConfig,
	specfile: string,
	progress: string
): string {
	let prompt = config.prompt ?? DEFAULT_PROMPT
	prompt = prompt.replace(/SPEC\.md/g, specfile)
	prompt = prompt.replace(/progress\.txt/g, progress)
	return prompt
}

export function parseStreamLine(line: string): string | null {
	if (!line.trim()) return null
	try {
		const obj = JSON.parse(line)
		if (obj.type === "stream_event" && obj.event?.delta?.text) {
			return obj.event.delta.text
		}
		return null
	} catch {
		return line
	}
}

export async function make(options: MakeOptions): Promise<void> {
	const cwd = process.cwd()
	const config = loadRalphConfig(cwd)

	const specfile = options.specfile ?? config.specfile ?? "SPEC.md"
	const iterations = options.iterations ?? config.iterations ?? 10
	const progressFile = options.progress ?? config.progress ?? "progress.txt"
	const completeFile = config.complete ?? ".ralph-complete"
	const completePath = path.resolve(cwd, completeFile)

	if (!existsSync(specfile)) {
		console.error(`Error: Spec file not found: ${specfile}`)
		process.exit(1)
	}

	ensureConfigDir(cwd)

	const prompt = buildPrompt(config, specfile, progressFile)

	console.log(`\n🚀 Starting ralph`)
	console.log(`   AI: ${config.ai ?? "claude"}`)
	console.log(`   Spec file: ${specfile}`)
	console.log(`   Progress file: ${progressFile}`)
	console.log(`   Max iterations: ${iterations}\n`)

	for (let i = 1; i <= iterations; i++) {
		console.log("")
		console.log("==========================================")
		console.log(`=== Iteration ${i} ===`)
		console.log("==========================================")
		console.log("")

		await runIteration(config, prompt)

		console.log("")

		if (existsSync(completePath)) {
			console.log(`\n✅ Spec complete after ${i} iteration(s).`)
			unlinkSync(completePath)
			return
		}
	}

	console.log(
		`\n⚠️  Reached maximum iterations (${iterations}) without completion.`
	)
}

export type SpawnFn = (
	command: string,
	args: string[]
) => {
	stdout: { on: (event: string, cb: (data: Buffer) => void) => void } | null
	stderr: { on: (event: string, cb: (data: Buffer) => void) => void } | null
	on: (event: string, cb: (codeOrErr: number | Error) => void) => void
}

export function buildCommand(
	config: RalphConfig,
	prompt: string
): { command: string; args: string[] } {
	const command = config.command ?? "claude"
	const defaultArgs = DEFAULT_CONFIG.args ?? []
	const args = [...(config.args ?? defaultArgs), prompt]
	return { command, args }
}

export async function runIteration(
	config: RalphConfig,
	prompt: string,
	spawnFn: SpawnFn = (cmd, args) =>
		nodeSpawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] })
): Promise<void> {
	return new Promise((resolve, reject) => {
		const { command, args } = buildCommand(config, prompt)

		const child = spawnFn(command, args)
		let stdoutBuffer = ""

		child.stdout?.on("data", (data: Buffer) => {
			stdoutBuffer += data.toString()
			const lines = stdoutBuffer.split("\n")
			stdoutBuffer = lines.pop() ?? ""
			for (const line of lines) {
				const text = parseStreamLine(line)
				if (text) process.stdout.write(text)
			}
		})

		child.stderr?.on("data", (data: Buffer) => {
			process.stderr.write(data)
		})

		child.on("close", (code) => {
			if (code === 0) {
				resolve()
			} else {
				reject(new Error(`${command} exited with code ${code}`))
			}
		})

		child.on("error", (err: Error) => {
			console.error(`Error running ${command}:`, err.message)
			reject(err)
		})
	})
}

export function initRalphConfig(): void {
	const cwd = process.cwd()
	const configDir = path.join(cwd, ".startupkit")
	const configPath = path.join(configDir, "ralph.json")

	if (existsSync(configPath)) {
		console.log(`Config already exists at ${configPath}`)
		return
	}

	ensureConfigDir(cwd)
	writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, "\t"))
	console.log(`Created ralph config at ${configPath}`)
}
