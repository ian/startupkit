import inquirer from "inquirer";
import { spinner } from "../lib/spinner";
import { exec, readFile, writeFile } from "../lib/system";
import path from "path";
import fs from "fs";
import degit from "degit";

type Answers = {
  name: string;
  customizeKey: boolean;
  key?: string;
} & Record<string, any>;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function init() {
  opener();

  // Step 1: Ask for project name
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of your project?",
      validate: (input: string) => input ? true : "Project name is required",
    },
  ]);

  const slug = slugify(name);

  // Step 2: Ask if user wants to customize project key
  const { customizeKey } = await inquirer.prompt([
    {
      type: "confirm",
      name: "customizeKey",
      message: `Customize project key (${slug})?`,
      default: false,
    },
  ]);

  let key = slug;
  if (customizeKey) {
    const keyAnswer = await inquirer.prompt({
      type: "input",
      name: "key",
      message: "Enter your project key:",
      default: slug,
      filter: (input: string) => slugify(input),
      transformer: (input: string) => slugify(input),
    });
    key = slugify(keyAnswer.key);
  }

  // Show the collected attributes
  const attrs = { name, customizeKey, key };
  console.log("\nCollected attributes:", attrs);

  // --- USE DEGit TO CLONE ONLY THE SUBDIRECTORY ---
  // const repoSubdir = "ian/startupkit/templates/repo";
  const repoSubdir = "ian/startupkit/templates/repo#startup-156-template-generation";
  const destDir = path.resolve(process.cwd(), key);

  await spinner(`Cloning template into ${destDir}`, async () => {
    const emitter = degit(repoSubdir, { cache: false, force: true, verbose: false });
    await emitter.clone(destDir);
  });

  console.log(`\nProject initialized at: ${destDir}`);
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
  Your startup kit for building, growing, and scaling your startup.
`);
}
