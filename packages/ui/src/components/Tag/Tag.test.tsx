import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Tag } from './Tag';

describe('Tag', () => {
  it('renders text', () => {
    render(<Tag>backend</Tag>);
    expect(screen.getByText('backend')).toBeInTheDocument();
  });

  it('renders the leading icon slot', () => {
    render(<Tag icon={<span data-testid="ticon">#</span>}>backend</Tag>);
    expect(screen.getByTestId('ticon')).toBeInTheDocument();
  });

  it('calls onRemove when × is clicked', async () => {
    const handle = vi.fn();
    render(<Tag onRemove={handle}>x</Tag>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(handle).toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Tag onRemove={() => {}}>tag</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Tag color prop', () => {
  it('applies an inline tint when `color` is provided', () => {
    render(<Tag color="#7c3aed">Brand</Tag>);
    const el = screen.getByText('Brand');
    // jsdom normalizes color-mix; match the recipe loosely.
    expect(el.style.background).toMatch(/color-mix\(in oklab/);
    expect(el.style.color).toBe('rgb(124, 58, 237)');
  });

  it('warns on invalid color', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Tag color="not-a-color">Bad</Tag>);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Tag]'));
    spy.mockRestore();
  });

  it('has no a11y violations (color path)', async () => {
    const { container } = render(<Tag color="#7c3aed">Brand</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
