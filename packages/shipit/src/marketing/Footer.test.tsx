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

  it('has no a11y violations', async () => {
    const { container } = render(<Footer brand="ShipIt" columns={columns} copyright="©" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
