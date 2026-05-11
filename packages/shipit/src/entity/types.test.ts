import { afterEach, describe, expect, it } from 'vitest';

import {
  ENTITY_GLYPH,
  ENTITY_LABEL,
  ENTITY_TONE_BG,
  ENTITY_TONE_CLASS,
  getEntityTypeMeta,
  registerEntityType,
  registerEntityTypes,
  resetEntityTypeRegistry,
} from './types';

describe('entity type registry', () => {
  afterEach(() => {
    resetEntityTypeRegistry();
  });

  it('resolves built-in types', () => {
    expect(getEntityTypeMeta('service').label).toBe('Service');
    expect(getEntityTypeMeta('incident').toneClass).toBe('text-err');
    expect(getEntityTypeMeta('deployment').colorVar).toBe('var(--color-ok)');
    expect(getEntityTypeMeta('person').badgeVariant).toBe('neutral');
  });

  it('falls back to the service meta for unknown types', () => {
    const fallback = getEntityTypeMeta('repository');
    expect(fallback.label).toBe('Service');
    expect(fallback.glyph).toBe('◇');
  });

  it('registers a new type', () => {
    registerEntityType('repository', {
      glyph: '◆',
      label: 'Repository',
      toneClass: 'text-accent',
      toneBg: 'bg-accent-dim',
      colorVar: 'var(--color-accent)',
      badgeVariant: 'accent',
    });
    const meta = getEntityTypeMeta('repository');
    expect(meta.label).toBe('Repository');
    expect(meta.glyph).toBe('◆');
  });

  it('bulk-registers a map of types', () => {
    registerEntityTypes({
      pipeline: {
        glyph: '⇄',
        label: 'Pipeline',
        toneClass: 'text-ok',
        toneBg: 'bg-panel-2',
        colorVar: 'var(--color-ok)',
        badgeVariant: 'ok',
      },
      monitor: {
        glyph: '◉',
        label: 'Monitor',
        toneClass: 'text-warn',
        toneBg: 'bg-panel-2',
        colorVar: 'var(--color-warn)',
        badgeVariant: 'warn',
      },
    });
    expect(getEntityTypeMeta('pipeline').label).toBe('Pipeline');
    expect(getEntityTypeMeta('monitor').label).toBe('Monitor');
  });

  it('lets a registered type override a built-in', () => {
    registerEntityType('service', {
      glyph: '★',
      label: 'Service (custom)',
      toneClass: 'text-pink',
      toneBg: 'bg-panel-2',
      colorVar: 'var(--color-pink)',
      badgeVariant: 'pink',
    });
    expect(getEntityTypeMeta('service').label).toBe('Service (custom)');
  });

  it('resetEntityTypeRegistry restores the built-ins', () => {
    registerEntityType('service', {
      glyph: '!',
      label: 'Overwritten',
      toneClass: 'text-pink',
      toneBg: 'bg-panel-2',
      colorVar: 'var(--color-pink)',
      badgeVariant: 'pink',
    });
    resetEntityTypeRegistry();
    expect(getEntityTypeMeta('service').label).toBe('Service');
  });

  it('keeps the deprecated record exports for built-ins', () => {
    expect(ENTITY_GLYPH.service).toBe('◇');
    expect(ENTITY_LABEL.incident).toBe('Incident');
    expect(ENTITY_TONE_CLASS.deployment).toBe('text-ok');
    expect(ENTITY_TONE_BG.ticket).toContain('color-mix');
  });
});
