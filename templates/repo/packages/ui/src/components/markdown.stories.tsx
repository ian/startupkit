import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Markdown } from "./markdown";

const meta: Meta<typeof Markdown> = {
  title: "UI/Markdown",
  component: Markdown,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Markdown>;

const basicMarkdown = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

This is a paragraph with **bold text** and *italic text*.

- List item 1
- List item 2
- List item 3

1. Ordered item 1
2. Ordered item 2
3. Ordered item 3

[This is a link](https://example.com)

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

And this is \`inline code\`.
`;

const tableMarkdown = `
# Table Example

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
| Cell 7   | Cell 8   | Cell 9   |
`;

const complexMarkdown = `
# GitHub Flavored Markdown

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Strikethrough

~~This text is strikethrough~~

## Tables with Alignment

| Left-aligned | Center-aligned | Right-aligned |
| :----------- | :------------: | ------------: |
| Left         | Center         | Right         |
| Text         | Text           | Text          |

## Autolinks

Visit https://example.com

## Emoji

:smile: :heart: :thumbsup:
`;

export const Basic: Story = {
  args: {
    children: basicMarkdown,
  },
};

export const WithTable: Story = {
  args: {
    children: tableMarkdown,
  },
};

export const Complex: Story = {
  args: {
    children: complexMarkdown,
  },
};
