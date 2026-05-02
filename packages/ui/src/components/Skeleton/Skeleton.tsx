import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

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
}

const defaultHeight = { line: 14, block: 80, circle: 40 } as const;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = 'line', width = '100%', height, className, style, ...props },
  ref,
) {
  const h = height ?? defaultHeight[shape!];
  const w = shape === 'circle' ? h : width;
  return (
    <div
      ref={ref}
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className={cn(skeletonStyles({ shape }), className)}
      style={{ width: w, height: h, ...style }}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';
