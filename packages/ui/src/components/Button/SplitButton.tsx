'use client';

import { glyphs } from '@ship-it-ui/icons';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

import { Button, type ButtonProps } from './Button';

export interface SplitButtonProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant applied to BOTH segments. Defaults to `primary`. */
  variant?: ButtonProps['variant'];
  /** Size applied to both segments. Defaults to `md`. */
  size?: ButtonProps['size'];
  /** Click handler for the main action button. */
  onClick?: () => void;
  /** Click handler for the trailing menu (caret) button. */
  onMenu?: () => void;
  /** Disable both segments. */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Two-segment button: a primary action on the left, a menu chevron on the right.
 * Common pattern for "Deploy ▾" or "Save and …" controls.
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  { variant = 'primary', size = 'md', onClick, onMenu, disabled, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('inline-flex', className)} {...props}>
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        className="rounded-r-none border-r border-r-black/20"
      >
        {children}
      </Button>
      <Button
        variant={variant}
        size={size}
        onClick={onMenu}
        disabled={disabled}
        aria-label="More actions"
        className="rounded-l-none px-2"
      >
        {glyphs.collapse}
      </Button>
    </div>
  );
});

SplitButton.displayName = 'SplitButton';
