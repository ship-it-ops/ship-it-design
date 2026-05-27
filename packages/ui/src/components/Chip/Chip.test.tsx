import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Chip } from './Chip';

describe('Chip', () => {
  it('renders', () => {
    render(<Chip>filter</Chip>);
    expect(screen.getByText('filter')).toBeInTheDocument();
  });

  it('renders the leading icon slot', () => {
    render(<Chip icon={<span data-testid="cicon">@</span>}>username</Chip>);
    expect(screen.getByTestId('cicon')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Chip onRemove={() => {}}>tag</Chip>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Chip color prop', () => {
  it('applies an inline tint when `color` is provided', () => {
    render(<Chip color="#7c3aed">Brand</Chip>);
    const el = screen.getByText('Brand');
    expect(el.style.background).toMatch(/color-mix\(in oklab/);
    expect(el.style.color).toBe('rgb(124, 58, 237)');
  });

  it('warns on invalid color', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Chip color="not-a-color">Bad</Chip>);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Chip]'));
    spy.mockRestore();
  });

  it('has no a11y violations (color path)', async () => {
    const { container } = render(<Chip color="#7c3aed">Brand</Chip>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
