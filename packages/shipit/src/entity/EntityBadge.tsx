import { Badge, type BadgeProps } from '@ship-it/ui';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../utils/cn';

import { ENTITY_GLYPH, ENTITY_LABEL, type EntityType } from './types';

/**
 * EntityBadge — small chip identifying an entity type. Resolves the canonical
 * glyph + label from the type, but accepts a `label` override for cases where
 * the consumer wants to show the entity's actual name.
 */

const typeVariant: Record<EntityType, BadgeProps['variant']> = {
  service: 'accent',
  person: 'neutral',
  document: 'purple',
  deployment: 'ok',
  incident: 'err',
  ticket: 'warn',
};

export interface EntityBadgeProps extends Omit<BadgeProps, 'variant'> {
  type: EntityType;
  /** Override the visible label. Defaults to the canonical type label. */
  label?: ReactNode;
  /** Hide the leading glyph. */
  hideGlyph?: boolean;
}

export const EntityBadge = forwardRef<HTMLSpanElement, EntityBadgeProps>(function EntityBadge(
  { type, label, hideGlyph, className, children, ...props },
  ref,
) {
  return (
    <Badge ref={ref} variant={typeVariant[type]} className={cn(className)} {...props}>
      {!hideGlyph && (
        <span aria-hidden className="font-mono">
          {ENTITY_GLYPH[type]}
        </span>
      )}
      {children ?? label ?? ENTITY_LABEL[type]}
    </Badge>
  );
});
