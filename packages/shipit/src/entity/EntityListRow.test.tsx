import { Button } from '@ship-it-ui/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

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

  describe('actions slot', () => {
    it('passes axe even when actions contains a button alongside an interactive row', async () => {
      const { container } = render(
        <EntityListRow
          type="service"
          name="payments"
          onClick={() => {}}
          actions={<Button size="sm">Open</Button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('renders the action button as a sibling of the row button, not a descendant', () => {
      render(
        <EntityListRow
          type="service"
          name="payments"
          onClick={() => {}}
          actions={<Button data-testid="action">Open</Button>}
        />,
      );
      const rowButton = screen.getByRole('button', { name: /payments/i });
      const actionButton = screen.getByTestId('action');
      // The action button must NOT be a descendant of the row button.
      expect(rowButton.contains(actionButton)).toBe(false);
    });

    it('does not invoke the row onClick when the action is clicked', async () => {
      const rowClick = vi.fn();
      const actionClick = vi.fn();
      render(
        <EntityListRow
          type="service"
          name="payments"
          onClick={rowClick}
          actions={
            <Button data-testid="action" onClick={actionClick}>
              Open
            </Button>
          }
        />,
      );
      await userEvent.click(screen.getByTestId('action'));
      expect(actionClick).toHaveBeenCalled();
      expect(rowClick).not.toHaveBeenCalled();
    });
  });
});
