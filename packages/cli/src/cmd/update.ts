import fs from "fs"
import path from "path"
import { exec } from "../lib/system"

export async function update() {
	console.log("Updating startupkit packages...")

	const baseDir = process.env.SK_DIR ?? process.cwd()
	const pkg = path.resolve(baseDir, "package.json")

	const data = fs.readFileSync(pkg, { encoding: "utf8", flag: "r" })

	// Parse the package.json content
	const packageJson = JSON.parse(data)

	// Function to find packages that match the @startupkit/* pattern
	const findOrgPackages = (deps) => {
		return Object.keys(deps).filter(
			(dep) => dep.startsWith("startupkit") || dep.startsWith("@startupkit/")
		)
	}

	// Get matching dependencies and devDependencies
	const dependencies = findOrgPackages(packageJson.dependencies || {})
	const devDependencies = findOrgPackages(packageJson.devDependencies || {})

	// Combine all matching packages
	const allPackages = [...dependencies, ...devDependencies]

	if (allPackages.length === 0) {
		console.log("No packages found that start with @startupkit/")
		return
	}

	// Generate the pnpm add command with the latest versions
	const updateCommand = `pnpm up ${allPackages.map((pkg) => `${pkg}@latest`).join(" ")}`

	await exec(updateCommand, {
		stdio: "inherit"
	})
}
