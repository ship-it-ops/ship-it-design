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

  it('uses role="alert" for err and warn', () => {
    const { rerender } = render(<Alert tone="err" title="Boom" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<Alert tone="warn" title="Heads up" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('uses role="status" for accent and ok', () => {
    render(<Alert tone="ok" title="Synced" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Alert tone="warn" title="Token expires soon" description="Renew before Friday." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
