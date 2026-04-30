import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { type EntityType } from '../entity/types';
import { EntityTable, entityColumn, entityTypeColumn } from './EntityTable';

interface TestEntity {
  id: string;
  type: EntityType;
  name: string;
  owner: string;
}

const rows: TestEntity[] = [
  { id: '1', type: 'service', name: 'payment-webhook-v2', owner: 'Payments' },
  { id: '2', type: 'person', name: 'Priya K', owner: '—' },
  { id: '3', type: 'document', name: 'runbook.md', owner: 'Platform' },
];

describe('EntityTable', () => {
  it('renders rows using the entity column', () => {
    render(<EntityTable data={rows} columns={[entityColumn(), entityTypeColumn()]} />);
    expect(screen.getByText('payment-webhook-v2')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
  });

  it('sorts on the entity name column', async () => {
    render(<EntityTable data={rows} columns={[entityColumn()]} />);
    await userEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    const header = screen.getByRole('columnheader', { name: /Name/ });
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    // localeCompare ascending: payment-webhook-v2, Priya K, runbook.md
    const sortedNames = screen
      .getAllByRole('row')
      .slice(1)
      .map((r) => r.textContent ?? '');
    expect(sortedNames[0]).toContain('payment-webhook');
    expect(sortedNames[2]).toContain('runbook');
  });

  it('uses the row id by default', () => {
    const { container } = render(<EntityTable data={rows} columns={[entityColumn()]} selectable />);
    expect(
      container.querySelectorAll('input[type="checkbox"][aria-label^="Select row"]'),
    ).toHaveLength(rows.length);
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <EntityTable data={rows} columns={[entityColumn(), entityTypeColumn()]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
