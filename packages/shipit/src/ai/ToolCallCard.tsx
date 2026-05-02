import { Badge } from '@ship-it/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * ToolCallCard — visual card for a function/tool invocation in the AI
 * conversation. Shows a `TOOL` badge, the tool name, status (running →
 * duration · result), and an optional code/args preview body.
 *
 * Pass `running` to render a streaming caret next to the timing. When the
 * call completes, replace `running` with `duration` and optionally `result`.
 */

export interface ToolCallCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Tool / function name. Rendered in mono. */
  name: ReactNode;
  /** Status text — e.g., `94ms · 142 rows`. */
  status?: ReactNode;
  /** When true, shows a streaming caret next to the status. */
  running?: boolean;
  /** Optional preformatted body — typically args or a query preview. */
  children?: ReactNode;
}

export const ToolCallCard = forwardRef<HTMLDivElement, ToolCallCardProps>(function ToolCallCard(
  { name, status, running, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('border-border bg-panel rounded-md border px-[14px] py-[10px]', className)}
      {...props}
    >
      <div className="flex items-center gap-[10px]">
        <Badge size="sm" variant="accent">
          TOOL
        </Badge>
        <span className="font-mono text-[12px] font-medium">{name}</span>
        <span className="text-text-dim ml-auto inline-flex items-center font-mono text-[10px]">
          {running ? (
            <>
              running
              <span
                aria-hidden
                className="bg-accent ml-1 inline-block h-3 w-px animate-[ship-pulse_1s_infinite] align-middle"
              />
            </>
          ) : (
            status
          )}
        </span>
      </div>
      {children && (
        <pre className="text-text-muted m-0 mt-[6px] font-mono text-[11px] leading-[1.6] break-words whitespace-pre-wrap">
          {children}
        </pre>
      )}
    </div>
  );
});

ToolCallCard.displayName = 'ToolCallCard';
