import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * Footer — site footer with brand on the left and grouped link columns on
 * the right, plus a copyright line below a divider.
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
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { brand, columns, copyright, closing, className, ...props },
  ref,
) {
  return (
    <footer ref={ref} className={cn('px-7 py-7', className)} {...props}>
      <div className="mb-7 flex flex-wrap gap-8">
        {brand && <div>{brand}</div>}
        <div className="ml-auto flex flex-wrap gap-6 text-[12px] text-text-muted">
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-[6px]">
              <div className="font-mono text-[10px] uppercase tracking-[1.2px] text-text-dim">
                {col.heading}
              </div>
              {col.links.map((link, j) => (
                <a
                  key={j}
                  href={link.href}
                  className="text-text-muted no-underline hover:text-text"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex border-t border-border pt-4 font-mono text-[11px] text-text-dim">
        {copyright && <span>{copyright}</span>}
        {closing && <span className="ml-auto">{closing}</span>}
      </div>
    </footer>
  );
});
