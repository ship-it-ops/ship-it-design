'use client';

import { glyphs } from '@ship-it-ui/icons';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

import { Button, type ButtonProps } from './Button';

/**
 * Variant set supported by `SplitButton`. Mirrors `Button`'s set minus `link` —
 * a split-button "menu" affordance attached to a link variant doesn't compose
 * visually. Use a regular `<Button variant="link" />` instead.
 */
export type SplitButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success';

export interface SplitButtonProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant applied to BOTH segments. Defaults to `primary`. */
  variant?: SplitButtonVariant;
  /** Size applied to both segments. Defaults to `md`. */
  size?: ButtonProps['size'];
  /** Click handler for the main action button. */
  onClick?: () => void;
  /** Click handler for the trailing menu (caret) button. */
  onMenu?: () => void;
  /** Disable both segments. */
  disabled?: boolean;
  /**
   * Accessible label for the trailing menu button. Defaults to
   * `"More actions"`. Override when the menu's purpose is more specific
   * (e.g. `"Deploy options"`) so screen-reader users hear the right intent.
   */
  menuAriaLabel?: string;
  children: ReactNode;
}

/**
 * Two-segment button: a primary action on the left, a menu chevron on the right.
 * Common pattern for "Deploy ▾" or "Save and …" controls.
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  {
    variant = 'primary',
    size = 'md',
    onClick,
    onMenu,
    disabled,
    menuAriaLabel = 'More actions',
    className,
    children,
    ...props
  },
  ref,
) {
  // Token-aware divider between the two segments. For variants whose
  // background is a colored surface with `text-on-accent` foreground
  // (primary/destructive/success), a 20%-opacity dark line is visible.
  // For neutral surfaces (secondary/outline/ghost), use the strong border
  // token so the divider tracks light/dark theme.
  const dividerBorder =
    variant === 'primary' || variant === 'destructive' || variant === 'success'
      ? 'border-r-on-accent/20'
      : 'border-r-border-strong';
  return (
    <div ref={ref} className={cn('inline-flex', className)} {...props}>
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        className={cn('rounded-r-none border-r', dividerBorder)}
      >
        {children}
      </Button>
      <Button
        variant={variant}
        size={size}
        onClick={onMenu}
        disabled={disabled}
        aria-label={menuAriaLabel}
        className="rounded-l-none px-2"
      >
        {glyphs.collapse}
      </Button>
    </div>
  );
});

SplitButton.displayName = 'SplitButton';
