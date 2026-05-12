'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * PullToRefresh — controlled visual indicator for the pull-to-refresh
 * interaction. Renders the rotating arrow + state label that appears at the
 * top of a scrolling list as the user pulls.
 *
 * This is the *visual* primitive only. The gesture (touch tracking, threshold
 * detection, async refresh) is left to the consumer because that wiring is
 * app-specific (router refresh, query invalidation, route reload, etc.). Pass
 * the current `state` and the indicator updates to match.
 */

export type PullToRefreshState = 'idle' | 'pulling' | 'ready' | 'loading';

const labels: Record<PullToRefreshState, string> = {
  idle: 'Pull to refresh',
  pulling: 'Pull to refresh',
  ready: 'Release to refresh',
  loading: 'Refreshing…',
};

export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  /** Current state. Drive this from your gesture handler. */
  state?: PullToRefreshState;
  /** Override the default state label. */
  label?: ReactNode;
}

export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(function PullToRefresh(
  { state = 'idle', label, className, ...props },
  ref,
) {
  const isLoading = state === 'loading';
  // 0deg when idle / pulling, 180deg when ready (arrow flips), spin when loading.
  const transform =
    state === 'ready' ? 'rotate(180deg)' : state === 'pulling' ? 'rotate(90deg)' : 'rotate(0deg)';

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-busy={isLoading || undefined}
      className={cn('text-text-muted flex flex-col items-center gap-[6px] py-3', className)}
      {...props}
    >
      <div
        aria-hidden
        className={cn(
          'border-border border-t-accent rounded-full border-2',
          isLoading && 'animate-[ship-spin_700ms_linear_infinite]',
        )}
        style={{
          width: 22,
          height: 22,
          transform: isLoading ? undefined : transform,
          transition: isLoading ? undefined : 'transform 200ms var(--easing-out)',
        }}
      />
      <span className="text-m-eyebrow font-mono tracking-wide uppercase">
        {label ?? labels[state]}
      </span>
    </div>
  );
});

PullToRefresh.displayName = 'PullToRefresh';
