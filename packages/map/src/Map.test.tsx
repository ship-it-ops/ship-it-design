import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

// Mock MapLibre — the real lib requires WebGL which jsdom doesn't provide.
vi.mock('maplibre-gl', () => {
  class FakeMap {
    constructor(_opts: unknown) {}
    flyTo() {}
    remove() {}
  }
  class FakeMarker {
    private element: HTMLElement;
    constructor(opts: { element?: HTMLElement }) {
      this.element = opts.element ?? document.createElement('div');
    }
    setLngLat() {
      return this;
    }
    addTo() {
      return this;
    }
    getElement() {
      return this.element;
    }
    remove() {}
  }
  return { default: { Map: FakeMap, Marker: FakeMarker }, Map: FakeMap, Marker: FakeMarker };
});

import { Map } from './Map';

describe('Map', () => {
  it('renders a region with an aria-label', () => {
    render(<Map center={[-122.4, 37.8]} zoom={10} aria-label="Search results map" />);
    expect(screen.getByRole('region', { name: 'Search results map' })).toBeInTheDocument();
  });

  it('renders without crashing when no markers are provided', () => {
    render(<Map center={[0, 0]} zoom={5} aria-label="Empty map" />);
    expect(screen.getByRole('region', { name: 'Empty map' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Map center={[-122.4, 37.8]} zoom={12} aria-label="Search results map" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
