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
        light: "github-light",
        dark: "github-dark"
      },
      transformers: [
        ...rehypeCodeDefaultOptions.transformers ?? [],
        transformerTwoslash({
          typesCache: createFileSystemTypesCache(),
          twoslashOptions: {
            compilerOptions: {
              moduleResolution: 100,
              module: 99,
              target: 9,
              strict: true,
              esModuleInterop: true,
              skipLibCheck: true,
              jsx: 4
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
