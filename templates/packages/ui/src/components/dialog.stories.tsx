import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog content and purpose.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">This is the main content of the dialog.</div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Without Footer</DialogTitle>
          <DialogDescription>
            This dialog doesn't have a footer section.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">This is the main content of the dialog.</div>
      </DialogContent>
    </Dialog>
  ),
};

export const NonCloseable: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Non-Closeable Dialog</Button>
      </DialogTrigger>
      <DialogContent closeable={false}>
        <DialogHeader>
          <DialogTitle>Non-Closeable Dialog</DialogTitle>
          <DialogDescription>
            This dialog doesn't have a close button in the corner.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          You can only close this dialog by clicking outside or pressing Escape.
        </div>
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
