import inquirer from "inquirer";
import {
  questions as analyticsQuestions,
  init as initAnalytics,
  type AnalyticsQuestionOptions,
} from "@startupkit/analytics/init";
// import {
//   type CMSQuestionOptions,
//   questions as cmsQuestions,
// } from "@startupkit/cms";
import { spinner } from "../lib/spinner";
import { exec } from "../lib/run";

type Answers = {
  name: string;
  analytics: AnalyticsQuestionOptions;
  // cms: CMSQuestionOptions;
};

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
  ...analyticsQuestions,
  // ...cmsQuestions,
];

export async function init() {
  opener();

  const answers: Answers = await inquirer.prompt(questions);
  const example =
    "https://github.com/01-studio/startupkit#feat/cli-and-base-template";
  const examplePath = "template";
  const destPath = (process.env.SK_DIR ?? process.cwd()) + "/" + answers.name;
  // @see https://nextjs.org/docs/pages/api-reference/create-next-app
  const cmd = `npx create-next-app@latest ${destPath} --use-pnpm --example ${example} --example-path "${examplePath}"`;

  await initAnalytics(answers.analytics);

  process.exit();

  await spinner("Installing", async () => {
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
