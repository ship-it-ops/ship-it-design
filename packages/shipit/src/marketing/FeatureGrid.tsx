import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * FeatureGrid — responsive grid of feature tiles. Each tile shows a glyph,
 * title, body description.
 */

export interface Feature {
  glyph: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

export interface FeatureGridProps extends HTMLAttributes<HTMLDivElement> {
  features: ReadonlyArray<Feature>;
  /** Columns at the largest breakpoint. Default 3. */
  columns?: 2 | 3 | 4;
}

const colsClass = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
} as const;

export const FeatureGrid = forwardRef<HTMLDivElement, FeatureGridProps>(function FeatureGrid(
  { features, columns = 3, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('grid grid-cols-1 gap-3', colsClass[columns], className)}
      {...props}
    >
      {features.map((f, i) => (
        <div key={i} className="rounded-base border-border bg-panel border p-5">
          <div aria-hidden className="text-accent mb-3 text-[22px]">
            {f.glyph}
          </div>
          <div className="mb-[6px] text-[14px] font-medium">{f.title}</div>
          <div className="text-text-muted text-[12px] leading-[1.55]">{f.description}</div>
        </div>
      ))}
    </div>
  );
});

FeatureGrid.displayName = 'FeatureGrid';
