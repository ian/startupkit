import { describe, expect, it } from "vitest"
import { buildDegitSources, slugify } from "./init"

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
})
