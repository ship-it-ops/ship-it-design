'use client';

import { Avatar } from '@ship-it-ui/ui';
import { cn } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * CopilotMessage — chat bubble for the AI conversation. Two roles:
 * `user` (right-aligned implicit, panel-2 background) and `assistant`
 * (left-aligned, framed panel + border). Pass `streaming` to render a pulsing
 * caret at the end of the body.
 */

export type CopilotRole = 'user' | 'assistant';

export interface CopilotMessageProps extends HTMLAttributes<HTMLDivElement> {
  role: CopilotRole;
  /** Avatar initials (or full node) shown on the side. */
  avatar?: ReactNode;
  /** Streaming caret at the end of the body. */
  streaming?: boolean;
  /**
   * `'comfortable'` (default) renders the desktop bubble. `'touch'` switches
   * to the mobile chat layout: user bubbles right-aligned on `bg-accent`,
   * assistant bubbles left-aligned on `bg-panel`, larger 15px text, and a
   * max-width that keeps bubbles within 85% of the viewport.
   */
  density?: 'comfortable' | 'touch';
}

export const CopilotMessage = forwardRef<HTMLDivElement, CopilotMessageProps>(
  function CopilotMessage(
    { role, avatar, streaming, density = 'comfortable', className, children, ...props },
    ref,
  ) {
    const isAssistant = role === 'assistant';
    const isTouch = density === 'touch';

    if (isTouch) {
      // Mobile layout: no side avatar; bubbles align to one side or the other.
      return (
        <div
          ref={ref}
          className={cn(
            'flex flex-col gap-[6px]',
            isAssistant ? 'items-start' : 'items-end',
            className,
          )}
          data-role={role}
          {...props}
        >
          {isAssistant && (
            <div className="text-m-eyebrow text-accent inline-flex items-center gap-[6px] font-mono tracking-wide uppercase">
              <span aria-hidden>✦</span>
              {streaming ? 'thinking' : 'ShipIt'}
            </div>
          )}
          <div
            className={cn(
              'rounded-m-card text-m-body max-w-[85%] px-[14px] py-3 leading-normal',
              isAssistant ? 'bg-panel border-border border' : 'bg-accent text-on-accent',
            )}
          >
            {children}
            {streaming && (
              <span
                aria-hidden
                className="bg-accent ml-[2px] inline-block h-4 w-px animate-[ship-pulse_1s_infinite] align-middle"
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-start gap-[10px]', className)}
        data-role={role}
        {...props}
      >
        {isAssistant ? (
          <span
            aria-hidden
            className="bg-accent-dim text-accent grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold"
          >
            ✦
          </span>
        ) : typeof avatar === 'string' ? (
          <Avatar size="sm" name={avatar} />
        ) : (
          (avatar ?? null)
        )}
        <div
          className={cn(
            'rounded-base min-w-0 flex-1 px-[14px] py-3 text-[13px] leading-[1.6]',
            isAssistant ? 'bg-panel border-border border' : 'bg-panel-2',
          )}
        >
          {children}
          {streaming && (
            <span
              aria-hidden
              className="bg-accent ml-[2px] inline-block h-[14px] w-px animate-[ship-pulse_1s_infinite] align-middle"
            />
          )}
        </div>
      </div>
    );
  },
);

CopilotMessage.displayName = 'CopilotMessage';
