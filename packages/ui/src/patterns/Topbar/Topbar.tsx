'use client';

import { forwardRef, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Topbar — slim header strip across the top of an app surface.
 *
 * Default (`density="comfortable"`) renders the 52px desktop header with a
 * title on the left and `actions` on the right. Pass `density="touch"` for the
 * 56px mobile page-header variant that adds an optional `back` button and an
 * `eyebrow` line (small uppercase mono label) above the title — the same shape
 * the Mobile Library uses as its in-app nav bar.
 */

export interface TopbarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Title rendered on the left. */
  title?: ReactNode;
  /**
   * Eyebrow label rendered above the title (small uppercase mono). Touch density
   * only — silently ignored on desktop density to avoid two header tiers stacking.
   */
  eyebrow?: ReactNode;
  /** Left-of-title slot — typically a logo or breadcrumbs. */
  leading?: ReactNode;
  /**
   * When set, renders a 36×36 back-arrow button at the start (before `leading`)
   * that fires this handler. Use `back={true}` for no-op visuals and wire your
   * own router push via `onBack` if needed.
   */
  back?: boolean | MouseEventHandler<HTMLButtonElement>;
  /** Explicit click handler for the back button — overrides a function passed to `back`. */
  onBack?: MouseEventHandler<HTMLButtonElement>;
  /** Right-side action group. Rendered with `gap-3` (desktop) or `gap-1` (touch). */
  actions?: ReactNode;
  /**
   * `'comfortable'` (default) → desktop 52px header. `'touch'` → mobile 56px
   * page-header with optional back button + eyebrow.
   */
  density?: 'comfortable' | 'touch';
}

export const Topbar = forwardRef<HTMLElement, TopbarProps>(function Topbar(
  {
    title,
    eyebrow,
    leading,
    back,
    onBack,
    actions,
    density = 'comfortable',
    className,
    children,
    ...props
  },
  ref,
) {
  const isTouch = density === 'touch';
  const backHandler = typeof back === 'function' ? back : back ? onBack : undefined;

  return (
    <header
      ref={ref}
      className={cn(
        'border-border bg-panel flex items-center border-b',
        isTouch ? 'h-navbar gap-2 px-3' : 'h-[52px] gap-4 px-5',
        className,
      )}
      {...props}
    >
      {isTouch && back && (
        <button
          type="button"
          onClick={backHandler}
          aria-label="Back"
          className={cn(
            'text-text inline-grid place-items-center rounded-md bg-transparent',
            'hover:bg-panel-2 h-9 w-9',
            'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
      {leading}
      {(title || (isTouch && eyebrow)) && (
        <div className={cn('min-w-0', isTouch && 'flex-1')}>
          {isTouch && eyebrow && (
            <div className="text-m-eyebrow text-accent font-mono tracking-wide uppercase">
              {eyebrow}
            </div>
          )}
          {title && (
            <div
              className={cn(
                isTouch
                  ? 'text-m-body-lg truncate font-semibold tracking-tight'
                  : 'text-[13px] font-medium',
              )}
            >
              {title}
            </div>
          )}
        </div>
      )}
      {!isTouch && <div className="flex flex-1 items-center" />}
      {actions && (
        <div className={cn('flex items-center', isTouch ? 'gap-1' : 'gap-3')}>{actions}</div>
      )}
      {children}
    </header>
  );
});

Topbar.displayName = 'Topbar';
