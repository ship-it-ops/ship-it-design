import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Ingest PRs' },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { checked: 'indeterminate' } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Ingest PRs" defaultChecked />
      <Checkbox label="Ingest issues" />
      <Checkbox label="Ingest wiki" checked="indeterminate" />
      <Checkbox label="Disabled" disabled defaultChecked />
    </div>
  ),
};
