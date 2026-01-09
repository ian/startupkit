import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, "..", "..", "..")
const PACKAGES_DIR = join(ROOT_DIR, "packages")
const DOCS_DIR = join(__dirname, "..", "content", "docs", "packages")

interface PackageInfo {
	name: string
	slug: string
	readmePath: string
	outputPath: string
}

const packages: PackageInfo[] = [
	{
		name: "@startupkit/analytics",
		slug: "analytics",
		readmePath: join(PACKAGES_DIR, "analytics", "README.md"),
		outputPath: join(DOCS_DIR, "analytics.mdx")
	},
	{
		name: "@startupkit/auth",
		slug: "auth",
		readmePath: join(PACKAGES_DIR, "auth", "README.md"),
		outputPath: join(DOCS_DIR, "auth.mdx")
	},
	{
		name: "@startupkit/cli",
		slug: "cli",
		readmePath: join(PACKAGES_DIR, "cli", "README.md"),
		outputPath: join(DOCS_DIR, "cli.mdx")
	},
	{
		name: "@startupkit/seo",
		slug: "seo",
		readmePath: join(PACKAGES_DIR, "seo", "README.md"),
		outputPath: join(DOCS_DIR, "seo.mdx")
	}
]

function extractTitle(content: string): string {
	const match = content.match(/^#\s+(.+)$/m)
	return match ? match[1] : "Documentation"
}

function extractDescription(content: string): string {
	const lines = content.split("\n")
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.startsWith("#")) continue
		if (line === "") continue
		if (line.startsWith("Part of")) continue
		if (line.startsWith("[")) continue
		return line.slice(0, 160)
	}
	return ""
}

function escapeTypeAnnotations(line: string): string {
	let result = line

	result = result.replace(
		/\(Array<\{[^}]+\}>\)/g,
		(match) => `(\`${match.slice(1, -1)}\`)`
	)

	result = result.replace(
		/\(([A-Za-z]+)<([^>]+)>\)/g,
		(_, name, inner) => `(\`${name}<${inner}>\`)`
	)

	result = result.replace(
		/`([A-Za-z]+)<([^`>]+)>`/g,
		"`$1<$2>`"
	)

	return result
}

function escapeForMDX(content: string): string {
	const lines = content.split("\n")
	let inCodeBlock = false
	const result: string[] = []

	for (const line of lines) {
		if (line.trim().startsWith("```")) {
			inCodeBlock = !inCodeBlock
			result.push(line)
			continue
		}

		if (inCodeBlock) {
			result.push(line)
			continue
		}

		result.push(escapeTypeAnnotations(line))
	}

	return result.join("\n")
}

function transformReadme(content: string, packageName: string): string {
	let transformed = content

	transformed = transformed.replace(/^#\s+.+$/m, "")

	transformed = transformed.replace(/Part of \[.+?\]\(.+?\).*/g, "").trim()

	transformed = escapeForMDX(transformed)

	const title = extractTitle(content)
	const description = extractDescription(content)

	const frontmatter = `---
title: "${title}"
description: "${description}"
---

`

	return frontmatter + transformed
}

async function syncPackage(pkg: PackageInfo): Promise<void> {
	try {
		if (!existsSync(pkg.readmePath)) {
			console.warn(`⚠️  README not found: ${pkg.readmePath}`)
			return
		}

		const content = await readFile(pkg.readmePath, "utf-8")
		const transformed = transformReadme(content, pkg.name)

		await mkdir(dirname(pkg.outputPath), { recursive: true })
		await writeFile(pkg.outputPath, transformed)

		console.log(`✓ Synced ${pkg.name}`)
	} catch (error) {
		console.error(`✗ Failed to sync ${pkg.name}:`, error)
	}
}

async function main(): Promise<void> {
	console.log("Syncing package documentation...\n")

	for (const pkg of packages) {
		await syncPackage(pkg)
	}

	console.log("\nDone!")
}

main().catch(console.error)
