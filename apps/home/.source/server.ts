// @ts-nocheck
import { default as __fd_glob_14 } from "../content/docs/packages/meta.json?collection=meta"
import { default as __fd_glob_13 } from "../content/docs/guides/meta.json?collection=meta"
import { default as __fd_glob_12 } from "../content/docs/getting-started/meta.json?collection=meta"
import { default as __fd_glob_11 } from "../content/docs/meta.json?collection=meta"
import * as __fd_glob_10 from "../content/docs/packages/seo.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/packages/cli.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/packages/auth.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/packages/analytics.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/getting-started/quickstart.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/getting-started/project-structure.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/getting-started/installation.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/guides/deployment.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/guides/authentication.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/guides/analytics-setup.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/index.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "content/docs", {"index.mdx": __fd_glob_0, "guides/analytics-setup.mdx": __fd_glob_1, "guides/authentication.mdx": __fd_glob_2, "guides/deployment.mdx": __fd_glob_3, "getting-started/installation.mdx": __fd_glob_4, "getting-started/project-structure.mdx": __fd_glob_5, "getting-started/quickstart.mdx": __fd_glob_6, "packages/analytics.mdx": __fd_glob_7, "packages/auth.mdx": __fd_glob_8, "packages/cli.mdx": __fd_glob_9, "packages/seo.mdx": __fd_glob_10, });

export const meta = await create.meta("meta", "content/docs", {"meta.json": __fd_glob_11, "getting-started/meta.json": __fd_glob_12, "guides/meta.json": __fd_glob_13, "packages/meta.json": __fd_glob_14, });