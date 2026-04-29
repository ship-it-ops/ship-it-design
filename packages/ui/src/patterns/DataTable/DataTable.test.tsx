import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { DataTable, type DataTableColumn } from './DataTable';

interface Row {
  id: string;
  name: string;
  owner: string;
  deploys: number;
}

const rows: Row[] = [
  { id: '1', name: 'payment-webhook-v2', owner: 'Payments', deploys: 2.3 },
  { id: '2', name: 'ledger-core', owner: 'Payments', deploys: 0.8 },
  { id: '3', name: 'notify-dispatch', owner: 'Platform', deploys: 4.1 },
];

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', accessor: (r) => r.name },
  { key: 'owner', header: 'Owner', accessor: (r) => r.owner },
  { key: 'deploys', header: 'Deploys/d', accessor: (r) => r.deploys, align: 'right' },
];

function getRowOrder() {
  return screen
    .getAllByRole('row')
    .slice(1) // skip header
    .map((row) => within(row).queryByText(/payment|ledger|notify/)?.textContent ?? '');
}

describe('DataTable', () => {
  it('renders rows', () => {
    render(<DataTable data={rows} columns={columns} rowKey={(r) => r.id} />);
    expect(screen.getByText('payment-webhook-v2')).toBeInTheDocument();
    expect(screen.getByText('ledger-core')).toBeInTheDocument();
  });

  it('sorts ascending then descending then unsorted on header click', async () => {
    render(<DataTable data={rows} columns={columns} rowKey={(r) => r.id} />);
    const header = screen.getByRole('columnheader', { name: /Deploys\/d/ });
    await userEvent.click(header);
    expect(getRowOrder()).toEqual(['ledger-core', 'payment-webhook-v2', 'notify-dispatch']);
    await userEvent.click(header);
    expect(getRowOrder()).toEqual(['notify-dispatch', 'payment-webhook-v2', 'ledger-core']);
    await userEvent.click(header);
    expect(getRowOrder()).toEqual(['payment-webhook-v2', 'ledger-core', 'notify-dispatch']);
  });

  it('exposes aria-sort on the active column', async () => {
    render(<DataTable data={rows} columns={columns} rowKey={(r) => r.id} />);
    await userEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });

  it('selects rows individually', async () => {
    const onChange = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        selectable
        onSelectionChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select row 2' }));
    expect(onChange).toHaveBeenCalled();
    const set = onChange.mock.calls.at(-1)![0] as Set<string>;
    expect(set.has('2')).toBe(true);
  });

  it('select-all toggles all rows', async () => {
    const onChange = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        selectable
        onSelectionChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    const set = onChange.mock.calls.at(-1)![0] as Set<string>;
    expect(set.size).toBe(3);
  });

  it('select-all is indeterminate when only some rows are selected', () => {
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        selectable
        defaultSelected={['1']}
      />,
    );
    const allCheckbox = screen.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;
    expect(allCheckbox.indeterminate).toBe(true);
  });

  it('renders the empty state when data is empty', () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        rowKey={(r: Row) => r.id}
        emptyState="No services"
      />,
    );
    expect(screen.getByText('No services')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <DataTable data={rows} columns={columns} rowKey={(r) => r.id} selectable />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
