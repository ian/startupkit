import fs from "node:fs"
import path from "node:path"
import degit from "degit"
import { spinner } from "../lib/spinner"
import { exec } from "../lib/system"

interface PackageJson {
	name?: string
	version?: string
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
}

interface UpgradeOptions {
	packages?: boolean
	config?: boolean
	dryRun?: boolean
}

function findStartupKitPackagesInPkg(pkg: PackageJson): string[] {
	const findOrgPackages = (deps: Record<string, string> | undefined) => {
		if (!deps) return []
		return Object.keys(deps).filter(
			(dep) => dep === "startupkit" || dep.startsWith("@startupkit/")
		)
	}

	const dependencies = findOrgPackages(pkg.dependencies)
	const devDependencies = findOrgPackages(pkg.devDependencies)

	return [...new Set([...dependencies, ...devDependencies])]
}

function getWorkspaceGlobs(baseDir: string): string[] {
	const pnpmWorkspacePath = path.join(baseDir, "pnpm-workspace.yaml")

	if (fs.existsSync(pnpmWorkspacePath)) {
		const content = fs.readFileSync(pnpmWorkspacePath, "utf-8")
		const packagePatterns: string[] = []

		const lines = content.split("\n")
		let inPackages = false

		for (const line of lines) {
			if (line.trim() === "packages:") {
				inPackages = true
				continue
			}
			if (inPackages) {
				if (line.startsWith("  - ")) {
					const pattern = line.replace("  - ", "").trim()
					packagePatterns.push(pattern)
				} else if (!line.startsWith("  ") && line.trim() !== "") {
					break
				}
			}
		}

		return packagePatterns
	}

	const rootPkgPath = path.join(baseDir, "package.json")
	if (fs.existsSync(rootPkgPath)) {
		const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"))
		if (rootPkg.workspaces) {
			if (Array.isArray(rootPkg.workspaces)) {
				return rootPkg.workspaces
			}
			if (rootPkg.workspaces.packages) {
				return rootPkg.workspaces.packages
			}
		}
	}

	return []
}

function expandGlobPattern(baseDir: string, pattern: string): string[] {
	const results: string[] = []

	if (pattern.endsWith("/*")) {
		const parentDir = path.join(baseDir, pattern.slice(0, -2))
		if (fs.existsSync(parentDir)) {
			const entries = fs.readdirSync(parentDir, { withFileTypes: true })
			for (const entry of entries) {
				if (entry.isDirectory()) {
					results.push(path.join(parentDir, entry.name))
				}
			}
		}
	} else {
		const fullPath = path.join(baseDir, pattern)
		if (fs.existsSync(fullPath)) {
			results.push(fullPath)
		}
	}

	return results
}

function findAllStartupKitPackages(baseDir: string): string[] {
	const allPackages: Set<string> = new Set()

	const rootPkgPath = path.join(baseDir, "package.json")
	if (fs.existsSync(rootPkgPath)) {
		const rootPkg: PackageJson = JSON.parse(
			fs.readFileSync(rootPkgPath, "utf-8")
		)
		for (const pkg of findStartupKitPackagesInPkg(rootPkg)) {
			allPackages.add(pkg)
		}
	}

	const workspaceGlobs = getWorkspaceGlobs(baseDir)
	for (const glob of workspaceGlobs) {
		const dirs = expandGlobPattern(baseDir, glob)
		for (const dir of dirs) {
			const pkgPath = path.join(dir, "package.json")
			if (fs.existsSync(pkgPath)) {
				const pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
				for (const pkgName of findStartupKitPackagesInPkg(pkg)) {
					allPackages.add(pkgName)
				}
			}
		}
	}

	return Array.from(allPackages)
}

async function detectPackageManager(
	baseDir: string
): Promise<"pnpm" | "npm" | "yarn" | "bun"> {
	if (fs.existsSync(path.join(baseDir, "pnpm-lock.yaml"))) return "pnpm"
	if (fs.existsSync(path.join(baseDir, "yarn.lock"))) return "yarn"
	if (fs.existsSync(path.join(baseDir, "bun.lockb"))) return "bun"
	return "npm"
}

function getUpgradeCommand(
	pm: "pnpm" | "npm" | "yarn" | "bun",
	packages: string[],
	isMonorepo: boolean
): string {
	const pkgList = packages.map((pkg) => `${pkg}@latest`).join(" ")
	switch (pm) {
		case "pnpm":
			return isMonorepo ? `pnpm up -r ${pkgList}` : `pnpm up ${pkgList}`
		case "yarn":
			return `yarn upgrade ${pkgList}`
		case "bun":
			return `bun update ${packages.join(" ")}`
		default:
			return `npm update ${packages.join(" ")}`
	}
}

interface UpgradeResult {
	success: boolean
	message?: string
	packages?: string[]
	command?: string
}

async function fetchLatestVersion(packageName: string): Promise<string | null> {
	try {
		const response = await fetch(
			`https://registry.npmjs.org/${packageName}/latest`
		)
		if (!response.ok) return null
		const data = (await response.json()) as { version?: string }
		return data.version ?? null
	} catch {
		return null
	}
}

interface CatalogUpdateResult {
	updated: string[]
	skipped: string[]
}

async function updateWorkspaceCatalogs(
	baseDir: string,
	dryRun?: boolean
): Promise<CatalogUpdateResult> {
	const workspacePath = path.join(baseDir, "pnpm-workspace.yaml")
	const result: CatalogUpdateResult = { updated: [], skipped: [] }

	if (!fs.existsSync(workspacePath)) {
		return result
	}

	let content = fs.readFileSync(workspacePath, "utf-8")
	const startupkitPattern =
		/["']?(@startupkit\/[\w-]+|startupkit)["']?\s*:\s*["']?([\d.^~<>=]+)["']?/g

	const matches = [...content.matchAll(startupkitPattern)]
	if (matches.length === 0) {
		return result
	}

	for (const match of matches) {
		const packageName = match[1]
		if (!packageName) continue

		const latestVersion = await fetchLatestVersion(packageName)
		if (!latestVersion) {
			result.skipped.push(packageName)
			continue
		}

		const oldPattern = new RegExp(
			`(["']?${packageName.replace("/", "\\/")}["']?\\s*:\\s*)["']?[\\d.^~<>=]+["']?`,
			"g"
		)
		const newContent = content.replace(oldPattern, `$1${latestVersion}`)

		if (newContent !== content) {
			content = newContent
			result.updated.push(`${packageName}@${latestVersion}`)
		}
	}

	if (!dryRun && result.updated.length > 0) {
		fs.writeFileSync(workspacePath, content)
	}

	return result
}

interface PackageVersionState {
	path: string
	hadVersion: boolean
}

function collectPackageVersionStates(baseDir: string): PackageVersionState[] {
	const states: PackageVersionState[] = []

	const rootPkgPath = path.join(baseDir, "package.json")
	if (fs.existsSync(rootPkgPath)) {
		const rootPkg: PackageJson = JSON.parse(
			fs.readFileSync(rootPkgPath, "utf-8")
		)
		states.push({
			path: rootPkgPath,
			hadVersion: rootPkg.version !== undefined
		})
	}

	const workspaceGlobs = getWorkspaceGlobs(baseDir)
	for (const glob of workspaceGlobs) {
		const dirs = expandGlobPattern(baseDir, glob)
		for (const dir of dirs) {
			const pkgPath = path.join(dir, "package.json")
			if (fs.existsSync(pkgPath)) {
				const pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
				states.push({
					path: pkgPath,
					hadVersion: pkg.version !== undefined
				})
			}
		}
	}

	return states
}

function restorePackageVersionStates(states: PackageVersionState[]): void {
	for (const state of states) {
		if (!state.hadVersion && fs.existsSync(state.path)) {
			const content = fs.readFileSync(state.path, "utf-8")
			const pkg = JSON.parse(content)
			if (pkg.version !== undefined) {
				const { version: _, ...pkgWithoutVersion } = pkg
				fs.writeFileSync(
					state.path,
					`${JSON.stringify(pkgWithoutVersion, null, "\t")}\n`
				)
			}
		}
	}
}

async function upgradeNpmPackages(
	baseDir: string,
	dryRun?: boolean
): Promise<UpgradeResult> {
	const pkgPath = path.join(baseDir, "package.json")

	if (!fs.existsSync(pkgPath)) {
		return { success: false, message: "No package.json found" }
	}

	const packages = findAllStartupKitPackages(baseDir)

	if (packages.length === 0) {
		return { success: false, message: "No @startupkit/* packages found" }
	}

	const pm = await detectPackageManager(baseDir)
	const isMonorepo = getWorkspaceGlobs(baseDir).length > 0
	const cmd = getUpgradeCommand(pm, packages, isMonorepo)

	if (dryRun) {
		return { success: true, packages, command: cmd }
	}

	const versionStates = collectPackageVersionStates(baseDir)

	await exec(cmd, { cwd: baseDir })

	restorePackageVersionStates(versionStates)

	return { success: true, packages }
}

interface ConfigResult {
	success: boolean
	message?: string
	configs?: string[]
	updated?: string[]
}

async function upgradeConfig(
	baseDir: string,
	dryRun?: boolean
): Promise<ConfigResult> {
	const configDir = path.join(baseDir, "config")

	if (!fs.existsSync(configDir)) {
		return { success: false, message: "No config/ directory found" }
	}

	const configDirs = ["biome", "typescript", "nextjs"]
	const existingConfigs = configDirs.filter((dir) =>
		fs.existsSync(path.join(configDir, dir))
	)

	if (existingConfigs.length === 0) {
		return {
			success: false,
			message: "No upgradeable config directories found"
		}
	}

	if (dryRun) {
		return { success: true, configs: existingConfigs }
	}

	const tempDir = path.join(baseDir, ".startupkit-upgrade-temp")
	const updated: string[] = []

	try {
		const emitter = degit("ian/startupkit/templates/repo/config", {
			cache: false,
			force: true,
			verbose: false
		})
		await emitter.clone(tempDir)

		for (const configName of existingConfigs) {
			const srcDir = path.join(tempDir, configName)
			const destDir = path.join(configDir, configName)

			if (fs.existsSync(srcDir)) {
				fs.cpSync(srcDir, destDir, { recursive: true })
				updated.push(configName)
			}
		}
	} finally {
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true })
		}
	}

	return { success: true, configs: existingConfigs, updated }
}

async function checkForUpdates(baseDir: string): Promise<void> {
	const packages = findAllStartupKitPackages(baseDir)

	if (packages.length === 0) return

	console.log("\n📊 Checking for available updates...")

	try {
		const pm = await detectPackageManager(baseDir)
		const pkgList = packages.join(" ")
		if (pm === "pnpm") {
			await exec(`pnpm outdated ${pkgList}`, {
				cwd: baseDir,
				stdio: "inherit"
			})
		} else if (pm === "npm") {
			await exec(`npm outdated ${pkgList}`, {
				cwd: baseDir,
				stdio: "inherit"
			})
		}
	} catch {
		// outdated commands exit with non-zero when updates available
	}
}

export async function upgrade(options: UpgradeOptions = {}): Promise<void> {
	const baseDir = process.env.SK_DIR ?? process.cwd()

	console.log(`
╔═══════════════════════════════════════╗
║     StartupKit Upgrade                ║
╚═══════════════════════════════════════╝
`)

	const doPackages = options.packages || (!options.config && !options.packages)
	const doConfig = options.config || (!options.config && !options.packages)

	if (options.dryRun) {
		console.log("🔍 DRY RUN - no changes will be made\n")
	}

	if (doPackages) {
		const result = await spinner("Upgrading @startupkit/* packages", () =>
			upgradeNpmPackages(baseDir, options.dryRun)
		)

		if (result.success) {
			if (result.packages) {
				console.log(`   📦 Packages: ${result.packages.join(", ")}`)
			}
			if (options.dryRun && result.command) {
				console.log(`   🔍 Would run: ${result.command}`)
			}
		} else if (result.message) {
			console.log(`   ⚠️  ${result.message}`)
		}

		const catalogResult = await spinner(
			"Updating pnpm-workspace.yaml catalogs",
			() => updateWorkspaceCatalogs(baseDir, options.dryRun)
		)

		if (catalogResult.updated.length > 0) {
			console.log(`   📋 Catalogs: ${catalogResult.updated.join(", ")}`)
		}
		if (catalogResult.skipped.length > 0 && options.dryRun) {
			console.log(`   ⚠️  Could not fetch: ${catalogResult.skipped.join(", ")}`)
		}
	}

	if (doConfig) {
		const result = await spinner("Syncing config files", () =>
			upgradeConfig(baseDir, options.dryRun)
		)

		if (result.success) {
			if (result.configs) {
				console.log(`   📁 Configs: ${result.configs.join(", ")}`)
			}
			if (options.dryRun) {
				console.log(
					"   🔍 Would sync from ian/startupkit/templates/repo/config"
				)
			} else if (result.updated) {
				for (const config of result.updated) {
					console.log(`   ✅ Updated config/${config}`)
				}
			}
		} else if (result.message) {
			console.log(`   ⚠️  ${result.message}`)
		}
	}

	if (!options.dryRun) {
		await checkForUpdates(baseDir)
	}

	console.log("\n✨ Upgrade complete!\n")

	if (!options.dryRun && doPackages) {
		console.log(
			"💡 Tip: Run your test suite to verify everything works correctly."
		)
	}
}
