/**
 * ShipIt entity vocabulary. Six built-in categories — `service`, `person`,
 * `document`, `deployment`, `incident`, `ticket` — cover the graph's core
 * shapes. The `EntityType` type is intentionally open: consumers may pass any
 * string and register metadata for it via {@link registerEntityType} so their
 * domain types (Repository, Pipeline, Monitor, …) render with the right glyph,
 * label, and tone.
 *
 * Unregistered types fall back to the `service` visuals so a stray value never
 * crashes the UI; consumers can detect them via the `data-entity-type` attribute
 * that entity components forward to the DOM.
 */

export type KnownEntityType =
  | 'service'
  | 'person'
  | 'document'
  | 'deployment'
  | 'incident'
  | 'ticket';

// The `(string & {})` branch preserves autocomplete for the six known literals
// while still accepting any string value at runtime.
export type EntityType = KnownEntityType | (string & {});

/**
 * Variant key for the shared `Badge` component in `@ship-it-ui/ui`. Inlined here
 * to keep `types.ts` free of cross-package value imports.
 */
export type EntityBadgeVariant = 'neutral' | 'accent' | 'ok' | 'warn' | 'err' | 'purple' | 'pink';

export interface EntityTypeMeta {
  /** Single-character glyph rendered next to the type label. */
  glyph: string;
  /** Human-readable type name (e.g. `'Service'`). */
  label: string;
  /** Tailwind text-color class for the glyph and accent text. */
  toneClass: string;
  /** Tailwind background-color class for the icon plate. */
  toneBg: string;
  /** CSS color value used by graph chrome (node ring + legend dot). */
  colorVar: string;
  /** Variant for the shared `Badge` component. */
  badgeVariant: EntityBadgeVariant;
}

const BUILTIN_META: Record<KnownEntityType, EntityTypeMeta> = {
  service: {
    glyph: '◇',
    label: 'Service',
    toneClass: 'text-accent',
    toneBg: 'bg-accent-dim',
    colorVar: 'var(--color-accent)',
    badgeVariant: 'accent',
  },
  person: {
    glyph: '○',
    label: 'Person',
    toneClass: 'text-text-muted',
    toneBg: 'bg-panel-2',
    colorVar: 'var(--color-purple)',
    badgeVariant: 'neutral',
  },
  document: {
    glyph: '▤',
    label: 'Document',
    toneClass: 'text-purple',
    toneBg: 'bg-[color-mix(in_oklab,var(--color-purple),transparent_85%)]',
    colorVar: 'var(--color-pink)',
    badgeVariant: 'purple',
  },
  deployment: {
    glyph: '↑',
    label: 'Deployment',
    toneClass: 'text-ok',
    toneBg: 'bg-[color-mix(in_oklab,var(--color-ok),transparent_85%)]',
    colorVar: 'var(--color-ok)',
    badgeVariant: 'ok',
  },
  incident: {
    glyph: '◎',
    label: 'Incident',
    toneClass: 'text-err',
    toneBg: 'bg-[color-mix(in_oklab,var(--color-err),transparent_85%)]',
    colorVar: 'var(--color-warn)',
    badgeVariant: 'err',
  },
  ticket: {
    glyph: '▢',
    label: 'Ticket',
    toneClass: 'text-warn',
    toneBg: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_85%)]',
    colorVar: 'var(--color-text-muted)',
    badgeVariant: 'warn',
  },
};

const FALLBACK: EntityTypeMeta = BUILTIN_META.service;

const registry = new Map<string, EntityTypeMeta>(Object.entries(BUILTIN_META));

/**
 * Register or replace metadata for an entity type. Pass any string key — the
 * built-in six can be overridden too. Returns the registered metadata.
 */
export function registerEntityType(type: string, meta: EntityTypeMeta): EntityTypeMeta {
  registry.set(type, meta);
  return meta;
}

/** Bulk-register a map of entity types. */
export function registerEntityTypes(map: Record<string, EntityTypeMeta>): void {
  for (const [key, meta] of Object.entries(map)) {
    registry.set(key, meta);
  }
}

/**
 * Resolve metadata for an entity type. Unknown types fall back to the `service`
 * metadata so consumers never crash on a stray value.
 */
export function getEntityTypeMeta(type: EntityType): EntityTypeMeta {
  return registry.get(type) ?? FALLBACK;
}

/** Test-only helper: drop all consumer registrations and re-seed the built-ins. */
export function resetEntityTypeRegistry(): void {
  registry.clear();
  for (const key of Object.keys(BUILTIN_META) as KnownEntityType[]) {
    registry.set(key, BUILTIN_META[key]);
  }
}

/**
 * @deprecated Prefer `getEntityTypeMeta(type).glyph`. Retained for the six
 * built-in types so existing consumers keep working.
 */
export const ENTITY_GLYPH: Record<KnownEntityType, string> = {
  service: BUILTIN_META.service.glyph,
  person: BUILTIN_META.person.glyph,
  document: BUILTIN_META.document.glyph,
  deployment: BUILTIN_META.deployment.glyph,
  incident: BUILTIN_META.incident.glyph,
  ticket: BUILTIN_META.ticket.glyph,
};

/** @deprecated Prefer `getEntityTypeMeta(type).label`. */
export const ENTITY_LABEL: Record<KnownEntityType, string> = {
  service: BUILTIN_META.service.label,
  person: BUILTIN_META.person.label,
  document: BUILTIN_META.document.label,
  deployment: BUILTIN_META.deployment.label,
  incident: BUILTIN_META.incident.label,
  ticket: BUILTIN_META.ticket.label,
};

/** @deprecated Prefer `getEntityTypeMeta(type).toneClass`. */
export const ENTITY_TONE_CLASS: Record<KnownEntityType, string> = {
  service: BUILTIN_META.service.toneClass,
  person: BUILTIN_META.person.toneClass,
  document: BUILTIN_META.document.toneClass,
  deployment: BUILTIN_META.deployment.toneClass,
  incident: BUILTIN_META.incident.toneClass,
  ticket: BUILTIN_META.ticket.toneClass,
};

/** @deprecated Prefer `getEntityTypeMeta(type).toneBg`. */
export const ENTITY_TONE_BG: Record<KnownEntityType, string> = {
  service: BUILTIN_META.service.toneBg,
  person: BUILTIN_META.person.toneBg,
  document: BUILTIN_META.document.toneBg,
  deployment: BUILTIN_META.deployment.toneBg,
  incident: BUILTIN_META.incident.toneBg,
  ticket: BUILTIN_META.ticket.toneBg,
};
