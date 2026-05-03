import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ToastProvider, useToast } from './Toast';

function Trigger() {
  const { toast } = useToast();
  return <button onClick={() => toast({ title: 'Hello', description: 'World' })}>fire</button>;
}

describe('Toast', () => {
  it('shows toast on demand', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('fire'));
    expect(await screen.findByText('Hello')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { baseElement } = render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    // Fire the toast first — without this, axe runs against an empty Radix
    // viewport and never evaluates the live region, dismiss button, or contrast.
    await userEvent.click(screen.getByText('fire'));
    await screen.findByText('Hello');
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
