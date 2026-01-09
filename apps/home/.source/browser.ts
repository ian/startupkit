// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "guides/analytics-setup.mdx": () => import("../content/docs/guides/analytics-setup.mdx?collection=docs"), "guides/authentication.mdx": () => import("../content/docs/guides/authentication.mdx?collection=docs"), "guides/deployment.mdx": () => import("../content/docs/guides/deployment.mdx?collection=docs"), "getting-started/installation.mdx": () => import("../content/docs/getting-started/installation.mdx?collection=docs"), "getting-started/project-structure.mdx": () => import("../content/docs/getting-started/project-structure.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "packages/analytics.mdx": () => import("../content/docs/packages/analytics.mdx?collection=docs"), "packages/auth.mdx": () => import("../content/docs/packages/auth.mdx?collection=docs"), "packages/cli.mdx": () => import("../content/docs/packages/cli.mdx?collection=docs"), "packages/seo.mdx": () => import("../content/docs/packages/seo.mdx?collection=docs"), }),
};
export default browserCollections;