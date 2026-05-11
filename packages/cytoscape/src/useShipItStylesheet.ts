'use client';

import type cytoscape from 'cytoscape';
import { useCallback, useEffect } from 'react';

import { buildShipItStylesheet, type BuildStylesheetOptions } from './stylesheet';

/**
 * useShipItStylesheet — keeps a Cytoscape instance's stylesheet in sync with
 * the live design-token palette. Re-applies the stylesheet whenever
 * `<html data-theme>` flips, so toggling between dark and light propagates to
 * the graph without remounting.
 *
 * Returns a `refresh()` callback the consumer can invoke after any other
 * theme-affecting change (e.g., a `--color-accent` hue knob update).
 *
 * ```ts
 * const cyRef = useRef<cytoscape.Core | null>(null);
 * const { refresh } = useShipItStylesheet(cyRef);
 * ```
 */

export interface UseShipItStylesheetOptions extends BuildStylesheetOptions {
  /** Skip the MutationObserver wiring (e.g., when the host owns its own observer). */
  observe?: boolean;
}

export interface UseShipItStylesheetReturn {
  /** Re-read tokens and re-apply the stylesheet. */
  refresh: () => void;
}

export function useShipItStylesheet(
  cyRef: { current: cytoscape.Core | null },
  options: UseShipItStylesheetOptions = {},
): UseShipItStylesheetReturn {
  const { observe = true, ...buildOptions } = options;

  const apply = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.style(buildShipItStylesheet(buildOptions)).update();
  }, [cyRef, buildOptions]);

  useEffect(() => {
    apply();
    if (!observe || typeof document === 'undefined') return undefined;
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, [apply, observe]);

  return { refresh: apply };
}
