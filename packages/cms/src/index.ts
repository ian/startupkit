export { startupkitCMS } from "./plugin";
export { CMSProvider } from "./provider";
export * from "./utils";

export type CMSQuestionOptions = true | false;

export const questions = [
  {
    type: "confirm",
    name: "cms",
    message: "Would you like to install a CMS (for blog, etc)",
    // choices: [{ name: "Built-in", value: "builtin" }],
  },
];
