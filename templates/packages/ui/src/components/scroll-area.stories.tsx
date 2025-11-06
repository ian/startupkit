import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag} className="text-sm">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

const horizontalItems = Array.from({ length: 15 }).map((_, i) => ({
  id: `horizontal-item-${i + 1000}`, // Using a base offset to create stable IDs
  label: `Item ${i + 1}`,
}));

export const HorizontalScrolling: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border">
      <div className="flex p-4">
        {horizontalItems.map((item) => (
          <div
            key={item.id}
            className="mr-4 flex h-32 w-32 shrink-0 items-center justify-center rounded-md border"
          >
            {item.label}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const LongContent: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[400px] rounded-md border p-4">
      <div>
        <h4 className="mb-4 text-lg font-medium">Lorem Ipsum</h4>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis
          aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
        <p className="mb-4">
          Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc,
          quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
        <p className="mb-4">
          Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc,
          quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
        <p className="mb-4">
          Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc,
          quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
        <p className="mb-4">
          Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc,
          quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
      </div>
    </ScrollArea>
  ),
};
