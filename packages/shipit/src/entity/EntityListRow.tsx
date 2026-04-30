import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';
import { ENTITY_GLYPH, ENTITY_TONE_CLASS, type EntityType } from './types';

/**
 * EntityListRow — compact row for entity lists (e.g., dependents / dependencies
 * panels on a detail page). Glyph dot + name + optional relation pill +
 * optional trailing meta.
 *
 * Renders as a button when `onClick` is supplied; otherwise a plain row.
 */

export interface EntityListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  type: EntityType;
  /** Entity name / id. Rendered in mono. */
  name: ReactNode;
  /** Trailing pill (e.g., relation type: `OWNED_BY`). */
  relation?: ReactNode;
  /** Trailing meta line (e.g., a timestamp). */
  meta?: ReactNode;
  /** When provided, the row becomes a clickable button. */
  onClick?: () => void;
  /** When true, hides the leading glyph dot. */
  hideGlyph?: boolean;
}

export const EntityListRow = forwardRef<HTMLElement, EntityListRowProps>(function EntityListRow(
  { type, name, relation, meta, onClick, hideGlyph, className, ...props },
  ref,
) {
  const interactive = typeof onClick === 'function';
  const baseClass = cn(
    'flex w-full items-center gap-3 border-0 bg-transparent px-2 py-2 text-left',
    'border-b border-border last:border-0',
    interactive &&
      'cursor-pointer outline-none transition-colors duration-(--duration-micro) hover:bg-panel-2 focus-visible:ring-[3px] focus-visible:ring-accent-dim',
    className,
  );

  const inner = (
    <>
      {!hideGlyph && (
        <span
          aria-hidden
          className={cn('font-mono text-[14px] leading-none', ENTITY_TONE_CLASS[type])}
        >
          {ENTITY_GLYPH[type]}
        </span>
      )}
      <span className="text-text min-w-0 flex-1 truncate font-mono text-[12px]">{name}</span>
      {relation && (
        <span className="border-border bg-panel-2 text-text-muted rounded-full border px-2 py-[2px] font-mono text-[10px]">
          {relation}
        </span>
      )}
      {meta && <span className="text-text-dim font-mono text-[10px]">{meta}</span>}
    </>
  );

  if (interactive) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        className={baseClass}
      >
        {inner}
      </button>
    );
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={baseClass} {...props}>
      {inner}
    </div>
  );
});
