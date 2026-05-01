import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
} from 'react';

import { cn } from '../../utils/cn';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `orientation="horizontal"` (default) joins children edge-to-edge with shared
   * borders; `vertical` does the same column-wise.
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Joins a row of `<Button>`s into a segmented control. The group owns the rounded
 * corners and outer border; child buttons render flush.
 *
 * Pass children as `<Button variant="secondary">…</Button>` — the group strips
 * each child's individual radius and adds the connecting borders.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = 'horizontal', className, children, ...props },
  ref,
) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{
    className?: string;
  }>[];

  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        'border-border inline-flex overflow-hidden rounded-md border',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className,
      )}
      {...props}
    >
      {items.map((child, i) => {
        const isFirst = i === 0;
        const childProps = (child.props ?? {}) as { className?: string };
        return cloneElement(child, {
          key: i,
          className: cn(
            childProps.className,
            'rounded-none border-none',
            !isFirst &&
              (orientation === 'horizontal'
                ? 'border-l border-l-border'
                : 'border-t border-t-border'),
          ),
        });
      })}
    </div>
  );
});
