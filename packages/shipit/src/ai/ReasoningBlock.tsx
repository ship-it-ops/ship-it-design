import { useControllableState } from '@ship-it-ui/ui';
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
    const heading = label ?? `Reasoning · ${inferredCount} step${inferredCount === 1 ? '' : 's'}`;

    return (
      <div
        ref={ref}
        className={cn('border-border bg-panel-2 overflow-hidden rounded-md border', className)}
        {...props}
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="focus-visible:ring-accent-dim flex w-full cursor-pointer items-center gap-[10px] border-0 bg-transparent px-[14px] py-[10px] text-left outline-none focus-visible:ring-[3px]"
        >
          <span aria-hidden className="text-text-dim font-mono text-[11px]">
            {open ? '▾' : '▸'}
          </span>
          <span className="text-[12px] font-medium">{heading}</span>
          {duration != null && (
            <span className="text-text-dim ml-auto font-mono text-[10px]">{duration}</span>
          )}
        </button>
        {open && (
          <div className="border-border text-text-muted border-t px-[14px] py-[10px] pl-9 text-[11px] leading-[1.7]">
            {children}
          </div>
        )}
      </div>
    );
  },
);

ReasoningBlock.displayName = 'ReasoningBlock';

export interface ReasoningStepProps extends HTMLAttributes<HTMLDivElement> {
  /** 1-indexed step number. Renders accent-colored before the body. */
  step: number;
}

export const ReasoningStep = forwardRef<HTMLDivElement, ReasoningStepProps>(function ReasoningStep(
  { step, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('mb-[2px] last:mb-0', className)} {...props}>
      <span className="text-accent mr-[6px] font-mono">{step}.</span>
      {children}
    </div>
  );
});

ReasoningStep.displayName = 'ReasoningStep';
