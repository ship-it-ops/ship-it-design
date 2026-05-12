import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

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

  it('has no a11y violations when open', async () => {
    const { container } = render(
      <Drawer open title="Filters">
        <p>body</p>
      </Drawer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('side="bottom" (bottom sheet)', () => {
    it('renders the drag handle by default', () => {
      // The drag handle is a visual affordance with `aria-hidden`, so it
      // doesn't show up in the accessibility tree. Reach for it via the
      // structural element instead — the only span.h-1.w-9 pill in the sheet.
      // `document` query, not `container`, because Radix portals Content
      // outside the testing-library render root.
      render(
        <Drawer open side="bottom" title="Filters">
          <p>body</p>
        </Drawer>,
      );
      expect(document.querySelector('span.h-1.w-9')).toBeInTheDocument();
    });

    it('suppresses the drag handle when `handle={false}`', () => {
      render(
        <Drawer open side="bottom" title="Filters" handle={false}>
          <p>body</p>
        </Drawer>,
      );
      expect(document.querySelector('span.h-1.w-9')).not.toBeInTheDocument();
    });

    it('renders the title via `SheetHeader` (no close button — the handle + ESC + backdrop handle dismissal)', () => {
      // The desktop drawer header has a built-in × close button; the bottom
      // sheet intentionally omits it to match iOS conventions where users
      // dismiss via drag, tap-outside, or system gestures.
      render(
        <Drawer open side="bottom" title="Filters">
          <p>body</p>
        </Drawer>,
      );
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('reflects the `height` prop in the inline style', () => {
      render(
        <Drawer open side="bottom" title="Filters" height="60vh">
          <p>body</p>
        </Drawer>,
      );
      // Radix portals the Content outside the RTL render root — query the
      // whole document via `screen` so we land on the portaled element.
      const sheet = screen.getByRole('dialog');
      expect(sheet.style.height).toBe('60vh');
    });

    it('has no a11y violations when open as a bottom sheet', async () => {
      const { container } = render(
        <Drawer open side="bottom" title="Filters">
          <p>body</p>
        </Drawer>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
