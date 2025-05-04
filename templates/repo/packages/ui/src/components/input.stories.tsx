import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Input } from "./input";
import { Search, Mail, Lock } from "lucide-react";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <Input placeholder="Enter text here" />,
};

export const WithLeftIcon: Story = {
  render: () => (
    <Input
      placeholder="Search..."
      leftIcon={<Search className="h-4 w-4" />}
    />
  ),
};

export const WithRightIcon: Story = {
  render: () => (
    <Input
      placeholder="Email"
      rightIcon={<Mail className="h-4 w-4" />}
    />
  ),
};

export const WithBothIcons: Story = {
  render: () => (
    <Input
      placeholder="Password"
      type="password"
      leftIcon={<Lock className="h-4 w-4" />}
      rightIcon={<div className="text-xs">Show</div>}
    />
  ),
};

export const WithPrefix: Story = {
  render: () => <Input placeholder="Amount" prefix="$" />,
};

export const Disabled: Story = {
  render: () => <Input placeholder="Disabled input" disabled />,
};

export const Invalid: Story = {
  render: () => (
    <Input
      placeholder="Invalid input"
      aria-invalid={true}
    />
  ),
};

export const WithType: Story = {
  render: () => (
    <div className="space-y-4">
      <Input placeholder="Text input" type="text" />
      <Input placeholder="Email input" type="email" />
      <Input placeholder="Password input" type="password" />
      <Input placeholder="Number input" type="number" />
      <Input placeholder="Date input" type="date" />
    </div>
  ),
};
