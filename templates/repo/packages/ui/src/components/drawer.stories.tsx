import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const meta: Meta<typeof Drawer> = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-center space-y-4">
            <p className="text-center text-sm">
              This is the main content area of the drawer.
              You can add form elements or any other content here.
            </p>
          </div>
        </div>
        <DrawerFooter>
          <Button>Save changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithDifferentSizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-8">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Small Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[30%]">
          <DrawerHeader>
            <DrawerTitle>Small Drawer</DrawerTitle>
            <DrawerDescription>This is a small drawer.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <p className="text-sm">Small drawer content.</p>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Medium Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[50%]">
          <DrawerHeader>
            <DrawerTitle>Medium Drawer</DrawerTitle>
            <DrawerDescription>This is a medium drawer.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <p className="text-sm">Medium drawer content.</p>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Large Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80%]">
          <DrawerHeader>
            <DrawerTitle>Large Drawer</DrawerTitle>
            <DrawerDescription>This is a large drawer.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <p className="text-sm">Large drawer content.</p>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  ),
};
