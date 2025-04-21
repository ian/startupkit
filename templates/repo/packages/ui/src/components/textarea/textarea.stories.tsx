import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => <Textarea placeholder="Type your message here." />,
};

export const WithValue: Story = {
  render: () => (
    <Textarea
      defaultValue="This is some default text that appears in the textarea when it loads."
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Textarea
      placeholder="This textarea is disabled."
      disabled
    />
  ),
};

export const WithRows: Story = {
  render: () => (
    <Textarea
      placeholder="This textarea has 10 rows."
      rows={10}
    />
  ),
};

export const WithMaxLength: Story = {
  render: () => (
    <div className="space-y-2">
      <Textarea
        placeholder="This textarea has a maximum length of 100 characters."
        maxLength={100}
      />
      <p className="text-xs text-muted-foreground">Maximum 100 characters</p>
    </div>
  ),
};
