import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders the viewport with children', () => {
    render(
      <ScrollArea data-testid="scroll">
        <div>scrollable content</div>
      </ScrollArea>,
    );
    expect(screen.getByText('scrollable content')).toBeInTheDocument();
  });

  it('applies a custom class to the root', () => {
    render(
      <ScrollArea data-testid="scroll" className="h-32 w-64">
        <div>x</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll').className).toContain('h-32');
  });

  it('renders the children regardless of orientation', () => {
    render(
      <ScrollArea orientation="horizontal" data-testid="scroll">
        <div style={{ width: 999 }}>wide content</div>
      </ScrollArea>,
    );
    expect(screen.getByText('wide content')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ScrollArea aria-label="Recent activity">
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
