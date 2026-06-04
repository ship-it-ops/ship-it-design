import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ComparisonTable, type ComparisonOption, type ComparisonRow } from './ComparisonTable';

const options: ComparisonOption[] = [
  {
    id: 'us',
    name: 'ShipIt',
    description: 'The platform.',
    url: 'https://ship.it',
    featured: true,
  },
  { id: 'a', name: 'Competitor A' },
  { id: 'b', name: 'Competitor B' },
];

const rows: ComparisonRow[] = [
  { feature: 'SSR', values: { us: true, a: false, b: true } },
  { feature: 'Price', values: { us: '$29', a: '$49', b: '$39' } },
  { feature: 'Seats', values: { us: 10, a: 5, b: 5 } },
];

function renderBasic(overrides: Partial<React.ComponentProps<typeof ComparisonTable>> = {}) {
  return render(
    <ComparisonTable caption="Pricing comparison" options={options} rows={rows} {...overrides} />,
  );
}

describe('ComparisonTable', () => {
  it('renders a table with a caption, scope=col option headers, and scope=row feature headers', () => {
    renderBasic();
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(within(table).getByText('Pricing comparison')).toBeInTheDocument();

    // Three option columns (header row also has a leading corner cell, hidden from AT).
    expect(screen.getByRole('columnheader', { name: /ShipIt/ })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('columnheader', { name: /Competitor A/ })).toHaveAttribute(
      'scope',
      'col',
    );

    // Row headers — this is the AI/SEO whole point.
    expect(screen.getByRole('rowheader', { name: /^SSR/ })).toHaveAttribute('scope', 'row');
    expect(screen.getByRole('rowheader', { name: /^Price/ })).toHaveAttribute('scope', 'row');
    expect(screen.getByRole('rowheader', { name: /^Seats/ })).toHaveAttribute('scope', 'row');
  });

  it('marks the featured column on header and every data cell, and auto-injects "recommended"', () => {
    const { container } = renderBasic();
    const featuredHeader = screen.getByRole('columnheader', { name: /ShipIt/ });
    expect(featuredHeader).toHaveAttribute('data-featured', 'true');
    expect(within(featuredHeader).getByText('recommended')).toBeInTheDocument();

    // Every td in the featured column carries data-featured="true".
    const featuredCells = container.querySelectorAll('tbody td[data-featured="true"]');
    expect(featuredCells.length).toBe(rows.length);
  });

  it('lets an explicit `badge` override the auto "recommended" pill, and `badge: null` suppresses it', () => {
    const { rerender } = render(
      <ComparisonTable
        caption="t"
        options={[{ id: 'us', name: 'ShipIt', featured: true, badge: 'BEST VALUE' }]}
        rows={[{ feature: 'x', values: { us: true } }]}
      />,
    );
    expect(screen.getByText('BEST VALUE')).toBeInTheDocument();
    expect(screen.queryByText('recommended')).not.toBeInTheDocument();

    rerender(
      <ComparisonTable
        caption="t"
        options={[{ id: 'us', name: 'ShipIt', featured: true, badge: null }]}
        rows={[{ feature: 'x', values: { us: true } }]}
      />,
    );
    expect(screen.queryByText('recommended')).not.toBeInTheDocument();
  });

  it('renders boolean cells as icon + sr-only Yes/No with data-cell-value', () => {
    const { container } = renderBasic();
    const ssrRow = screen.getByRole('rowheader', { name: /^SSR/ }).closest('tr')!;
    const cells = within(ssrRow).getAllByRole('cell');
    // us=true → "Yes"
    expect(within(cells[0]!).getByText('Yes')).toHaveClass('sr-only');
    // a=false → "No"
    expect(within(cells[1]!).getByText('No')).toHaveClass('sr-only');

    expect(cells[0]).toHaveAttribute('data-cell-type', 'boolean');
    expect(cells[0]).toHaveAttribute('data-cell-value', 'true');
    expect(cells[1]).toHaveAttribute('data-cell-value', 'false');

    // Number cell.
    const seatsRow = screen.getByRole('rowheader', { name: /^Seats/ }).closest('tr')!;
    const seatsCells = within(seatsRow).getAllByRole('cell');
    expect(seatsCells[0]).toHaveAttribute('data-cell-type', 'number');
    expect(seatsCells[0]).toHaveAttribute('data-cell-value', '10');

    // Sanity: only the empty corner header is aria-hidden — featured cells aren't hidden.
    expect(container.querySelector('thead th[aria-hidden]')).toBeInTheDocument();
  });

  it('renders object cells with a small note line', () => {
    renderBasic({
      rows: [
        {
          feature: 'Storage',
          values: { us: { value: '50 GB', note: 'expandable' }, a: '10 GB', b: '20 GB' },
        },
      ],
    });
    expect(screen.getByText('50 GB')).toBeInTheDocument();
    expect(screen.getByText('expandable')).toBeInTheDocument();
  });

  it('emits a <tfoot> only when at least one option provides an `action`', () => {
    const { container, rerender } = renderBasic();
    expect(container.querySelector('tfoot')).toBeNull();

    rerender(
      <ComparisonTable
        caption="t"
        options={[{ id: 'us', name: 'ShipIt', action: <button>Buy</button> }]}
        rows={[{ feature: 'x', values: { us: true } }]}
      />,
    );
    expect(container.querySelector('tfoot')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Buy' })).toBeInTheDocument();
  });

  it('groups rows under a colgroup header when `group` is set', () => {
    const { container } = renderBasic({
      rows: [
        { feature: 'SSR', group: 'Runtime', values: { us: true, a: false, b: true } },
        { feature: 'Edge', group: 'Runtime', values: { us: true, a: false, b: false } },
        { feature: 'Price', group: 'Billing', values: { us: '$29', a: '$49', b: '$39' } },
      ],
    });
    const tbodies = container.querySelectorAll('tbody[data-group]');
    expect(tbodies.length).toBe(2);
    expect(tbodies[0]!.getAttribute('data-group')).toBe('Runtime');
    expect(tbodies[1]!.getAttribute('data-group')).toBe('Billing');
    expect(screen.getByText('Runtime')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
  });

  it('applies sticky-header utilities only when `stickyHeader` is set', () => {
    const { container, rerender } = renderBasic();
    expect(container.querySelector('thead')?.className).not.toMatch(/sticky/);
    rerender(<ComparisonTable caption="t" options={options} rows={rows} stickyHeader />);
    expect(container.querySelector('thead')?.className).toMatch(/sticky/);
  });

  it('emits a single application/ld+json script with the right shape by default', () => {
    const { container } = renderBasic();
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(1);

    const parsed = JSON.parse(scripts[0]!.textContent ?? '[]') as Array<{
      '@context': string;
      '@type': string;
      name: string;
      description?: string;
      url?: string;
      additionalProperty: Array<{ '@type': string; name: string; value: string }>;
    }>;

    expect(parsed.length).toBe(3);
    expect(parsed[0]).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'ShipIt',
      description: 'The platform.',
      url: 'https://ship.it',
    });
    expect(parsed[0]!.additionalProperty).toEqual([
      { '@type': 'PropertyValue', name: 'SSR', value: 'Yes' },
      { '@type': 'PropertyValue', name: 'Price', value: '$29' },
      { '@type': 'PropertyValue', name: 'Seats', value: '10' },
    ]);
    // Cell with `false` should serialize to "No" — not be dropped.
    expect(parsed[1]!.additionalProperty[0]).toEqual({
      '@type': 'PropertyValue',
      name: 'SSR',
      value: 'No',
    });
  });

  it('honours a custom `schema` @type', () => {
    const { container } = renderBasic({ schema: 'SoftwareApplication' });
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const parsed = JSON.parse(script.textContent ?? '[]');
    expect(parsed[0]['@type']).toBe('SoftwareApplication');
  });

  it('escapes </script> in the JSON-LD payload', () => {
    const { container } = render(
      <ComparisonTable
        caption="t"
        options={[{ id: 'x', name: 'X' }]}
        rows={[{ feature: '</script><img onerror=alert(1)>', values: { x: 'oops' } }]}
      />,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const raw = script.innerHTML;
    // The literal `</script>` must not appear — escaped form must.
    expect(raw).not.toMatch(/<\/script>/i);
    expect(raw).toContain('\\u003c/script>');
    // And it still parses back to a useful value.
    const parsed = JSON.parse(script.textContent ?? '[]');
    expect(parsed[0].additionalProperty[0].name).toBe('</script><img onerror=alert(1)>');
  });

  it('suppresses the JSON-LD script when `noStructuredData` is set', () => {
    const { container } = renderBasic({ noStructuredData: true });
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('uses schemaName as a fallback when feature/name are JSX', () => {
    const { container } = render(
      <ComparisonTable
        caption="t"
        options={[{ id: 'us', name: <span>ShipIt™</span>, schemaName: 'ShipIt' }]}
        rows={[
          {
            feature: <em>Server-Side Rendering</em>,
            schemaName: 'SSR',
            values: { us: true },
          },
        ]}
      />,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '[]',
    );
    expect(parsed[0].name).toBe('ShipIt');
    expect(parsed[0].additionalProperty[0].name).toBe('SSR');
  });

  it('renders option.tagline as an eyebrow above the name', () => {
    render(
      <ComparisonTable
        caption="t"
        options={[{ id: 'pro', name: 'Pro', tagline: 'MOST POPULAR' }]}
        rows={[{ feature: 'x', values: { pro: true } }]}
      />,
    );
    const header = screen.getByRole('columnheader', { name: /Pro/ });
    const tagline = within(header).getByText('MOST POPULAR');
    const name = within(header).getByText('Pro');
    // Tagline appears earlier in document order than the name.
    expect(tagline.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders a string option.icon as an IconGlyph, JSX as itself', () => {
    const { rerender } = render(
      <ComparisonTable
        caption="t"
        options={[{ id: 'x', name: 'X', icon: 'check' }]}
        rows={[{ feature: 'f', values: { x: true } }]}
      />,
    );
    const headerWithStringIcon = screen.getByRole('columnheader', { name: /X/ });
    // IconGlyph renders an inline SVG.
    expect(headerWithStringIcon.querySelector('svg')).not.toBeNull();

    rerender(
      <ComparisonTable
        caption="t"
        options={[
          {
            id: 'x',
            name: 'X',
            icon: <span data-testid="custom-brand">▲</span>,
          },
        ]}
        rows={[{ feature: 'f', values: { x: true } }]}
      />,
    );
    expect(screen.getByTestId('custom-brand')).toBeInTheDocument();
  });

  it('renders option.description visibly AND keeps it in JSON-LD', () => {
    const { container } = render(
      <ComparisonTable
        caption="t"
        options={[{ id: 'pro', name: 'Pro', description: 'For growing teams.' }]}
        rows={[{ feature: 'f', values: { pro: true } }]}
      />,
    );
    // Visible in the header.
    const header = screen.getByRole('columnheader', { name: /Pro/ });
    expect(within(header).getByText('For growing teams.')).toBeInTheDocument();
    // Still in JSON-LD.
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '[]',
    );
    expect(parsed[0].description).toBe('For growing teams.');
  });

  it('scales the option name with headerSize', () => {
    const { rerender } = render(
      <ComparisonTable
        caption="t"
        options={[{ id: 'x', name: 'Plan X' }]}
        rows={[{ feature: 'f', values: { x: true } }]}
        headerSize="sm"
      />,
    );
    const sm = screen.getByText('Plan X');
    expect(sm.className).toMatch(/text-\[12px\]/);

    rerender(
      <ComparisonTable
        caption="t"
        options={[{ id: 'x', name: 'Plan X' }]}
        rows={[{ feature: 'f', values: { x: true } }]}
        headerSize="lg"
      />,
    );
    const lg = screen.getByText('Plan X');
    expect(lg.className).toMatch(/text-\[18px\]/);
  });

  it('centers option columns when headerAlign="center" without affecting the row-header column', () => {
    render(
      <ComparisonTable
        caption="t"
        options={[{ id: 'x', name: 'X' }]}
        rows={[{ feature: 'SSR', values: { x: true } }]}
        headerAlign="center"
      />,
    );
    const optionHeader = screen.getByRole('columnheader', { name: /^X/ });
    expect(optionHeader.className).toMatch(/text-center/);
    const optionCell = within(
      screen.getByRole('rowheader', { name: /^SSR/ }).closest('tr')!,
    ).getAllByRole('cell')[0]!;
    expect(optionCell.className).toMatch(/text-center/);
    const rowHeader = screen.getByRole('rowheader', { name: /^SSR/ });
    expect(rowHeader.className).toMatch(/text-left/);
    expect(rowHeader.className).not.toMatch(/text-center/);
  });

  it('marks the featured header with data-prominent-featured when prominentFeatured is on', () => {
    const { rerender } = renderBasic({ prominentFeatured: true });
    const featuredHeader = screen.getByRole('columnheader', { name: /ShipIt/ });
    expect(featuredHeader).toHaveAttribute('data-prominent-featured', 'true');

    // Non-featured columns never carry the attribute.
    expect(screen.getByRole('columnheader', { name: /Competitor A/ })).not.toHaveAttribute(
      'data-prominent-featured',
    );

    // prominentFeatured without any featured option does nothing.
    rerender(
      <ComparisonTable
        caption="t"
        options={[{ id: 'x', name: 'X' }]}
        rows={[{ feature: 'f', values: { x: true } }]}
        prominentFeatured
      />,
    );
    expect(screen.getByRole('columnheader', { name: /X/ })).not.toHaveAttribute(
      'data-prominent-featured',
    );
  });

  it('has no a11y violations', async () => {
    const { container } = renderBasic({
      options: [
        { id: 'us', name: 'ShipIt', featured: true, action: <button>Start</button> },
        { id: 'a', name: 'Competitor A', action: <button>Compare</button> },
      ],
      rows: [
        { feature: 'SSR', group: 'Runtime', values: { us: true, a: false } },
        { feature: 'Edge', group: 'Runtime', values: { us: true, a: false } },
        { feature: 'Price', values: { us: '$29', a: '$49' } },
      ],
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
