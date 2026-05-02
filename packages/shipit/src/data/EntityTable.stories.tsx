import { type DataTableColumn, StatusDot } from '@ship-it-ui/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { type EntityType } from '../entity/types';

import { EntityTable, entityColumn, entityTypeColumn } from './EntityTable';

interface Service {
  id: string;
  type: EntityType;
  name: string;
  owner: string;
  runtime: string;
  deploys: number;
  status: 'ok' | 'warn' | 'err' | 'off';
}

const services: Service[] = [
  {
    id: 's1',
    type: 'service',
    name: 'payment-webhook-v2',
    owner: 'Payments',
    runtime: 'node 20',
    deploys: 2.3,
    status: 'ok',
  },
  {
    id: 's2',
    type: 'service',
    name: 'ledger-core',
    owner: 'Payments',
    runtime: 'go 1.22',
    deploys: 0.8,
    status: 'ok',
  },
  {
    id: 's3',
    type: 'service',
    name: 'notify-dispatch',
    owner: 'Platform',
    runtime: 'node 20',
    deploys: 4.1,
    status: 'warn',
  },
  {
    id: 's4',
    type: 'service',
    name: 'auth-edge',
    owner: 'Platform',
    runtime: 'rust',
    deploys: 0.2,
    status: 'ok',
  },
  {
    id: 's5',
    type: 'service',
    name: 'legacy-wh',
    owner: 'Payments',
    runtime: 'node 16',
    deploys: 0,
    status: 'off',
  },
];

const columns: DataTableColumn<Service>[] = [
  entityColumn<Service>(),
  {
    key: 'owner',
    header: 'Owner',
    accessor: (r) => r.owner,
    cell: (r) => <span className="text-text-muted">{r.owner}</span>,
  },
  {
    key: 'runtime',
    header: 'Runtime',
    accessor: (r) => r.runtime,
    cell: (r) => <span className="text-text-muted font-mono">{r.runtime}</span>,
  },
  {
    key: 'deploys',
    header: 'Deploys/d',
    accessor: (r) => r.deploys,
    align: 'right',
    cell: (r) => (
      <span className="font-mono tabular-nums">{r.deploys === 0 ? '—' : r.deploys.toFixed(1)}</span>
    ),
  },
  { key: 'status', header: 'Status', cell: (r) => <StatusDot state={r.status} /> },
  entityTypeColumn<Service>(),
];

const meta: Meta<typeof EntityTable<Service>> = {
  title: 'ShipIt/Data/EntityTable',
  component: EntityTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EntityTable<Service>>;

export const Sortable: Story = {
  render: () => (
    <div className="rounded-base border-border bg-panel overflow-hidden border">
      <EntityTable
        data={services}
        columns={columns}
        defaultSort={{ key: 'deploys', direction: 'desc' }}
      />
    </div>
  ),
};

export const Selectable: Story = {
  render: () => (
    <div className="rounded-base border-border bg-panel overflow-hidden border">
      <EntityTable data={services} columns={columns} selectable defaultSelected={['s1']} />
    </div>
  ),
};
