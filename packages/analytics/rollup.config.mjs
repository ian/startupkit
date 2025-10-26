import esbuild from "rollup-plugin-esbuild";
import preserveDirectives from "rollup-preserve-directives";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist/esm",
    format: "esm",
  },
  external: [
    "react",
    "react/jsx-runtime",
    "next/navigation",
    "posthog-js/react",
  ],
  plugins: [
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: true,
      minify: process.env.NODE_ENV === "production",
      target: "esnext",
      jsx: "transform",
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
      tsconfig: "tsconfig.json",
      loaders: {
        ".json": "json",
      },
    }),
    preserveDirectives(),
  ],
};

