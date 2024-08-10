import fs from "fs";
import path from "path";
import {
  InitializerActions,
  writeFile,
  type Initializer,
  type InitializerOptions,
  type InitializerQuestion,
} from "@startupkit/utils";

const questions: InitializerQuestion[] = [
  {
    type: "confirm",
    name: "cms",
    message: "Would you like to install a CMS (for blog, etc)",
    // choices: [{ name: "Built-in", value: "builtin" }],
  },
];

type Answer = true | false;

// init() does the following:
// 1. adds pages/blog/index.tsx
// 2. adds pages/blog/sample-page.mdx
// 3. adds @startupkit/analytics to the project

const init = async (answers: Answer, opts: InitializerOptions) => {
  const { cwd } = opts;

  await fs.mkdirSync(path.join(cwd, "src/pages/blog"), { recursive: true });

  await writeFile(
    path.join(cwd, "src/blog/index.tsx"),
    fs.readFileSync(path.join(__dirname, "../templates/index.tsx"), "utf8")
  );
  await writeFile(
    path.join(cwd, "src/blog/sample-page.mdx"),
    fs.readFileSync(
      path.join(__dirname, "../templates/sample-page.mdx"),
      "utf8"
    )
  );

  return {
    packages: ["@startupkit/cms"],
  } satisfies InitializerActions;
};

export default {
  questions,
  init,
} satisfies Initializer;
