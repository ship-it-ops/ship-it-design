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

  it('sets aria-live="off" when live="off" to override role="status"\'s implicit polite region', () => {
    render(
      <Banner tone="accent" live="off">
        Quiet
      </Banner>,
    );
    const banner = screen.getByRole('status');
    // role="status" implies aria-live="polite"; an explicit "off" is required
    // to actually suppress announcements (omitting the attribute would not).
    expect(banner).toHaveAttribute('aria-live', 'off');
  });

  it('renders trailing action', () => {
    render(<Banner action={<a href="/upgrade">Upgrade</a>}>Trial</Banner>);
    expect(screen.getByRole('link', { name: 'Upgrade' })).toBeInTheDocument();
  });

  it('uses the contrast-safe accent-text token for the accent tone', () => {
    render(<Banner tone="accent">News</Banner>);
    const banner = screen.getByRole('status');
    expect(banner).toHaveClass('text-accent-text');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Banner tone="accent">News</Banner>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
