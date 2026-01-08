import path from "node:path"
import degit from "degit"
import inquirer from "inquirer"
import { replaceInFile } from "replace-in-file"
import { spinner } from "../lib/spinner"
import { exec } from "../lib/system"

export function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/_/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+|-+$/g, "")
}

export interface ResolveDestDirOptions {
	dir?: string
	key: string
	cwd: string
	promptedDirectory?: string
}

export function resolveDestDir(options: ResolveDestDirOptions): string {
	const { dir, key, cwd, promptedDirectory } = options

	if (dir) {
		return path.resolve(cwd, dir)
	}

	if (promptedDirectory !== undefined) {
		return path.resolve(cwd, promptedDirectory)
	}

	return path.resolve(cwd, key)
}

export function buildDegitSources(repoBase: string): {
	repoSource: string
	packagesSource: string
} {
	if (repoBase.includes("#")) {
		const [userRepo, branch] = repoBase.split("#")
		const normalizedRepo = userRepo
			.replace(/\/templates\/repo$/, "")
			.replace(/\/templates\/packages$/, "")
		return {
			repoSource: `${normalizedRepo}/templates/repo#${branch}`,
			packagesSource: `${normalizedRepo}/templates/packages#${branch}`
		}
	}
	const normalizedRepo = repoBase
		.replace(/\/templates\/repo$/, "")
		.replace(/\/templates\/packages$/, "")
	return {
		repoSource: `${normalizedRepo}/templates/repo`,
		packagesSource: `${normalizedRepo}/templates/packages`
	}
}

export async function init(props: {
	name?: string
	repoArg?: string
	dir?: string
}) {
	opener()

	// Step 1: Use provided name or prompt for project name
	let projectName = props.name
	let promptedForName = false
	if (!projectName) {
		const answer = await inquirer.prompt([
			{
				type: "input",
				name: "name",
				message: "What is the name of your project?",
				validate: (input: string) => (input ? true : "Project name is required")
			}
		])
		projectName = answer.name
		promptedForName = true
	}

	const slug = slugify(projectName)

	let key = slug
	if (promptedForName) {
		const { customizeKey } = await inquirer.prompt([
			{
				type: "confirm",
				name: "customizeKey",
				message: `Customize project key (${slug})?`,
				default: false
			}
		])
		if (customizeKey) {
			const keyAnswer = await inquirer.prompt({
				type: "input",
				name: "key",
				message: "Enter your project key:",
				default: slug,
				filter: (input: string) => slugify(input),
				transformer: (input: string) => slugify(input)
			})
			key = slugify(keyAnswer.key)
		}
	}

	// Step 2: Determine destination directory
	let promptedDirectory: string | undefined
	if (!props.dir && promptedForName) {
		const { directory } = await inquirer.prompt([
			{
				type: "input",
				name: "directory",
				message: "Where should we create the project?",
				default: `./${key}`,
				filter: (input: string) => input.trim()
			}
		])
		promptedDirectory = directory
	}

	const cwd = process.cwd()
	const destDir = resolveDestDir({
		dir: props.dir,
		key,
		cwd,
		promptedDirectory
	})

	const isCurrentDir = destDir === cwd

	// --- USE DEGit TO CLONE THE REPO STRUCTURE AND PACKAGES ---
	const repoBase = props.repoArg || "ian/startupkit"
	const { repoSource, packagesSource } = buildDegitSources(repoBase)

	await spinner(`Cloning template into ${isCurrentDir ? "current directory" : destDir}`, async () => {
		const repoEmitter = degit(repoSource, {
			cache: false,
			force: true,
			verbose: false
		})
		await repoEmitter.clone(destDir)

		const packagesEmitter = degit(packagesSource, {
			cache: false,
			force: true,
			verbose: false
		})
		await packagesEmitter.clone(path.join(destDir, "packages"))
	})

	// Recursively replace all instances of PROJECT and PROJECT_VITE with slug
	await replaceInFile({
		files: `${destDir}/**/*`,
		from: [/PROJECT_VITE/g, /PROJECT/g],
		to: key,
		ignore: ["**/node_modules/**", "**/.git/**"],
		allowEmptyPaths: true
	})

	// Install dependencies
	await spinner(`Installing dependencies`, async () => {
		await exec("pnpm install --no-frozen-lockfile", { cwd: destDir })
	})

	console.log(`\nProject initialized at: ${isCurrentDir ? "." : destDir}`)
}

function opener() {
	// generated via https://ascii-generator.site
	console.log(`
                        ▓▒░░░▒▓         
                      ▓▒░░░░░░░▓        
                    ▓▒░░░▒▒░░░░         
                  ▓▒░░░▒▓▓░░░░          
                ▓▒▒▒▒▒▓ ▓░░░░           
              ▓▒▒▒▒▒   ▓░░░░            
            ▓▒▒▒▒▓    ▓░░░░             
          ▓▒▒▒▒▓      ░░░░              
         ▓▒▒▒▒▓     ▓░░░░▓              
          ▒▒▒▒▒▒▒▒▒▒░░░░▒▒▒▒▒▒▒▒▒▓      
            ▓▓▓▓▓▓▓░░░▒▓▓▓▓▓▓▓▒▒▒▒      
                 ▓░░░▒      ▓▒▒▒▒▓      
                 ░░░▒     ▒▒▒▒▒▓        
               ▓░░░▒    ▒▒▒▒▒▓          
              ▓░░░▒  ▓▒▒▒▒▒▓            
             ▓░░░▒ ▓▒░░░▒▓              
            ▓░░░▒▓▒░░░▒▓                
            ▒░░░░░░░▒▓                  
             ▒░░░░▒▓                    
               ▓▓                       
                                        

  StartupKit - ${process.env.VERSION}
  The Zero to One Startup Framework
`)
}
