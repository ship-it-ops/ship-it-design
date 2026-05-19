import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { GraphElement } from './adapter';
import { GraphEditorCanvas } from './GraphEditorCanvas';

// React Flow needs a sized container to render; jsdom doesn't compute layout
// so we shim `getBoundingClientRect`. RF still mounts even without it, but
// without a width/height it skips the node tree.
function stubBoundingRect() {
  const original = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 600,
      bottom: 400,
      width: 600,
      height: 400,
      toJSON: () => ({}),
    } as DOMRect;
  };
  return () => {
    Element.prototype.getBoundingClientRect = original;
  };
}

const ELEMENTS: GraphElement[] = [
  { data: { id: 'a', label: 'Alpha', entityType: 'service' }, position: { x: 0, y: 0 } },
  { data: { id: 'b', label: 'Beta', entityType: 'service' }, position: { x: 200, y: 0 } },
  { data: { id: 'e-ab', source: 'a', target: 'b' } },
];

// The canvas's mini-map uses React Flow's `useStore` which loops in jsdom
// without a real layout. Disable it for unit tests; mini-map is exercised
// manually on the docs site.
const CANVAS_DEFAULTS = { miniMap: false } as const;

describe('GraphEditorCanvas', () => {
  it('renders with role=application and the supplied aria-label', () => {
    const restore = stubBoundingRect();
    try {
      render(
        <div style={{ width: 600, height: 400 }}>
          <GraphEditorCanvas elements={ELEMENTS} aria-label="Schema editor" {...CANVAS_DEFAULTS} />
        </div>,
      );
      const root = screen.getByRole('application', { name: 'Schema editor' });
      expect(root).toBeInTheDocument();
      expect(root).toHaveAttribute('tabindex', '0');
    } finally {
      restore();
    }
  });

  it('renders the inspector slot top-right', () => {
    const restore = stubBoundingRect();
    try {
      render(
        <div style={{ width: 600, height: 400 }}>
          <GraphEditorCanvas
            elements={ELEMENTS}
            inspector={<div data-testid="inspector">Panel</div>}
            {...CANVAS_DEFAULTS}
          />
        </div>,
      );
      expect(screen.getByTestId('inspector')).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('renders a consumer toolbar in the top-left slot', () => {
    const restore = stubBoundingRect();
    try {
      render(
        <div style={{ width: 600, height: 400 }}>
          <GraphEditorCanvas
            elements={ELEMENTS}
            toolbar={<div data-testid="toolbar">+ Service</div>}
            {...CANVAS_DEFAULTS}
          />
        </div>,
      );
      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('renders the built-in "+ Add" button when no toolbar is supplied and onNodeAdd is provided', () => {
    const restore = stubBoundingRect();
    try {
      render(
        <div style={{ width: 600, height: 400 }}>
          <GraphEditorCanvas elements={ELEMENTS} onNodeAdd={() => {}} {...CANVAS_DEFAULTS} />
        </div>,
      );
      expect(screen.getByRole('button', { name: 'Add node' })).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('suppresses the built-in "+ Add" button when onNodeAdd is not provided', () => {
    const restore = stubBoundingRect();
    try {
      render(
        <div style={{ width: 600, height: 400 }}>
          <GraphEditorCanvas elements={ELEMENTS} {...CANVAS_DEFAULTS} />
        </div>,
      );
      expect(screen.queryByRole('button', { name: 'Add node' })).not.toBeInTheDocument();
    } finally {
      restore();
    }
  });
});
