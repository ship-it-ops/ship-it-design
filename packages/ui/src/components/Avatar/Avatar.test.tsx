import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';

describe('Avatar', () => {
  it('shows initials derived from name', () => {
    render(<Avatar name="Priya Khanna" />);
    expect(screen.getByText('PK')).toBeInTheDocument();
  });

  it('uses provided initials override', () => {
    render(<Avatar name="Anything" initials="XY" />);
    expect(screen.getByText('XY')).toBeInTheDocument();
  });

  it('renders status indicator with a friendly label', () => {
    render(<Avatar name="X" status="ok" />);
    expect(screen.getByLabelText('Online')).toBeInTheDocument();
  });

  it('falls back to ? when name is empty', () => {
    render(<Avatar name="" />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders without crashing when src is provided', () => {
    // Radix Avatar's <img> only mounts after a successful load event, which
    // jsdom never fires. We just exercise the `src` branch and ensure the
    // root still renders.
    const { container } = render(<Avatar name="Priya Khanna" src="https://example.com/p.png" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Avatar name="Priya Khanna" status="ok" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Avatar color prop', () => {
  it('overrides the hash-derived background with the literal color', () => {
    const { container } = render(<Avatar name="Alex" color="#7c3aed" />);
    // The Radix Avatar.Root element carries the background style.
    const root = container.querySelector('[class*="rounded-full"]');
    expect((root as HTMLElement).style.background).toBe('rgb(124, 58, 237)');
  });

  it('warns on invalid color', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Avatar name="Alex" color="not-a-color" />);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Avatar]'));
    spy.mockRestore();
  });

  it('has no a11y violations (color path)', async () => {
    const { container } = render(<Avatar name="Alex" color="#7c3aed" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('AvatarGroup', () => {
  it('shows visible avatars and overflow', () => {
    render(<AvatarGroup names={['A B', 'C D', 'E F', 'G H', 'I J']} max={3} />);
    expect(screen.getByLabelText('+2 more')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<AvatarGroup names={['A B', 'C D']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
