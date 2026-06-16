'use client';

import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>;

/**
 * VisuallyHidden — renders content that stays in the accessibility tree (and is
 * announced by screen readers) but is removed from the visual layout. Use to
 * provide an accessible name/description without showing it on screen, e.g. a
 * required `DialogTitle` inside a visually titleless dialog.
 *
 * Implements the standard "sr-only" clip pattern locally — no extra dependency.
 */
const srOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, style, children, ...props }, ref) {
    return (
      <span ref={ref} className={cn(className)} style={{ ...srOnlyStyle, ...style }} {...props}>
        {children}
      </span>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
