import {
  Children,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';

/**
 * Breadcrumbs — composed of `<Crumb>` children. The last crumb is treated as
 * the current page (rendered as plain text with `aria-current="page"`); earlier
 * crumbs render as links if `href` is provided. Pass `separator` to swap the
 * default `/` divider.
 */

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Element to render between crumbs. Defaults to a dim `/`. */
  separator?: ReactNode;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { separator = '/', className, children, ...props },
  ref,
) {
  const crumbs = Children.toArray(children).filter(isValidElement) as ReactElement<CrumbProps>[];
  const last = crumbs.length - 1;
  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn('text-[13px]', className)} {...props}>
      <ol className="text-text-muted flex flex-wrap items-center gap-[6px]">
        {crumbs.map((crumb, i) => {
          const isCurrent = i === last;
          return (
            <li key={i} className="inline-flex items-center gap-[6px]">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {isCurrent ? <Crumb {...(crumb.props as any)} current /> : crumb}
              {!isCurrent && (
                <span aria-hidden className="text-text-dim">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';

export interface CrumbProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks this crumb as the current page — disables the link and applies emphasis styling. */
  current?: boolean;
}

export const Crumb = forwardRef<HTMLAnchorElement, CrumbProps>(function Crumb(
  { current, className, href, children, ...props },
  ref,
) {
  if (current) {
    return (
      <span aria-current="page" className={cn('text-text', className)}>
        {children}
      </span>
    );
  }
  return (
    <a
      ref={ref}
      href={href ?? '#'}
      className={cn('hover:text-text transition-colors duration-(--duration-micro)', className)}
      {...props}
    >
      {children}
    </a>
  );
});

Crumb.displayName = 'Crumb';
