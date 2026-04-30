import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Hero } from './Hero';

describe('Hero', () => {
  it('renders title and description', () => {
    render(
      <Hero
        title="Your knowledge, as a graph."
        description="ShipIt turns repos into a queryable graph."
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your knowledge');
    expect(screen.getByText(/queryable graph/)).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Hero title="Headline" description="Body" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
