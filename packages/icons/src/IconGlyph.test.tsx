import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IconGlyph } from './IconGlyph';

describe('IconGlyph', () => {
  it('renders the glyph for a known name', () => {
    render(<IconGlyph name="ask" data-testid="icon" />);
    expect(screen.getByTestId('icon').textContent).toBe('✦');
  });

  it('falls back to the name itself when unknown', () => {
    render(<IconGlyph name="totally-not-real-glyph" data-testid="icon" />);
    expect(screen.getByTestId('icon').textContent).toBe('totally-not-real-glyph');
  });

  it('is aria-hidden when no label is provided (decorative use)', () => {
    render(<IconGlyph name="confirm" data-testid="icon" />);
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes role="img" with aria-label when labelled', () => {
    render(<IconGlyph name="incident" label="Active incident" />);
    const labelled = screen.getByRole('img', { name: 'Active incident' });
    expect(labelled.textContent).toBe('◎');
  });

  it('applies numeric size as px', () => {
    render(<IconGlyph name="brand" size={20} data-testid="icon" />);
    expect(screen.getByTestId('icon')).toHaveStyle({ fontSize: '20px' });
  });

  it('resolves connector glyphs when kind="connector"', () => {
    render(<IconGlyph name="github" kind="connector" data-testid="icon" />);
    expect(screen.getByTestId('icon').textContent).toBe('⎈');
  });
});
