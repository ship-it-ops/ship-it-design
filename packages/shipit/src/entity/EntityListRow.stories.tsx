import type { Meta, StoryObj } from '@storybook/react';

import { EntityListRow } from './EntityListRow';

const meta: Meta<typeof EntityListRow> = {
  title: 'ShipIt/Entity/EntityListRow',
  component: EntityListRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EntityListRow>;

export const Default: Story = {
  args: { type: 'service', name: 'ledger-core', relation: 'OWNED_BY' },
};

export const List: Story = {
  render: () => (
    <div className="w-[360px] rounded-base border border-border bg-panel">
      <EntityListRow type="service" name="ledger-core" relation="DEPENDS_ON" onClick={() => {}} />
      <EntityListRow type="service" name="api-gateway" relation="CALLED_BY" onClick={() => {}} />
      <EntityListRow type="person" name="Priya K." relation="OWNED_BY" onClick={() => {}} />
      <EntityListRow type="document" name="runbook-oncall.md" relation="DOCUMENTED_IN" onClick={() => {}} />
    </div>
  ),
};
