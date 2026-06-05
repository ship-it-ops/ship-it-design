import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PricingCard } from './PricingCard';

describe('PricingCard', () => {
  it('renders tier, price, and features', () => {
    render(
      <PricingCard
        tier="Pro"
        price="$29 / mo"
        description="For growing teams"
        features={['Unlimited repos', 'SSO', 'Priority support']}
      />,
    );
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('$29 / mo')).toBeInTheDocument();
    expect(screen.getByText('SSO')).toBeInTheDocument();
  });

  it('shows the recommended pill when featured', () => {
    render(<PricingCard tier="Pro" price="$29" features={['x']} featured />);
    expect(screen.getByText('recommended')).toBeInTheDocument();
  });

  it('renders priceUnit alongside the price', () => {
    render(<PricingCard tier="Pro" price="$29" priceUnit="/ user / mo" features={['x']} />);
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('/ user / mo')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <PricingCard tier="Pro" price="$29 / mo" features={['Feature one', 'Feature two']} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not emit JSON-LD without priceCurrency', () => {
    const { container } = render(<PricingCard tier="Pro" price="$29" features={['x']} />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('emits an Offer JSON-LD when priceCurrency is set and price is parseable', () => {
    const { container } = render(
      <PricingCard
        tier="Pro"
        price="$29"
        description="For growing teams"
        features={['x']}
        priceCurrency="USD"
        availability="https://schema.org/InStock"
        url="https://ship.it/pro"
      />,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(parsed).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: 'Pro',
      description: 'For growing teams',
      price: 29,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://ship.it/pro',
    });
  });

  it('skips JSON-LD when price is not numerically parseable (e.g. "Talk to us")', () => {
    const { container } = render(
      <PricingCard tier="Enterprise" price="Talk to us" features={['x']} priceCurrency="USD" />,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('uses explicit priceAmount when provided, regardless of visible price', () => {
    const { container } = render(
      <PricingCard
        tier="Enterprise"
        price="Talk to us"
        priceAmount={2999}
        features={['x']}
        priceCurrency="USD"
      />,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(parsed.price).toBe(2999);
  });

  it('skips JSON-LD when tier is JSX without tierName fallback', () => {
    const { container } = render(
      <PricingCard tier={<span>Pro</span>} price="$29" features={['x']} priceCurrency="USD" />,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('omits the JSON-LD script when noStructuredData is set', () => {
    const { container } = render(
      <PricingCard tier="Pro" price="$29" features={['x']} priceCurrency="USD" noStructuredData />,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('escapes </script> in description', () => {
    const { container } = render(
      <PricingCard
        tier="Pro"
        price="$29"
        description={'</script><img onerror=alert(1)>'}
        features={['x']}
        priceCurrency="USD"
      />,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toMatch(/<\/script>/i);
    expect(script.innerHTML).toContain('\\u003c/script>');
  });
});
