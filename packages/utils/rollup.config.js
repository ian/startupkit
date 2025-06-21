import commonjs from "@rollup/plugin-commonjs";
import { swc } from "@rollup/plugin-swc";
import { preserveDirectives } from "rollup-preserve-directives";

const config = [
  {
    input: ["src/index.ts"],
    output: {
      dir: "dist/esm",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [
      commonjs(),
      swc({
        jsc: {
          target: "es2022",
        },
      }),
      preserveDirectives(),
    ],
  },
];

export default config;