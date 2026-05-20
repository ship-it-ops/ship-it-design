'use client';

import { readThemeTokens, type ThemeTokenPalette } from '@ship-it-ui/graph-tokens';
import { useCallback, useEffect, useState, type RefObject } from 'react';

/**
 * Mirrors `@ship-it-ui/cytoscape`'s `useShipItStylesheet` for React Flow.
 * RF reads its own CSS variables (`--xy-node-background-color-default`, etc.)
 * off the canvas wrapper, so the bridge:
 *
 *   1. Reads the canonical Ship-It tokens (oklch-coerced to sRGB).
 *   2. Writes them onto the wrapper as RF's expected CSS variable names.
 *   3. Subscribes to `data-theme` flips on `<html>` and re-runs.
 *
 * The bridge also exposes the resolved palette so consumers writing custom
 * `renderNode` can read the same values without re-resolving.
 */

const RF_VAR_MAP = {
  '--xy-background-color-default': 'bg',
  '--xy-node-background-color-default': 'panel',
  '--xy-node-border-default': 'accent',
  '--xy-node-color-default': 'text',
  '--xy-edge-stroke-default': 'accent',
  '--xy-edge-stroke-selected-default': 'accent',
  '--xy-selection-background-color-default': 'accent',
  '--xy-controls-button-background-color-default': 'panel',
  '--xy-controls-button-background-color-hover-default': 'panel-2',
  '--xy-controls-button-color-default': 'text',
  '--xy-controls-button-border-color-default': 'border',
} as const;

type PaletteKey =
  | 'bg'
  | 'panel'
  | 'panel-2'
  | 'border'
  | 'border-strong'
  | 'text'
  | 'text-muted'
  | 'text-dim'
  | 'accent'
  | 'ok'
  | 'warn'
  | 'err'
  | 'purple'
  | 'pink';

function paletteLookup(palette: ThemeTokenPalette, key: PaletteKey): string {
  switch (key) {
    case 'bg':
      return palette.bg;
    case 'panel':
      return palette.panel;
    case 'panel-2':
      return palette.panel2;
    case 'border':
      return palette.border;
    case 'border-strong':
      return palette.borderStrong;
    case 'text':
      return palette.text;
    case 'text-muted':
      return palette.textMuted;
    case 'text-dim':
      return palette.textDim;
    case 'accent':
      return palette.accent;
    case 'ok':
      return palette.ok;
    case 'warn':
      return palette.warn;
    case 'err':
      return palette.err;
    case 'purple':
      return palette.purple;
    case 'pink':
      return palette.pink;
  }
}

function applyPalette(el: HTMLElement, palette: ThemeTokenPalette): void {
  for (const [cssVar, key] of Object.entries(RF_VAR_MAP) as Array<[string, PaletteKey]>) {
    el.style.setProperty(cssVar, paletteLookup(palette, key));
  }
}

export interface UseGraphEditorThemeReturn {
  /** Current resolved palette. Stable until the next `data-theme` flip. */
  palette: ThemeTokenPalette;
  /** Re-read tokens and re-apply. */
  refresh: () => void;
}

/**
 * Read tokens, paint them onto the wrapper, and re-read on `data-theme`
 * changes. Returns the live palette so consumers can use it elsewhere
 * (e.g., to color SVG arrowheads inside a custom edge renderer).
 */
export function useGraphEditorTheme(
  wrapperRef: RefObject<HTMLElement | null>,
  options: { observe?: boolean } = {},
): UseGraphEditorThemeReturn {
  const { observe = true } = options;
  const [palette, setPalette] = useState<ThemeTokenPalette>(() => readThemeTokens());

  const apply = useCallback(() => {
    const next = readThemeTokens();
    setPalette(next);
    if (wrapperRef.current) applyPalette(wrapperRef.current, next);
  }, [wrapperRef]);

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

  return { palette, refresh: apply };
}
