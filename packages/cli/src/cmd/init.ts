
import degit from "degit"
import inquirer from "inquirer"
import path from "node:path"
import { replaceInFile } from "replace-in-file"
import { exec } from "../lib/system"

type Answers = {
	name: string
	customizeKey: boolean
	key?: string
} & Record<string, any>

function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/_/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+|-+$/g, "")
}

export async function init(props: {
	name?: string
	repoArg?: string
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
		// Only prompt to customize key if name was prompted
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

	// Show the collected attributes
	const attrs = { name: projectName, key }

	// --- USE DEGit TO CLONE ONLY THE SUBDIRECTORY ---
	const repoBase = props.repoArg || "ian/startupkit/templates/repo"
	const destDir = path.resolve(process.cwd(), key)

	let degitSource: string

	if (repoBase.includes("#")) {
		const [userRepo, branch] = repoBase.split("#")
		// If the path already includes /templates/repo, don't add it again
		if (userRepo.includes("/templates/repo")) {
			degitSource = `${userRepo}#${branch}`
		} else {
			degitSource = `${userRepo}/templates/repo#${branch}`
		}
	} else {
		degitSource = repoBase
	}

	await spinner(`Cloning template into ${destDir}`, async () => {
		const emitter = degit(degitSource, {
			cache: false,
			force: true,
			verbose: false
		})
		await emitter.clone(destDir)
	})

	// Recursively replace all instances of PROJECT with slug in the cloned repo
	await replaceInFile({
		files: `${destDir}/**/*`,
		from: /PROJECT/g,
		to: slug,
		ignore: ["**/node_modules/**", "**/.git/**"],
		allowEmptyPaths: true
	})

	// Install dependencies
	await spinner(`Installing dependencies`, async () => {
		await exec("pnpm install", { cwd: destDir })
	})

	console.log(`\nProject initialized at: ${destDir}`)
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
  From zero to scale — the startup framework for your AI dev team.
`)
}
