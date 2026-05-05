'use client';

import { DataTable, type DataTableColumn } from '@ship-it-ui/ui';

import docgen from '@/.generated/docgen.json';

interface PropEntry {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
  required?: boolean;
}

type Docgen = Record<string, ReadonlyArray<PropEntry>>;

const DOCGEN = docgen as unknown as Docgen;

const columns: DataTableColumn<PropEntry>[] = [
  {
    key: 'name',
    header: 'Prop',
    width: 160,
    cell: (row) => (
      <span className="font-mono text-[12px]">
        {row.name}
        {row.required && <span className="text-err"> *</span>}
      </span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    width: 220,
    cell: (row) => <code className="text-text-muted text-[11px]">{row.type}</code>,
  },
  {
    key: 'defaultValue',
    header: 'Default',
    width: 100,
    cell: (row) => <code className="text-text-dim text-[11px]">{row.defaultValue ?? '—'}</code>,
  },
  {
    key: 'description',
    header: 'Description',
    cell: (row) => <span className="text-text-muted text-[12px]">{row.description ?? ''}</span>,
  },
];

export function PropsTable({ component }: { component: string }) {
  const props = DOCGEN[component];
  if (!props || props.length === 0) {
    return (
      <div className="text-text-muted my-4 text-[12px]">
        No props metadata for <code className="font-mono">{component}</code>.
      </div>
    );
  }
  return (
    <div className="my-6">
      <DataTable<PropEntry>
        data={props}
        columns={columns}
        rowKey={(r) => r.name}
        caption={`Props for ${component}`}
      />
    </div>
  );
}
