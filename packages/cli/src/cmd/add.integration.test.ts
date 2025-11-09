import fs from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { init } from "./init"
import { add } from "./add"

describe("CLI add - Full Integration Test Suite", () => {
	const testDir = path.join(process.cwd(), "tmp/test-add-workspace")
	const projectName = "test-workspace"
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

	describe("Add Next.js App", () => {
		const appName = "test-next-app"
		const appPath = path.join(projectPath, "apps", appName)

		beforeAll(async () => {
			try {
				process.chdir(projectPath)
				await add({ type: "next", name: appName, repo: undefined })
			} finally {
				process.chdir(originalCwd)
			}
		}, 120000)

		it("should create app directory", () => {
			expect(fs.existsSync(appPath)).toBeTruthy()
		})

		it("should have package.json with correct name", () => {
			const pkgJsonPath = path.join(appPath, "package.json")
			expect(fs.existsSync(pkgJsonPath)).toBeTruthy()

			const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
			expect(pkgJson.name).toBe(appName)
		})

		it("should have Next.js specific files", () => {
			const requiredFiles = [
				"next.config.ts",
				"tsconfig.json",
				"tailwind.config.ts",
				"postcss.config.mjs"
			]

			for (const file of requiredFiles) {
				expect(fs.existsSync(path.join(appPath, file))).toBeTruthy()
			}
		})

		it("should have src directory with app router structure", () => {
			const srcDir = path.join(appPath, "src")
			expect(fs.existsSync(srcDir)).toBeTruthy()

			const appDir = path.join(srcDir, "app")
			expect(fs.existsSync(appDir)).toBeTruthy()

			expect(fs.existsSync(path.join(appDir, "layout.tsx"))).toBeTruthy()
			expect(fs.existsSync(path.join(appDir, "page.tsx"))).toBeTruthy()
		})

		it("should replace PROJECT_NEXT placeholder", () => {
			const pkgJsonPath = path.join(appPath, "package.json")
			const content = fs.readFileSync(pkgJsonPath, "utf-8")
			expect(content.includes("PROJECT_NEXT")).toBeFalsy()
			expect(content.includes(appName)).toBeTruthy()
		})

		it("should have workspace dependencies", () => {
			const pkgJsonPath = path.join(appPath, "package.json")
			const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))

			expect(pkgJson.dependencies).toBeDefined()
			expect(pkgJson.dependencies["@repo/auth"]).toBeDefined()
			expect(pkgJson.dependencies["@repo/ui"]).toBeDefined()
		})

		it("should not have .git directory", () => {
			expect(fs.existsSync(path.join(appPath, ".git"))).toBeFalsy()
		})
	})

	describe("Add Vite App", () => {
		const appName = "test-vite-app"
		const appPath = path.join(projectPath, "apps", appName)

		beforeAll(async () => {
			try {
				process.chdir(projectPath)
				await add({ type: "vite", name: appName, repo: undefined })
			} finally {
				process.chdir(originalCwd)
			}
		}, 120000)

		it("should create app directory", () => {
			expect(fs.existsSync(appPath)).toBeTruthy()
		})

		it("should have package.json with correct name", () => {
			const pkgJsonPath = path.join(appPath, "package.json")
			expect(fs.existsSync(pkgJsonPath)).toBeTruthy()

			const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
			expect(pkgJson.name).toBe(appName)
		})

		it("should have Vite specific files", () => {
			const requiredFiles = [
				"vite.config.ts",
				"tsconfig.json",
				"tsconfig.node.json",
				"index.html"
			]

			for (const file of requiredFiles) {
				expect(fs.existsSync(path.join(appPath, file))).toBeTruthy()
			}
		})

		it("should have src directory", () => {
			const srcDir = path.join(appPath, "src")
			expect(fs.existsSync(srcDir)).toBeTruthy()
			expect(fs.existsSync(path.join(srcDir, "App.tsx"))).toBeTruthy()
		})

		it("should replace PROJECT_VITE placeholder", () => {
			const pkgJsonPath = path.join(appPath, "package.json")
			const content = fs.readFileSync(pkgJsonPath, "utf-8")
			expect(content.includes("PROJECT_VITE")).toBeFalsy()
			expect(content.includes(appName)).toBeTruthy()
		})

		it("should not have .git directory", () => {
			expect(fs.existsSync(path.join(appPath, ".git"))).toBeFalsy()
		})
	})

	describe("Error Handling", () => {
		it("should prevent adding app with duplicate name", async () => {
			const duplicateName = "test-next-app"

			try {
				process.chdir(projectPath)
				await expect(
					add({ type: "next", name: duplicateName, repo: undefined })
				).rejects.toThrow()
			} finally {
				process.chdir(originalCwd)
			}
		})
	})

	describe("Workspace Root Detection", () => {
		it("should work when run from apps directory", async () => {
			const appName = "test-from-apps"
			const appsDir = path.join(projectPath, "apps")
			const appPath = path.join(appsDir, appName)

			try {
				process.chdir(appsDir)
				await add({ type: "next", name: appName, repo: undefined })

				expect(fs.existsSync(appPath)).toBeTruthy()
			} finally {
				process.chdir(originalCwd)
			}
		}, 120000)

		it("should work when run from packages directory", async () => {
			const appName = "test-from-packages"
			const packagesDir = path.join(projectPath, "packages")
			const appPath = path.join(projectPath, "apps", appName)

			try {
				process.chdir(packagesDir)
				await add({ type: "next", name: appName, repo: undefined })

				expect(fs.existsSync(appPath)).toBeTruthy()
			} finally {
				process.chdir(originalCwd)
			}
		}, 120000)
	})

	describe("Placeholder Replacement", () => {
		it("should replace placeholders in all files", async () => {
			const appName = "my-custom-app"
			const appPath = path.join(projectPath, "apps", appName)

			try {
				process.chdir(projectPath)
				await add({ type: "next", name: appName, repo: undefined })

				const filesToCheck = ["package.json", "README.md"]

				for (const file of filesToCheck) {
					const filePath = path.join(appPath, file)
					if (fs.existsSync(filePath)) {
						const content = fs.readFileSync(filePath, "utf-8")
						expect(content.includes("PROJECT_NEXT")).toBeFalsy()
					}
				}
			} finally {
				process.chdir(originalCwd)
			}
		}, 120000)
	})

	describe("App Name Slugification", () => {
		it("should convert spaces to dashes in app name", async () => {
			const appName = "My Test App"
			const expectedSlug = "my-test-app"
			const appPath = path.join(projectPath, "apps", expectedSlug)

			try {
				process.chdir(projectPath)
				await add({ type: "next", name: appName, repo: undefined })

				expect(fs.existsSync(appPath)).toBeTruthy()

				const pkgJson = JSON.parse(
					fs.readFileSync(path.join(appPath, "package.json"), "utf-8")
				)
				expect(pkgJson.name).toBe(expectedSlug)
			} finally {
				process.chdir(originalCwd)
			}
		}, 120000)

		it("should handle special characters in app name", async () => {
			const appName = "My App!@#"
			const expectedSlug = "my-app"
			const appPath = path.join(projectPath, "apps", expectedSlug)

			try {
				process.chdir(projectPath)
				await add({ type: "next", name: appName, repo: undefined })

				expect(fs.existsSync(appPath)).toBeTruthy()
			} finally {
				process.chdir(originalCwd)
			}
		}, 120000)
	})
})

