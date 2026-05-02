import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export type KbdProps = HTMLAttributes<HTMLElement>;

/**
 * Keyboard shortcut display — `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. Uses `<kbd>` semantics
 * so screen readers announce it as a key.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, children, ...props },
  ref,
) {
  return (
    <kbd
      ref={ref}
      className={cn(
        'text-text-muted inline-flex items-center font-mono text-[10px] font-medium',
        'bg-panel border-border rounded-xs border px-[6px] py-[2px]',
        'border-b-border border-b-[2px]',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
});

Kbd.displayName = 'Kbd';
