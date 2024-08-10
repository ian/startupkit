export type AnalyticsQuestionOptions = (
  | "posthog"
  | "googleAnalytics"
  | "plausible"
)[];

export const questions = [
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

export const init = async (analytics: AnalyticsQuestionOptions) => {
  console.log("Installing Analytics", analytics);
};
