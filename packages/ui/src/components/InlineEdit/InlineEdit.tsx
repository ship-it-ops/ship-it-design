'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * Display-to-input rename primitive. Renders `value` as a static element until
 * activated (default: double-click or Enter on the focused display), at which
 * point it swaps to a focused `<input>` with the text pre-selected. Enter
 * commits, Escape cancels, blur commits when `commitOnBlur` (default `true`).
 *
 * Reuses {@link useControllableState} so consumers can mirror the editing
 * state externally (useful when the parent wants to open the editor
 * programmatically — e.g., right-click → Rename).
 */

const displayStyles = cva(
  [
    'inline-block cursor-text rounded-[3px] px-[2px] -mx-[2px]',
    'outline-none transition-[background,box-shadow] duration-(--duration-micro)',
    'hover:bg-panel-2',
    'focus-visible:ring-[2px] focus-visible:ring-accent-dim',
  ],
  {
    variants: {
      size: {
        sm: 'text-[12px]',
        md: 'text-[13px]',
        lg: 'text-[14px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const inputStyles = cva(
  [
    'border bg-panel text-text font-sans outline-none',
    'transition-[border-color,box-shadow] duration-(--duration-micro)',
    'focus:ring-[3px] focus:ring-accent-dim focus:border-accent',
    'placeholder:text-text-dim',
  ],
  {
    variants: {
      size: {
        sm: 'h-6 px-2 text-[12px] rounded-md',
        md: 'h-[28px] px-[8px] text-[13px] rounded-md',
        lg: 'h-8 px-[10px] text-[14px] rounded-md',
      },
      tone: {
        default: 'border-border',
        err: 'border-err focus:border-err focus:ring-err/30',
      },
    },
    defaultVariants: { size: 'md', tone: 'default' },
  },
);

type AsElement = 'span' | 'div' | 'h1' | 'h2' | 'h3';
type Activation = 'dblclick' | 'click' | 'focus';

export interface InlineEditProps
  extends
    Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'children' | 'role'>,
    VariantProps<typeof displayStyles> {
  /** Current label value. */
  value: string;
  /** Fired with the committed value. */
  onValueChange: (next: string) => void;
  /** Display element. Default 'span'. Use 'h1'-'h3' for headings. */
  as?: AsElement;
  /** Activation gesture besides the always-on Enter-on-focus. Default 'dblclick'. */
  activate?: Activation;
  /** Commit (vs cancel) on blur. Default `true`. */
  commitOnBlur?: boolean;
  /** Returns an error message on rejection, or `null` on success. */
  validate?: (next: string) => string | null;
  /** Shown when `value` is empty in display mode. */
  placeholder?: string;
  /** Disables activation and applies a muted style. */
  disabled?: boolean;
  /** Controlled editing flag. */
  editing?: boolean;
  /** Fired when the editing flag changes (uncontrolled mode or external open). */
  onEditingChange?: (next: boolean) => void;
  /** Extra className on the `<input>` in edit mode. */
  inputClassName?: string;
  /** Accessible label for the display element. Default `Edit {value}`. */
  'aria-label'?: string;
}

export interface InlineEditHandle {
  /** Programmatically enter edit mode and focus the input. */
  edit: () => void;
  /** Cancel any pending edit and return to display mode. */
  cancel: () => void;
}

export const InlineEdit = forwardRef<InlineEditHandle, InlineEditProps>(function InlineEdit(
  {
    value,
    onValueChange,
    as = 'span',
    activate = 'dblclick',
    commitOnBlur = true,
    validate,
    placeholder = 'Empty',
    disabled = false,
    editing: editingProp,
    onEditingChange,
    size,
    className,
    inputClassName,
    'aria-label': ariaLabel,
    ...rest
  },
  forwardedRef,
) {
  const [editing, setEditing] = useControllableState<boolean>({
    value: editingProp,
    defaultValue: false,
    onChange: onEditingChange,
  });
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Re-seed the draft whenever we enter edit mode or the upstream `value`
  // shifts while idle. Without this, opening the editor after an external
  // change would show stale text.
  useEffect(() => {
    if (!editing) {
      setDraft(value);
      setError(null);
    }
  }, [editing, value]);

  // Autoselect on edit-mode enter. Microtask delay is needed because the
  // input is rendered in the same commit that flips `editing`, so the focus
  // call has to wait for the element to exist.
  useEffect(() => {
    if (!editing) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [editing]);

  const commit = useCallback(() => {
    const next = draft;
    if (validate) {
      const msg = validate(next);
      if (msg !== null) {
        setError(msg);
        return;
      }
    }
    setError(null);
    setEditing(false);
    if (next !== value) onValueChange(next);
  }, [draft, validate, value, onValueChange, setEditing]);

  const cancel = useCallback(() => {
    setDraft(value);
    setError(null);
    setEditing(false);
  }, [value, setEditing]);

  const beginEdit = useCallback(() => {
    if (disabled) return;
    setDraft(value);
    setError(null);
    setEditing(true);
  }, [disabled, value, setEditing]);

  useImperativeHandle(forwardedRef, () => ({ edit: beginEdit, cancel }), [beginEdit, cancel]);

  const onDisplayKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      beginEdit();
    }
  };

  const onDisplayActivate = (e: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if ((activate === 'dblclick' && e.detail >= 2) || (activate === 'click' && e.detail >= 1)) {
      e.preventDefault();
      beginEdit();
    }
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (error) setError(null);
        }}
        onKeyDown={onInputKeyDown}
        onBlur={() => {
          if (commitOnBlur) commit();
          else cancel();
        }}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? `${rest.id ?? 'inline-edit'}-error` : undefined}
        className={cn(inputStyles({ size, tone: error ? 'err' : 'default' }), inputClassName)}
      />
    );
  }

  // Display state — render the element specified by `as`. For non-heading
  // elements we apply `role="button"` so screen readers announce the rename
  // affordance; for headings we preserve the implicit heading role and
  // expose editability via `aria-roledescription` instead. Either way the
  // element is keyboard-focusable.
  const Tag = as;
  const isHeading = as === 'h1' || as === 'h2' || as === 'h3';
  const isEmpty = value.length === 0;
  const displayText = isEmpty ? placeholder : value;
  return (
    <Tag
      role={isHeading ? undefined : 'button'}
      aria-roledescription={isHeading ? 'editable' : undefined}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel ?? `Edit ${value || placeholder}`}
      data-empty={isEmpty || undefined}
      onClick={onDisplayActivate}
      onKeyDown={onDisplayKeyDown}
      className={cn(
        displayStyles({ size }),
        isEmpty && 'text-text-dim italic',
        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
        className,
      )}
      {...rest}
    >
      {displayText}
    </Tag>
  );
});

InlineEdit.displayName = 'InlineEdit';
