'use client';

import type cytoscape from 'cytoscape';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { buildShipItStylesheet, type BuildStylesheetOptions } from './stylesheet';
import { useShipItStylesheet } from './useShipItStylesheet';

/**
 * GraphCanvas — high-level wrapper around a Cytoscape instance. Owns the
 * `data-theme` ↔ stylesheet sync (via {@link useShipItStylesheet}), the
 * cytoscape lifecycle (create / destroy on mount / unmount), and a thin
 * selection API on top of Cytoscape's events.
 *
 * The component never bundles Cytoscape itself — pass the engine factory in
 * via the `engine` prop so the consumer controls the Cytoscape version and
 * any registered extensions:
 *
 * ```tsx
 * import cytoscape from 'cytoscape';
 *
 * <GraphCanvas
 *   engine={cytoscape}
 *   elements={[...]}
 *   layout={{ name: 'cose' }}
 *   onSelect={(node) => setSelected(node.id())}
 *   inspector={selected && <GraphInspector …/>}
 * />
 * ```
 */

export type CytoscapeEngine = (options: cytoscape.CytoscapeOptions) => cytoscape.Core;

export interface GraphCanvasHandle {
  /** Live Cytoscape instance. `null` until mount. */
  cy: cytoscape.Core | null;
  /** Re-read tokens and re-apply the stylesheet. */
  refreshStyles: () => void;
}

export interface GraphCanvasProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'children'
> {
  /** Cytoscape factory. Pass the imported `cytoscape` default export. */
  engine: CytoscapeEngine;
  /** Graph elements (nodes + edges). Passed straight through to Cytoscape. */
  elements: cytoscape.ElementDefinition[];
  /** Layout config. Defaults to a static `preset` layout (no auto-layout). */
  layout?: cytoscape.LayoutOptions;
  /** Fires when a node is tapped/selected. */
  onSelect?: (node: cytoscape.NodeSingular) => void;
  /** Fires when the selection is cleared (background tap). */
  onClearSelection?: () => void;
  /** Fires when the pointer enters a node. */
  onNodeHover?: (node: cytoscape.NodeSingular) => void;
  /** Fires when the pointer leaves a node. */
  onNodeLeave?: () => void;
  /** Slot rendered over the graph (e.g., a `<GraphInspector>`). Positioned top-right. */
  inspector?: ReactNode;
  /** Overrides for the stylesheet builder. */
  styleOptions?: BuildStylesheetOptions;
  /** Accessible label for the container. */
  'aria-label'?: string;
}

const DEFAULT_LAYOUT: cytoscape.LayoutOptions = { name: 'preset' };

export const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(function GraphCanvas(
  {
    engine,
    elements,
    layout = DEFAULT_LAYOUT,
    onSelect,
    onClearSelection,
    onNodeHover,
    onNodeLeave,
    inspector,
    styleOptions,
    className,
    'aria-label': ariaLabel = 'Graph canvas',
    ...props
  },
  forwardedRef,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  // Create the cytoscape instance once on mount.
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const cy = engine({
      container: containerRef.current,
      elements,
      layout,
      style: buildShipItStylesheet(styleOptions),
    });
    cyRef.current = cy;
    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // We intentionally re-create on engine swap or container remount only.
    // Elements / layout / style updates are handled in the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  // Keep elements in sync.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.json({ elements });
  }, [elements]);

  // Re-run layout when the layout config changes.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.layout(layout).run();
  }, [layout]);

  const { refresh: refreshStyles } = useShipItStylesheet(cyRef, styleOptions);

  // Wire selection events. `engine` is in the deps so the listeners re-bind
  // whenever the upstream effect destroys + recreates the Cytoscape instance —
  // without it, an `engine` swap would leave the new `cy` without handlers.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return undefined;
    const handleSelect = (event: cytoscape.EventObject) => {
      if (event.target?.isNode?.()) {
        onSelect?.(event.target as cytoscape.NodeSingular);
      }
    };
    const handleBackgroundTap = (event: cytoscape.EventObject) => {
      if (event.target === cy) onClearSelection?.();
    };
    const handleEnter = (event: cytoscape.EventObject) => {
      onNodeHover?.(event.target as cytoscape.NodeSingular);
    };
    const handleLeave = () => onNodeLeave?.();
    cy.on('tap', 'node', handleSelect);
    cy.on('tap', handleBackgroundTap);
    cy.on('mouseover', 'node', handleEnter);
    cy.on('mouseout', 'node', handleLeave);
    return () => {
      cy.off('tap', 'node', handleSelect);
      cy.off('tap', handleBackgroundTap);
      cy.off('mouseover', 'node', handleEnter);
      cy.off('mouseout', 'node', handleLeave);
    };
  }, [engine, onSelect, onClearSelection, onNodeHover, onNodeLeave]);

  // Expose the imperative handle via getters so consumers always read the live
  // `cyRef.current`. Snapshotting `cyRef.current` here would freeze it at
  // `null` because the instance is assigned inside an effect that runs *after*
  // the initial render — Copilot/Claude both flagged this.
  useImperativeHandle(
    forwardedRef,
    (): GraphCanvasHandle => ({
      get cy() {
        return cyRef.current;
      },
      refreshStyles,
    }),
    [refreshStyles],
  );

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={['relative h-full w-full', className].filter(Boolean).join(' ')}
      {...props}
    >
      {/*
       * Inline styles, not Tailwind utilities. Cytoscape injects an unlayered
       * `.__________cytoscape_container { position: relative }` stylesheet at
       * init time, and Tailwind v4 emits `.absolute`/`.inset-0` into
       * `@layer utilities` — unlayered rules outrank layered ones regardless
       * of source order, so the canvas would collapse to 0×0 in a static-
       * height parent. Inline styles win against both.
       */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      {inspector && <div className="absolute top-4 right-4 z-10">{inspector}</div>}
    </div>
  );
});

GraphCanvas.displayName = 'GraphCanvas';
