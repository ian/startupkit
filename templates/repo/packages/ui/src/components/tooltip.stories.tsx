import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "./button";
import { BetterTooltip, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover Me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const WithDifferentPositions: Story = {
  render: () => (
    <div className="flex items-center justify-center space-x-4 pt-16">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top</Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>This tooltip appears on top</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Bottom</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>This tooltip appears on bottom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>This tooltip appears on left</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>This tooltip appears on right</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};

export const UsingBetterTooltip: Story = {
  render: () => (
    <div className="flex items-center justify-center space-x-4">
      <BetterTooltip content="This is a simple string tooltip">
        <Button variant="outline">Simple Text</Button>
      </BetterTooltip>

      <BetterTooltip
        content={
          <div className="flex flex-col gap-2">
            <p className="font-bold">Rich Content</p>
            <p>You can add complex content here</p>
          </div>
        }
      >
        <Button variant="outline">Rich Content</Button>
      </BetterTooltip>

      <BetterTooltip content="Aligned to start" align="start">
        <Button variant="outline">Start Aligned</Button>
      </BetterTooltip>

      <BetterTooltip content="Aligned to end" align="end">
        <Button variant="outline">End Aligned</Button>
      </BetterTooltip>
    </div>
  ),
};
