import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { GraphLegend } from './GraphLegend';

describe('GraphLegend', () => {
  it('renders default entries when none are provided', () => {
    render(<GraphLegend />);
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Person')).toBeInTheDocument();
  });

  it('honours custom entries', () => {
    render(<GraphLegend entries={[{ color: 'red', label: 'errors' }]} />);
    expect(screen.getByText('errors')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<GraphLegend />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
