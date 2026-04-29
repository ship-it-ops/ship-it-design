import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * FileChip — file attachment chip with thumb, name, size, optional progress
 * bar, and a remove affordance. The thumb defaults to the file extension; pass
 * `icon` to override.
 */

export interface FileChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Filename to display. */
  name: string;
  /** Right-of-name label (size, status). Often `2.4 MB` or `failed`. */
  size?: ReactNode;
  /** When set, renders a progress bar at the bottom (0..100). Used for upload UX. */
  progress?: number;
  /** Replace the file-extension thumb. */
  icon?: ReactNode;
  /** When provided, renders a remove (×) button. */
  onRemove?: () => void;
  /** When true, signals an error state (red status text + red bar). */
  failed?: boolean;
}

function deriveExt(name: string) {
  const dot = name.lastIndexOf('.');
  if (dot < 0) return 'FILE';
  return name.slice(dot + 1).slice(0, 4).toUpperCase();
}

export const FileChip = forwardRef<HTMLDivElement, FileChipProps>(function FileChip(
  { name, size, progress, icon, onRemove, failed, className, ...props },
  ref,
) {
  const ext = deriveExt(name);
  const showProgress = typeof progress === 'number';
  const isComplete = showProgress && progress >= 100;

  return (
    <div
      ref={ref}
      className={cn(
        'flex max-w-[320px] items-center gap-[10px] rounded-md border border-border bg-panel-2 px-3 py-2',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="grid h-6 w-6 shrink-0 place-items-center rounded-xs border border-border bg-panel font-mono text-[9px] text-text-dim"
      >
        {icon ?? ext}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-medium">{name}</div>
        <div className={cn('font-mono text-[10px]', failed ? 'text-err' : 'text-text-dim')}>
          {size}
          {showProgress && !isComplete && (
            <span> · {Math.round(progress)}%</span>
          )}
        </div>
        {showProgress && !isComplete && (
          <div className="mt-1 h-[2px] overflow-hidden rounded-full bg-panel">
            <div
              className={cn('h-full transition-[width] duration-(--duration-step)', failed ? 'bg-err' : 'bg-accent')}
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
          className={cn(
            'cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-none text-text-dim',
            'hover:text-text outline-none focus-visible:ring-[3px] focus-visible:ring-accent-dim rounded-xs',
          )}
        >
          ×
        </button>
      )}
    </div>
  );
});
