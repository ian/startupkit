import fs from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

interface PackageJson {
	name?: string
	version?: string
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
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

function detectPackageManager(
	baseDir: string
): "pnpm" | "npm" | "yarn" | "bun" {
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

describe("upgrade command - unit tests", () => {
	describe("findStartupKitPackages function", () => {
		it("should find startupkit CLI package", () => {
			const pkg: PackageJson = {
				devDependencies: {
					startupkit: "^0.5.0",
					typescript: "^5.0.0"
				}
			}

			const result = findStartupKitPackages(pkg)

			expect(result).toContain("startupkit")
			expect(result).not.toContain("typescript")
		})

		it("should find @startupkit/* packages in dependencies", () => {
			const pkg: PackageJson = {
				dependencies: {
					"@startupkit/analytics": "^0.5.0",
					"@startupkit/auth": "^0.5.0",
					react: "^19.0.0"
				}
			}

			const result = findStartupKitPackages(pkg)

			expect(result).toContain("@startupkit/analytics")
			expect(result).toContain("@startupkit/auth")
			expect(result).not.toContain("react")
		})

		it("should find packages in both dependencies and devDependencies", () => {
			const pkg: PackageJson = {
				dependencies: {
					"@startupkit/auth": "^0.5.0"
				},
				devDependencies: {
					startupkit: "^0.5.0"
				}
			}

			const result = findStartupKitPackages(pkg)

			expect(result).toContain("@startupkit/auth")
			expect(result).toContain("startupkit")
			expect(result).toHaveLength(2)
		})

		it("should deduplicate packages found in both places", () => {
			const pkg: PackageJson = {
				dependencies: {
					startupkit: "^0.5.0"
				},
				devDependencies: {
					startupkit: "^0.5.0"
				}
			}

			const result = findStartupKitPackages(pkg)

			expect(result).toEqual(["startupkit"])
		})

		it("should return empty array when no startupkit packages", () => {
			const pkg: PackageJson = {
				dependencies: {
					react: "^19.0.0",
					next: "^15.0.0"
				}
			}

			const result = findStartupKitPackages(pkg)

			expect(result).toEqual([])
		})

		it("should handle missing dependencies", () => {
			const pkg: PackageJson = {
				name: "test-project"
			}

			const result = findStartupKitPackages(pkg)

			expect(result).toEqual([])
		})

		it("should not match similar package names", () => {
			const pkg: PackageJson = {
				dependencies: {
					"startupkit-unofficial": "^1.0.0",
					"@other/startupkit": "^1.0.0"
				}
			}

			const result = findStartupKitPackages(pkg)

			expect(result).toEqual([])
		})
	})

	describe("detectPackageManager function", () => {
		const testDir = path.join(process.cwd(), "tmp/test-pm-detection")

		beforeEach(() => {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true })
			}
			fs.mkdirSync(testDir, { recursive: true })
		})

		afterEach(() => {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true })
			}
		})

		it("should detect pnpm from pnpm-lock.yaml", () => {
			fs.writeFileSync(path.join(testDir, "pnpm-lock.yaml"), "")

			const result = detectPackageManager(testDir)

			expect(result).toBe("pnpm")
		})

		it("should detect yarn from yarn.lock", () => {
			fs.writeFileSync(path.join(testDir, "yarn.lock"), "")

			const result = detectPackageManager(testDir)

			expect(result).toBe("yarn")
		})

		it("should detect bun from bun.lockb", () => {
			fs.writeFileSync(path.join(testDir, "bun.lockb"), "")

			const result = detectPackageManager(testDir)

			expect(result).toBe("bun")
		})

		it("should default to npm when no lockfile found", () => {
			const result = detectPackageManager(testDir)

			expect(result).toBe("npm")
		})

		it("should prefer pnpm when multiple lockfiles exist", () => {
			fs.writeFileSync(path.join(testDir, "pnpm-lock.yaml"), "")
			fs.writeFileSync(path.join(testDir, "yarn.lock"), "")

			const result = detectPackageManager(testDir)

			expect(result).toBe("pnpm")
		})
	})

	describe("getUpgradeCommand function", () => {
		it("should generate pnpm upgrade command", () => {
			const result = getUpgradeCommand("pnpm", [
				"startupkit",
				"@startupkit/auth"
			])

			expect(result).toBe("pnpm up startupkit@latest @startupkit/auth@latest")
		})

		it("should generate yarn upgrade command", () => {
			const result = getUpgradeCommand("yarn", ["startupkit"])

			expect(result).toBe("yarn upgrade startupkit@latest")
		})

		it("should generate bun update command without @latest", () => {
			const result = getUpgradeCommand("bun", [
				"startupkit",
				"@startupkit/auth"
			])

			expect(result).toBe("bun update startupkit @startupkit/auth")
		})

		it("should generate npm update command", () => {
			const result = getUpgradeCommand("npm", ["@startupkit/analytics"])

			expect(result).toBe("npm update @startupkit/analytics")
		})

		it("should handle single package", () => {
			const result = getUpgradeCommand("pnpm", ["startupkit"])

			expect(result).toBe("pnpm up startupkit@latest")
		})

		it("should handle multiple packages", () => {
			const packages = [
				"startupkit",
				"@startupkit/auth",
				"@startupkit/analytics",
				"@startupkit/seo"
			]
			const result = getUpgradeCommand("pnpm", packages)

			expect(result).toBe(
				"pnpm up startupkit@latest @startupkit/auth@latest @startupkit/analytics@latest @startupkit/seo@latest"
			)
		})
	})

	describe("config upgrade detection", () => {
		const testDir = path.join(process.cwd(), "tmp/test-config-detection")

		beforeEach(() => {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true })
			}
			fs.mkdirSync(path.join(testDir, "config"), { recursive: true })
		})

		afterEach(() => {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true })
			}
		})

		it("should detect existing config directories", () => {
			fs.mkdirSync(path.join(testDir, "config/biome"), { recursive: true })
			fs.mkdirSync(path.join(testDir, "config/typescript"), { recursive: true })

			const configDir = path.join(testDir, "config")
			const configDirs = ["biome", "typescript", "nextjs"]
			const existingConfigs = configDirs.filter((dir) =>
				fs.existsSync(path.join(configDir, dir))
			)

			expect(existingConfigs).toContain("biome")
			expect(existingConfigs).toContain("typescript")
			expect(existingConfigs).not.toContain("nextjs")
		})

		it("should return empty array when no config directories exist", () => {
			const configDir = path.join(testDir, "config")
			const configDirs = ["biome", "typescript", "nextjs"]
			const existingConfigs = configDirs.filter((dir) =>
				fs.existsSync(path.join(configDir, dir))
			)

			expect(existingConfigs).toEqual([])
		})
	})
})
