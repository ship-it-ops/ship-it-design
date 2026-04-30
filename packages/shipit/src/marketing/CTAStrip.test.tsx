import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { CTAStrip } from './CTAStrip';

describe('CTAStrip', () => {
  it('renders title and description', () => {
    render(<CTAStrip title="Ready to graph your org?" description="Free for 14 days." />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ready');
    expect(screen.getByText(/14 days/)).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<CTAStrip title="CTA" description="Body" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
