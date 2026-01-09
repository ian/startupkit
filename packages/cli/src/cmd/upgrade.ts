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

function findStartupKitPackages(pkg: PackageJson): string[] {
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
	packages: string[]
): string {
	const pkgList = packages.map((pkg) => `${pkg}@latest`).join(" ")
	switch (pm) {
		case "pnpm":
			return `pnpm up ${pkgList}`
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

async function upgradeNpmPackages(
	baseDir: string,
	dryRun?: boolean
): Promise<UpgradeResult> {
	const pkgPath = path.join(baseDir, "package.json")

	if (!fs.existsSync(pkgPath)) {
		return { success: false, message: "No package.json found" }
	}

	const pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
	const packages = findStartupKitPackages(pkg)

	if (packages.length === 0) {
		return { success: false, message: "No @startupkit/* packages found" }
	}

	const pm = await detectPackageManager(baseDir)
	const cmd = getUpgradeCommand(pm, packages)

	if (dryRun) {
		return { success: true, packages, command: cmd }
	}

	await exec(cmd, { cwd: baseDir })
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
	const pkgPath = path.join(baseDir, "package.json")

	if (!fs.existsSync(pkgPath)) return

	const pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
	const packages = findStartupKitPackages(pkg)

	if (packages.length === 0) return

	console.log("\n📊 Checking for available updates...")

	try {
		const pm = await detectPackageManager(baseDir)
		if (pm === "pnpm") {
			await exec("pnpm outdated startupkit @startupkit/*", {
				cwd: baseDir,
				stdio: "inherit"
			})
		} else if (pm === "npm") {
			await exec("npm outdated startupkit @startupkit/*", {
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
