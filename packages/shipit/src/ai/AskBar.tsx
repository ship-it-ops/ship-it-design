import { Button, useControllableState } from '@ship-it/ui';
import { forwardRef, useRef, type FormEvent, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * AskBar — the primary "ask anything" input. The leading ✦ glyph + accent
 * caret give it the same identity as the Copilot bubbles. Submit with the
 * button or `⌘↵` / `Ctrl↵`.
 *
 * Children are rendered as scope chips below the textarea (use the existing
 * `<Chip>` from @ship-it/ui to mark a scoped query). Children render slot is
 * the "scopes" row — leave empty for an unscoped bar.
 */

export interface AskBarProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> {
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
    className,
    children,
    ...props
  },
  ref,
) {
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
      style={{ maxWidth }}
      className={cn(
        'w-full rounded-xl border border-border-strong bg-panel p-[14px] shadow',
        'focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent-dim',
        className,
      )}
      {...props}
    >
      <div className="mb-[10px] flex items-start gap-[10px]">
        <span aria-hidden className="text-[16px] text-accent">
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
            'flex-1 resize-none border-0 bg-transparent text-[14px] leading-[1.5] text-text outline-none',
            'placeholder:text-text-dim',
          )}
        />
        {streaming && (
          <span
            aria-hidden
            className="mt-[3px] inline-block h-4 w-px bg-accent animate-[ship-pulse_1s_infinite]"
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-[6px]">
        {children}
        <div className="ml-auto flex items-center gap-2">
          <span aria-hidden className="font-mono text-[11px] text-text-dim">
            ⌘↵
          </span>
          <Button type="submit" size="sm" variant="primary" disabled={disabled || !(value ?? '').trim()}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
});
