#!/usr/bin/env node

/**
 * Link/Unlink Local Packages Script
 *
 * This script toggles between using local file: links and npm versions
 * for @startupkit/* packages in the template repo.
 *
 * Packages are automatically discovered by scanning the packages/ directory
 * for any package.json files with names starting with "@startupkit/".
 *
 * Usage:
 *   pnpm link:local              - Link template repo packages
 *   pnpm unlink:local            - Unlink template repo packages
 *   node scripts/link-local.js link <target-dir> <packages-dir>
 *
 * Examples:
 *   Development: pnpm link:local && cd templates/repo && pnpm install
 *   Publishing:  pnpm unlink:local
 *   CI: node scripts/link-local.js link test-projects/test-startup $GITHUB_WORKSPACE/packages
 */

import { glob } from "glob"
import { readFileSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"

const command = process.argv[2]
const targetDir = process.argv[3] || "templates/repo"
const packagesDir = process.argv[4]

async function getStartupKitPackages(packagesPath) {
	const sourcePath = packagesPath || "packages"
	const packageJsonFiles = await glob(`${sourcePath}/*/package.json`, {
		ignore: ["**/node_modules/**", "**/dist/**"]
	})

	const packages = []
	for (const file of packageJsonFiles) {
		const content = readFileSync(file, "utf8")
		const pkg = JSON.parse(content)
		if (pkg.name?.startsWith("@startupkit/")) {
			packages.push(pkg.name)
		}
	}

	return packages
}

if (!command || !["link", "unlink"].includes(command)) {
	console.error(
		"Usage: node scripts/link-local.js [link|unlink] [target-dir] [packages-dir]"
	)
	console.error("")
	console.error("Commands:")
	console.error("  link    Convert npm versions to local file: links")
	console.error("  unlink  Convert file: links to npm versions")
	console.error("")
	console.error("Arguments:")
	console.error(
		"  target-dir     Directory to process (default: templates/repo)"
	)
	console.error(
		"  packages-dir   Path to packages directory (optional, for CI)"
	)
	process.exit(1)
}

async function main() {
	const packagesToLink = await getStartupKitPackages(packagesDir)

	if (packagesToLink.length === 0) {
		console.log("⚠️  No @startupkit/* packages found")
		return
	}

	console.log(
		`🔗 ${command === "link" ? "Linking" : "Unlinking"} ${packagesToLink.length} @startupkit/* package(s): ${packagesToLink.join(", ")}`
	)

	const packageJsonFiles = await glob(`${targetDir}/**/package.json`, {
		ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"]
	})

	let changedCount = 0

	for (const file of packageJsonFiles) {
		const content = readFileSync(file, "utf8")
		const pkg = JSON.parse(content)
		let changed = false

		if (pkg.dependencies) {
			for (const pkgName of packagesToLink) {
				if (pkg.dependencies[pkgName]) {
					const currentValue = pkg.dependencies[pkgName]

					if (command === "link") {
						// Convert version to file: link
						if (!currentValue.startsWith("file:")) {
							const targetPackage = pkgName.replace("@startupkit/", "")

							let relativePackagePath
							if (packagesDir) {
								// Use custom packages directory (for CI)
								const fileDir = resolve(file, "..")
								const absolutePackagesPath = resolve(packagesDir, targetPackage)
								relativePackagePath = relative(fileDir, absolutePackagesPath)
							} else {
								// Calculate from file depth (for local development)
								const depth = file.split("/").length - 1
								const relativeRoot = "../".repeat(depth)
								relativePackagePath = `${relativeRoot}packages/${targetPackage}`
							}

							pkg.dependencies[pkgName] = `file:${relativePackagePath}`
							changed = true
							console.log(`✅ ${file}: ${pkgName} → local link`)
						}
					} else if (command === "unlink") {
						// Convert file: link to version
						if (currentValue.startsWith("file:")) {
							const targetPackage = pkgName.replace("@startupkit/", "")
							const rootPkgPath = packagesDir
								? join(packagesDir, targetPackage, "package.json")
								: join("packages", targetPackage, "package.json")

							const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8"))
							pkg.dependencies[pkgName] = rootPkg.version
							changed = true
							console.log(`✅ ${file}: ${pkgName} → v${rootPkg.version}`)
						}
					}
				}
			}
		}

		if (changed) {
			writeFileSync(file, `${JSON.stringify(pkg, null, "\t")}\n`)
			changedCount++
		}
	}

	if (changedCount > 0) {
		console.log(`\n🎉 Updated ${changedCount} package.json file(s)`)
		if (command === "link") {
			console.log(
				'\n⚠️  Run "pnpm install" in templates/repo to update node_modules'
			)
		} else {
			console.log("\n⚠️  Remember to update lockfile before committing")
		}
	} else {
		console.log("\n✨ No changes needed")
	}
}

main().catch((err) => {
	console.error("❌ Error:", err)
	process.exit(1)
})
