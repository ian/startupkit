// @ts-nocheck
import { default as __fd_glob_34 } from "../content/docs/getting-started/guides/meta.json?collection=meta"
import { default as __fd_glob_33 } from "../content/docs/seo/meta.json?collection=meta"
import { default as __fd_glob_32 } from "../content/docs/getting-started/meta.json?collection=meta"
import { default as __fd_glob_31 } from "../content/docs/cli/meta.json?collection=meta"
import { default as __fd_glob_30 } from "../content/docs/auth/meta.json?collection=meta"
import { default as __fd_glob_29 } from "../content/docs/analytics/meta.json?collection=meta"
import { default as __fd_glob_28 } from "../content/docs/meta.json?collection=meta"
import * as __fd_glob_27 from "../content/docs/getting-started/guides/project-structure.mdx?collection=docs"
import * as __fd_glob_26 from "../content/docs/getting-started/guides/environment-variables.mdx?collection=docs"
import * as __fd_glob_25 from "../content/docs/getting-started/guides/deployment.mdx?collection=docs"
import * as __fd_glob_24 from "../content/docs/seo/structured-data.mdx?collection=docs"
import * as __fd_glob_23 from "../content/docs/seo/sitemap.mdx?collection=docs"
import * as __fd_glob_22 from "../content/docs/seo/robots.mdx?collection=docs"
import * as __fd_glob_21 from "../content/docs/seo/metadata.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/seo/index.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/auth/session-management.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/auth/protecting-routes.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/auth/index.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/auth/hooks-reference.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/auth/google-oauth.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/auth/email-otp.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/getting-started/what-is.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/getting-started/quickstart.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/getting-started/installation.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/getting-started/comparisons.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/cli/upgrade.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/cli/troubleshooting.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/cli/init.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/cli/index.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/cli/add.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/analytics/tracking-events.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/analytics/index.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/analytics/identifying-users.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/analytics/feature-flags.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/index.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "content/docs", {"index.mdx": __fd_glob_0, "analytics/feature-flags.mdx": __fd_glob_1, "analytics/identifying-users.mdx": __fd_glob_2, "analytics/index.mdx": __fd_glob_3, "analytics/tracking-events.mdx": __fd_glob_4, "cli/add.mdx": __fd_glob_5, "cli/index.mdx": __fd_glob_6, "cli/init.mdx": __fd_glob_7, "cli/troubleshooting.mdx": __fd_glob_8, "cli/upgrade.mdx": __fd_glob_9, "getting-started/comparisons.mdx": __fd_glob_10, "getting-started/installation.mdx": __fd_glob_11, "getting-started/quickstart.mdx": __fd_glob_12, "getting-started/what-is.mdx": __fd_glob_13, "auth/email-otp.mdx": __fd_glob_14, "auth/google-oauth.mdx": __fd_glob_15, "auth/hooks-reference.mdx": __fd_glob_16, "auth/index.mdx": __fd_glob_17, "auth/protecting-routes.mdx": __fd_glob_18, "auth/session-management.mdx": __fd_glob_19, "seo/index.mdx": __fd_glob_20, "seo/metadata.mdx": __fd_glob_21, "seo/robots.mdx": __fd_glob_22, "seo/sitemap.mdx": __fd_glob_23, "seo/structured-data.mdx": __fd_glob_24, "getting-started/guides/deployment.mdx": __fd_glob_25, "getting-started/guides/environment-variables.mdx": __fd_glob_26, "getting-started/guides/project-structure.mdx": __fd_glob_27, });

export const meta = await create.meta("meta", "content/docs", {"meta.json": __fd_glob_28, "analytics/meta.json": __fd_glob_29, "auth/meta.json": __fd_glob_30, "cli/meta.json": __fd_glob_31, "getting-started/meta.json": __fd_glob_32, "seo/meta.json": __fd_glob_33, "getting-started/guides/meta.json": __fd_glob_34, });