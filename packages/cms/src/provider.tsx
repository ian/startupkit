import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXComponents } from "@mdx-js/react/lib";

export function CMSProvider({
  children,
  layout: wrapper,
}: {
  children: React.ReactNode;
  layout: () => JSX.Element;
}) {
  const components = {
    wrapper: (props) => {
      return (
        <div style={{ padding: "20px", backgroundColor: "tomato" }}>
          <main {...props} />
        </div>
      );
    },
  } as MDXComponents;

  return <MDXProvider components={components}>{children}</MDXProvider>;
}
