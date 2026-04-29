import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Display/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'auto-tag: infra', icon: '✦' },
};
export default meta;

type Story = StoryObj<typeof Chip>;
export const Default: Story = {};
export const Removable: Story = { args: { removable: true } };
