import type { Meta, StoryObj } from '@storybook/react';

import { GraphMinimap } from './GraphMinimap';

const meta: Meta<typeof GraphMinimap> = {
  title: 'ShipIt/Graph/GraphMinimap',
  component: GraphMinimap,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof GraphMinimap>;

const points = Array.from({ length: 14 }).map((_, i) => ({
  x: ((i % 5) + 0.5) / 5,
  y: (Math.floor(i / 5) + 0.5) / 3,
}));

export const Default: Story = {
  args: {
    points,
    viewport: { x: 0.3, y: 0.2, width: 0.4, height: 0.55 },
  },
};
