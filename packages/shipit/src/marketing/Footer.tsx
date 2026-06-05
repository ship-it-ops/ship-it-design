'use client';

import { cn } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Footer — site footer with brand on the left and grouped link columns on
 * the right, plus a copyright line below a divider.
 *
 * Each link column is rendered as a proper `<ul>` of `<li>` link rows so
 * search engines pick up the footer-nav hierarchy correctly. Pass
 * `address` for a contact block that renders inside `<address>` (the
 * semantic element for organization contact info — improves local SEO and
 * structured-data extraction).
 */

export interface FooterLink {
  label: ReactNode;
  href: string;
}

export interface FooterColumn {
  heading: ReactNode;
  links: ReadonlyArray<FooterLink>;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Brand label (logo + word mark). */
  brand?: ReactNode;
  columns: ReadonlyArray<FooterColumn>;
  /** Copyright / legal line. */
  copyright?: ReactNode;
  /** Right-side closing line (e.g., `made with care · san francisco`). */
  closing?: ReactNode;
  /**
   * Optional contact / address block. Rendered inside `<address>` next to the
   * brand for org contact info (phone, email, mailing address).
   */
  address?: ReactNode;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { brand, columns, copyright, closing, address, className, ...props },
  ref,
) {
  return (
    <footer ref={ref} className={cn('px-7 py-7', className)} {...props}>
      <div className="mb-7 flex flex-wrap gap-8">
        {brand && (
          <div className="flex flex-col gap-2">
            <div>{brand}</div>
            {address && (
              <address className="text-text-dim text-[12px] not-italic">{address}</address>
            )}
          </div>
        )}
        <div className="text-text-muted ml-auto flex flex-wrap gap-6 text-[12px]">
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-[6px]">
              <div className="text-text-dim font-mono text-[10px] tracking-[1.2px] uppercase">
                {col.heading}
              </div>
              <ul className="m-0 flex list-none flex-col gap-[6px] p-0">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href} className="text-text-muted hover:text-text no-underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-border text-text-dim flex border-t pt-4 font-mono text-[11px]">
        {copyright && <span>{copyright}</span>}
        {closing && <span className="ml-auto">{closing}</span>}
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
