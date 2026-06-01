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

  it('fires onClick when the stretched card surface is clicked', async () => {
    const handle = vi.fn();
    render(<ListingCard photos={photos} title="Tesla" price="89" onClick={handle} />);
    await userEvent.click(screen.getByRole('button', { name: 'View Tesla' }));
    expect(handle).toHaveBeenCalledTimes(1);
  });

  it('keeps inner buttons clickable when onClick is set (no nested-interactive)', async () => {
    const cardClick = vi.fn();
    const cta = vi.fn();
    render(
      <ListingCard
        variant="spec"
        photos={photos}
        title="Corvette"
        price="$250"
        onClick={cardClick}
        cta={{ label: 'Rent', onClick: cta }}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Rent' }));
    expect(cta).toHaveBeenCalledTimes(1);
    expect(cardClick).not.toHaveBeenCalled();
  });

  it('has no a11y violations with onClick + cta combined', async () => {
    const { container } = render(
      <ListingCard
        variant="spec"
        photos={photos}
        title="Corvette"
        price="$250"
        onClick={() => {}}
        cta={{ label: 'Rent', onClick: () => {} }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('applies classNames slot overrides', () => {
    render(
      <ListingCard
        variant="spec"
        photos={photos}
        title="Corvette"
        price="$250"
        cta={{ label: 'Rent', onClick: () => {} }}
        classNames={{
          title: 'custom-title-class',
          footer: 'custom-footer-class',
          cta: 'custom-cta-class',
        }}
      />,
    );
    expect(screen.getByText('Corvette')).toHaveClass('custom-title-class');
    expect(screen.getByRole('button', { name: 'Rent' })).toHaveClass('custom-cta-class');
  });

  it('loops the photo carousel by default and passes loop={false} through', () => {
    // Marketplace cards opt in to looping by default. The forwarded `loop`
    // prop on the inner Carousel decides whether prev/next disable at the
    // boundaries — easiest signal to assert against without touching
    // internals.
    const { rerender } = render(<ListingCard photos={photos} title="Tesla" price="89" />);
    expect(screen.getByRole('button', { name: 'Previous slide' })).not.toBeDisabled();

    rerender(<ListingCard photos={photos} title="Tesla" price="89" loop={false} />);
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
  });

  it('uses renderPhoto when provided', () => {
    render(
      <ListingCard
        photos={photos}
        title="Tesla"
        price="89"
        // Disable loop so the rendered tiles match `photos` order without
        // clone twins at either end (clones also flow through renderPhoto).
        loop={false}
        renderPhoto={(src) => <div data-testid="custom-photo">{src}</div>}
      />,
    );
    const tiles = screen.getAllByTestId('custom-photo');
    expect(tiles.length).toBeGreaterThan(0);
    expect(tiles[0]).toHaveTextContent('/p1.jpg');
  });

  describe('variant="spec"', () => {
    it('renders flag, category, meta, specs, and the CTA', () => {
      render(
        <ListingCard
          variant="spec"
          photos={photos}
          title="Chevrolet Corvette Stingray"
          category="performance"
          meta="LR-001 · 2023"
          flag={{ icon: 'flag', label: 'Flagship', tone: 'purple' }}
          pricePrefix="from"
          price="$250"
          priceUnit="/day"
          specs={[
            { label: '0-60', value: '2.9s' },
            { label: 'Power', value: '495 hp' },
            { label: 'Drive', value: 'RWD' },
          ]}
          cta={{ label: 'Rent on Turo', onClick: () => {} }}
        />,
      );
      expect(screen.getByText('Chevrolet Corvette Stingray')).toBeInTheDocument();
      expect(screen.getByText('performance')).toBeInTheDocument();
      expect(screen.getByText('LR-001 · 2023')).toBeInTheDocument();
      expect(screen.getByText('Flagship')).toBeInTheDocument();
      expect(screen.getByText('from')).toBeInTheDocument();
      expect(screen.getByText('$250')).toBeInTheDocument();
      expect(screen.getByText('2.9s')).toBeInTheDocument();
      expect(screen.getByText('495 hp')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Rent on Turo' })).toBeInTheDocument();
    });

    it('fires the CTA handler', async () => {
      const handle = vi.fn();
      render(
        <ListingCard
          variant="spec"
          photos={photos}
          title="Corvette"
          price="$250"
          cta={{ label: 'Rent', onClick: handle }}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Rent' }));
      expect(handle).toHaveBeenCalledTimes(1);
    });

    it('has no a11y violations', async () => {
      const { container } = render(
        <ListingCard
          variant="spec"
          photos={photos}
          title="Corvette"
          category="performance"
          meta="LR-001 · 2023"
          flag={{ icon: 'flag', label: 'Flagship' }}
          pricePrefix="from"
          price="$250"
          priceUnit="/day"
          specs={[
            { label: '0-60', value: '2.9s' },
            { label: 'Power', value: '495 hp' },
            { label: 'Drive', value: 'RWD' },
          ]}
          cta={{ label: 'Rent now', onClick: () => {} }}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
