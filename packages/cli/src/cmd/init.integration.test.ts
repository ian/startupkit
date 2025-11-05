import fs from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { init } from "./init"

describe("CLI init - Full Test Suite", () => {
	const testDir = path.join(process.cwd(), "tmp/test-project")
	const projectName = "test-startup"
	const projectPath = path.join(testDir, projectName)
	const originalCwd = process.cwd()

	beforeAll(async () => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true })
		}
		fs.mkdirSync(testDir, { recursive: true })

		try {
			process.chdir(testDir)
			await init({ name: projectName, repoArg: undefined })
		} finally {
			process.chdir(originalCwd)
		}
	}, 180000)

	afterAll(async () => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true })
		}
	})

	describe("Project Structure", () => {
		it("should create project directory", () => {
			expect(fs.existsSync(projectPath)).toBeTruthy()
		})

		it("should have all required root files", () => {
			const requiredFiles = [
				"package.json",
				"turbo.json",
				"pnpm-workspace.yaml",
				"biome.jsonc"
			]

			for (const file of requiredFiles) {
				expect(fs.existsSync(path.join(projectPath, file))).toBeTruthy()
			}
		})

		it("should have packages directory with all packages", () => {
			const packagesDir = path.join(projectPath, "packages")
			expect(fs.existsSync(packagesDir)).toBeTruthy()

			const expectedPackages = ["ui", "auth", "db", "analytics", "utils", "emails"]

			for (const pkg of expectedPackages) {
				const pkgPath = path.join(packagesDir, pkg)
				const pkgJsonPath = path.join(pkgPath, "package.json")

				expect(fs.existsSync(pkgPath)).toBeTruthy()
				expect(fs.existsSync(pkgJsonPath)).toBeTruthy()
			}
		})

		it("should have apps and config directories", () => {
			expect(fs.existsSync(path.join(projectPath, "apps"))).toBeTruthy()
			expect(fs.existsSync(path.join(projectPath, "config"))).toBeTruthy()
		})
	})

	describe("PROJECT Placeholder Replacement", () => {
		it("should replace PROJECT with project name in root package.json", () => {
			const pkgJson = JSON.parse(
				fs.readFileSync(path.join(projectPath, "package.json"), "utf-8")
			)
			expect(pkgJson.name).toBe(projectName)
		})

		it("should not have PROJECT placeholders in package files", () => {
			const packagesDir = path.join(projectPath, "packages")
			const packages = fs.readdirSync(packagesDir)

			for (const pkg of packages) {
				const pkgJsonPath = path.join(packagesDir, pkg, "package.json")
				if (fs.existsSync(pkgJsonPath)) {
					const content = fs.readFileSync(pkgJsonPath, "utf-8")
					expect(content.includes("PROJECT")).toBeFalsy()
				}
			}
		})
	})

	describe("Package Structure", () => {
		it("should have valid Drizzle schema", () => {
			const schemaPath = path.join(projectPath, "packages/db/src/schema.ts")
			expect(fs.existsSync(schemaPath)).toBeTruthy()

			const content = fs.readFileSync(schemaPath, "utf-8")
			expect(content).toContain("pgTable")
		})

		it("should have Drizzle config", () => {
			const configPath = path.join(projectPath, "packages/db/drizzle.config.ts")
			expect(fs.existsSync(configPath)).toBeTruthy()
		})

		it("should have auth library and provider", () => {
			const authLibPath = path.join(projectPath, "packages/auth/src/lib/auth.ts")
			const authProviderPath = path.join(
				projectPath,
				"packages/auth/src/components/provider.tsx"
			)

			expect(fs.existsSync(authLibPath)).toBeTruthy()
			expect(fs.existsSync(authProviderPath)).toBeTruthy()
		})

		it("should have UI package with correct exports", () => {
			const pkgJson = JSON.parse(
				fs.readFileSync(
					path.join(projectPath, "packages/ui/package.json"),
					"utf-8"
				)
			)

			expect(pkgJson.exports).toBeDefined()
			expect(pkgJson.exports["./components/*"]).toBeDefined()
			expect(pkgJson.exports["./tailwind.config"]).toBeDefined()
			expect(pkgJson.exports["./postcss.config"]).toBeDefined()
		})
	})

	describe("Workspace Configuration", () => {
		it("should have valid pnpm-workspace.yaml", () => {
			const workspacePath = path.join(projectPath, "pnpm-workspace.yaml")
			const content = fs.readFileSync(workspacePath, "utf-8")
			expect(content).toContain("packages:")
		})
	})

	describe("Artifacts", () => {
		it("should not have .git directory", () => {
			expect(fs.existsSync(path.join(projectPath, ".git"))).toBeFalsy()
		})

		it("should not have PLACEHOLDER text", () => {
			const filesToCheck = [
				"package.json",
				"packages/ui/package.json",
				"packages/db/package.json"
			]

			for (const file of filesToCheck) {
				const filePath = path.join(projectPath, file)
				if (fs.existsSync(filePath)) {
					const content = fs.readFileSync(filePath, "utf-8")
					expect(content.includes("PLACEHOLDER")).toBeFalsy()
				}
			}
		})
	})
})

