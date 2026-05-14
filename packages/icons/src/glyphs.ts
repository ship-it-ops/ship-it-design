/**
 * Canonical glyph vocabulary for Ship-It UIs.
 *
 * The design system is glyph-first: we use unicode characters as iconography rather
 * than a conventional icon library. Glyphs render at text weight, monochromatic, in
 * `currentColor`, in any size — which gives the engineering-console feel.
 *
 * Sourced from `design-handoff/project/README.md` (the brand-rule glyph table) and
 * `design-handoff/project/library/sec-ai-marketing-icons.jsx` (the full inventory).
 *
 * Use via `<IconGlyph name="ask" />` rather than literal characters in JSX, so a
 * glyph swap in this file propagates everywhere.
 *
 * ## Intentional aliases
 *
 * Some keys map to the same glyph on purpose — the same character carries
 * different *semantic intent* at the call site. Picking the alias whose name
 * matches what the UI is *saying* (`schema` vs `menu`, `dismiss` vs `close`)
 * keeps grep-ability and screen-reader semantics aligned with intent. Current
 * aliases:
 *
 *   - service ↔ serviceOutline (both ◇)
 *   - incident ↔ target (both ◎)
 *   - cmd ↔ schema ↔ menu (all ≡)
 *   - ask ↔ sparkle (both ✦)
 *   - upRight ↔ external (both ↗)
 *   - confirm ↔ check (both ✓)
 *   - close ↔ dismiss (both ×)
 *   - warn ↔ warnAlt (both !)
 *
 * If design intent diverges (e.g. `dismiss` should become a distinct glyph
 * from `close`), swap the alias's value here — every consumer using the
 * renamed key picks up the change automatically.
 */

export const glyphs = {
  // Brand & entity nodes
  brand: '◆',
  service: '◇',
  serviceOutline: '◇',
  person: '○',
  document: '▤',
  file: '▢',

  // AI & status
  ask: '✦',
  sparkle: '✦',
  incident: '◎',
  target: '◎',
  live: '◉',
  half: '◐',
  dot: '▪',
  blockCursor: '▊',

  // Connectors / sources
  bolt: '⌁',
  graph: '⋈',
  schema: '≡',
  menu: '≡',

  // Navigation & layout
  home: '⌂',
  fitView: '◱',
  cornerSquare: '◱',
  expand: '▸',
  collapse: '▾',

  // Arrows
  next: '→',
  prev: '←',
  up: '↑',
  down: '↓',
  upRight: '↗',
  downRight: '↘',
  external: '↗',
  enter: '↵',
  sort: '⇅',
  caretLeft: '‹',
  caretRight: '›',
  caretUp: '▴',
  caretDown: '⌄',

  // Status & actions
  confirm: '✓',
  check: '✓',
  close: '×',
  dismiss: '×',
  add: '+',
  remove: '−',
  warn: '!',
  warnAlt: '!',
  help: '?',
  info: 'ⓘ',
  more: '⋯',
  moreVertical: '⋮',
  edit: '✎',
  copy: '⧉',
  refresh: '↻',

  // Interaction
  search: '⌕',
  cmd: '⌘',
  shift: '⇧',
  option: '⌥',
  escape: '⎋',
  settings: '⚙',
  power: '⏻',

  // Punctuation & misc
  middleDot: '·',
  mention: '@',
  tag: '#',
  approx: '~',
  infinite: '∞',
  section: '§',

  // Infra-specific (per handoff README brand-rule table)
  kubernetes: '⎔',
  datadog: '◉',
  backstage: '▨',
  pagerduty: '◔',
  github: '⌨',
} as const;

export type GlyphName = keyof typeof glyphs;

/**
 * Connector logos — single-character placeholders for known sources.
 * The handoff README notes: "for connector logos we reach for real brand SVGs
 * (see assets/connectors/)." These are placeholders until real SVGs land.
 */
export const connectorGlyphs = {
  github: '⎈',
  notion: 'N',
  slack: '#',
  linear: 'L',
  jira: 'J',
  pagerduty: 'P',
  confluence: 'C',
  gdrive: 'G',
  s3: 'S',
  postgres: 'Ψ',
} as const;

export type ConnectorName = keyof typeof connectorGlyphs;

/** Programmatic lookup — returns the glyph or the name itself if unknown (graceful fallback). */
export function resolveGlyph(name: GlyphName | string): string {
  return (glyphs as Record<string, string>)[name] ?? name;
}
