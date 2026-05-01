import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Patterns/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-5">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};
