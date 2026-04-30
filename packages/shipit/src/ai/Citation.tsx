import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * Citation — superscript-style numbered chip + source label, used in answer
 * bodies to point back to the document/line that supports the claim.
 *
 * Pass `inline` for the inline superscript variant (rendered next to the
 * referenced text). The default block variant lives below the answer with a
 * source preview.
 */

const SUPERSCRIPTS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((d) => SUPERSCRIPTS[Number(d)] ?? d)
    .join('');
}

export interface CitationProps extends HTMLAttributes<HTMLSpanElement> {
  /** Citation number (1-indexed). */
  index: number;
  /** Source label — e.g., `runbook-oncall.md:L42`. */
  source?: ReactNode;
  /** Connector / origin line — e.g., `notion · updated 2d ago`. */
  meta?: ReactNode;
  /** Inline superscript variant (renders the number only, no source row). */
  inline?: boolean;
}

export const Citation = forwardRef<HTMLSpanElement, CitationProps>(function Citation(
  { index, source, meta, inline, className, ...props },
  ref,
) {
  if (inline) {
    return (
      <sup
        ref={ref as never}
        aria-label={typeof source === 'string' ? `Citation ${index}: ${source}` : `Citation ${index}`}
        className={cn('ml-[2px] font-mono text-[10px] text-accent', className)}
        {...props}
      >
        {toSuperscript(index)}
      </sup>
    );
  }
  return (
    <span ref={ref} className={cn('inline-flex items-center gap-2', className)} {...props}>
      <span
        aria-hidden
        className="rounded-xs bg-accent-dim px-[6px] py-[2px] font-mono text-[10px] text-accent"
      >
        {toSuperscript(index)}
      </span>
      <span className="text-[12px] text-text-muted">
        {source != null && <>from {source}</>}
        {source != null && meta != null && <span className="text-text-dim"> · </span>}
        {meta}
      </span>
    </span>
  );
});
