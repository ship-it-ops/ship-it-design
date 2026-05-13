import { render, screen } from '@testing-library/react';
import type cytoscape from 'cytoscape';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { GraphCanvas } from './GraphCanvas';

interface FakeCy {
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
  style: ReturnType<typeof vi.fn>;
  layout: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
}

function makeEngine(): {
  engine: (options: cytoscape.CytoscapeOptions) => cytoscape.Core;
  instances: FakeCy[];
} {
  const instances: FakeCy[] = [];
  const engine = (() => {
    const fake: FakeCy = {
      on: vi.fn(),
      off: vi.fn(),
      destroy: vi.fn(),
      style: vi.fn().mockReturnValue({ update: vi.fn() }),
      layout: vi.fn().mockReturnValue({ run: vi.fn() }),
      json: vi.fn(),
    };
    instances.push(fake);
    return fake as unknown as cytoscape.Core;
  }) as unknown as (options: cytoscape.CytoscapeOptions) => cytoscape.Core;
  return { engine, instances };
}

describe('GraphCanvas', () => {
  it('renders an accessible region', () => {
    const { engine } = makeEngine();
    render(<GraphCanvas engine={engine} elements={[]} />);
    expect(screen.getByRole('region', { name: 'Graph canvas' })).toBeInTheDocument();
  });

  it('creates and destroys a cytoscape instance', () => {
    const { engine, instances } = makeEngine();
    const { unmount } = render(<GraphCanvas engine={engine} elements={[]} />);
    expect(instances).toHaveLength(1);
    unmount();
    expect(instances[0]!.destroy).toHaveBeenCalled();
  });

  it('wires tap, mouseover, and mouseout listeners', () => {
    const { engine, instances } = makeEngine();
    const onSelect = vi.fn();
    const onNodeHover = vi.fn();
    render(
      <GraphCanvas engine={engine} elements={[]} onSelect={onSelect} onNodeHover={onNodeHover} />,
    );
    const cy = instances[0]!;
    const events = cy.on.mock.calls.map((call) => call[0]);
    expect(events).toContain('tap');
    expect(events).toContain('mouseover');
    expect(events).toContain('mouseout');
  });

  it('renders the inspector slot', () => {
    const { engine } = makeEngine();
    render(<GraphCanvas engine={engine} elements={[]} inspector={<aside>inspector body</aside>} />);
    expect(screen.getByText('inspector body')).toBeInTheDocument();
  });

  it('re-wires listeners when the engine prop changes', () => {
    const { engine: engine1, instances: inst1 } = makeEngine();
    const { engine: engine2, instances: inst2 } = makeEngine();
    const onSelect = vi.fn();
    const { rerender } = render(<GraphCanvas engine={engine1} elements={[]} onSelect={onSelect} />);
    rerender(<GraphCanvas engine={engine2} elements={[]} onSelect={onSelect} />);
    expect(inst1[0]!.destroy).toHaveBeenCalled();
    expect(inst2).toHaveLength(1);
    const newEvents = inst2[0]!.on.mock.calls.map((call) => call[0]);
    expect(newEvents).toContain('tap');
    expect(newEvents).toContain('mouseover');
    expect(newEvents).toContain('mouseout');
  });

  it('mounts the cytoscape container with inline position/inset so it survives the runtime CSS reset', () => {
    // Regression: cytoscape injects `.__________cytoscape_container { position: relative }`
    // at init time. With Tailwind v4 emitting `.absolute`/`.inset-0` into
    // `@layer utilities`, the unlayered runtime rule wins and the canvas
    // collapses to 0×0 in a static-height parent. Inline styles outrank both.
    const { engine } = makeEngine();
    const { container } = render(
      <div style={{ height: 0 }}>
        <GraphCanvas engine={engine} elements={[]} />
      </div>,
    );
    const region = container.querySelector('[role="region"]') as HTMLElement;
    const mount = region.firstElementChild as HTMLElement;
    expect(mount.style.position).toBe('absolute');
    // jsdom serializes `inset: 0` to per-side offsets — accept either form.
    const inset = mount.style.inset || mount.style.top;
    expect(inset).toMatch(/^0(px)?$/);
  });

  it('has no a11y violations', async () => {
    const { engine } = makeEngine();
    const { container } = render(<GraphCanvas engine={engine} elements={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
