'use client';

import { cn } from '@ship-it-ui/ui';
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

import { getEntityTypeMeta, type EntityType } from './types';

/**
 * EntityListRow — compact row for entity lists (e.g., dependents / dependencies
 * panels on a detail page). Glyph dot + name + optional relation pill +
 * optional trailing meta + optional trailing `actions` slot.
 *
 * Renders as a button when `onClick` is supplied; otherwise a plain row.
 *
 * When `actions` is provided, the interactive label region (button or div) is
 * wrapped in an outer container and `actions` renders as a peer sibling — so
 * any nested `<button>` in the slot stays a peer of the row button instead of
 * a descendant (avoiding axe `nested-interactive`). When `actions` is absent,
 * the rendered structure is unchanged from the original single-element form.
 *
 * For strongly-typed refs use the specialized exports `EntityListRowDiv`
 * (non-interactive) and `EntityListRowButton` (interactive). The default
 * `EntityListRow` is a thin wrapper that picks the right underlying element
 * based on whether `onClick` is provided.
 */

interface EntityListRowCommonProps {
  type: EntityType;
  /** Entity name / id. Rendered in mono. */
  name: ReactNode;
  /** Trailing pill (e.g., relation type: `OWNED_BY`). */
  relation?: ReactNode;
  /** Trailing meta line (e.g., a timestamp). */
  meta?: ReactNode;
  /**
   * Trailing action slot — typically a `Button` or `DropdownMenu` trigger.
   * Rendered as a peer sibling of the row's interactive region.
   */
  actions?: ReactNode;
  /** When true, hides the leading glyph dot. */
  hideGlyph?: boolean;
}

const dividerClass = 'border-b border-border last:border-0';

const labelClass = (interactive: boolean, className?: string) =>
  cn(
    'flex w-full items-center gap-3 border-0 bg-transparent px-2 py-2 text-left',
    interactive &&
      'cursor-pointer outline-none transition-colors duration-(--duration-micro) hover:bg-panel-2 focus-visible:ring-[3px] focus-visible:ring-accent-dim',
    className,
  );

function RowInner({
  type,
  name,
  relation,
  meta,
  hideGlyph,
}: Pick<EntityListRowCommonProps, 'type' | 'name' | 'relation' | 'meta' | 'hideGlyph'>) {
  const typeMeta = getEntityTypeMeta(type);
  return (
    <>
      {!hideGlyph && (
        <span aria-hidden className={cn('font-mono text-[14px] leading-none', typeMeta.toneClass)}>
          {typeMeta.glyph}
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
}

export interface EntityListRowDivProps
  extends EntityListRowCommonProps, Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'name'> {}

/** Non-interactive row. Use this when you have a static list of entities. */
export const EntityListRowDiv = forwardRef<HTMLDivElement, EntityListRowDivProps>(
  function EntityListRowDiv(
    { type, name, relation, meta, hideGlyph, actions, className, ...props },
    ref,
  ) {
    if (actions) {
      return (
        <div
          ref={ref}
          data-entity-type={type}
          className={cn('flex w-full items-center gap-1', dividerClass, className)}
          {...props}
        >
          <div className={labelClass(false)}>
            <RowInner
              type={type}
              name={name}
              relation={relation}
              meta={meta}
              hideGlyph={hideGlyph}
            />
          </div>
          <div className="shrink-0 self-center pr-1">{actions}</div>
        </div>
      );
    }
    return (
      <div
        ref={ref}
        data-entity-type={type}
        className={cn(labelClass(false), dividerClass, className)}
        {...props}
      >
        <RowInner type={type} name={name} relation={relation} meta={meta} hideGlyph={hideGlyph} />
      </div>
    );
  },
);

EntityListRowDiv.displayName = 'EntityListRowDiv';

export interface EntityListRowButtonProps
  extends
    EntityListRowCommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'type' | 'name' | 'onClick'> {
  /** Click handler. Required for the button variant. */
  onClick: MouseEventHandler<HTMLButtonElement>;
}

/** Interactive row rendered as a `<button>`. Use this when the row navigates. */
export const EntityListRowButton = forwardRef<HTMLButtonElement, EntityListRowButtonProps>(
  function EntityListRowButton(
    { type, name, relation, meta, hideGlyph, actions, className, onClick, ...props },
    ref,
  ) {
    if (actions) {
      return (
        <div
          data-entity-type={type}
          className={cn('flex w-full items-stretch gap-1', dividerClass, className)}
        >
          <button ref={ref} type="button" onClick={onClick} className={labelClass(true)} {...props}>
            <RowInner
              type={type}
              name={name}
              relation={relation}
              meta={meta}
              hideGlyph={hideGlyph}
            />
          </button>
          <div className="shrink-0 self-center pr-1">{actions}</div>
        </div>
      );
    }
    return (
      <button
        ref={ref}
        type="button"
        data-entity-type={type}
        onClick={onClick}
        className={cn(labelClass(true), dividerClass, className)}
        {...props}
      >
        <RowInner type={type} name={name} relation={relation} meta={meta} hideGlyph={hideGlyph} />
      </button>
    );
  },
);

EntityListRowButton.displayName = 'EntityListRowButton';

export interface EntityListRowProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'title' | 'name' | 'onClick'
> {
  type: EntityType;
  /** Entity name / id. Rendered in mono. */
  name: ReactNode;
  /** Trailing pill (e.g., relation type: `OWNED_BY`). */
  relation?: ReactNode;
  /** Trailing meta line (e.g., a timestamp). */
  meta?: ReactNode;
  /**
   * Trailing action slot — typically a `Button` or `DropdownMenu` trigger.
   * Rendered as a peer sibling of the row's interactive region so any nested
   * `<button>` in the slot avoids `nested-interactive` a11y failures.
   */
  actions?: ReactNode;
  /** When provided, the row becomes a clickable button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** When true, hides the leading glyph dot. */
  hideGlyph?: boolean;
}

/**
 * Convenience wrapper: chooses `EntityListRowButton` when `onClick` is
 * supplied, otherwise `EntityListRowDiv`. Does not forward refs — when you
 * need a typed ref, reach for the specialized component directly.
 */
export function EntityListRow({
  type,
  name,
  relation,
  meta,
  hideGlyph,
  actions,
  onClick,
  className,
  ...props
}: EntityListRowProps) {
  if (typeof onClick === 'function') {
    return (
      <EntityListRowButton
        type={type}
        name={name}
        relation={relation}
        meta={meta}
        hideGlyph={hideGlyph}
        actions={actions}
        onClick={onClick}
        className={className}
        {...(props as Omit<
          ButtonHTMLAttributes<HTMLButtonElement>,
          'title' | 'type' | 'name' | 'onClick'
        >)}
      />
    );
  }
  return (
    <EntityListRowDiv
      type={type}
      name={name}
      relation={relation}
      meta={meta}
      hideGlyph={hideGlyph}
      actions={actions}
      className={className}
      {...(props as Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'name'>)}
    />
  );
}

EntityListRow.displayName = 'EntityListRow';
