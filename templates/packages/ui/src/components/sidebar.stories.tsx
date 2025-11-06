import type { Meta, StoryObj } from '@storybook/react';
import { Home, Mail, Plus, Search, Settings, Users } from 'lucide-react';
import { Button } from './button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from './sidebar';

const meta: Meta<typeof SidebarProvider> = {
  title: 'UI/Sidebar',
  component: SidebarProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SidebarProvider>;

export const Default: Story = {
  render: () => (
    <div className="h-[600px] w-full border rounded-lg overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <SidebarTrigger />
            </div>
            <SidebarInput
              placeholder="Search..."
              leftIcon={<Search className="h-4 w-4" />}
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <div className="flex items-center justify-between relative">
                <SidebarGroupLabel className="flex-grow">
                  Main Navigation
                </SidebarGroupLabel>
                <div className="relative right-0 top-0">
                  <SidebarGroupAction
                    asChild
                    className="!absolute !right-0 !top-0"
                  >
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </SidebarGroupAction>
                </div>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem active>
                    <SidebarMenuButton>
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Mail className="h-4 w-4 mr-2" />
                      Messages
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Recent Items</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Project Alpha</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Project Beta</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Project Gamma</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="outline" className="w-full">
              Log out
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-4 ml-[var(--sidebar-width)]">
          <h1 className="text-2xl font-bold">Main Content Area</h1>
          <p className="mt-2">This is where your main content would go.</p>
        </div>
      </SidebarProvider>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div className="h-[600px] w-full border rounded-lg overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem active>
                    <SidebarMenuButton>
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">Main Content Area</h1>
          <p className="mt-2">This is where your main content would go.</p>
        </div>
      </SidebarProvider>
    </div>
  ),
};

export const FloatingVariant: Story = {
  render: () => (
    <div className="h-[600px] w-full border rounded-lg overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <Sidebar variant="floating">
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem active>
                    <SidebarMenuButton>
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-4 ml-[var(--sidebar-width)]">
          <h1 className="text-2xl font-bold">Main Content Area</h1>
          <p className="mt-2">This is where your main content would go.</p>
        </div>
      </SidebarProvider>
    </div>
  ),
};
