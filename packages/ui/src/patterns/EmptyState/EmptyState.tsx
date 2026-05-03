'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * EmptyState — placeholder for empty lists, no-results states, and error
 * surfaces. A 48×48 icon plate sits above a title + description and an
 * optional action area (button or chip stack).
 *
 * Tone controls the icon plate color. Omit `tone` for a neutral plate (the
 * default for empty lists / no-results); pass `accent | ok | warn | err` to
 * signal semantic intent (e.g., `err` for sync failures).
 */

const plateStyles = cva('grid h-12 w-12 place-items-center rounded-base text-[22px]', {
  variants: {
    tone: {
      neutral: 'bg-panel-2 text-text-muted',
      accent: 'bg-accent-dim text-accent',
      ok: 'bg-[color-mix(in_oklab,var(--color-ok),transparent_85%)] text-ok',
      warn: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_85%)] text-warn',
      err: 'bg-[color-mix(in_oklab,var(--color-err),transparent_85%)] text-err',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

type PlateVariantProps = VariantProps<typeof plateStyles>;

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Glyph or icon node shown in the rounded plate. */
  icon?: ReactNode;
  /** Title heading. */
  title: ReactNode;
  /** Body description. */
  description?: ReactNode;
  /** Optional primary action (e.g., a Button) below the description. */
  action?: ReactNode;
  /** Optional list of chip-style suggestions instead of (or below) the action. */
  chips?: ReadonlyArray<{ label: ReactNode; onClick?: () => void }>;
  /** Semantic tone for the icon plate. Omit for the neutral default. */
  tone?: Exclude<PlateVariantProps['tone'], 'neutral' | null | undefined> | undefined;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, chips, tone, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-base border-border bg-panel flex flex-col items-center gap-[10px] border border-dashed p-6 text-center',
        className,
      )}
      {...props}
    >
      {icon != null && (
        <span aria-hidden className={plateStyles({ tone: tone ?? 'neutral' })}>
          {icon}
        </span>
      )}
      <div className="text-[14px] font-medium">{title}</div>
      {description && (
        <div className="text-text-muted max-w-[260px] text-[12px] leading-[1.5]">{description}</div>
      )}
      {chips && chips.length > 0 && (
        <div className="flex w-full flex-col gap-1">
          {chips.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={c.onClick}
              className={cn(
                'border-border bg-panel-2 text-text-muted cursor-pointer rounded-md border px-[10px] py-[6px] text-[11px]',
                'hover:border-border-strong hover:text-text outline-none',
                'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      {action}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
