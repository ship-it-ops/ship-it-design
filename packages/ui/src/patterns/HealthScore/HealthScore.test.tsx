import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { HealthScore } from './HealthScore';

describe('HealthScore', () => {
  it('renders the percent through RadialProgress', () => {
    render(<HealthScore value={72} />);
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('shows a positive delta with an up arrow', () => {
    render(<HealthScore value={50} delta={4} />);
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows a negative delta with a down arrow', () => {
    render(<HealthScore value={50} delta={-7} />);
    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders without a delta indicator when delta is omitted', () => {
    render(<HealthScore value={88} />);
    expect(screen.queryByText('↑')).not.toBeInTheDocument();
    expect(screen.queryByText('↓')).not.toBeInTheDocument();
  });

  it('wraps in a HoverCard when a breakdown is provided', () => {
    render(
      <HealthScore
        value={88}
        breakdown={[
          { label: 'Coverage', value: 92 },
          { label: 'Latency', value: 76 },
        ]}
      />,
    );
    // The HoverCard trigger should host the score; just sanity-check the score still renders.
    expect(screen.getByText('88%')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<HealthScore value={64} label="Service health" delta={2} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
