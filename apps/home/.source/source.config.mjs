// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
import { createFileSystemTypesCache } from "fumadocs-twoslash/cache-fs";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
var { docs, meta } = defineDocs({
  dir: "content/docs"
});
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var homeDir = __dirname.includes(".source") ? path.resolve(__dirname, "..") : __dirname;
var twoslashTypes = fs.readFileSync(
  path.resolve(homeDir, "twoslash.d.ts"),
  "utf-8"
);
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-dark",
        dark: "github-dark"
      },
      transformers: [
        ...rehypeCodeDefaultOptions.transformers ?? [],
        transformerTwoslash({
          typesCache: createFileSystemTypesCache(),
          twoslashOptions: {
            compilerOptions: {
              moduleResolution: 100,
              // bundler
              module: 99,
              // esnext
              target: 9,
              // es2022
              strict: true,
              esModuleInterop: true,
              skipLibCheck: true,
              jsx: 4
              // react-jsx
            },
            extraFiles: {
              "startupkit.d.ts": twoslashTypes
            }
          }
        })
      ]
    }
  }
});
export {
  source_config_default as default,
  docs,
  meta
};
