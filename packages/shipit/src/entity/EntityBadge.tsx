'use client';

import { Badge, type BadgeProps } from '@ship-it-ui/ui';
import { cn } from '@ship-it-ui/ui';
import { forwardRef, type ReactNode } from 'react';


import { getEntityTypeMeta, type EntityType } from './types';

/**
 * EntityBadge — small chip identifying an entity type. Resolves the canonical
 * glyph + label from the type, but accepts a `label` override for cases where
 * the consumer wants to show the entity's actual name.
 */

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
  const meta = getEntityTypeMeta(type);
  return (
    <Badge
      ref={ref}
      variant={meta.badgeVariant}
      data-entity-type={type}
      className={cn(className)}
      {...props}
    >
      {!hideGlyph && (
        <span aria-hidden className="font-mono">
          {meta.glyph}
        </span>
      )}
      {children ?? label ?? meta.label}
    </Badge>
  );
});

EntityBadge.displayName = 'EntityBadge';
