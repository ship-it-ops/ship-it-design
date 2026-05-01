import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ConfidenceIndicator } from './ConfidenceIndicator';

describe('ConfidenceIndicator', () => {
  it('exposes a meter role with the value', () => {
    render(<ConfidenceIndicator value={88.2} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '88');
  });

  it('derives tier label from value', () => {
    render(<ConfidenceIndicator value={28.4} />);
    expect(screen.getByText('Unverified')).toBeInTheDocument();
  });

  it('respects a custom tier override', () => {
    render(<ConfidenceIndicator value={50} tier="high" label="High" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<ConfidenceIndicator value={62.1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
