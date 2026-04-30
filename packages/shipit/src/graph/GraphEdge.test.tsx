import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GraphEdge } from './GraphEdge';

describe('GraphEdge', () => {
  it('renders a line for the straight variant', () => {
    const { container } = render(
      <svg>
        <GraphEdge x1={0} y1={0} x2={100} y2={100} />
      </svg>,
    );
    expect(container.querySelector('line')).toBeTruthy();
  });

  it('renders a path when curve is provided', () => {
    const { container } = render(
      <svg>
        <GraphEdge x1={0} y1={0} x2={100} y2={100} curve={{ cx: 50, cy: 0 }} />
      </svg>,
    );
    expect(container.querySelector('path')).toBeTruthy();
  });

  it('applies dashed stroke for the dashed variant', () => {
    const { container } = render(
      <svg>
        <GraphEdge x1={0} y1={0} x2={100} y2={100} edgeStyle="dashed" />
      </svg>,
    );
    expect(container.querySelector('line')).toHaveAttribute('stroke-dasharray', '4 3');
  });
});
