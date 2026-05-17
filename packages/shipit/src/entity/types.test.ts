import { afterEach, describe, expect, it } from 'vitest';

import {
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

  it('built-ins all carry an iconName for SVG rendering', () => {
    expect(getEntityTypeMeta('service').iconName).toBe('service');
    expect(getEntityTypeMeta('person').iconName).toBe('person');
    expect(getEntityTypeMeta('document').iconName).toBe('document');
    expect(getEntityTypeMeta('deployment').iconName).toBe('deployment');
    expect(getEntityTypeMeta('incident').iconName).toBe('incident');
    expect(getEntityTypeMeta('ticket').iconName).toBe('ticket');
  });

  it('falls back to the service meta for unknown types', () => {
    const fallback = getEntityTypeMeta('repository');
    expect(fallback.label).toBe('Service');
    expect(fallback.iconName).toBe('service');
  });

  it('registers a new type', () => {
    registerEntityType('repository', {
      iconName: 'brand',
      label: 'Repository',
      toneClass: 'text-accent',
      toneBg: 'bg-accent-dim',
      colorVar: 'var(--color-accent)',
      badgeVariant: 'accent',
    });
    const meta = getEntityTypeMeta('repository');
    expect(meta.label).toBe('Repository');
    expect(meta.iconName).toBe('brand');
  });

  it('bulk-registers a map of types', () => {
    registerEntityTypes({
      pipeline: {
        iconName: 'bolt',
        label: 'Pipeline',
        toneClass: 'text-ok',
        toneBg: 'bg-panel-2',
        colorVar: 'var(--color-ok)',
        badgeVariant: 'ok',
      },
      monitor: {
        iconName: 'target',
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
      iconName: 'brand',
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
      iconName: 'warn',
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
    expect(ENTITY_LABEL.incident).toBe('Incident');
    expect(ENTITY_TONE_CLASS.deployment).toBe('text-ok');
    expect(ENTITY_TONE_BG.ticket).toContain('color-mix');
  });
});
