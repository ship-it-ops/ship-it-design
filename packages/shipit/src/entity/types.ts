/**
 * Canonical ShipIt entity vocabulary. The six types are the categories the
 * graph cares about — anything else is rendered as `service` by default.
 */

export type EntityType =
  | 'service'
  | 'person'
  | 'document'
  | 'deployment'
  | 'incident'
  | 'ticket';

export const ENTITY_GLYPH: Record<EntityType, string> = {
  service: '◇',
  person: '○',
  document: '▤',
  deployment: '↑',
  incident: '◎',
  ticket: '▢',
};

export const ENTITY_LABEL: Record<EntityType, string> = {
  service: 'Service',
  person: 'Person',
  document: 'Document',
  deployment: 'Deployment',
  incident: 'Incident',
  ticket: 'Ticket',
};

export const ENTITY_TONE_CLASS: Record<EntityType, string> = {
  service: 'text-accent',
  person: 'text-text-muted',
  document: 'text-purple',
  deployment: 'text-ok',
  incident: 'text-err',
  ticket: 'text-warn',
};

export const ENTITY_TONE_BG: Record<EntityType, string> = {
  service: 'bg-accent-dim',
  person: 'bg-panel-2',
  document: 'bg-[color-mix(in_oklab,var(--color-purple),transparent_85%)]',
  deployment: 'bg-[color-mix(in_oklab,var(--color-ok),transparent_85%)]',
  incident: 'bg-[color-mix(in_oklab,var(--color-err),transparent_85%)]',
  ticket: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_85%)]',
};
