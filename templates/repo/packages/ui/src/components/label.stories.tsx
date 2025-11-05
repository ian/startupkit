import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => <Label>Default Label</Label>,
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label
        htmlFor="username"
        className="after:content-['*'] after:ml-0.5 after:text-red-500"
      >
        Username
      </Label>
      <Input id="username" placeholder="Username" />
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="custom" className="text-blue-500 font-bold text-base">
        Custom Styled Label
      </Label>
      <Input id="custom" placeholder="Custom input" />
    </div>
  ),
};
