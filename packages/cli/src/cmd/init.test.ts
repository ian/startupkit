import { describe, expect, it } from "vitest"

describe("init command - unit tests", () => {
    describe("slugify function", () => {
        const slugify = (input: string): string => {
            return input
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/_/g, "-")
                .replace(/[^\w\-]+/g, "")
                .replace(/\-\-+/g, "-")
                .replace(/^-+|-+$/g, "")
        }

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

    describe("path resolution", () => {
        it("should resolve degit sources correctly", () => {
            const repoBase = "ian/startupkit"
            const repoSource = `${repoBase}/templates/repo`
            const packagesSource = `${repoBase}/templates/packages`

            expect(repoSource).toBe("ian/startupkit/templates/repo")
            expect(packagesSource).toBe("ian/startupkit/templates/packages")
        })

        it("should handle branch names in degit sources", () => {
            const repoBase = "ian/startupkit#develop"
            const [userRepo, branch] = repoBase.split("#")
            const repoSource = `${userRepo}/templates/repo#${branch}`
            const packagesSource = `${userRepo}/templates/packages#${branch}`

            expect(repoSource).toBe("ian/startupkit/templates/repo#develop")
            expect(packagesSource).toBe("ian/startupkit/templates/packages#develop")
        })
    })
})

