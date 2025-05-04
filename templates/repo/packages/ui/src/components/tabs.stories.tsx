import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="p-4 rounded-md border mt-4">
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="p-4 rounded-md border mt-4">
          <h3 className="text-lg font-medium">Password</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4 rounded-md border mt-4">
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Configure your notification preferences and privacy settings.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="p-4 rounded-md border mt-4">
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The Settings tab is disabled in this example.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="p-4 rounded-md border mt-4">
          <h3 className="text-lg font-medium">Password</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Change your password here.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4 rounded-md border mt-4">
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This content won't be accessible due to the disabled tab.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
