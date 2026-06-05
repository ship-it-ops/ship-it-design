import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Heading } from './Heading';

describe('Heading', () => {
  it('defaults to h2', () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
  });

  it('renders the requested level', () => {
    const { rerender } = render(<Heading as="h1">A</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    rerender(<Heading as="h6">B</Heading>);
    expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
  });

  it('forwards className and additional props', () => {
    render(
      <Heading as="h3" className="text-[18px]" data-testid="h">
        X
      </Heading>,
    );
    const h = screen.getByTestId('h');
    expect(h.tagName).toBe('H3');
    expect(h).toHaveClass('text-[18px]');
  });
});
