import {
  forwardRef,
  useState,
  type DragEvent,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';

/**
 * Dropzone — drag-and-drop file capture surface with a click-to-browse
 * fallback. Manages its own drag-over state and forwards file drops to
 * `onFiles`. Native `<input type="file">` covers keyboard / a11y.
 */

export interface DropzoneProps extends Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  'onDrop' | 'onDragOver' | 'onDragLeave' | 'title'
> {
  /** Fired with the dropped or selected files. */
  onFiles?: (files: File[]) => void;
  /** Limit accepted MIME types or extensions. Forwarded to the hidden input + filtered on drop. */
  accept?: string;
  /** Allow multiple files. Default true. */
  multiple?: boolean;
  /** Heading text. Default "Drop files to ingest". */
  title?: ReactNode;
  /** Subtitle / hint text rendered below the title. */
  description?: ReactNode;
  /** Glyph at the top of the surface. Default `↥`. */
  icon?: ReactNode;
  disabled?: boolean;
}

function listToArray(list: FileList | null): File[] {
  if (!list) return [];
  return Array.from(list);
}

export const Dropzone = forwardRef<HTMLLabelElement, DropzoneProps>(function Dropzone(
  {
    onFiles,
    accept,
    multiple = true,
    title = 'Drop files to ingest',
    description,
    icon = '↥',
    disabled,
    className,
    ...props
  },
  ref,
) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(false);
    const files = listToArray(e.dataTransfer.files);
    if (files.length) onFiles?.(files);
  };

  return (
    <label
      ref={ref}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'rounded-base flex max-w-[420px] cursor-pointer flex-col items-center border-[1.5px] border-dashed p-8 text-center',
        'transition-[background,border] duration-(--duration-micro)',
        'focus-within:ring-accent-dim focus-within:ring-[3px]',
        isDragging
          ? 'border-accent bg-accent-dim'
          : 'border-border-strong bg-panel hover:bg-panel-2',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      {...props}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={typeof title === 'string' ? title : 'Upload files'}
        className="sr-only"
        onChange={(e) => {
          const files = listToArray(e.target.files);
          if (files.length) onFiles?.(files);
          e.target.value = '';
        }}
      />
      <div
        aria-hidden
        className={cn('mb-2 text-[28px]', isDragging ? 'text-accent' : 'text-text-dim')}
      >
        {icon}
      </div>
      <div className="mb-1 text-[13px] font-medium">{title}</div>
      {description && <div className="text-text-dim text-[11px]">{description}</div>}
    </label>
  );
});

Dropzone.displayName = 'Dropzone';
