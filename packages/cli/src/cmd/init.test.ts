import { describe, expect, it } from "vitest"
import { buildDegitSources, resolveDestDir, slugify } from "./init"

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
		})

		it("should handle branch names in degit sources", () => {
			const result = buildDegitSources("ian/startupkit#develop")

			expect(result.repoSource).toBe("ian/startupkit/templates/repo#develop")
			expect(result.packagesSource).toBe(
				"ian/startupkit/templates/packages#develop"
			)
		})

		it("should handle different repository paths", () => {
			const result = buildDegitSources("user/repo#main")

			expect(result.repoSource).toBe("user/repo/templates/repo#main")
			expect(result.packagesSource).toBe("user/repo/templates/packages#main")
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
})
