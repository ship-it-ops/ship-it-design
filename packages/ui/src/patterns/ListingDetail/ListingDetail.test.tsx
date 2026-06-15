import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ListingDetail } from './ListingDetail';

const photos = ['/p1.jpg', '/p2.jpg', '/p3.jpg'];

describe('ListingDetail', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the title, price, rating, and host when open', () => {
    render(
      <ListingDetail
        open
        photos={photos}
        title="2023 Tesla Model 3"
        eyebrow="Mid-size sedan · Berkeley"
        rating={4.92}
        reviewCount={238}
        price="$89"
        priceUnit="/day"
        host={{ name: 'Jamie', verified: true, meta: 'Host since 2022 · 312 trips' }}
      />,
    );
    expect(screen.getByRole('heading', { name: '2023 Tesla Model 3' })).toBeInTheDocument();
    expect(screen.getByText('$89')).toBeInTheDocument();
    expect(screen.getByText('4.92')).toBeInTheDocument();
    expect(screen.getByText('(238 reviews)')).toBeInTheDocument();
    expect(screen.getByText('Hosted by Jamie')).toBeInTheDocument();
    expect(screen.getByText('Host since 2022 · 312 trips')).toBeInTheDocument();
  });

  it('fires action handlers', async () => {
    const book = vi.fn();
    const message = vi.fn();
    render(
      <ListingDetail
        open
        photos={photos}
        title="Tesla"
        price="$89"
        primaryAction={{ label: 'Book now', onClick: book }}
        secondaryAction={{ label: 'Message host', onClick: message }}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Book now' }));
    await userEvent.click(screen.getByRole('button', { name: 'Message host' }));
    expect(book).toHaveBeenCalledTimes(1);
    expect(message).toHaveBeenCalledTimes(1);
  });

  it('opens the fullscreen lightbox when the gallery is clicked', async () => {
    render(<ListingDetail open photos={photos} title="Tesla" price="$89" />);
    // Two dialogs once Lightbox opens — the listing detail + the photo viewer.
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Open photo viewer' }));
    expect(screen.getAllByRole('dialog')).toHaveLength(2);
  });

  it('renders feature chips with icons', () => {
    render(
      <ListingDetail
        open
        photos={photos}
        title="Tesla"
        price="$89"
        features={[
          { icon: 'seat', label: '5 seats' },
          { icon: 'fuel', label: 'Electric' },
          { icon: 'snowflake', label: 'A/C' },
        ]}
      />,
    );
    expect(screen.getByText('5 seats')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('A/C')).toBeInTheDocument();
  });

  /*
   * Axe must scan `document.body`, not the RTL container — Radix Dialog
   * portals its Content outside the render wrapper. See
   * docs/agent/patterns/test-setup-portal-axe.md.
   */
  it('has no a11y violations when open', async () => {
    render(
      <ListingDetail
        open
        photos={photos}
        title="2023 Tesla Model 3"
        eyebrow="Mid-size sedan"
        rating={4.92}
        reviewCount={238}
        price="$89"
        priceUnit="/day"
        host={{ name: 'Jamie', verified: true, meta: 'Host since 2022' }}
        features={[
          { icon: 'seat', label: '5 seats' },
          { icon: 'fuel', label: 'Electric' },
        ]}
        description="Long-range RWD. Clean interior."
        primaryAction={{ label: 'Book now' }}
        secondaryAction={{ label: 'Message host' }}
      />,
    );
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('keeps the gallery carousel in sync after navigating inside the lightbox', async () => {
    // The shared `galleryIndex` already feeds both surfaces. The bug this
    // covers: Carousel only scrolled its viewport from inside its own
    // goTo, so closing the lightbox on a different photo used to leave
    // the gallery showing the old slide. With the controlled-sync effect
    // the viewport now scrolls (behavior: 'instant') whenever the controlled
    // `index` prop changes from outside.
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const fivePhotos = ['/p1.jpg', '/p2.jpg', '/p3.jpg', '/p4.jpg', '/p5.jpg'];
    render(<ListingDetail open photos={fivePhotos} title="Tesla" price="$89" />);

    // jsdom reports clientWidth: 0; force a real value so the sync effect
    // doesn't bail on the early-return — and so the scroll target left is
    // determinate.
    const width = 300;
    const viewport = document.querySelector('[aria-live="polite"]') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { value: width, configurable: true });

    await userEvent.click(screen.getByRole('button', { name: 'Open photo viewer' }));
    const lightbox = screen.getByRole('dialog', { name: /Tesla photos/ });

    scrollSpy.mockClear();
    fireEvent.keyDown(lightbox, { key: 'ArrowRight' });
    fireEvent.keyDown(lightbox, { key: 'ArrowRight' });

    // Two →: lightbox is on real photo index 2. With ListingDetail's
    // default `loop=true`, the gallery's DOM child for real idx 2 lives
    // at viewport.children[3] (a clone of last sits at index 0). The
    // controlled-sync effect repositions the viewport horizontally with
    // `scrollTo({ left, behavior: 'instant' })` — left 3 * width — rather
    // than scrollIntoView, which would drag the window vertically.
    const autoCallIndexes: number[] = [];
    scrollSpy.mock.calls.forEach((call, i) => {
      const [opts] = call;
      if ((opts as ScrollToOptions | undefined)?.behavior === 'instant') {
        autoCallIndexes.push(i);
      }
    });
    expect(autoCallIndexes.length).toBeGreaterThan(0);
    const lastAutoCallIndex = autoCallIndexes[autoCallIndexes.length - 1]!;
    expect(scrollSpy.mock.instances[lastAutoCallIndex]).toBe(viewport);
    expect((scrollSpy.mock.calls[lastAutoCallIndex]![0] as ScrollToOptions).left).toBe(3 * width);
  });

  it('passes mode="gallery" to renderPhoto inline and mode="lightbox" when fullscreen opens', async () => {
    const seen: Array<'gallery' | 'lightbox'> = [];
    render(
      <ListingDetail
        open
        photos={photos}
        title="Tesla"
        price="$89"
        renderPhoto={(src, _i, mode) => {
          seen.push(mode);
          return <div data-testid={`photo-${mode}`}>{src}</div>;
        }}
      />,
    );
    expect(seen).toContain('gallery');
    await userEvent.click(screen.getByRole('button', { name: 'Open photo viewer' }));
    expect(seen).toContain('lightbox');
  });

  describe('variant="spec"', () => {
    it('renders flag, category, meta, specs, and the bottom CTA', () => {
      render(
        <ListingDetail
          variant="spec"
          open
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
      expect(
        screen.getByRole('heading', { name: 'Chevrolet Corvette Stingray' }),
      ).toBeInTheDocument();
      expect(screen.getByText('performance')).toBeInTheDocument();
      expect(screen.getByText('LR-001 · 2023')).toBeInTheDocument();
      expect(screen.getByText('Flagship')).toBeInTheDocument();
      expect(screen.getByText('2.9s')).toBeInTheDocument();
      expect(screen.getByText('495 hp')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Rent on Turo' })).toBeInTheDocument();
    });

    it('has no a11y violations', async () => {
      render(
        <ListingDetail
          variant="spec"
          open
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
          description="Long-range RWD coupe."
          cta={{ label: 'Rent now' }}
        />,
      );
      expect(await axe(document.body)).toHaveNoViolations();
    });
  });

  describe('structured data', () => {
    it('emits Accommodation JSON-LD by default and renders outside the portal', () => {
      const { container } = render(
        <ListingDetail
          // Intentionally NOT open — the JSON-LD must still ship to the page.
          photos={photos}
          title="Sun-soaked cabin"
          price="189"
          rating={4.7}
          reviewCount={42}
          url="https://ship.it/cabin"
        />,
      );
      // The script lives in the container (not inside the Radix Portal which
      // wouldn't be in `container` when the dialog is closed).
      const script = container.querySelector('script[type="application/ld+json"]')!;
      expect(script).not.toBeNull();
      const parsed = JSON.parse(script.textContent ?? '{}');
      expect(parsed).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Accommodation',
        name: 'Sun-soaked cabin',
        url: 'https://ship.it/cabin',
        image: photos,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: 4.7,
          reviewCount: 42,
          bestRating: 5,
        },
      });
    });

    it('emits Product JSON-LD for spec variant with additionalProperty from specs', () => {
      const { container } = render(
        <ListingDetail
          variant="spec"
          photos={photos}
          title="Corvette"
          price="$250"
          priceCurrency="USD"
          specs={[
            { label: '0-60', value: '2.9s' },
            { label: 'Power', value: '495 hp' },
          ]}
        />,
      );
      const parsed = JSON.parse(
        container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
      );
      expect(parsed['@type']).toBe('Product');
      expect(parsed.offers).toMatchObject({ price: 250, priceCurrency: 'USD' });
      expect(parsed.additionalProperty).toEqual([
        { '@type': 'PropertyValue', name: '0-60', value: '2.9s' },
        { '@type': 'PropertyValue', name: 'Power', value: '495 hp' },
      ]);
    });

    it('omits the JSON-LD script when noStructuredData is set', () => {
      const { container } = render(
        <ListingDetail photos={photos} title="X" price="$189" noStructuredData />,
      );
      expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
    });

    it('escapes </script> in the JSON-LD payload', () => {
      const { container } = render(
        <ListingDetail photos={photos} title={'</script><img onerror=alert(1)>'} price="$189" />,
      );
      const script = container.querySelector('script[type="application/ld+json"]')!;
      expect(script.innerHTML).not.toMatch(/<\/script>/i);
      expect(script.innerHTML).toContain('\\u003c/script>');
    });
  });
});
