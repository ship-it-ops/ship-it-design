import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Sparkline } from './Sparkline';

describe('Sparkline', () => {
  it('renders an svg with the provided aria label', () => {
    render(<Sparkline values={[1, 4, 2, 6, 3]} aria-label="Queries / hr" />);
    expect(screen.getByRole('img', { name: 'Queries / hr' })).toBeInTheDocument();
  });

  it('handles a single-value series without crashing', () => {
    const { container } = render(<Sparkline values={[5]} />);
    expect(container.querySelector('path')).toBeTruthy();
  });

  it('renders an empty svg for an empty series', () => {
    const { container } = render(<Sparkline values={[]} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Sparkline values={[1, 4, 2, 6, 3]} aria-label="Trend" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
