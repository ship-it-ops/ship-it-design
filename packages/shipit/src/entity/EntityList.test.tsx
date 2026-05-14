import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { EntityList } from './EntityList';
import { EntityListRow } from './EntityListRow';

const ROWS = (
  <>
    <EntityListRow type="service" name="payments" />
    <EntityListRow type="service" name="ledger-core" />
    <EntityListRow type="document" name="runbook.md" />
  </>
);

describe('EntityList', () => {
  it('renders the title and subtitle when provided', () => {
    render(
      <EntityList title="Depends on" subtitle="3 services">
        {ROWS}
      </EntityList>,
    );
    expect(screen.getByText('Depends on')).toBeInTheDocument();
    expect(screen.getByText('3 services')).toBeInTheDocument();
  });

  it('renders all row children', () => {
    render(<EntityList>{ROWS}</EntityList>);
    expect(screen.getByText('payments')).toBeInTheDocument();
    expect(screen.getByText('ledger-core')).toBeInTheDocument();
    expect(screen.getByText('runbook.md')).toBeInTheDocument();
  });

  it('renders as a <details> when collapsible', () => {
    const { container } = render(
      <EntityList collapsible title="Used by">
        {ROWS}
      </EntityList>,
    );
    const details = container.querySelector('details');
    expect(details).toBeTruthy();
    expect(details?.open).toBe(true);
  });

  it('honours defaultCollapsed', () => {
    const { container } = render(
      <EntityList collapsible defaultCollapsed title="Used by">
        {ROWS}
      </EntityList>,
    );
    expect(container.querySelector('details')?.open).toBe(false);
  });

  it('has no a11y violations (expanded)', async () => {
    const { container } = render(
      <EntityList title="Depends on" subtitle="3 services">
        {ROWS}
      </EntityList>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (collapsible, default open)', async () => {
    const { container } = render(
      <EntityList collapsible title="Used by">
        {ROWS}
      </EntityList>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (collapsible, collapsed)', async () => {
    const { container } = render(
      <EntityList collapsible defaultCollapsed title="Used by">
        {ROWS}
      </EntityList>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
