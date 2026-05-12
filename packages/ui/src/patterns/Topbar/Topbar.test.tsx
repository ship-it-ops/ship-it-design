import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Topbar } from './Topbar';

describe('Topbar', () => {
  it('renders the title', () => {
    render(<Topbar title="Graph Explorer" />);
    expect(screen.getByText('Graph Explorer')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(<Topbar title="App" actions={<button>Settings</button>} />);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  it('renders the back button in touch density when `back` is set', () => {
    render(<Topbar density="touch" title="Detail" back={true} onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('fires `onBack` when `back={true}` is clicked', async () => {
    const onBack = vi.fn();
    render(<Topbar density="touch" title="Detail" back={true} onBack={onBack} />);
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('uses `back` as the handler when passed a function (and ignores `onBack`)', async () => {
    // Lock the precedence in: `back={handler}` form wins over a separate
    // `onBack`. The JSDoc says so; this guards against a future refactor
    // flipping the order.
    const fromBack = vi.fn();
    const fromOnBack = vi.fn();
    render(<Topbar density="touch" title="Detail" back={fromBack} onBack={fromOnBack} />);
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(fromBack).toHaveBeenCalledOnce();
    expect(fromOnBack).not.toHaveBeenCalled();
  });

  it('does not render the back button on comfortable density even when `back` is set', () => {
    // `back` is a touch-density feature — silently ignored on desktop to
    // prevent a phantom button on the wide header.
    render(<Topbar title="Detail" back={true} onBack={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
  });

  it('renders the eyebrow in touch density', () => {
    render(<Topbar density="touch" title="Detail" eyebrow="Section" />);
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('omits the eyebrow on comfortable density', () => {
    render(<Topbar title="Detail" eyebrow="Section" />);
    expect(screen.queryByText('Section')).not.toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Topbar title="Graph Explorer" actions={<button aria-label="Settings">⚙</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations in touch density with back + eyebrow', async () => {
    const { container } = render(
      <Topbar
        density="touch"
        title="payment-webhook"
        eyebrow="Service"
        back={true}
        onBack={vi.fn()}
        actions={<button aria-label="More">⋯</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
