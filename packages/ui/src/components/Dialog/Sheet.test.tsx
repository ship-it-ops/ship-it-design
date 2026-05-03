import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Sheet } from './Sheet';

function Stateful({ initial = true }: { initial?: boolean }) {
  const [open, setOpen] = useState(initial);
  return (
    <Sheet open={open} onOpenChange={setOpen} title="Quick actions">
      <p>body</p>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('renders title and body when open', () => {
    render(
      <Sheet open title="Quick actions">
        <p>body</p>
      </Sheet>,
    );
    expect(screen.getByText('Quick actions')).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('omits the title block when none is given', () => {
    render(
      <Sheet open>
        <p>just body</p>
      </Sheet>,
    );
    expect(screen.getByText('just body')).toBeInTheDocument();
  });

  it('hides when closed', () => {
    render(
      <Sheet open={false} title="x">
        <p>body</p>
      </Sheet>,
    );
    expect(screen.queryByText('body')).not.toBeInTheDocument();
  });

  it('closes via ESC', async () => {
    render(<Stateful />);
    expect(screen.getByText('body')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('body')).not.toBeInTheDocument();
  });

  it('has no a11y violations when open with a title', async () => {
    const { container } = render(
      <Sheet open title="Quick actions">
        <p>body</p>
      </Sheet>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when open without a title', async () => {
    const { container } = render(
      <Sheet open>
        <p>body</p>
      </Sheet>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
