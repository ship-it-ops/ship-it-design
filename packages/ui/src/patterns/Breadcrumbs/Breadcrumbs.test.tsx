import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Breadcrumbs, Crumb } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('marks the last crumb as current', () => {
    render(
      <Breadcrumbs>
        <Crumb href="/">Workspace</Crumb>
        <Crumb href="/graph">Graph</Crumb>
        <Crumb>payment-webhook</Crumb>
      </Breadcrumbs>,
    );
    expect(screen.getByText('payment-webhook')).toHaveAttribute('aria-current', 'page');
  });

  it('earlier crumbs render as links', () => {
    render(
      <Breadcrumbs>
        <Crumb href="/">Workspace</Crumb>
        <Crumb href="/graph">Graph</Crumb>
        <Crumb>payment-webhook</Crumb>
      </Breadcrumbs>,
    );
    expect(screen.getByRole('link', { name: 'Workspace' })).toHaveAttribute('href', '/');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Breadcrumbs>
        <Crumb href="/">Home</Crumb>
        <Crumb>Page</Crumb>
      </Breadcrumbs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('emits a BreadcrumbList JSON-LD with position/name/item for every string-labeled crumb', () => {
    const { container } = render(
      <Breadcrumbs>
        <Crumb href="/">Workspace</Crumb>
        <Crumb href="/graph">Graph</Crumb>
        <Crumb>payment-webhook</Crumb>
      </Breadcrumbs>,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const parsed = JSON.parse(script.textContent ?? '{}');
    expect(parsed).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
    });
    expect(parsed.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Workspace', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Graph', item: '/graph' },
      { '@type': 'ListItem', position: 3, name: 'payment-webhook' },
    ]);
  });

  it('omits the JSON-LD script when noStructuredData is set', () => {
    const { container } = render(
      <Breadcrumbs noStructuredData>
        <Crumb href="/">Home</Crumb>
        <Crumb>Page</Crumb>
      </Breadcrumbs>,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('skips crumbs with non-string labels', () => {
    const { container } = render(
      <Breadcrumbs>
        <Crumb href="/">Home</Crumb>
        <Crumb href="/x">
          <span>Rich label</span>
        </Crumb>
        <Crumb>Tail</Crumb>
      </Breadcrumbs>,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    // The middle crumb is JSX-only — skipped.
    expect(parsed.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 3, name: 'Tail' },
    ]);
  });

  it('escapes </script> in crumb labels', () => {
    const { container } = render(
      <Breadcrumbs>
        <Crumb href="/">Home</Crumb>
        <Crumb>{'</script><img onerror=alert(1)>'}</Crumb>
      </Breadcrumbs>,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toMatch(/<\/script>/i);
    expect(script.innerHTML).toContain('\\u003c/script>');
    const parsed = JSON.parse(script.textContent ?? '{}');
    expect(parsed.itemListElement[1].name).toBe('</script><img onerror=alert(1)>');
  });
});
