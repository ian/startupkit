import type {
  Initializer,
  InitializerOptions,
  InitializerQuestion,
} from "@startupkit/utils";

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

// init() does the following:
// 1. adds the AnalyticsProvider + pluigins
// 2. adds AnalyticsProvider to the provider stack
// 3. adds @startupkit/analytics to the project

const init = async (analytics: Answers, opts: InitializerOptions) => {
  console.log("Installing Analytics", analytics);
};

export default {
  questions,
  init,
} satisfies Initializer;
