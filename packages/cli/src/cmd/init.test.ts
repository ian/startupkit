import { describe, expect, it } from "vitest"
import {
	buildDegitSources,
	generateEnvContent,
	mergeEnvContent,
	parseEnvKeys,
	resolveDestDir,
	slugify
} from "./init"

describe("init command - unit tests", () => {
	describe("slugify function", () => {
		it("should convert spaces to dashes", () => {
			expect(slugify("My Project Name")).toBe("my-project-name")
		})

		it("should convert underscores to dashes", () => {
			expect(slugify("my_project_name")).toBe("my-project-name")
		})

		it("should remove special characters", () => {
			expect(slugify("My Project!@#$%")).toBe("my-project")
		})

		it("should lowercase everything", () => {
			expect(slugify("UPPERCASE")).toBe("uppercase")
		})

		it("should handle consecutive dashes", () => {
			expect(slugify("my---project")).toBe("my-project")
		})

		it("should trim leading/trailing dashes", () => {
			expect(slugify("-my-project-")).toBe("my-project")
		})

		it("should handle numbers", () => {
			expect(slugify("project-123")).toBe("project-123")
		})
	})

	describe("buildDegitSources", () => {
		it("should resolve degit sources correctly without branch", () => {
			const result = buildDegitSources("ian/startupkit")

			expect(result.repoSource).toBe("ian/startupkit/templates/repo")
			expect(result.packagesSource).toBe("ian/startupkit/templates/packages")
			expect(result.storybookSource).toBe(
				"ian/startupkit/templates/apps/storybook"
			)
		})

		it("should handle branch names in degit sources", () => {
			const result = buildDegitSources("ian/startupkit#develop")

			expect(result.repoSource).toBe("ian/startupkit/templates/repo#develop")
			expect(result.packagesSource).toBe(
				"ian/startupkit/templates/packages#develop"
			)
			expect(result.storybookSource).toBe(
				"ian/startupkit/templates/apps/storybook#develop"
			)
		})

		it("should handle different repository paths", () => {
			const result = buildDegitSources("user/repo#main")

			expect(result.repoSource).toBe("user/repo/templates/repo#main")
			expect(result.packagesSource).toBe("user/repo/templates/packages#main")
			expect(result.storybookSource).toBe(
				"user/repo/templates/apps/storybook#main"
			)
		})
	})

	describe("resolveDestDir", () => {
		const cwd = "/home/user/projects"

		it("should use --dir flag when provided", () => {
			const result = resolveDestDir({
				dir: ".",
				key: "my-project",
				cwd
			})
			expect(result).toBe("/home/user/projects")
		})

		it("should use --dir flag with relative path", () => {
			const result = resolveDestDir({
				dir: "./existing-app",
				key: "my-project",
				cwd
			})
			expect(result).toBe("/home/user/projects/existing-app")
		})

		it("should use --dir flag with absolute path", () => {
			const result = resolveDestDir({
				dir: "/tmp/my-app",
				key: "my-project",
				cwd
			})
			expect(result).toBe("/tmp/my-app")
		})

		it("should use prompted directory when provided", () => {
			const result = resolveDestDir({
				key: "my-project",
				cwd,
				promptedDirectory: "."
			})
			expect(result).toBe("/home/user/projects")
		})

		it("should use prompted directory with custom path", () => {
			const result = resolveDestDir({
				key: "my-project",
				cwd,
				promptedDirectory: "./custom-dir"
			})
			expect(result).toBe("/home/user/projects/custom-dir")
		})

		it("should default to key as directory name when no dir or prompt", () => {
			const result = resolveDestDir({
				key: "my-project",
				cwd
			})
			expect(result).toBe("/home/user/projects/my-project")
		})

		it("should prioritize --dir over prompted directory", () => {
			const result = resolveDestDir({
				dir: "/explicit/path",
				key: "my-project",
				cwd,
				promptedDirectory: "./prompted-path"
			})
			expect(result).toBe("/explicit/path")
		})

		it("should handle empty string prompted directory as current dir", () => {
			const result = resolveDestDir({
				key: "my-project",
				cwd,
				promptedDirectory: ""
			})
			expect(result).toBe("/home/user/projects")
		})
	})

	describe("parseEnvKeys", () => {
		it("should parse simple env keys", () => {
			const content = "FOO=bar\nBAZ=qux"
			const keys = parseEnvKeys(content)
			expect(keys).toEqual(new Set(["FOO", "BAZ"]))
		})

		it("should ignore comments", () => {
			const content = "# This is a comment\nFOO=bar\n# Another comment"
			const keys = parseEnvKeys(content)
			expect(keys).toEqual(new Set(["FOO"]))
		})

		it("should ignore empty lines", () => {
			const content = "FOO=bar\n\nBAZ=qux\n"
			const keys = parseEnvKeys(content)
			expect(keys).toEqual(new Set(["FOO", "BAZ"]))
		})

		it("should handle values with equals signs", () => {
			const content = 'DATABASE_URL="postgres://user:pass=123@localhost"'
			const keys = parseEnvKeys(content)
			expect(keys).toEqual(new Set(["DATABASE_URL"]))
		})

		it("should trim whitespace from keys", () => {
			const content = "  FOO  =bar"
			const keys = parseEnvKeys(content)
			expect(keys).toEqual(new Set(["FOO"]))
		})
	})

	describe("generateEnvContent", () => {
		it("should generate env content with header", () => {
			const requiredEnv = { FOO: "bar", BAZ: "qux" }
			const content = generateEnvContent(requiredEnv)
			expect(content).toBe("# Generated by StartupKit\nFOO=bar\nBAZ=qux\n")
		})

		it("should handle single entry", () => {
			const requiredEnv = { AUTH_SECRET: "secret123" }
			const content = generateEnvContent(requiredEnv)
			expect(content).toBe("# Generated by StartupKit\nAUTH_SECRET=secret123\n")
		})
	})

	describe("mergeEnvContent", () => {
		it("should add missing keys to existing content", () => {
			const existingContent = "EXISTING=value"
			const requiredEnv = { EXISTING: "ignored", NEW_KEY: "new_value" }
			const { content, addedKeys } = mergeEnvContent(
				existingContent,
				requiredEnv
			)
			expect(content).toBe("EXISTING=value\nNEW_KEY=new_value\n")
			expect(addedKeys).toEqual(["NEW_KEY"])
		})

		it("should not modify content when all keys exist", () => {
			const existingContent = "FOO=bar\nBAZ=qux"
			const requiredEnv = { FOO: "different", BAZ: "also_different" }
			const { content, addedKeys } = mergeEnvContent(
				existingContent,
				requiredEnv
			)
			expect(content).toBe("FOO=bar\nBAZ=qux")
			expect(addedKeys).toEqual([])
		})

		it("should add multiple missing keys", () => {
			const existingContent = "EXISTING=value"
			const requiredEnv = { KEY1: "val1", KEY2: "val2" }
			const { content, addedKeys } = mergeEnvContent(
				existingContent,
				requiredEnv
			)
			expect(content).toBe("EXISTING=value\nKEY1=val1\nKEY2=val2\n")
			expect(addedKeys).toEqual(["KEY1", "KEY2"])
		})

		it("should handle content with trailing newline", () => {
			const existingContent = "EXISTING=value\n"
			const requiredEnv = { NEW_KEY: "new_value" }
			const { content, addedKeys } = mergeEnvContent(
				existingContent,
				requiredEnv
			)
			expect(content).toBe("EXISTING=value\nNEW_KEY=new_value\n")
			expect(addedKeys).toEqual(["NEW_KEY"])
		})

		it("should preserve comments in existing content", () => {
			const existingContent = "# My app config\nFOO=bar"
			const requiredEnv = { BAZ: "qux" }
			const { content, addedKeys } = mergeEnvContent(
				existingContent,
				requiredEnv
			)
			expect(content).toBe("# My app config\nFOO=bar\nBAZ=qux\n")
			expect(addedKeys).toEqual(["BAZ"])
		})
	})
})
