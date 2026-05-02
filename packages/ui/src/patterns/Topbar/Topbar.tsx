import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Topbar — slim header strip across the top of an app surface. The title
 * lives on the left, the rest of the row is yours via `actions` (search,
 * settings, avatar, etc.).
 */

export interface TopbarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Title rendered on the left. */
  title?: ReactNode;
  /** Left-of-title slot — typically a logo or breadcrumbs. */
  leading?: ReactNode;
  /** Right-side action group. Rendered with `gap-3`. */
  actions?: ReactNode;
}

export const Topbar = forwardRef<HTMLElement, TopbarProps>(function Topbar(
  { title, leading, actions, className, children, ...props },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(
        'border-border bg-panel flex h-[52px] items-center gap-4 border-b px-5',
        className,
      )}
      {...props}
    >
      {leading}
      {title && <div className="text-[13px] font-medium">{title}</div>}
      <div className="flex flex-1 items-center" />
      {actions && <div className="flex items-center gap-3">{actions}</div>}
      {children}
    </header>
  );
});

Topbar.displayName = 'Topbar';
