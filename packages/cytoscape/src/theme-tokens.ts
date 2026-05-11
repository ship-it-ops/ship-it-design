/**
 * Token resolution helpers. The Ship-It design system stores colors as CSS
 * custom properties on `<html>` (`--color-accent`, `--color-bg`, …). Cytoscape
 * renders to a canvas / SVG layer outside Tailwind, so those vars never
 * resolve — we read the *computed* values at runtime and feed them into the
 * stylesheet builder as concrete color strings.
 *
 * Two layers:
 *   1. `resolveCssVar` — single-var reader with a fallback.
 *   2. `readThemeTokens` — pulls every color the stylesheet uses, returning a
 *      flat `Record<string, string>` keyed by short name (no `--color-`
 *      prefix). Re-running this after a `data-theme` flip yields a fresh
 *      palette.
 */

import { getEntityTypeMeta, type EntityType } from '@ship-it-ui/shipit';

const DEFAULT_FALLBACK: Record<string, string> = {
  bg: '#0a0a0a',
  panel: '#0f0f0f',
  'panel-2': '#161616',
  border: '#262626',
  'border-strong': '#383838',
  text: '#fafafa',
  'text-muted': '#a3a3a3',
  'text-dim': '#737373',
  accent: '#3b82f6',
  ok: '#10b981',
  warn: '#f59e0b',
  err: '#ef4444',
  purple: '#a855f7',
  pink: '#ec4899',
};

/**
 * Read a single CSS variable from the document root and return its trimmed
 * computed value, falling back to `fallback` when the document is missing
 * (SSR) or the variable is unset.
 */
export function resolveCssVar(name: string, fallback = ''): string {
  if (typeof document === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export interface ThemeTokenPalette {
  /** Surface backgrounds. */
  bg: string;
  panel: string;
  panel2: string;
  /** Hairline + emphasis border. */
  border: string;
  borderStrong: string;
  /** Foreground tiers. */
  text: string;
  textMuted: string;
  textDim: string;
  /** Brand + status. */
  accent: string;
  ok: string;
  warn: string;
  err: string;
  /** Extras the graph uses for entity-type ring colors. */
  purple: string;
  pink: string;
}

/** Read the canonical Ship-It color tokens from the document root. */
export function readThemeTokens(): ThemeTokenPalette {
  return {
    bg: resolveCssVar('--color-bg', DEFAULT_FALLBACK.bg),
    panel: resolveCssVar('--color-panel', DEFAULT_FALLBACK.panel),
    panel2: resolveCssVar('--color-panel-2', DEFAULT_FALLBACK['panel-2']),
    border: resolveCssVar('--color-border', DEFAULT_FALLBACK.border),
    borderStrong: resolveCssVar('--color-border-strong', DEFAULT_FALLBACK['border-strong']),
    text: resolveCssVar('--color-text', DEFAULT_FALLBACK.text),
    textMuted: resolveCssVar('--color-text-muted', DEFAULT_FALLBACK['text-muted']),
    textDim: resolveCssVar('--color-text-dim', DEFAULT_FALLBACK['text-dim']),
    accent: resolveCssVar('--color-accent', DEFAULT_FALLBACK.accent),
    ok: resolveCssVar('--color-ok', DEFAULT_FALLBACK.ok),
    warn: resolveCssVar('--color-warn', DEFAULT_FALLBACK.warn),
    err: resolveCssVar('--color-err', DEFAULT_FALLBACK.err),
    purple: resolveCssVar('--color-purple', DEFAULT_FALLBACK.purple),
    pink: resolveCssVar('--color-pink', DEFAULT_FALLBACK.pink),
  };
}

/**
 * Resolve the concrete color for a registered entity type. Reads the type's
 * `colorVar` (a `var(--color-…)` string) and looks the value up in the
 * palette. Falls back to the palette's `accent` color when the var is
 * malformed or unknown.
 */
export function resolveEntityColor(type: EntityType, palette: ThemeTokenPalette): string {
  const meta = getEntityTypeMeta(type);
  return resolveColorReference(meta.colorVar, palette);
}

/**
 * Extract `foo` from `var(--color-foo)` or `var(--color-foo, fallback)`.
 * Returns `undefined` if the input doesn't match. O(n), no backtracking.
 */
function parseColorVarName(value: string): string | undefined {
  // Strip surrounding whitespace once. `String#trim` is linear, not a regex.
  let i = 0;
  while (i < value.length && isWhitespace(value.charCodeAt(i))) i++;
  if (!value.startsWith('var(', i)) return undefined;
  i += 4;
  // Skip whitespace inside the parens.
  while (i < value.length && isWhitespace(value.charCodeAt(i))) i++;
  if (!value.startsWith('--color-', i)) return undefined;
  i += 8;
  // Read the name: stop at the first whitespace, comma, or `)`.
  const start = i;
  while (i < value.length) {
    const c = value.charCodeAt(i);
    if (c === CC_COMMA || c === CC_PAREN_CLOSE || isWhitespace(c)) break;
    i++;
  }
  if (i === start) return undefined;
  // Require a closing `)` somewhere after, so we don't classify malformed
  // inputs (`var(--color-foo`) as valid references.
  const close = value.indexOf(')', i);
  if (close === -1) return undefined;
  return value.slice(start, i);
}

const CC_COMMA = 0x2c;
const CC_PAREN_CLOSE = 0x29;

function isWhitespace(cc: number): boolean {
  // ASCII whitespace: space, tab, LF, CR, FF, VT.
  return cc === 0x20 || cc === 0x09 || cc === 0x0a || cc === 0x0d || cc === 0x0c || cc === 0x0b;
}

/**
 * Map a `var(--color-foo)` reference or a raw color literal to a concrete
 * color string, using the supplied palette. Unrecognized references fall back
 * to `accent`.
 */
export function resolveColorReference(value: string, palette: ThemeTokenPalette): string {
  // Deterministic parser instead of a regex — regex variants with overlapping
  // quantifiers around the color name produced quadratic backtracking on
  // adversarial inputs (CodeQL js/polynomial-redos).
  const key = parseColorVarName(value);
  if (key === undefined) return value;
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
    default:
      return palette.accent;
  }
}
