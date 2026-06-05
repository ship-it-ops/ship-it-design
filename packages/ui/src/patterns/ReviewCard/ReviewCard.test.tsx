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

  it('emits a Review JSON-LD with author, body, and rating', () => {
    const { container } = render(
      <ReviewCard
        author="Jamie"
        rating={5}
        date="Apr 12, 2026"
        dateTime="2026-04-12"
        body="Great car."
        itemReviewedName="Tesla Model 3 Rental"
        url="https://ship.it/listings/tesla-3"
      />,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const parsed = JSON.parse(script.textContent ?? '{}');
    expect(parsed).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Jamie' },
      reviewBody: 'Great car.',
      reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
      datePublished: '2026-04-12',
      itemReviewed: {
        '@type': 'Thing',
        name: 'Tesla Model 3 Rental',
        url: 'https://ship.it/listings/tesla-3',
      },
    });
  });

  it('renders <time dateTime> when dateTime is supplied', () => {
    const { container } = render(
      <ReviewCard author="J" rating={5} date="Apr 12" dateTime="2026-04-12T00:00:00Z" body="b" />,
    );
    const time = container.querySelector('time')!;
    expect(time).toHaveAttribute('datetime', '2026-04-12T00:00:00Z');
  });

  it('skips JSON-LD when author or body is JSX without a string fallback', () => {
    const { container } = render(
      <ReviewCard author={<span>Jamie</span>} rating={5} date="Apr" body="b" />,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('uses authorName / bodyText fallback when author/body are JSX', () => {
    const { container } = render(
      <ReviewCard
        author={<span>Jamie</span>}
        authorName="Jamie"
        rating={5}
        date="Apr"
        body={<em>fancy</em>}
        bodyText="fancy"
      />,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(parsed.author.name).toBe('Jamie');
    expect(parsed.reviewBody).toBe('fancy');
  });

  it('omits the JSON-LD script when noStructuredData is set', () => {
    const { container } = render(
      <ReviewCard author="J" rating={5} date="Apr" body="b" noStructuredData />,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('escapes </script> in body or author', () => {
    const { container } = render(
      <ReviewCard author="J" rating={5} date="Apr" body={'</script><img onerror=alert(1)>'} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toMatch(/<\/script>/i);
    expect(script.innerHTML).toContain('\\u003c/script>');
  });
});
