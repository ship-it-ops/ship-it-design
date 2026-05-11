'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { StatusDot } from '../../components/StatusDot';
import { cn } from '../../utils/cn';

/**
 * OnboardingChecklist — list of getting-started tasks driven by remote
 * progress. Each item has a `status` (`pending` / `in-progress` / `done`)
 * that decides its dot color and label tone, plus an optional `action` slot
 * (typically a `Button`) rendered on the right.
 *
 * The header shows aggregate progress as a `Progress` bar; pass
 * `progressLabel` to override the default `"{n} of {m} complete"` text.
 */

export type OnboardingItemStatus = 'pending' | 'in-progress' | 'done';

export interface OnboardingItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  status: OnboardingItemStatus;
  /** Trailing call-to-action (typically a `Button`). */
  action?: ReactNode;
}

export interface OnboardingChecklistProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  items: ReadonlyArray<OnboardingItem>;
  /** Fires when an item row is clicked. The whole row becomes clickable when supplied. */
  onItemClick?: (id: string) => void;
  /** Header heading. Default `'Get started'`. */
  title?: ReactNode;
  /** Override the progress label rendered next to the bar. */
  progressLabel?: ReactNode;
  /** Hide the aggregate progress bar. */
  hideProgress?: boolean;
}

const statusDot: Record<OnboardingItemStatus, 'off' | 'sync' | 'ok'> = {
  pending: 'off',
  'in-progress': 'sync',
  done: 'ok',
};

const labelStateClass: Record<OnboardingItemStatus, string> = {
  pending: 'text-text',
  'in-progress': 'text-text',
  done: 'text-text-dim line-through',
};

export const OnboardingChecklist = forwardRef<HTMLElement, OnboardingChecklistProps>(
  function OnboardingChecklist(
    { items, onItemClick, title = 'Get started', progressLabel, hideProgress, className, ...props },
    ref,
  ) {
    const total = items.length;
    const done = items.filter((i) => i.status === 'done').length;

    return (
      <section
        ref={ref}
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn(
          'rounded-base border-border bg-panel flex flex-col gap-3 border p-5',
          className,
        )}
        {...props}
      >
        <header className="flex items-center gap-2">
          <span className="text-[14px] font-medium">{title}</span>
          <span className="text-text-dim ml-auto font-mono text-[11px] tabular-nums">
            {progressLabel ?? `${done} of ${total} complete`}
          </span>
        </header>
        {!hideProgress && total > 0 && (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            aria-label={typeof title === 'string' ? `${title} progress` : 'Setup progress'}
            className="bg-panel-2 h-[3px] w-full overflow-hidden rounded-full"
          >
            <span
              aria-hidden
              className={cn(
                'block h-full rounded-full transition-[width] duration-(--duration-step)',
                done === total ? 'bg-ok' : 'bg-accent',
              )}
              style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
            />
          </div>
        )}
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {items.map((item) => {
            const interactive = typeof onItemClick === 'function';
            const labelBlock = (
              <>
                <StatusDot
                  state={statusDot[item.status]}
                  pulse={item.status === 'in-progress'}
                  size={10}
                  className="mt-[3px]"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className={cn('text-[13px]', labelStateClass[item.status])}>
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-text-muted text-[12px] leading-[1.45]">
                      {item.description}
                    </span>
                  )}
                </div>
              </>
            );
            const labelRegionClass = cn(
              'flex flex-1 items-start gap-3 rounded-md px-2 py-2 text-left transition-colors duration-(--duration-micro)',
              interactive &&
                'cursor-pointer outline-none hover:bg-panel-2 focus-visible:ring-[3px] focus-visible:ring-accent-dim',
            );
            // The label region is the clickable target; the `action` slot
            // renders as a sibling so any nested button stays a peer of the
            // row button (avoiding axe `nested-interactive`).
            return (
              <li key={item.id} className="flex items-start gap-2">
                {interactive ? (
                  <button
                    type="button"
                    aria-current={item.status === 'in-progress' ? 'step' : undefined}
                    onClick={() => onItemClick(item.id)}
                    className={labelRegionClass}
                  >
                    {labelBlock}
                  </button>
                ) : (
                  <div className={labelRegionClass}>{labelBlock}</div>
                )}
                {item.action && <div className="shrink-0 self-center">{item.action}</div>}
              </li>
            );
          })}
        </ul>
      </section>
    );
  },
);

OnboardingChecklist.displayName = 'OnboardingChecklist';
