import type { Initializer, InitializerQuestion } from "@startupkit/utils";

const questions: InitializerQuestion[] = [
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
];

type Answers = ("posthog" | "googleAnalytics" | "plausible")[];

const init = async (analytics: Answers) => {
  console.log("Installing Analytics", analytics);
};

export default {
  questions,
  init,
} satisfies Initializer;
