import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"
import { after, describe, it } from "node:test"
import { exec } from "../lib/system"

describe("init command", () => {
    const testDir = path.join(process.cwd(), "test-project")

    after(async () => {
        if (fs.existsSync(testDir)) {
            await exec(`rm -rf ${testDir}`)
        }
    })

    it("should clone both repo structure and packages", async () => {
        // This test would run the actual init command
        // For now, we'll just verify the expected structure

        // Create a mock test directory
        fs.mkdirSync(testDir, { recursive: true })

        // Check that repo structure files exist
        const repoFiles = [
            "package.json",
            "pnpm-workspace.yaml",
            "turbo.json",
            "apps",
            "config"
        ]

        // Check that packages directory exists with expected packages
        const expectedPackages = ["ui", "auth", "db", "analytics", "utils", "emails"]

        // Verify repo structure
        for (const file of repoFiles) {
            const filePath = path.join(testDir, file)
            assert.ok(
                fs.existsSync(filePath),
                `Expected ${file} to exist in cloned repo`
            )
        }

        // Verify packages directory exists
        const packagesDir = path.join(testDir, "packages")
        assert.ok(
            fs.existsSync(packagesDir),
            "Expected packages directory to exist"
        )

        // Verify each package exists
        for (const pkg of expectedPackages) {
            const pkgPath = path.join(packagesDir, pkg)
            assert.ok(
                fs.existsSync(pkgPath),
                `Expected package ${pkg} to exist in packages/`
            )

            // Verify package has package.json
            const pkgJsonPath = path.join(pkgPath, "package.json")
            assert.ok(
                fs.existsSync(pkgJsonPath),
                `Expected ${pkg}/package.json to exist`
            )
        }
    })

    it("should verify packages have correct structure", async () => {
        const uiPackagePath = path.join(testDir, "packages", "ui")

        // Verify UI package has expected directories
        const expectedDirs = ["src", "src/components", "src/hooks", "src/providers"]

        for (const dir of expectedDirs) {
            const dirPath = path.join(uiPackagePath, dir)
            assert.ok(fs.existsSync(dirPath), `Expected ${dir} to exist in ui package`)
        }

        // Verify UI package exports
        const pkgJson = JSON.parse(
            fs.readFileSync(path.join(uiPackagePath, "package.json"), "utf-8")
        )
        assert.ok(pkgJson.exports, "Expected ui package to have exports field")
        assert.ok(
            pkgJson.exports["./components/*"],
            "Expected ui package to export components"
        )
        assert.ok(
            pkgJson.exports["./tailwind.config"],
            "Expected ui package to export tailwind.config"
        )
    })
})

