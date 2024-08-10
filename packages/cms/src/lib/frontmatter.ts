import { format } from "date-fns"; // Add this import
import matter from "gray-matter";
import { extractRoute } from "./helpers";

export const frontmatter = () => (tree: any, file: any) => {
  const { data } = matter(file.value);
  const route = extractRoute(file.path);

  // Remove frontmatter from the content
  if (tree.children[0].type === "thematicBreak") {
    const firstHeadingIndex = tree.children.findIndex(
      (t: any) => t.type === "heading"
    );
    if (firstHeadingIndex !== -1) {
      tree.children.splice(0, firstHeadingIndex + 1);
    }
  }

  // Add import statement
  tree.children.unshift({
    type: "mdxjsEsm",
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            source: {
              type: "Literal",
              value: "next/head",
            },
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: {
                  type: "Identifier",
                  name: "Head",
                },
              },
            ],
          },
        ],
        sourceType: "module",
      },
    },
  });

  // SEO head tags
  const headChildren = [
    data.title && {
      type: "mdxJsxFlowElement",
      name: "title",
      children: [{ type: "text", value: data.title }],
    },
    data.description && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "name", value: "description" },
        { type: "mdxJsxAttribute", name: "content", value: data.description },
      ],
    },
    data.author && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "name", value: "author" },
        { type: "mdxJsxAttribute", name: "content", value: data.author },
      ],
    },
    data.date && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "name", value: "date" },
        {
          type: "mdxJsxAttribute",
          name: "content",
          value: format(data.date, "yyyy-MM-dd"),
        },
      ],
    },
    data.lastUpdated && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "name", value: "lastUpdated" },
        {
          type: "mdxJsxAttribute",
          name: "content",
          value: format(data.date, "yyyy-MM-dd"),
        },
      ],
    },
    (data.url || route) && {
      type: "mdxJsxFlowElement",
      name: "link",
      attributes: [
        { type: "mdxJsxAttribute", name: "rel", value: "canonical" },
        { type: "mdxJsxAttribute", name: "href", value: data.url || route },
      ],
    },
    data.keywords && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "name", value: "keywords" },
        { type: "mdxJsxAttribute", name: "content", value: data.keywords },
      ],
    },
    data.ogImage && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "property", value: "og:image" },
        { type: "mdxJsxAttribute", name: "content", value: data.ogImage },
      ],
    },
    data.ogType && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "property", value: "og:type" },
        { type: "mdxJsxAttribute", name: "content", value: data.ogType },
      ],
    },
    (data.ogUrl || data.url || route) && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "property", value: "og:url" },
        {
          type: "mdxJsxAttribute",
          name: "content",
          value: data.ogUrl || data.url || route,
        },
      ],
    },
    {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "property", value: "og:title" },
        { type: "mdxJsxAttribute", name: "content", value: data.title },
      ],
    },
    data.description && {
      type: "mdxJsxFlowElement",
      name: "meta",
      attributes: [
        { type: "mdxJsxAttribute", name: "property", value: "og:description" },
        { type: "mdxJsxAttribute", name: "content", value: data.description },
      ],
    },
  ].filter(Boolean);

  tree.children = [
    {
      type: "mdxJsxFlowElement",
      name: null, // This creates a fragment <>...</>
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "Head",
          children: headChildren,
        },
        // Original content goes here
        ...tree.children,
      ],
    },
  ];

  // Add frontMatter export
  tree.children.push({
    type: "mdxjsEsm",
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ExportNamedDeclaration",
            declaration: {
              type: "VariableDeclaration",
              kind: "const",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: {
                    type: "Identifier",
                    name: "metadata",
                  },
                  init: {
                    type: "ObjectExpression",
                    properties: Object.entries(data).map(([key, value]) => ({
                      type: "Property",
                      key: { type: "Identifier", name: key },
                      value: { type: "Literal", value: value },
                      kind: "init",
                    })),
                  },
                },
              ],
            },
            specifiers: [],
            source: null,
          },
        ],
        sourceType: "module",
      },
    },
  });
};
