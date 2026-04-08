import { homedir } from "node:os"
import { join } from "node:path"
import { readFileSync, existsSync } from "node:fs"

interface AuthConfig {
	apiKey?: string
	baseUrl?: string
}

const CONFIG_DIR = join(homedir(), ".startupkit")
const CONFIG_FILE = join(CONFIG_DIR, "pro.json")

export function loadAuthConfig(): AuthConfig {
	if (!existsSync(CONFIG_FILE)) {
		return {}
	}
	try {
		const content = readFileSync(CONFIG_FILE, "utf-8")
		return JSON.parse(content)
	} catch {
		return {}
	}
}

export function getApiKey(): string | null {
	const config = loadAuthConfig()
	return config.apiKey || null
}

export function hasApiKey(): boolean {
	return !!getApiKey()
}
