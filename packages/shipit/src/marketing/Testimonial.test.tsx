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

  it('emits a Review JSON-LD with author + reviewBody + jobTitle', () => {
    const { container } = render(
      <Testimonial
        quote="ShipIt saved us a rotation's worth of pings."
        author="Priya Khanna"
        role="Staff Engineer, Acme Payments"
        avatar="PK"
      />,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(parsed).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Priya Khanna',
        jobTitle: 'Staff Engineer, Acme Payments',
      },
      reviewBody: "ShipIt saved us a rotation's worth of pings.",
    });
  });

  it('adds reviewRating + itemReviewed when rating + itemReviewedName are provided', () => {
    const { container } = render(
      <Testimonial
        quote="Great."
        author="A"
        rating={5}
        itemReviewedName="ShipIt"
        url="https://ship.it"
      />,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(parsed.reviewRating).toEqual({
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    });
    expect(parsed.itemReviewed).toEqual({
      '@type': 'Thing',
      name: 'ShipIt',
      url: 'https://ship.it',
    });
  });

  it('skips JSON-LD when quote or author is JSX without a string fallback', () => {
    const { container } = render(<Testimonial quote={<em>fancy</em>} author={<span>X</span>} />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('omits the JSON-LD script when noStructuredData is set', () => {
    const { container } = render(<Testimonial quote="Q" author="A" noStructuredData />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('escapes </script> in quote', () => {
    const { container } = render(
      <Testimonial quote={'</script><img onerror=alert(1)>'} author="A" />,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toMatch(/<\/script>/i);
    expect(script.innerHTML).toContain('\\u003c/script>');
  });
});
