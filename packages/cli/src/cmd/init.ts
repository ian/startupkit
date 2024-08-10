import inquirer from "inquirer";

import AnalyticsPlugin from "@startupkit/analytics/init";
import CMSPlugin from "@startupkit/cms/init";

import { spinner } from "../lib/spinner";
import { exec, InitializerActions } from "../../../utils/src";

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
  ...AnalyticsPlugin.questions,
  ...CMSPlugin.questions,
];

export async function init() {
  opener();

  const answers: Answers = await inquirer.prompt(questions);
  const destPath = (process.env.SK_DIR ?? process.cwd()) + "/" + answers.name;
  const actions: InitializerActions = [];

  const analytics = await AnalyticsPlugin.init(answers.analytics, {
    cwd: destPath,
  });
  const cms = await CMSPlugin.init(answers.cms, { cwd: destPath });

  process.exit();

  await spinner("Installing", async () => {
    // @see https://nextjs.org/docs/pages/api-reference/create-next-app
    const example =
      "https://github.com/01-studio/startupkit#feat/cli-and-base-template";
    const examplePath = "template";
    const cmd = `npx create-next-app@latest ${destPath} --use-pnpm --example ${example} --example-path "${examplePath}"`;
    await exec(cmd, {
      stdio: "inherit",
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

export function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
