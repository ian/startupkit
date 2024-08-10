import inquirer from "inquirer"; // Updated to use ES module import
import { spinner } from "../lib/spinner";

type Answers = {
  analytics: Array<string>;
  authentication: string;
  payments: string;
  cms: string;
  newsletter: string;
};

export async function init() {
  opener();

  const answers: Answers = await inquirer.prompt(questions);
  console.log("Your selected features:");
  console.log(JSON.stringify(answers, null, 2));

  await spinner("Installing", async () => {
    await pause(3000);
  });
}

function opener() {
  // generated via https://ascii-generator.site
  console.log(`
  
  StartupKit - ${process.env.VERSION}
  Your startup kit for building, growing, and scaling your startup.

`);
}

const questions: any[] = [
  {
    type: "checkbox",
    name: "analytics",
    message: "Which analytics tools would you like to include?",
    choices: [
      { name: "Posthog", value: "posthog" },
      { name: "Google Analytics", value: "googleAnalytics" },
      { name: "Plausible", value: "plausible" },
    ] as const,
  },
  {
    type: "list",
    name: "authentication",
    message: "Which authentication service would you like to use? (Pick one)",

    choices: [
      { name: "NextAuth", value: "nextAuth" },
      { name: "WorkOS", value: "workOS" },
    ],
  },
  {
    type: "list",
    name: "payments",
    message: "Which payment service would you like to use? (Pick one)",
    choices: [{ name: "Stripe", value: "stripe" }],
  },
  {
    type: "list",
    name: "cms",
    message: "Which CMS would you like to use? (Pick one)",
    choices: [{ name: "Built-in", value: "builtin" }],
  },
  {
    type: "list",
    name: "newsletter",
    message: "Which newsletter service would you like to use? (Pick one)",
    choices: [
      { name: "ConvertKit", value: "convertKit" },
      { name: "Loops", value: "loops" },
    ],
  },
];

export function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
