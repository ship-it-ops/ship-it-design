import { Avatar } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

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
}

export const CopilotMessage = forwardRef<HTMLDivElement, CopilotMessageProps>(
  function CopilotMessage({ role, avatar, streaming, className, children, ...props }, ref) {
    const isAssistant = role === 'assistant';
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
