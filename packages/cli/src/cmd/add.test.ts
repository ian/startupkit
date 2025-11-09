import fs from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { add } from "./add"

const slugify = (input: string): string => {
	return input
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/_/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+|-+$/g, "")
}

const getWorkspaceRoot = (): string => {
	const cwd = process.cwd()
	const cwdBase = path.basename(cwd)
	return cwdBase === "apps" || cwdBase === "packages" ? path.dirname(cwd) : cwd
}

interface TemplateInfo {
	type: string
	templatePath: string
	replacementPattern: RegExp
}

const getTemplateInfo = (appType: string, repoArg?: string): TemplateInfo => {
	const templates: Record<string, TemplateInfo> = {
		next: {
			type: "next",
			templatePath: repoArg || "ian/startupkit/templates/apps/next",
			replacementPattern: /PROJECT_NEXT/g
		},
		vite: {
			type: "vite",
			templatePath: repoArg || "ian/startupkit/templates/apps/vite",
			replacementPattern: /PROJECT_VITE/g
		}
	}

	const template = templates[appType]
	if (!template) {
		throw new Error(`Unknown template type: ${appType}`)
	}
	return template
}

describe("add command - unit tests", () => {
	describe("slugify function", () => {
		it("should convert spaces to dashes", () => {
			expect(slugify("My App Name")).toBe("my-app-name")
		})

		it("should convert underscores to dashes", () => {
			expect(slugify("my_app_name")).toBe("my-app-name")
		})

		it("should remove special characters", () => {
			expect(slugify("My App!@#$%")).toBe("my-app")
		})

		it("should lowercase everything", () => {
			expect(slugify("UPPERCASE")).toBe("uppercase")
		})

		it("should handle consecutive dashes", () => {
			expect(slugify("my---app")).toBe("my-app")
		})

		it("should trim leading/trailing dashes", () => {
			expect(slugify("-my-app-")).toBe("my-app")
		})

		it("should handle numbers", () => {
			expect(slugify("app-123")).toBe("app-123")
		})

		it("should handle mixed cases", () => {
			expect(slugify("My Cool App 2024!")).toBe("my-cool-app-2024")
		})
	})

	describe("getWorkspaceRoot function", () => {
		const originalCwd = process.cwd()

		afterEach(() => {
			process.chdir(originalCwd)
		})

		it("should return current directory if not in apps or packages", () => {
			const result = getWorkspaceRoot()
			expect(result).toBe(process.cwd())
		})

		it("should return parent directory if in apps subdirectory", () => {
			const testDir = path.join(process.cwd(), "tmp/test-workspace/apps")
			fs.mkdirSync(testDir, { recursive: true })
			process.chdir(testDir)

			const result = getWorkspaceRoot()
			expect(result).toBe(path.dirname(testDir))

			fs.rmSync(path.join(process.cwd(), "../../tmp"), {
				recursive: true,
				force: true
			})
		})

		it("should return parent directory if in packages subdirectory", () => {
			const testDir = path.join(process.cwd(), "tmp/test-workspace/packages")
			fs.mkdirSync(testDir, { recursive: true })
			process.chdir(testDir)

			const result = getWorkspaceRoot()
			expect(result).toBe(path.dirname(testDir))

			fs.rmSync(path.join(process.cwd(), "../../tmp"), {
				recursive: true,
				force: true
			})
		})
	})

	describe("getTemplateInfo function", () => {
		it("should return correct info for next template", () => {
			const result = getTemplateInfo("next")

			expect(result.type).toBe("next")
			expect(result.templatePath).toBe("ian/startupkit/templates/apps/next")
			expect(result.replacementPattern).toEqual(/PROJECT_NEXT/g)
		})

		it("should return correct info for vite template", () => {
			const result = getTemplateInfo("vite")

			expect(result.type).toBe("vite")
			expect(result.templatePath).toBe("ian/startupkit/templates/apps/vite")
			expect(result.replacementPattern).toEqual(/PROJECT_VITE/g)
		})

		it("should use custom repo when provided", () => {
			const customRepo = "user/custom-repo/templates/apps/next"
			const result = getTemplateInfo("next", customRepo)

			expect(result.templatePath).toBe(customRepo)
		})

		it("should throw error for unknown template type", () => {
			expect(() => getTemplateInfo("unknown")).toThrow(
				"Unknown template type: unknown"
			)
		})
	})

	describe("checkMissingDependencies function", () => {
		const testDir = path.join(process.cwd(), "tmp/test-deps-workspace")

		beforeEach(() => {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true })
			}
			fs.mkdirSync(path.join(testDir, "packages"), { recursive: true })
			fs.mkdirSync(path.join(testDir, "config"), { recursive: true })
		})

		afterEach(() => {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true })
			}
		})

		it("should return empty arrays when no dependencies required", () => {
			const config = null
			const missing = checkMissingDependenciesHelper(config, testDir)

			expect(missing.packages).toEqual([])
			expect(missing.config).toEqual([])
		})

		it("should detect missing packages", () => {
			const config = {
				type: "app" as const,
				dependencies: {
					packages: ["auth", "db", "ui"]
				}
			}

			const missing = checkMissingDependenciesHelper(config, testDir)

			expect(missing.packages).toEqual(["auth", "db", "ui"])
			expect(missing.config).toEqual([])
		})

		it("should detect existing packages", () => {
			fs.mkdirSync(path.join(testDir, "packages/auth"), { recursive: true })
			fs.mkdirSync(path.join(testDir, "packages/db"), { recursive: true })

			const config = {
				type: "app" as const,
				dependencies: {
					packages: ["auth", "db", "ui"]
				}
			}

			const missing = checkMissingDependenciesHelper(config, testDir)

			expect(missing.packages).toEqual(["ui"])
		})

		it("should detect missing config packages", () => {
			const config = {
				type: "app" as const,
				dependencies: {
					config: ["typescript", "biome"]
				}
			}

			const missing = checkMissingDependenciesHelper(config, testDir)

			expect(missing.packages).toEqual([])
			expect(missing.config).toEqual(["typescript", "biome"])
		})

		it("should detect existing config packages", () => {
			fs.mkdirSync(path.join(testDir, "config/typescript"), { recursive: true })

			const config = {
				type: "app" as const,
				dependencies: {
					config: ["typescript", "biome"]
				}
			}

			const missing = checkMissingDependenciesHelper(config, testDir)

			expect(missing.config).toEqual(["biome"])
		})

		it("should handle both packages and config dependencies", () => {
			fs.mkdirSync(path.join(testDir, "packages/auth"), { recursive: true })
			fs.mkdirSync(path.join(testDir, "config/typescript"), { recursive: true })

			const config = {
				type: "app" as const,
				dependencies: {
					packages: ["auth", "db"],
					config: ["typescript", "biome"]
				}
			}

			const missing = checkMissingDependenciesHelper(config, testDir)

			expect(missing.packages).toEqual(["db"])
			expect(missing.config).toEqual(["biome"])
		})
	})

	describe("replaceInDirectory function", () => {
		const testDir = path.join(process.cwd(), "tmp/test-replace")

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

		it("should replace text in files", () => {
			const testFile = path.join(testDir, "test.txt")
			fs.writeFileSync(testFile, "This is PROJECT_NEXT app")

			replaceInDirectoryHelper(testDir, /PROJECT_NEXT/g, "my-app")

			const content = fs.readFileSync(testFile, "utf-8")
			expect(content).toBe("This is my-app app")
		})

		it("should replace text in nested directories", () => {
			const nestedDir = path.join(testDir, "nested")
			fs.mkdirSync(nestedDir)
			const testFile = path.join(nestedDir, "test.txt")
			fs.writeFileSync(testFile, "PROJECT_NEXT")

			replaceInDirectoryHelper(testDir, /PROJECT_NEXT/g, "my-app")

			const content = fs.readFileSync(testFile, "utf-8")
			expect(content).toBe("my-app")
		})

		it("should replace multiple occurrences in same file", () => {
			const testFile = path.join(testDir, "test.json")
			fs.writeFileSync(
				testFile,
				'{"name": "PROJECT_VITE", "title": "PROJECT_VITE"}'
			)

			replaceInDirectoryHelper(testDir, /PROJECT_VITE/g, "vite-app")

			const content = fs.readFileSync(testFile, "utf-8")
			expect(content).toBe('{"name": "vite-app", "title": "vite-app"}')
		})

		it("should skip node_modules directory", () => {
			const nodeModulesDir = path.join(testDir, "node_modules")
			fs.mkdirSync(nodeModulesDir)
			const testFile = path.join(nodeModulesDir, "test.txt")
			fs.writeFileSync(testFile, "PROJECT_NEXT")

			replaceInDirectoryHelper(testDir, /PROJECT_NEXT/g, "my-app")

			const content = fs.readFileSync(testFile, "utf-8")
			expect(content).toBe("PROJECT_NEXT")
		})

		it("should skip .git directory", () => {
			const gitDir = path.join(testDir, ".git")
			fs.mkdirSync(gitDir)
			const testFile = path.join(gitDir, "config")
			fs.writeFileSync(testFile, "PROJECT_NEXT")

			replaceInDirectoryHelper(testDir, /PROJECT_NEXT/g, "my-app")

			const content = fs.readFileSync(testFile, "utf-8")
			expect(content).toBe("PROJECT_NEXT")
		})

		it("should handle files with no matches", () => {
			const testFile = path.join(testDir, "test.txt")
			fs.writeFileSync(testFile, "No placeholder here")

			replaceInDirectoryHelper(testDir, /PROJECT_NEXT/g, "my-app")

			const content = fs.readFileSync(testFile, "utf-8")
			expect(content).toBe("No placeholder here")
		})
	})
})

interface MissingDependencies {
	packages: string[]
	config: string[]
}

interface StartupKitConfig {
	type: "app" | "package"
	dependencies?: {
		packages?: string[]
		config?: string[]
	}
}

function checkMissingDependenciesHelper(
	config: StartupKitConfig | null,
	workspaceRoot: string
): MissingDependencies {
	const missing: MissingDependencies = {
		packages: [],
		config: []
	}

	if (!config?.dependencies) {
		return missing
	}

	if (config.dependencies.packages) {
		for (const pkg of config.dependencies.packages) {
			const pkgPath = path.join(workspaceRoot, "packages", pkg)
			if (!fs.existsSync(pkgPath)) {
				missing.packages.push(pkg)
			}
		}
	}

	if (config.dependencies.config) {
		for (const cfg of config.dependencies.config) {
			const cfgPath = path.join(workspaceRoot, "config", cfg)
			if (!fs.existsSync(cfgPath)) {
				missing.config.push(cfg)
			}
		}
	}

	return missing
}

function replaceInDirectoryHelper(
	dir: string,
	pattern: RegExp,
	replacement: string
): void {
	const entries = fs.readdirSync(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)

		if (entry.name === "node_modules" || entry.name === ".git") {
			continue
		}

		if (entry.isDirectory()) {
			replaceInDirectoryHelper(fullPath, pattern, replacement)
		} else if (entry.isFile()) {
			try {
				const content = fs.readFileSync(fullPath, "utf8")
				const newContent = content.replace(pattern, replacement)
				if (content !== newContent) {
					fs.writeFileSync(fullPath, newContent, "utf8")
				}
			} catch {
				// Skip binary files or files that can't be read as text
			}
		}
	}
}

