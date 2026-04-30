import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PathOverlay } from './PathOverlay';

describe('PathOverlay', () => {
  it('renders a polyline for valid paths', () => {
    const { container } = render(
      <svg>
        <PathOverlay
          points={[
            { x: 0, y: 0 },
            { x: 10, y: 10 },
            { x: 20, y: 5 },
          ]}
        />
      </svg>,
    );
    const lines = container.querySelectorAll('polyline');
    expect(lines.length).toBe(2);
  });

  it('renders nothing for paths shorter than 2 points', () => {
    const { container } = render(
      <svg>
        <PathOverlay points={[{ x: 0, y: 0 }]} />
      </svg>,
    );
    expect(container.querySelectorAll('polyline').length).toBe(0);
  });

  it('skips the halo when halo=false', () => {
    const { container } = render(
      <svg>
        <PathOverlay
          points={[
            { x: 0, y: 0 },
            { x: 10, y: 10 },
          ]}
          halo={false}
        />
      </svg>,
    );
    expect(container.querySelectorAll('polyline').length).toBe(1);
  });
});
