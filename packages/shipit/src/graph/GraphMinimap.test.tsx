import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { GraphMinimap } from './GraphMinimap';

const points = Array.from({ length: 8 }).map((_, i) => ({ x: (i % 4) / 4, y: Math.floor(i / 4) / 2 }));

describe('GraphMinimap', () => {
  it('renders the minimap as an image role', () => {
    render(<GraphMinimap points={points} />);
    expect(screen.getByRole('img', { name: 'Graph minimap' })).toBeInTheDocument();
  });

  it('renders the viewport rectangle when provided', () => {
    const { container } = render(
      <GraphMinimap points={points} viewport={{ x: 0.2, y: 0.2, width: 0.4, height: 0.4 }} />,
    );
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBeGreaterThan(points.length);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<GraphMinimap points={points} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
