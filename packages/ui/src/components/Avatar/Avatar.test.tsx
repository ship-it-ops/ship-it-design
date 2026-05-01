import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

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

  it('renders status indicator', () => {
    render(<Avatar name="X" status="ok" />);
    expect(screen.getByLabelText('status: ok')).toBeInTheDocument();
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
