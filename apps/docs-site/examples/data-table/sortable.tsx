import { DataTable, StatusDot, type DataTableColumn } from '@ship-it-ui/ui';

interface Service {
  id: string;
  name: string;
  owner: string;
  runtime: string;
  deploys: number;
  status: 'ok' | 'warn' | 'err' | 'off';
}

const services: Service[] = [
  {
    id: 's1',
    name: 'payment-webhook-v2',
    owner: 'Payments',
    runtime: 'node 20',
    deploys: 2.3,
    status: 'ok',
  },
  {
    id: 's2',
    name: 'ledger-core',
    owner: 'Payments',
    runtime: 'go 1.22',
    deploys: 0.8,
    status: 'ok',
  },
  {
    id: 's3',
    name: 'notify-dispatch',
    owner: 'Platform',
    runtime: 'node 20',
    deploys: 4.1,
    status: 'warn',
  },
  { id: 's4', name: 'auth-edge', owner: 'Platform', runtime: 'rust', deploys: 0.2, status: 'ok' },
  { id: 's5', name: 'legacy-wh', owner: 'Payments', runtime: 'node 16', deploys: 0, status: 'off' },
];

const columns: DataTableColumn<Service>[] = [
  {
    key: 'name',
    header: 'Name',
    accessor: (r) => r.name,
    cell: (r) => (
      <span className="flex items-center gap-2 font-mono">
        <span className="text-accent">◇</span>
        {r.name}
      </span>
    ),
  },
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
  {
    key: 'status',
    header: 'Status',
    cell: (r) => <StatusDot state={r.status} />,
  },
];

export default function Example() {
  return (
    <div className="rounded-base border-border bg-panel overflow-hidden border">
      <DataTable
        data={services}
        columns={columns}
        rowKey={(r) => r.id}
        defaultSort={{ key: 'deploys', direction: 'desc' }}
      />
    </div>
  );
}
