'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

const skeletonStyles = cva('block bg-panel-2 animate-[ship-skeleton_1.4s_infinite]', {
  variants: {
    shape: {
      line: 'rounded-xs',
      block: 'rounded-md',
      circle: 'rounded-full',
    },
  },
  defaultVariants: { shape: 'line' },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonStyles> {
  /** Width override — accepts any CSS length, e.g. `'70%'`, `120`. */
  width?: number | string;
  /** Height override. Defaults differ by shape: `line` = 14, `block` = 80, `circle` = 40. */
  height?: number | string;
  /**
   * Render this Skeleton as its own loading announcement (`role="status"`,
   * `aria-busy="true"`, `aria-label="Loading"`). Default `false` — Skeleton is
   * `aria-hidden` so a list of N skeletons does not announce N times. Wrap a
   * group of Skeletons in `<SkeletonGroup>` to get a single aggregate
   * announcement, or set `standalone` when rendering a single isolated
   * Skeleton with no surrounding live region.
   */
  standalone?: boolean;
}

const defaultHeight = { line: 14, block: 80, circle: 40 } as const;

/**
 * Visual placeholder for content that is loading. By default, Skeleton is
 * `aria-hidden` and emits no live-region announcement — wrap one or more
 * Skeletons in `<SkeletonGroup loading>` to get a single "Loading" message
 * for the whole group. For a single isolated Skeleton outside any group,
 * pass `standalone` to restore the per-element `role="status"` semantic.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = 'line', width = '100%', height, standalone = false, className, style, ...props },
  ref,
) {
  const h = height ?? defaultHeight[shape!];
  const w = shape === 'circle' ? h : width;
  const a11yProps = standalone
    ? ({ role: 'status', 'aria-busy': true, 'aria-label': 'Loading' } as const)
    : ({ 'aria-hidden': true } as const);
  return (
    <div
      ref={ref}
      {...a11yProps}
      className={cn(skeletonStyles({ shape }), className)}
      style={{ width: w, height: h, ...style }}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export interface SkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Optional override for the announcement text. Defaults to `"Loading"`.
   * Pass something more specific (e.g., `"Loading inbox"`) when the context
   * makes it useful.
   */
  label?: string;
  /**
   * When `false`, the group renders as a plain wrapper with no live region —
   * useful when toggling between loading and loaded children inside the same
   * mount. Default `true`.
   */
  loading?: boolean;
}

/**
 * Wraps a group of `<Skeleton>` placeholders in a single `role="status"` /
 * `aria-busy="true"` live region so screen readers announce one "Loading"
 * message for the whole group instead of one per Skeleton.
 */
export const SkeletonGroup = forwardRef<HTMLDivElement, SkeletonGroupProps>(function SkeletonGroup(
  { label = 'Loading', loading = true, className, children, ...props },
  ref,
) {
  if (!loading) {
    return (
      <div ref={ref} className={className} {...props}>
        {children as ReactNode}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      role="status"
      aria-busy="true"
      aria-label={label}
      className={className}
      {...props}
    >
      {children as ReactNode}
    </div>
  );
});

SkeletonGroup.displayName = 'SkeletonGroup';
