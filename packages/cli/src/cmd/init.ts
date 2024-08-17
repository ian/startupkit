import inquirer from "inquirer";

import { spinner } from "../lib/spinner";
import { exec, writeFile } from "../lib/system";

type Answers = {
  name: string;
} & Record<string, any>;

const questions: any[] = [
  {
    type: "input",
    name: "name",
    message: "What is the name of your startup?",
    validate: (input: string) => {
      return input ? true : "Name is required"; // Ensure valid input
    },
    filter: (input: string) =>
      input
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+|-+$/g, ""), // Remove starting and ending hyphens
  },
];

export async function init() {
  opener();

  const answers: Answers = await inquirer.prompt(questions);
  const baseDir = process.env.SK_DIR ?? process.cwd();
  const destPath = baseDir + "/" + answers.name;

  await spinner("Initializing Project", async () => {
    // @see https://nextjs.org/docs/pages/api-reference/create-next-app
    const example =
      process.env.EXAMPLE ?? "https://github.com/01-studio/startupkit";
    const examplePath = "template";
    const installCmd = `npx create-next-app@latest ${destPath} --use-pnpm --example ${example} --example-path "${examplePath}"`;

    await exec(installCmd, {
      stdio: "inherit",
    });

    await writeFile(
      `${destPath}/.env.local`,
      `
AUTH_SECRET=FAKE1234567890123456789012345678901234567890
DATABASE_URL="postgresql://localhost:5432/${answers.name}?schema=public"
# Analytics
GOOGLE_ANALYTICS_ID=
PLAUSIBLE_DOMAIN=
POSTHOG_TOKEN=
# Payments
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
# Auth
WORKOS_CLIENT_ID=
WORKOS_API_KEY=
WORKOS_REDIRECT_URI=`,
    );
  });

  await spinner("Adding StartupKit", async () => {
    await exec(`pnpm add @startupkit/analytics@latest @startupkit/cms@latest`, {
      stdio: "inherit",
      cwd: destPath,
    });
  });
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
