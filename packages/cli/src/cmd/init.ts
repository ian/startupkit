import inquirer from "inquirer";
import { spinner } from "../lib/spinner";
import { exec, readFile, writeFile } from "../lib/system";

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

  // --- Existing logic below (not run for this demo) ---
  // const stdio = process.env.DEBUG ? "inherit" : "ignore";

  // const baseDir = process.env.SK_DIR ?? process.cwd();
  // const destPath = baseDir + "/" + name;
  // const version = process.env.VERSION;

  // await spinner("Initializing Project", async () => {
  //   // @see https://nextjs.org/docs/pages/api-reference/create-next-app
  //   const example =
  //     process.env.EXAMPLE ?? "https://github.com/01-studio/startupkit";
  //   const examplePath = "template";
  //   const installCmd = `npx create-next-app ${destPath} --use-pnpm --skip-install --example ${example} --example-path "${examplePath}"`;

  //   await exec(installCmd, {
  //     stdio,
  //   });

  //   await writeFile(
  //     `${destPath}/.env.local`,
  //     `
  // DATABASE_URL="postgresql://postgres@localhost:5432/${name}?schema=public"

  // # Auth
  // AUTH_SECRET=FAKE1234567890123456789012345678901234567890
  // WORKOS_CLIENT_ID=
  // WORKOS_API_KEY=
  // # optional - defaults to /api/auth/callback
  // # WORKOS_REDIRECT_URI=

  // # Analytics
  // GOOGLE_ANALYTICS_ID=
  // PLAUSIBLE_DOMAIN=
  // POSTHOG_TOKEN=

  // # Payments
  // STRIPE_PUBLISHABLE_KEY=
  // STRIPE_SECRET_KEY=
  // STRIPE_WEBHOOK_SECRET=
  // `,
  //   );

  //   const pkg = JSON.parse(await readFile(`${destPath}/package.json`));

  //   pkg.name = name;

  //   pkg.dependencies = Object.fromEntries(
  //     Object.entries(pkg.dependencies).map(([key, value]) =>
  //       value === "workspace:*" ? [key, process.env.VERSION] : [key, value],
  //     ),
  //   );

  //   pkg.devDependencies = Object.fromEntries(
  //     Object.entries(pkg.devDependencies).map(([key, value]) =>
  //       value === "workspace:*" ? [key, process.env.VERSION] : [key, value],
  //     ),
  //   );

  //   await writeFile(`${destPath}/package.json`, JSON.stringify(pkg, null, 2));
  // });

  // await spinner("Installing StartupKit", async () => {
  //   await exec("pnpm install", {
  //     stdio,
  //     cwd: destPath,
  //   });
  // });

  // // await spinner("Adding StartupKit", async () => {
  // //   const packages = ["analytics", "auth", "cms", "payments"];
  // //   const installCmd = `pnpm add ${packages.map((p) => `@startupkit/${p}@${version}`).join(" ")}`;
  // //   await exec(installCmd, {
  // //     stdio,
  // //     cwd: destPath,
  // //   });
  // // });
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
