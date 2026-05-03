import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Alert } from './Alert';

describe('Alert', () => {
  it('renders title and description', () => {
    render(<Alert title="Saved" description="142 entities committed." />);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('142 entities committed.')).toBeInTheDocument();
  });

  it('defaults to role="status" with aria-live="polite" regardless of tone', () => {
    const { rerender } = render(<Alert tone="err" title="Boom" />);
    let alert = screen.getByRole('status');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'polite');
    rerender(<Alert tone="warn" title="Heads up" />);
    alert = screen.getByRole('status');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('uses role="alert" only when live="assertive" is set', () => {
    render(<Alert tone="err" live="assertive" title="Boom" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('omits aria-live entirely when live="off"', () => {
    render(<Alert tone="ok" live="off" title="Synced" />);
    const alert = screen.getByRole('status');
    expect(alert).not.toHaveAttribute('aria-live');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Alert tone="warn" title="Token expires soon" description="Renew before Friday." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
