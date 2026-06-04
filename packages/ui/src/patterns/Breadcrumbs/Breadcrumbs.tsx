'use client';

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
import { JsonLd } from '../../utils/JsonLd';

/**
 * Breadcrumbs — composed of `<Crumb>` children. The last crumb is treated as
 * the current page (rendered as plain text with `aria-current="page"`); earlier
 * crumbs render as links if `href` is provided. Pass `separator` to swap the
 * default `/` divider.
 *
 * Emits a schema.org `BreadcrumbList` JSON-LD script next to the `<nav>` so
 * crawlers and AI agents understand the trail without parsing the DOM. The
 * script auto-derives `position`/`name`/`item` from each `<Crumb>`'s `href`
 * and visible children; crumbs without a string label are skipped. Pass
 * `noStructuredData` to suppress emission entirely (consumers emitting their
 * own page-level structured data).
 */

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Element to render between crumbs. Defaults to a dim `/`. */
  separator?: ReactNode;
  /** Opt out of emitting the `BreadcrumbList` JSON-LD script. */
  noStructuredData?: boolean;
}

interface BreadcrumbListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

function reactNodeToString(node: ReactNode): string | null {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  return null;
}

function buildBreadcrumbList(
  crumbs: ReactElement<CrumbProps>[],
): { '@context': string; '@type': 'BreadcrumbList'; itemListElement: BreadcrumbListItem[] } | null {
  const itemListElement: BreadcrumbListItem[] = [];
  crumbs.forEach((crumb, index) => {
    const name = reactNodeToString(crumb.props.children);
    if (!name) return;
    const item: BreadcrumbListItem = {
      '@type': 'ListItem',
      position: index + 1,
      name,
    };
    if (typeof crumb.props.href === 'string') {
      item.item = crumb.props.href;
    }
    itemListElement.push(item);
  });
  if (itemListElement.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { separator = '/', noStructuredData, className, children, ...props },
  ref,
) {
  const crumbs = Children.toArray(children).filter(isValidElement) as ReactElement<CrumbProps>[];
  const last = crumbs.length - 1;
  const structuredData = !noStructuredData ? buildBreadcrumbList(crumbs) : null;
  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <nav ref={ref} aria-label="Breadcrumb" className={cn('text-[13px]', className)} {...props}>
        <ol className="text-text-muted flex flex-wrap items-center gap-[6px]">
          {crumbs.map((crumb, i) => {
            const isCurrent = i === last;
            return (
              <li key={i} className="inline-flex items-center gap-[6px]">
                {isCurrent ? <Crumb {...crumb.props} current /> : crumb}
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
    </>
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
  if (href === undefined) {
    return <span className={cn('text-text-dim', className)}>{children}</span>;
  }
  return (
    <a
      ref={ref}
      href={href}
      className={cn('hover:text-text transition-colors duration-(--duration-micro)', className)}
      {...props}
    >
      {children}
    </a>
  );
});

Crumb.displayName = 'Crumb';
