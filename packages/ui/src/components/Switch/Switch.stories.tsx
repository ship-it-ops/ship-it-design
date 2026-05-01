import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Auto-refresh' },
};
export default meta;

type Story = StoryObj<typeof Switch>;
export const Default: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch label="Small" size="sm" defaultChecked />
      <Switch label="Medium" size="md" defaultChecked />
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
