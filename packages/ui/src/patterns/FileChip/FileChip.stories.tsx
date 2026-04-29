import type { Meta, StoryObj } from '@storybook/react';

import { FileChip } from './FileChip';

const meta: Meta<typeof FileChip> = {
  title: 'Patterns/Forms/FileChip',
  component: FileChip,
  tags: ['autodocs'],
  args: { name: 'runbook-oncall.pdf', size: '2.4 MB', progress: 100 },
};
export default meta;

type Story = StoryObj<typeof FileChip>;

export const Complete: Story = {};

export const Uploading: Story = {
  args: { name: 'architecture-v2.md', size: '18 KB · uploading', progress: 62 },
};

export const Failed: Story = {
  args: { name: 'diagram.xlsx', size: 'failed', failed: true, progress: undefined },
  render: (args) => <FileChip {...args} onRemove={() => {}} />,
};

export const Stack: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <FileChip name="runbook-oncall.pdf" size="2.4 MB" progress={100} onRemove={() => {}} />
      <FileChip name="architecture-v2.md" size="18 KB · uploading" progress={62} />
      <FileChip name="diagram.xlsx" size="failed" failed onRemove={() => {}} />
    </div>
  ),
};
