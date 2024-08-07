import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: (props) => {
      return (
        <div data-layout="static">
          <main {...props} />
        </div>
      );
    },
    ...components,
  };
}
