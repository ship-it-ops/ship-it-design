import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { StatusDot } from './StatusDot';

describe('StatusDot', () => {
  it('exposes a status role with the label', () => {
    render(<StatusDot state="ok" label="Synced" />);
    expect(screen.getByRole('status')).toHaveTextContent('Synced');
  });

  it('falls back to img role with a friendly state name when no label', () => {
    render(<StatusDot state="warn" />);
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  it('respects a consumer-provided aria-label', () => {
    render(<StatusDot state="ok" aria-label="Custom" />);
    expect(screen.getByRole('img', { name: 'Custom' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<StatusDot state="ok" label="Synced" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('StatusDot color prop', () => {
  it('applies background-color inline when `color` is provided', () => {
    const { container } = render(<StatusDot color="#7c3aed" label="Premium" />);
    const dot = container.querySelector('span > span');
    expect((dot as HTMLElement).style.backgroundColor).toBe('rgb(124, 58, 237)');
  });

  it('drops the state-derived Tailwind class when `color` is provided', () => {
    const { container } = render(<StatusDot color="#7c3aed" />);
    const dot = container.querySelector('span > span');
    expect((dot as HTMLElement).className).not.toMatch(/bg-(?:ok|warn|err|accent|text-dim)/);
  });

  it('warns on invalid color', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<StatusDot color="not-a-color" />);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[StatusDot]'));
    spy.mockRestore();
  });

  it('has no a11y violations (color path)', async () => {
    const { container } = render(<StatusDot color="#7c3aed" label="Premium" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
