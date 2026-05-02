import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusDot } from './StatusDot';

const meta: Meta<typeof StatusDot> = {
  title: 'Components/Display/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  args: { state: 'ok', label: 'Synced · 2m ago' },
};
export default meta;

type Story = StoryObj<typeof StatusDot>;
export const Default: Story = {};
export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <StatusDot state="ok" label="Synced · 2m ago" />
      <StatusDot state="sync" label="Syncing 182 / 1,204" pulse />
      <StatusDot state="warn" label="Stale · last sync 4h ago" />
      <StatusDot state="err" label="Failed · token expired" />
      <StatusDot state="off" label="Paused" />
    </div>
  ),
};
