import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

const cardStyles = cva(
  'block bg-panel border border-border rounded-base transition-[border-color,transform,box-shadow] duration-(--duration-step)',
  {
    variants: {
      variant: {
        default: '',
        ghost: 'bg-transparent',
        elevated: 'shadow',
      },
      interactive: {
        true: 'cursor-pointer hover:border-border-strong hover:-translate-y-px hover:shadow',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', interactive: false },
  },
);

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof cardStyles> {
  /** Render a header row with this title (and optional `actions`). */
  title?: ReactNode;
  /** Description shown under the title (or above children when no title). */
  description?: ReactNode;
  /** Action slot rendered to the right of the title. */
  actions?: ReactNode;
  /** Footer slot rendered with a top divider beneath children. */
  footer?: ReactNode;
}

/**
 * Standard surface for a chunk of content. All cards share the same chrome
 * (panel bg, 1px border, 10px radius); variation comes from what's inside.
 *
 * Compose with the `<Card title="…" actions={…} footer={…}>` API for simple
 * cases, or pass children directly for full control.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant,
    interactive,
    title,
    description,
    actions,
    footer,
    className,
    children,
    onClick,
    ...props
  },
  ref,
) {
  const isInteractive = interactive ?? Boolean(onClick);
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(cardStyles({ variant, interactive: isInteractive }), 'p-[18px]', className)}
      {...props}
    >
      {(title || actions) && (
        <div className={cn('flex items-start gap-3', (description || children) && 'mb-[10px]')}>
          {title && <div className="flex-1 text-[14px] font-medium">{title}</div>}
          {actions && <div className="flex gap-1">{actions}</div>}
        </div>
      )}
      {description && (
        <div className={cn('text-text-muted text-[12px] leading-[1.55]', children && 'mb-[14px]')}>
          {description}
        </div>
      )}
      {children}
      {footer && (
        <div className="border-border text-text-dim mt-[14px] border-t pt-3 text-[11px]">
          {footer}
        </div>
      )}
    </div>
  );
});

export { cardStyles };
