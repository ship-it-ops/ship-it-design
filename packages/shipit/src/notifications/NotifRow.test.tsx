import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { NotifRow } from './NotifRow';

describe('NotifRow', () => {
  it('renders title and body', () => {
    render(<NotifRow title="Deploy succeeded" body="payments-api v3.1.4 → production." />);
    expect(screen.getByText('Deploy succeeded')).toBeInTheDocument();
    expect(screen.getByText('payments-api v3.1.4 → production.')).toBeInTheDocument();
  });

  it('renders relative time when supplied', () => {
    render(<NotifRow title="Hi" time="9:32" />);
    expect(screen.getByText('9:32')).toBeInTheDocument();
  });

  it('renders as a link when href is set', () => {
    render(<NotifRow title="Link row" href="/inbox/123" />);
    expect(screen.getByRole('link', { name: 'Link row' })).toHaveAttribute('href', '/inbox/123');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <NotifRow title="First" body="Body" time="9:32" unread tone="err" isFirst />
        <NotifRow title="Second" body="Body" time="8:14" />
        <NotifRow title="Last" body="Body" time="7:01" isLast />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
