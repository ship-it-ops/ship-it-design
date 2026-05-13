'use client';

import { Button, useControllableState } from '@ship-it-ui/ui';
import { cn } from '@ship-it-ui/ui';
import {
  forwardRef,
  useRef,
  type FormEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

/**
 * AskBar — the primary "ask anything" input. The leading ✦ glyph + accent
 * caret give it the same identity as the Copilot bubbles. Submit with the
 * button or `⌘↵` / `Ctrl↵`.
 *
 * Children are rendered as scope chips below the textarea (use the existing
 * `<Chip>` from @ship-it-ui/ui to mark a scoped query). Children render slot is
 * the "scopes" row — leave empty for an unscoped bar.
 */

export interface AskBarProps extends Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'onChange'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires with the current query when submitted (button or ⌘↵). */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /** Streaming caret next to the input. */
  streaming?: boolean;
  /** Submit button label. Default `Ask`. */
  submitLabel?: ReactNode;
  /** Disable submit. */
  disabled?: boolean;
  /** Pixel max-width. Default 620. */
  maxWidth?: number | string;
  /**
   * `'comfortable'` (default) renders the desktop ask bar. `'touch'` swaps to
   * the mobile composer: larger text, 44pt send button, ⌘↵ hint hidden (no
   * hardware keyboard), and scope chips wrap to a second row.
   */
  density?: 'comfortable' | 'touch';
}

export const AskBar = forwardRef<HTMLFormElement, AskBarProps>(function AskBar(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    onSubmit,
    placeholder = 'Ask anything…',
    streaming,
    submitLabel = 'Ask',
    disabled,
    maxWidth = 620,
    density = 'comfortable',
    className,
    children,
    ...props
  },
  ref,
) {
  const isTouch = density === 'touch';
  const [value, setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const v = (value ?? '').trim();
    if (!v) return;
    onSubmit?.(v);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      ref={ref}
      role="search"
      onSubmit={handleSubmit}
      style={{ maxWidth: isTouch ? undefined : maxWidth }}
      className={cn(
        'border-border-strong bg-panel w-full border',
        isTouch ? 'rounded-m-card p-3' : 'rounded-xl p-[14px] shadow',
        'focus-within:border-accent focus-within:ring-accent-dim focus-within:ring-[3px]',
        className,
      )}
      {...props}
    >
      <div className={cn('flex items-start gap-[10px]', isTouch ? 'mb-2' : 'mb-[10px]')}>
        <span aria-hidden className={cn('text-accent', isTouch ? 'text-[18px]' : 'text-[16px]')}>
          ✦
        </span>
        <textarea
          ref={inputRef}
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          aria-label={placeholder}
          rows={1}
          className={cn(
            'text-text flex-1 resize-none border-0 bg-transparent leading-[1.5] outline-none',
            'placeholder:text-text-dim',
            isTouch ? 'text-m-body' : 'text-[14px]',
          )}
        />
        {streaming && (
          <span
            aria-hidden
            className={cn(
              'bg-accent mt-[3px] inline-block w-px animate-[ship-pulse_1s_infinite]',
              isTouch ? 'h-5' : 'h-4',
            )}
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-[6px]">
        {children}
        <div className="ml-auto flex items-center gap-2">
          {!isTouch && (
            <span aria-hidden className="text-text-dim font-mono text-[11px]">
              ⌘↵
            </span>
          )}
          <Button
            type="submit"
            size={isTouch ? 'md' : 'sm'}
            density={isTouch ? 'touch' : undefined}
            variant="primary"
            disabled={disabled || !(value ?? '').trim()}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
});

AskBar.displayName = 'AskBar';
