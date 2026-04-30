import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { EntityListRow } from './EntityListRow';

describe('EntityListRow', () => {
  it('renders the entity name and relation', () => {
    render(<EntityListRow type="service" name="ledger-core" relation="OWNED_BY" />);
    expect(screen.getByText('ledger-core')).toBeInTheDocument();
    expect(screen.getByText('OWNED_BY')).toBeInTheDocument();
  });

  it('becomes interactive when onClick is provided', async () => {
    const onClick = vi.fn();
    render(<EntityListRow type="service" name="x" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <EntityListRow type="service" name="ledger-core" relation="OWNED_BY" onClick={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
