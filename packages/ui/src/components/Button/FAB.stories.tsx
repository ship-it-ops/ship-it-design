import type { Meta, StoryObj } from '@storybook/react-vite';

import { FAB } from './FAB';

const meta: Meta<typeof FAB> = {
  title: 'Components/Inputs/FAB',
  component: FAB,
  tags: ['autodocs'],
  argTypes: { onClick: { action: 'clicked' } },
  args: { 'aria-label': 'Ask anything', icon: '✦' },
};
export default meta;

type Story = StoryObj<typeof FAB>;

export const Default: Story = {};
export const Glyphs: Story = {
  render: () => (
    <div className="flex gap-4">
      <FAB aria-label="Ask" icon="✦" />
      <FAB aria-label="Add" icon="+" />
      <FAB aria-label="Up" icon="↑" />
    </div>
  ),
};
