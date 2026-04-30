import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { RadialProgress } from './RadialProgress';

describe('RadialProgress', () => {
  it('renders the percent label in the center', () => {
    render(<RadialProgress value={68} />);
    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('exposes aria-valuenow', () => {
    render(<RadialProgress value={42} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
  });

  it('honours custom children for the label', () => {
    render(
      <RadialProgress value={3} max={5}>
        3/5
      </RadialProgress>,
    );
    expect(screen.getByText('3/5')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<RadialProgress value={60} aria-label="Coverage" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
