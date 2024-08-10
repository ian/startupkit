import type { Initializer, InitializerQuestion } from "@startupkit/utils";

const questions: InitializerQuestion[] = [
  {
    type: "confirm",
    name: "cms",
    message: "Would you like to install a CMS (for blog, etc)",
    // choices: [{ name: "Built-in", value: "builtin" }],
  },
];

type Answer = true | false;

const init = async (cms: Answer) => {
  console.log("Installing CMS", cms);
};

export default {
  questions,
  init,
} satisfies Initializer;
