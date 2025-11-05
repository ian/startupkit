import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: () => <Spinner className="h-6 w-6" />,
};

export const Small: Story = {
  render: () => <Spinner className="h-4 w-4" />,
};

export const Medium: Story = {
  render: () => <Spinner className="h-8 w-8" />,
};

export const Large: Story = {
  render: () => <Spinner className="h-12 w-12" />,
};

export const CustomColor: Story = {
  render: () => <Spinner className="h-8 w-8 text-blue-500" />,
};
