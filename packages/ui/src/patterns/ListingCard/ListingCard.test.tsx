import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ListingCard } from './ListingCard';

const photos = ['/p1.jpg', '/p2.jpg'];

describe('ListingCard', () => {
  it('renders title, price, and rating', () => {
    render(
      <ListingCard
        photos={photos}
        title="2023 Tesla Model 3"
        price="89"
        rating={4.7}
        reviewCount={238}
      />,
    );
    expect(screen.getByText('2023 Tesla Model 3')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('(238)')).toBeInTheDocument();
  });

  it('toggles favorite', async () => {
    const handle = vi.fn();
    render(
      <ListingCard
        photos={photos}
        title="Tesla"
        price="89"
        onFavorite={handle}
        favorited={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save to favorites' }));
    expect(handle).toHaveBeenCalledWith(true);
  });

  it('wraps in an anchor when href is set', () => {
    render(<ListingCard photos={photos} title="Tesla" price="89" href="/cars/123" />);
    expect(screen.getByRole('link', { name: 'Tesla' })).toHaveAttribute('href', '/cars/123');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ListingCard
        photos={photos}
        title="Tesla"
        price="89"
        rating={4.7}
        reviewCount={238}
        verified
        host="Jamie"
        distance="0.4 mi"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  /*
   * Regression: when both `href` and `onFavorite` were provided, the heart
   * button used to live inside the wrapping `<a>` — axe flagged
   * `nested-interactive`. The component now uses a stretched-link pattern
   * (link as absolute sibling, favorite at higher z-index), so this case
   * must stay axe-clean.
   */
  it('has no a11y violations when href + onFavorite are combined', async () => {
    const { container } = render(
      <ListingCard
        photos={photos}
        title="Tesla"
        price="89"
        href="/cars/123"
        onFavorite={() => {}}
        favorited={false}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
