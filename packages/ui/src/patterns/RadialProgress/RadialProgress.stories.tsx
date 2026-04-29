import type { Meta, StoryObj } from '@storybook/react';

import { RadialProgress } from './RadialProgress';

const meta: Meta<typeof RadialProgress> = {
  title: 'Patterns/Feedback/RadialProgress',
  component: RadialProgress,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'ok', 'warn', 'err'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  args: { value: 68, size: 64 },
};
export default meta;

type Story = StoryObj<typeof RadialProgress>;

export const Default: Story = {};

export const Set: Story = {
  render: () => (
    <div className="flex items-center gap-5">
      {[28, 58, 84, 100].map((v) => (
        <RadialProgress key={v} value={v} />
      ))}
    </div>
  ),
};
