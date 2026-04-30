import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';
import { EntityBadge } from './EntityBadge';
import { ENTITY_GLYPH, ENTITY_TONE_BG, ENTITY_TONE_CLASS, type EntityType } from './types';

/**
 * EntityCard — display card for a graph entity. Plate (icon + tinted bg),
 * title, optional subtitle / description, and an optional stats grid.
 *
 * Stats render in a 2- or 3-column grid below the description; pass `[]` (or
 * omit) to skip them.
 */

export interface EntityStat {
  label: ReactNode;
  value: ReactNode;
  /** Tone for the value text — defaults to plain `text-text`. */
  tone?: 'accent' | 'ok' | 'warn' | 'err' | 'muted';
}

export interface EntityCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  type: EntityType;
  title: ReactNode;
  /** Subtitle line — typically owner / scope. */
  subtitle?: ReactNode;
  /** Body description. */
  description?: ReactNode;
  /** Stat tiles. Up to 6 fit comfortably across one row. */
  stats?: ReadonlyArray<EntityStat>;
  /** Right-side actions (buttons). */
  actions?: ReactNode;
  /** Override the leading glyph. */
  glyph?: ReactNode;
}

const statToneClass = {
  accent: 'text-accent',
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
  muted: 'text-text-muted',
} as const;

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(function EntityCard(
  { type, title, subtitle, description, stats, actions, glyph, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3 rounded-base border border-border bg-panel p-5',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            'grid h-12 w-12 shrink-0 place-items-center rounded-base text-[20px]',
            ENTITY_TONE_BG[type],
            ENTITY_TONE_CLASS[type],
          )}
        >
          {glyph ?? ENTITY_GLYPH[type]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <EntityBadge type={type} size="sm" />
            {subtitle && (
              <span className="font-mono text-[11px] text-text-dim">{subtitle}</span>
            )}
          </div>
          <div className="mt-1 truncate font-mono text-[18px] font-medium tracking-tight">
            {title}
          </div>
          {description && (
            <div className="mt-1 text-[13px] leading-[1.5] text-text-muted">{description}</div>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {stats && stats.length > 0 && (
        <div
          className="grid divide-x divide-border rounded-md border border-border bg-panel-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 6)}, 1fr)` }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[1.3px] text-text-dim">
                {stat.label}
              </div>
              <div
                className={cn(
                  'mt-1 text-[16px] font-medium tracking-tight',
                  stat.tone ? statToneClass[stat.tone] : 'text-text',
                )}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
