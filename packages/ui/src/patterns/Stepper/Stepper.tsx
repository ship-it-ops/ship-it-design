import { forwardRef, Fragment, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

/**
 * Stepper — wizard / multi-step progress indicator. Computes done / current /
 * upcoming state from the `current` index so the consumer just passes labels.
 */

export type StepState = 'done' | 'current' | 'upcoming';

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Ordered step labels. */
  steps: ReadonlyArray<string>;
  /** Zero-based index of the current step. Steps before are `done`, after are `upcoming`. */
  current: number;
}

const dotBase =
  'h-6 w-6 rounded-full grid place-items-center text-[11px] font-mono font-semibold border';

const dotStateClass: Record<StepState, string> = {
  done: 'bg-accent text-on-accent border-accent',
  current: 'bg-accent-dim text-accent border-accent',
  upcoming: 'bg-panel text-text-dim border-border',
};

const labelStateClass: Record<StepState, string> = {
  done: 'text-text',
  current: 'text-text font-medium',
  upcoming: 'text-text-dim',
};

function stateFor(index: number, current: number): StepState {
  if (index < current) return 'done';
  if (index === current) return 'current';
  return 'upcoming';
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  { steps, current, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="list"
      aria-label="Progress"
      className={cn('flex w-full items-center', className)}
      {...props}
    >
      {steps.map((label, i) => {
        const state = stateFor(i, current);
        const connectorActive = i < current;
        return (
          <Fragment key={label}>
            <div
              role="listitem"
              aria-current={state === 'current' ? 'step' : undefined}
              className="flex items-center gap-2"
            >
              <span aria-hidden className={cn(dotBase, dotStateClass[state])}>
                {state === 'done' ? '✓' : i + 1}
              </span>
              <span className={cn('text-[12px]', labelStateClass[state])}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn('mx-3 h-px flex-1', connectorActive ? 'bg-accent' : 'bg-border')}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
});
