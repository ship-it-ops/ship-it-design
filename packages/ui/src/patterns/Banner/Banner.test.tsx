import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Banner } from './Banner';

describe('Banner', () => {
  it('renders its content', () => {
    render(<Banner>Trial expires in 4 days.</Banner>);
    expect(screen.getByText('Trial expires in 4 days.')).toBeInTheDocument();
  });

  it('uses role="alert" for warn/err', () => {
    render(<Banner variant="warn">Heads up</Banner>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders trailing action', () => {
    render(<Banner action={<a href="/upgrade">Upgrade</a>}>Trial</Banner>);
    expect(screen.getByRole('link', { name: 'Upgrade' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Banner variant="info">News</Banner>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
