import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Testimonial } from './Testimonial';

// `role` is a React prop on Testimonial (the author's job title), not an ARIA role.
/* eslint-disable jsx-a11y/aria-role */

describe('Testimonial', () => {
  it('renders the quote and author', () => {
    render(
      <Testimonial
        quote="ShipIt saved us a rotation's worth of pings."
        author="Priya Khanna"
        role="Staff Engineer, Acme Payments"
        avatar="PK"
      />,
    );
    expect(screen.getByText(/saved us a rotation/)).toBeInTheDocument();
    expect(screen.getByText('Priya Khanna')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Testimonial quote="Great." author="A. Person" role="Eng" avatar="AP" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
