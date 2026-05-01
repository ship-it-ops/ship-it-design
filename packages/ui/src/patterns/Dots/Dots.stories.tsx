import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Dots } from './Dots';

const meta: Meta<typeof Dots> = {
  title: 'Patterns/Navigation/Dots',
  component: Dots,
  tags: ['autodocs'],
  args: { total: 5, current: 1 },
};
export default meta;

type Story = StoryObj<typeof Dots>;

export const Static: Story = {
  args: { total: 5, current: 1 },
};

function DotsInteractiveDemo() {
  const [current, setCurrent] = useState(0);
  return <Dots total={6} current={current} onChange={setCurrent} />;
}

export const Interactive: Story = {
  render: () => <DotsInteractiveDemo />,
};
