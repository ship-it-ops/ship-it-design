import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Dialog } from './Dialog';

function Stateful({ initial = true }: { initial?: boolean }) {
  const [open, setOpen] = useState(initial);
  return <Dialog open={open} onOpenChange={setOpen} title="Confirm" description="Sure?" />;
}

describe('Dialog', () => {
  it('renders title and description when open', () => {
    render(<Dialog open title="Confirm" description="Sure?" />);
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Confirm');
    expect(screen.getByText('Sure?')).toBeInTheDocument();
  });

  it('hides when closed', () => {
    render(<Dialog open={false} title="Confirm" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes via ESC', async () => {
    render(<Stateful />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no a11y violations when open', async () => {
    const { container } = render(
      <Dialog open title="Confirm" description="Sure?">
        <p>body</p>
      </Dialog>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
