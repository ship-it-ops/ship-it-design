import type { Meta, StoryObj } from '@storybook/react-vite';

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
    <div className="rounded-base border-border bg-panel w-[360px] border">
      <EntityListRow type="service" name="ledger-core" relation="DEPENDS_ON" onClick={() => {}} />
      <EntityListRow type="service" name="api-gateway" relation="CALLED_BY" onClick={() => {}} />
      <EntityListRow type="person" name="Priya K." relation="OWNED_BY" onClick={() => {}} />
      <EntityListRow
        type="document"
        name="runbook-oncall.md"
        relation="DOCUMENTED_IN"
        onClick={() => {}}
      />
    </div>
  ),
};
