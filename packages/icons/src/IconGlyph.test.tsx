import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DynamicIconGlyph, IconGlyph } from './IconGlyph';

describe('IconGlyph', () => {
  it('renders an <svg> with the icon-data body for a known name', () => {
    render(<IconGlyph name="ask" data-testid="icon" />);
    const svg = screen.getByTestId('icon');
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.getAttribute('viewBox')).toMatch(/^\d+ \d+ \d+ \d+$/);
    // The icon body is injected via dangerouslySetInnerHTML — at minimum we
    // expect *some* drawing primitive (<path>, <circle>, <g>, …).
    expect(svg.innerHTML).toMatch(/<(path|circle|rect|g|polyline|polygon|line)/);
  });

  it('is aria-hidden when no label is provided (decorative use)', () => {
    render(<IconGlyph name="confirm" data-testid="icon" />);
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes role="img" with aria-label and an embedded <title> when labelled', () => {
    render(<IconGlyph name="incident" label="Active incident" />);
    const labelled = screen.getByRole('img', { name: 'Active incident' });
    expect(labelled.querySelector('title')?.textContent).toBe('Active incident');
  });

  it('applies numeric size to width and height as px', () => {
    render(<IconGlyph name="brand" size={20} data-testid="icon" />);
    const svg = screen.getByTestId('icon');
    expect(svg).toHaveAttribute('width', '20px');
    expect(svg).toHaveAttribute('height', '20px');
  });

  it('resolves connector logos when kind="connector"', () => {
    render(<IconGlyph name="github" kind="connector" data-testid="icon" />);
    const svg = screen.getByTestId('icon');
    expect(svg.tagName.toLowerCase()).toBe('svg');
    // simple-icons github should render an SVG body (not the legacy unicode fallback).
    expect(svg.innerHTML).toMatch(/<(path|g)/);
    // No fallback <text> element — it would mean icon-data lookup failed.
    expect(svg.querySelector('text')).toBeNull();
  });
});

describe('DynamicIconGlyph', () => {
  it('renders SVG body for a known glyph name', () => {
    render(<DynamicIconGlyph name="ask" data-testid="icon" />);
    const svg = screen.getByTestId('icon');
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.querySelector('text')).toBeNull();
  });

  it('falls back to a centered <text> with the literal name when unknown', () => {
    // Post-cutover: there's no unicode `glyphs` map to consult. Unknown names
    // render as the literal string inside SVG <text>, so the caller still
    // gets a square-shaped element to lay out against.
    render(<DynamicIconGlyph name="totally-not-real-glyph" data-testid="icon" />);
    const svg = screen.getByTestId('icon');
    expect(svg.querySelector('text')?.textContent).toBe('totally-not-real-glyph');
  });
});
