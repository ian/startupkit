import { execSync } from "node:child_process"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
	STARTUP_SKILLS,
	addSkills,
	listInstalledSkills,
	listSkills,
	removeSkill
} from "./skills"

vi.mock("node:child_process")
vi.mock("@inquirer/prompts", () => ({
	checkbox: vi.fn(),
	input: vi.fn()
}))

describe("skills", () => {
	describe("STARTUP_SKILLS", () => {
		it("should have all expected categories", () => {
			expect(Object.keys(STARTUP_SKILLS)).toEqual([
				"product",
				"engineering",
				"design",
				"marketing",
				"growth"
			])
		})

		it("should have correct number of skills per category", () => {
			expect(STARTUP_SKILLS.product).toHaveLength(13)
			expect(STARTUP_SKILLS.engineering).toHaveLength(16)
			expect(STARTUP_SKILLS.design).toHaveLength(5)
			expect(STARTUP_SKILLS.marketing).toHaveLength(23)
			expect(STARTUP_SKILLS.growth).toHaveLength(2)
		})

		it("should have valid skill structure", () => {
			for (const [_category, skills] of Object.entries(STARTUP_SKILLS)) {
				for (const skill of skills) {
					expect(skill).toHaveProperty("name")
					expect(skill).toHaveProperty("repo")
					expect(skill).toHaveProperty("description")
					expect(typeof skill.name).toBe("string")
					expect(typeof skill.repo).toBe("string")
					expect(typeof skill.description).toBe("string")
				}
			}
		})

		it("should have unique skill names", () => {
			const allNames = Object.values(STARTUP_SKILLS)
				.flat()
				.map((s) => s.name)
			const uniqueNames = new Set(allNames)
			expect(allNames.length).toBe(uniqueNames.size)
		})
	})

	describe("listSkills", () => {
		it("should output skill categories", () => {
			const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
			listSkills()
			expect(consoleSpy).toHaveBeenCalledWith("\n📦 StartupKit Skills\n")
			expect(consoleSpy).toHaveBeenCalledWith("Available skill categories:\n")
			expect(consoleSpy).toHaveBeenCalledWith("  product (13 skills)")
		})
	})

	describe("addSkills", () => {
		beforeEach(() => {
			vi.mocked(execSync).mockImplementation(() => Buffer.from(""))
		})

		afterEach(() => {
			vi.clearAllMocks()
		})

		it("should install single skill by name", async () => {
			await addSkills({ skill: "brainstorming" })

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("obra/superpowers"),
				expect.any(Object)
			)
			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--skill brainstorming"),
				expect.any(Object)
			)
		})

		it("should install all skills with --all flag", async () => {
			await addSkills({ all: true })

			const calls = vi.mocked(execSync).mock.calls
			expect(calls.length).toBeGreaterThan(0)

			const allCommandStrings = calls.map((c) => c[0]).join(" ")
			expect(allCommandStrings).toContain("obra/superpowers")
			expect(allCommandStrings).toContain("vercel-labs/agent-skills")
			expect(allCommandStrings).toContain("coreyhaines31/marketingskills")
		})

		it("should install category skills with --category flag", async () => {
			await addSkills({ category: "engineering" })

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("vercel-labs/agent-skills"),
				expect.any(Object)
			)
			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("obra/superpowers"),
				expect.any(Object)
			)
		})

		it("should pass global flag when specified", async () => {
			await addSkills({ skill: "brainstorming", global: true })

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--global"),
				expect.any(Object)
			)
		})

		it("should not call execSync in dry-run mode", async () => {
			await addSkills({ skill: "brainstorming", dryRun: true })

			expect(execSync).not.toHaveBeenCalled()
		})

		it("should exit with error for unknown category", async () => {
			const processExitSpy = vi
				.spyOn(process, "exit")
				.mockImplementation(() => {
					throw new Error("process.exit")
				})
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {})

			await expect(addSkills({ category: "invalid-category" })).rejects.toThrow(
				"process.exit"
			)

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Unknown category: invalid-category"
			)
			expect(processExitSpy).toHaveBeenCalledWith(1)

			processExitSpy.mockRestore()
			consoleErrorSpy.mockRestore()
		})

		it("should exit with error for unknown skill", async () => {
			const processExitSpy = vi
				.spyOn(process, "exit")
				.mockImplementation(() => {
					throw new Error("process.exit")
				})
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {})

			await expect(addSkills({ skill: "unknown-skill" })).rejects.toThrow(
				"process.exit"
			)

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Unknown skill: unknown-skill"
			)
			expect(processExitSpy).toHaveBeenCalledWith(1)

			processExitSpy.mockRestore()
			consoleErrorSpy.mockRestore()
		})

		it("should use default agents when none specified", async () => {
			await addSkills({ skill: "brainstorming" })

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--agent opencode"),
				expect.any(Object)
			)
			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--agent claude-code"),
				expect.any(Object)
			)
		})

		it("should use custom agents when specified", async () => {
			await addSkills({
				skill: "brainstorming",
				agent: ["cursor", "cline"]
			})

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--agent cursor"),
				expect.any(Object)
			)
			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--agent cline"),
				expect.any(Object)
			)
		})
	})

	describe("listInstalledSkills", () => {
		it("should call npx skills list", async () => {
			vi.mocked(execSync).mockImplementation(() => Buffer.from(""))
			await listInstalledSkills(false)

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("npx skills list"),
				expect.any(Object)
			)
		})

		it("should pass global flag when specified", async () => {
			vi.mocked(execSync).mockImplementation(() => Buffer.from(""))
			await listInstalledSkills(true)

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--global"),
				expect.any(Object)
			)
		})
	})

	describe("removeSkill", () => {
		it("should call npx skills remove with skill name", async () => {
			vi.mocked(execSync).mockImplementation(() => Buffer.from(""))
			await removeSkill({ skill: "brainstorming" })

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("npx skills remove"),
				expect.any(Object)
			)
			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--skill brainstorming"),
				expect.any(Object)
			)
		})

		it("should pass global flag when specified", async () => {
			vi.mocked(execSync).mockImplementation(() => Buffer.from(""))
			await removeSkill({ skill: "brainstorming", global: true })

			expect(execSync).toHaveBeenCalledWith(
				expect.stringContaining("--global"),
				expect.any(Object)
			)
		})
	})
})
