'use client';

import * as RadixRadio from '@radix-ui/react-radio-group';
import { DynamicIconGlyph } from '@ship-it-ui/icons';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * SegmentedControl — pill-styled radio group for filtering the current view's
 * data (Daily / Weekly / Monthly rates, Map / List view). Distinct from
 * `Tabs`, which changes navigational context.
 */

export interface SegmentedControlOption {
  /** Stable identifier. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Optional leading icon name (from `@ship-it-ui/icons`). */
  icon?: string;
  /** When true, this option is disabled. */
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<
  RadixRadio.RadioGroupProps,
  'orientation' | 'children'
> {
  /** Options to render. */
  options: ReadonlyArray<SegmentedControlOption>;
  /** Visual size. Default `md`. */
  size?: 'sm' | 'md';
  /** When true, stretches to fill the parent. */
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: 'h-7 text-[12px] p-0.5',
  md: 'h-9 text-[13px] p-1',
} as const;

const itemSizeClasses = {
  sm: 'px-2.5 gap-1',
  md: 'px-3 gap-1.5',
} as const;

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl({ options, size = 'md', fullWidth = false, className, ...props }, ref) {
    return (
      <RadixRadio.Root
        ref={ref}
        orientation="horizontal"
        className={cn(
          'bg-panel-2 border-border inline-flex rounded-md border',
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <RadixRadio.Item
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className={cn(
              'relative inline-flex flex-1 cursor-pointer items-center justify-center rounded-[5px] font-medium whitespace-nowrap',
              'text-text-dim data-[state=checked]:text-text',
              'data-[state=checked]:bg-panel data-[state=checked]:shadow-sm',
              'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
              'transition-colors duration-(--duration-micro)',
              'disabled:cursor-not-allowed disabled:opacity-40',
              itemSizeClasses[size],
            )}
          >
            {opt.icon && <DynamicIconGlyph name={opt.icon} size={size === 'sm' ? 12 : 14} />}
            <span>{opt.label}</span>
          </RadixRadio.Item>
        ))}
      </RadixRadio.Root>
    );
  },
);

SegmentedControl.displayName = 'SegmentedControl';
