import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Drawer } from './Drawer';

function Stateful({ initial = true }: { initial?: boolean }) {
  const [open, setOpen] = useState(initial);
  return (
    <Drawer open={open} onOpenChange={setOpen} title="Filters">
      <p>body</p>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('renders title and body when open', () => {
    render(
      <Drawer open title="Filters">
        <p>body</p>
      </Drawer>,
    );
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('omits the header when no title is given', () => {
    render(
      <Drawer open>
        <p>just body</p>
      </Drawer>,
    );
    expect(screen.getByText('just body')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('renders the left-side variant', () => {
    render(
      <Drawer open side="left" title="Nav">
        <p>x</p>
      </Drawer>,
    );
    expect(screen.getByText('Nav')).toBeInTheDocument();
  });

  it('hides when closed', () => {
    render(
      <Drawer open={false} title="Filters">
        <p>body</p>
      </Drawer>,
    );
    expect(screen.queryByText('body')).not.toBeInTheDocument();
  });

  it('closes via the header close button', async () => {
    render(<Stateful />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('body')).not.toBeInTheDocument();
  });

  it('closes via ESC', async () => {
    render(<Stateful />);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('body')).not.toBeInTheDocument();
  });
});
