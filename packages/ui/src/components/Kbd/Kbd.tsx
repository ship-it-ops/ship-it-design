import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export interface KbdProps extends HTMLAttributes<HTMLElement> {}

/**
 * Keyboard shortcut display — `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. Uses `<kbd>` semantics
 * so screen readers announce it as a key.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ className, children, ...props }, ref) {
  return (
    <kbd
      ref={ref}
      className={cn(
        'inline-flex items-center font-mono text-[10px] font-medium text-text-muted',
        'px-[6px] py-[2px] bg-panel border border-border rounded-xs',
        'border-b-[2px] border-b-border',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
});
