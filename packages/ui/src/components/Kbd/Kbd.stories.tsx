import type { Meta, StoryObj } from '@storybook/react';

import { Kbd } from './Kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Components/Display/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: { children: '⌘' },
};
export default meta;

type Story = StoryObj<typeof Kbd>;
export const Default: Story = {};
export const Combo: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>K</Kbd>
      <span className="text-text-muted ml-3 text-[12px]">Command palette</span>
    </div>
  ),
};
