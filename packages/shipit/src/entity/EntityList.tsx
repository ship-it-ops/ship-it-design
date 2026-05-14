'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import { cn } from '@ship-it-ui/ui';
import { type HTMLAttributes, type ReactNode } from 'react';

/**
 * EntityList — bordered/rounded container for `EntityListRow*` children with
 * auto-dividers and an optional title/subtitle header. Replaces the ad-hoc
 * `<div className="flex flex-col">` wrappers consumers were rolling by hand.
 *
 * When `collapsible` is set, renders a native `<details>`/`<summary>` so the
 * expand/collapse behaviour is zero-JS and screen-reader-correct out of the
 * box. The caret affordance rotates from down→right via CSS when the section
 * is collapsed.
 *
 * NOTE on keyboard navigation: an arrow-key / j-k roving-tabindex scheme is
 * intentionally NOT implemented in this initial version. Wiring focus across
 * children requires either prop-cloning rows or a context they opt into;
 * neither has landed yet and a half-built version would set the wrong
 * expectation. The surface is reserved here — file a follow-up issue when a
 * real consumer needs it.
 */

export interface EntityListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Header title rendered above the row list. */
  title?: ReactNode;
  /** Muted subtitle rendered under the title. */
  subtitle?: ReactNode;
  /** Bordered + rounded container framing. Default `true`. */
  framed?: boolean;
  /** Auto-dividers between row children. Default `true`. */
  dividers?: boolean;
  /** Render as a native `<details>`/`<summary>` collapsible group. */
  collapsible?: boolean;
  /** Initial collapsed state when `collapsible`. Default `false`. */
  defaultCollapsed?: boolean;
  children: ReactNode;
}

const framedClasses = 'rounded-base border-border bg-panel overflow-hidden border';
const dividerWrapperClasses = '[&>*+*]:border-t [&>*+*]:border-border';

function Header({ title, subtitle }: { title?: ReactNode; subtitle?: ReactNode }) {
  if (!title && !subtitle) return null;
  return (
    <div className="border-border flex flex-col gap-[2px] border-b px-3 py-2">
      {title && <div className="text-text text-[12px] font-medium">{title}</div>}
      {subtitle && <div className="text-text-muted text-[11px]">{subtitle}</div>}
    </div>
  );
}

function Rows({ dividers, children }: { dividers: boolean; children: ReactNode }) {
  return <div className={cn('flex flex-col', dividers && dividerWrapperClasses)}>{children}</div>;
}

export function EntityList({
  title,
  subtitle,
  framed = true,
  dividers = true,
  collapsible,
  defaultCollapsed = false,
  className,
  children,
  ...props
}: EntityListProps) {
  if (collapsible) {
    return (
      <details
        open={!defaultCollapsed}
        className={cn(framed && framedClasses, 'group', className)}
        {...(props as HTMLAttributes<HTMLDetailsElement>)}
      >
        <summary
          className={cn(
            'border-border flex cursor-pointer list-none items-center gap-2 border-b px-3 py-2',
            'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
            // Hide the default disclosure marker on WebKit.
            '[&::-webkit-details-marker]:hidden',
          )}
        >
          <IconGlyph
            name="caretDown"
            size={12}
            className="text-text-muted -rotate-90 transition-transform group-open:rotate-0"
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            {title && <div className="text-text text-[12px] font-medium">{title}</div>}
            {subtitle && <div className="text-text-muted text-[11px]">{subtitle}</div>}
          </div>
        </summary>
        <Rows dividers={dividers}>{children}</Rows>
      </details>
    );
  }

  return (
    <section className={cn(framed && framedClasses, className)} {...props}>
      <Header title={title} subtitle={subtitle} />
      <Rows dividers={dividers}>{children}</Rows>
    </section>
  );
}

EntityList.displayName = 'EntityList';
