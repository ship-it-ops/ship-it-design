import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders a leading icon slot', () => {
    render(<Badge icon={<span data-testid="bicon">★</span>}>Featured</Badge>);
    expect(screen.getByTestId('bicon')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Badge variant="ok" dot>
        synced
      </Badge>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Badge color prop', () => {
  it('applies an inline tint background and color when `color` is provided', () => {
    render(<Badge color="#7c3aed">VIP</Badge>);
    const el = screen.getByText('VIP');
    // jsdom normalises color-mix: expands hex to rgb and rewrites percentage form
    expect(el.style.background).toMatch(/color-mix\(in oklab/);
    expect(el.style.color).toBe('rgb(124, 58, 237)');
  });

  it('does NOT apply variant classes when `color` is provided', () => {
    render(<Badge color="#7c3aed">VIPnoVar</Badge>);
    const el = screen.getByText('VIPnoVar');
    expect(el.className).not.toMatch(
      /text-ok|text-warn|text-err|text-purple|text-pink|text-accent/,
    );
  });

  it('warns and falls back to neutral when `color` is invalid', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Badge color="not-a-color">Bad</Badge>);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Badge]'));
    spy.mockRestore();
  });
});
