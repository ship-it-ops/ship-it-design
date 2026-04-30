import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Footer } from './Footer';

const columns = [
  { heading: 'Product', links: [{ label: 'Graph', href: '/graph' }, { label: 'Ask', href: '/ask' }] },
  { heading: 'Company', links: [{ label: 'About', href: '/about' }] },
];

describe('Footer', () => {
  it('renders all link columns and the copyright', () => {
    render(<Footer brand="ShipIt" columns={columns} copyright="© 2026 ShipIt, Inc." />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Graph' })).toHaveAttribute('href', '/graph');
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Footer brand="ShipIt" columns={columns} copyright="©" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
