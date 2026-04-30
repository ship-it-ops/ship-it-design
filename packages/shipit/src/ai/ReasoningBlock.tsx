import { useControllableState } from '@ship-it/ui';
import { Children, forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * ReasoningBlock — collapsible "Reasoning · N steps · 1.8s" disclosure. Shows
 * the chain-of-thought / step trace expanded or collapsed. Pass `<ReasoningStep>`
 * children for each step.
 */

export interface ReasoningBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Override the heading label (defaults to `Reasoning · N steps`). */
  label?: ReactNode;
  /** Visible step count when label is auto. Defaults to children length. */
  stepCount?: number;
  /** Visible duration label (e.g., `1.8s`). */
  duration?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ReasoningBlock = forwardRef<HTMLDivElement, ReasoningBlockProps>(
  function ReasoningBlock(
    {
      label,
      stepCount,
      duration,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const [open, setOpen] = useControllableState<boolean>({
      value: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const inferredCount = stepCount ?? Children.count(children);
    const heading =
      label ?? `Reasoning · ${inferredCount} step${inferredCount === 1 ? '' : 's'}`;

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden rounded-md border border-border bg-panel-2',
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex w-full cursor-pointer items-center gap-[10px] border-0 bg-transparent px-[14px] py-[10px] text-left outline-none focus-visible:ring-[3px] focus-visible:ring-accent-dim"
        >
          <span aria-hidden className="font-mono text-[11px] text-text-dim">
            {open ? '▾' : '▸'}
          </span>
          <span className="text-[12px] font-medium">{heading}</span>
          {duration != null && (
            <span className="ml-auto font-mono text-[10px] text-text-dim">{duration}</span>
          )}
        </button>
        {open && (
          <div className="border-t border-border px-[14px] py-[10px] pl-9 text-[11px] leading-[1.7] text-text-muted">
            {children}
          </div>
        )}
      </div>
    );
  },
);

export interface ReasoningStepProps extends HTMLAttributes<HTMLDivElement> {
  /** 1-indexed step number. Renders accent-colored before the body. */
  step: number;
}

export const ReasoningStep = forwardRef<HTMLDivElement, ReasoningStepProps>(
  function ReasoningStep({ step, className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn('mb-[2px] last:mb-0', className)} {...props}>
        <span className="mr-[6px] font-mono text-accent">{step}.</span>
        {children}
      </div>
    );
  },
);
