import { useId, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visible label rendered above the control. */
  label?: ReactNode;
  /** Helper text shown below the control when no error is present. */
  hint?: ReactNode;
  /** Error message shown below the control. Displaces `hint` when set. */
  error?: ReactNode;
  /** Marks the field with a visual asterisk (does not enforce validity). */
  required?: boolean;
  /**
   * The control. Receives `id`, `aria-describedby`, and `aria-invalid` automatically.
   * Pass via render prop so the field can wire IDs without consumers thinking about it.
   */
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean | undefined;
  }) => ReactNode;
}

/**
 * Form-field wrapper: label + control + hint/error. Wires up the IDs so screen
 * readers connect the label and helper text to the input.
 *
 *   <Field label="Email" hint="We never share it">
 *     {(p) => <Input type="email" placeholder="me@org.com" {...p} />}
 *   </Field>
 */
export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
  ...props
}: FieldProps) {
  const reactId = useId();
  const id = `field-${reactId}`;
  const hintId = hint && !error ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = errorId ?? hintId;

  return (
    <div className={cn('flex flex-col gap-[6px]', className)} {...props}>
      {label && (
        <label htmlFor={id} className="text-[11px] font-medium text-text-muted">
          {label}
          {required && <span className="ml-1 text-err">*</span>}
        </label>
      )}
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}
      {hint && !error && (
        <div id={hintId} className="text-[11px] text-text-dim">
          {hint}
        </div>
      )}
      {error && (
        <div id={errorId} className="text-[11px] text-err">
          {error}
        </div>
      )}
    </div>
  );
}
