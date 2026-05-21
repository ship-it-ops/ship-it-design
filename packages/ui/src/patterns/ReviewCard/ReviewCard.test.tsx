import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ReviewCard } from './ReviewCard';

describe('ReviewCard', () => {
  it('renders author, rating, date, and body', () => {
    render(
      <ReviewCard
        author="Jamie"
        rating={5}
        date="Apr 12, 2026"
        body="Great car, super clean and easy pickup."
      />,
    );
    expect(screen.getByText('Jamie')).toBeInTheDocument();
    expect(screen.getByText('Apr 12, 2026')).toBeInTheDocument();
    expect(screen.getByText(/super clean/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /5 out of 5/ })).toBeInTheDocument();
  });

  it('shows the verified badge when set', () => {
    render(<ReviewCard author="Priya" rating={4} date="May 1, 2026" body="All good." verified />);
    expect(screen.getByText('Verified trip')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ReviewCard
        author="Alex"
        rating={4.5}
        date="Apr 2026"
        body="Smooth experience."
        verified
        subtitle="Member since 2022"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
