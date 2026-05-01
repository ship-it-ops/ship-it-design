import type { Meta, StoryObj } from '@storybook/react';

import { IconButton } from '../Button';

import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  render: () => (
    <Tooltip content="Add new source">
      <IconButton aria-label="Add source" icon="+" />
    </Tooltip>
  ),
};
export const Sides: Story = {
  render: () => (
    <div className="flex gap-3">
      <Tooltip content="Top" side="top">
        <IconButton aria-label="Top" icon="↑" />
      </Tooltip>
      <Tooltip content="Bottom" side="bottom">
        <IconButton aria-label="Bottom" icon="↓" />
      </Tooltip>
      <Tooltip content="Left" side="left">
        <IconButton aria-label="Left" icon="←" />
      </Tooltip>
      <Tooltip content="Right" side="right">
        <IconButton aria-label="Right" icon="→" />
      </Tooltip>
    </div>
  ),
};
