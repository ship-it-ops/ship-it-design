import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Banner } from './Banner';

describe('Banner', () => {
  it('renders its content', () => {
    render(<Banner>Trial expires in 4 days.</Banner>);
    expect(screen.getByText('Trial expires in 4 days.')).toBeInTheDocument();
  });

  it('defaults to role="status" with aria-live="polite" so initial page render is not announced assertively', () => {
    render(<Banner tone="warn">Heads up</Banner>);
    const banner = screen.getByRole('status');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('aria-live', 'polite');
  });

  it('uses role="alert" only when live="assertive" is set', () => {
    render(
      <Banner tone="err" live="assertive">
        Outage
      </Banner>,
    );
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('aria-live', 'assertive');
  });

  it('omits aria-live entirely when live="off"', () => {
    render(
      <Banner tone="accent" live="off">
        Quiet
      </Banner>,
    );
    const banner = screen.getByRole('status');
    expect(banner).not.toHaveAttribute('aria-live');
  });

  it('renders trailing action', () => {
    render(<Banner action={<a href="/upgrade">Upgrade</a>}>Trial</Banner>);
    expect(screen.getByRole('link', { name: 'Upgrade' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Banner tone="accent">News</Banner>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
