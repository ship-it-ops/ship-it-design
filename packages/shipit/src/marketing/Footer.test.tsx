import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Footer } from './Footer';

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Graph', href: '/graph' },
      { label: 'Ask', href: '/ask' },
    ],
  },
  { heading: 'Company', links: [{ label: 'About', href: '/about' }] },
];

describe('Footer', () => {
  it('renders all link columns and the copyright', () => {
    render(<Footer brand="ShipIt" columns={columns} copyright="© 2026 ShipIt, Inc." />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Graph' })).toHaveAttribute('href', '/graph');
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });

  it('renders each link column as a <ul> of <li> rows', () => {
    const { container } = render(<Footer brand="ShipIt" columns={columns} copyright="©" />);
    const lists = container.querySelectorAll('footer ul');
    expect(lists.length).toBe(columns.length);
    // Product column should have 2 li rows (Graph, Ask); Company should have 1 (About).
    expect(lists[0]!.querySelectorAll(':scope > li').length).toBe(2);
    expect(lists[1]!.querySelectorAll(':scope > li').length).toBe(1);
    // Anchors live inside <li>, not as raw siblings.
    for (const a of container.querySelectorAll('footer a')) {
      expect(a.parentElement?.tagName).toBe('LI');
    }
  });

  it('renders the address slot inside an <address> element when provided', () => {
    const { container } = render(
      <Footer
        brand="ShipIt"
        columns={columns}
        address="1 Market St · San Francisco"
        copyright="©"
      />,
    );
    const address = container.querySelector('footer address');
    expect(address).not.toBeNull();
    expect(address?.textContent).toContain('1 Market St');
  });

  it('passes target and defaults rel to noopener noreferrer for target="_blank" links', () => {
    render(
      <Footer
        columns={[
          {
            heading: 'Social',
            links: [
              { label: 'Twitter', href: 'https://x.com', target: '_blank' },
              {
                label: 'Maps',
                href: 'https://maps.example',
                target: '_blank',
                rel: 'me external',
              },
              { label: 'About', href: '/about' },
            ],
          },
        ]}
        copyright="©"
      />,
    );
    const external = screen.getByRole('link', { name: 'Twitter' });
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');

    const explicitRel = screen.getByRole('link', { name: 'Maps' });
    expect(explicitRel).toHaveAttribute('target', '_blank');
    expect(explicitRel).toHaveAttribute('rel', 'me external');

    const internal = screen.getByRole('link', { name: 'About' });
    expect(internal).not.toHaveAttribute('target');
    expect(internal).not.toHaveAttribute('rel');
  });

  it('uses ml-auto distribution for the default/split align', () => {
    const { container, rerender } = render(
      <Footer brand="ShipIt" columns={columns} copyright="©" closing="made with care" />,
    );
    const columnsGroup = container.querySelector('footer > div:first-child > div:last-child');
    expect(columnsGroup?.className).toContain('ml-auto');
    expect(container.querySelector('footer .border-t span:last-child')?.className).toContain(
      'ml-auto',
    );

    rerender(
      <Footer
        brand="ShipIt"
        columns={columns}
        copyright="©"
        closing="made with care"
        align="split"
      />,
    );
    expect(
      container.querySelector('footer > div:first-child > div:last-child')?.className,
    ).toContain('ml-auto');
  });

  it('removes ml-auto from the columns group when align="center"', () => {
    const { container } = render(
      <Footer
        brand="ShipIt"
        columns={columns}
        copyright="©"
        closing="made with care"
        align="center"
      />,
    );
    const columnsGroup = container.querySelector('footer > div:first-child > div:last-child');
    expect(columnsGroup?.className).not.toContain('ml-auto');
    expect(columnsGroup?.className).toContain('mx-auto');
    const closing = container.querySelector('footer .border-t span:last-child');
    expect(closing?.className).not.toContain('ml-auto');
    expect(closing?.className).toContain('mx-auto');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Footer brand="ShipIt" columns={columns} copyright="©" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
