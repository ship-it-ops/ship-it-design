import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { FeatureGrid } from './FeatureGrid';

const features = [
  { glyph: '◇', title: 'Live graph', description: 'Append-only.' },
  { glyph: '✦', title: 'Ask anything', description: 'NL queries.' },
];

describe('FeatureGrid', () => {
  it('renders each feature', () => {
    render(<FeatureGrid features={features} />);
    expect(screen.getByText('Live graph')).toBeInTheDocument();
    expect(screen.getByText('Ask anything')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<FeatureGrid features={features} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
