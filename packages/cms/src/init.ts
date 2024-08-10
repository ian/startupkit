export type CMSQuestionOptions = true | false;

export const questions = [
  {
    type: "confirm",
    name: "cms",
    message: "Would you like to install a CMS (for blog, etc)",
    // choices: [{ name: "Built-in", value: "builtin" }],
  },
];

export const init = async (cms: CMSQuestionOptions) => {
  console.log("Installing CMS", cms);
};
