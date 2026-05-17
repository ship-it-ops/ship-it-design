/**
 * Source of truth for every icon name in `@ship-it-ui/icons`. Each entry maps
 * a semantic name to an Iconify `[collection, icon]` tuple — the codegen in
 * `scripts/build-icon-data.ts` materialises every entry into the committed
 * `src/icon-data.ts`. `GlyphName` and `ConnectorName` are derived from these
 * maps so adding an entry here automatically expands the typed `IconGlyph`
 * `name` prop and `kind="connector"` lookups.
 *
 * Collections in use:
 *   - `lucide`        — stroke-based UI primitives (default)
 *   - `ph`            — Phosphor: softer variants when Lucide's hairlines feel wrong
 *   - `simple-icons`  — brand logos for connectors and infra-specific glyphs
 */

/** [collection, icon-name] tuple for an Iconify icon. */
export type IconRef = readonly [collection: string, icon: string];

export const glyphManifest = {
  // Brand & entity nodes
  brand: ['lucide', 'diamond'],
  service: ['lucide', 'server'],
  serviceOutline: ['lucide', 'server'],
  person: ['lucide', 'user'],
  document: ['lucide', 'file-text'],
  file: ['lucide', 'file'],
  ticket: ['lucide', 'ticket'],
  deployment: ['lucide', 'rocket'],

  // AI & status
  ask: ['lucide', 'sparkles'],
  sparkle: ['lucide', 'sparkles'],
  incident: ['lucide', 'circle-alert'],
  target: ['lucide', 'target'],
  live: ['lucide', 'circle-dot'],
  half: ['lucide', 'contrast'],
  dot: ['lucide', 'dot'],
  blockCursor: ['ph', 'cursor-text-bold'],

  // Connectors / sources (semantic glyphs, not brand logos)
  bolt: ['lucide', 'zap'],
  graph: ['lucide', 'git-fork'],
  schema: ['lucide', 'menu'],
  menu: ['lucide', 'menu'],

  // Navigation & layout
  home: ['lucide', 'house'],
  fitView: ['lucide', 'maximize'],
  cornerSquare: ['lucide', 'square'],
  expand: ['lucide', 'chevron-right'],
  collapse: ['lucide', 'chevron-down'],

  // Arrows
  next: ['lucide', 'arrow-right'],
  prev: ['lucide', 'arrow-left'],
  up: ['lucide', 'arrow-up'],
  down: ['lucide', 'arrow-down'],
  upRight: ['lucide', 'arrow-up-right'],
  downRight: ['lucide', 'arrow-down-right'],
  external: ['lucide', 'external-link'],
  enter: ['lucide', 'corner-down-left'],
  sort: ['lucide', 'arrow-up-down'],
  caretLeft: ['lucide', 'chevron-left'],
  caretRight: ['lucide', 'chevron-right'],
  caretUp: ['lucide', 'chevron-up'],
  caretDown: ['lucide', 'chevron-down'],

  // Status & actions
  confirm: ['lucide', 'check'],
  check: ['lucide', 'check'],
  close: ['lucide', 'x'],
  dismiss: ['lucide', 'x'],
  add: ['lucide', 'plus'],
  remove: ['lucide', 'minus'],
  warn: ['lucide', 'triangle-alert'],
  warnAlt: ['lucide', 'circle-alert'],
  help: ['lucide', 'circle-help'],
  info: ['lucide', 'info'],
  more: ['lucide', 'ellipsis'],
  moreVertical: ['lucide', 'ellipsis-vertical'],
  edit: ['lucide', 'pencil'],
  copy: ['lucide', 'copy'],
  refresh: ['lucide', 'refresh-cw'],

  // Interaction
  search: ['lucide', 'search'],
  cmd: ['lucide', 'command'],
  shift: ['ph', 'arrow-fat-up'],
  option: ['ph', 'option'],
  escape: ['ph', 'arrow-elbow-up-left'],
  settings: ['lucide', 'settings'],
  power: ['lucide', 'power'],

  // Punctuation & misc
  middleDot: ['lucide', 'dot'],
  mention: ['lucide', 'at-sign'],
  tag: ['lucide', 'hash'],
  approx: ['ph', 'approximate-equals'],
  infinite: ['lucide', 'infinity'],
  // `§` (section sign) has no direct Iconify equivalent — `list` is the closest
  // semantic stand-in (a section as a grouped sequence). Swap if design prefers.
  section: ['lucide', 'list'],

  // Infra-specific (brand glyphs that also appear in semantic contexts)
  kubernetes: ['simple-icons', 'kubernetes'],
  datadog: ['simple-icons', 'datadog'],
  backstage: ['simple-icons', 'backstage'],
  pagerduty: ['simple-icons', 'pagerduty'],
  github: ['simple-icons', 'github'],
} as const satisfies Record<string, IconRef>;

export const connectorManifest = {
  github: ['simple-icons', 'github'],
  notion: ['simple-icons', 'notion'],
  slack: ['simple-icons', 'slack'],
  linear: ['simple-icons', 'linear'],
  jira: ['simple-icons', 'jira'],
  pagerduty: ['simple-icons', 'pagerduty'],
  confluence: ['simple-icons', 'confluence'],
  gdrive: ['simple-icons', 'googledrive'],
  s3: ['simple-icons', 'amazons3'],
  postgres: ['simple-icons', 'postgresql'],
} as const satisfies Record<string, IconRef>;

/** Statically-typed semantic icon names — adds compile-time checking to `<IconGlyph name=…>`. */
export type GlyphName = keyof typeof glyphManifest;

/** Statically-typed connector names — used with `<IconGlyph kind="connector" name=…>`. */
export type ConnectorName = keyof typeof connectorManifest;
