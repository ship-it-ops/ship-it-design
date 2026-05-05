import Link from 'next/link';

import { neighbors } from '@/content/navigation';

export function Pager({ slug }: { slug: string }) {
  const { prev, next } = neighbors(slug);
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Page navigation"
      className="border-border mt-12 grid grid-cols-2 gap-3 border-t pt-6"
    >
      <div>
        {prev && (
          <Link
            href={`/${prev.slug}`}
            className="border-border bg-panel hover:bg-panel-2 rounded-base focus-visible:ring-accent-dim block border p-3 text-[13px] outline-none focus-visible:ring-[3px]"
          >
            <div className="text-text-dim text-[10px] tracking-wider uppercase">Previous</div>
            <div className="text-text mt-0.5">← {prev.title}</div>
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={`/${next.slug}`}
            className="border-border bg-panel hover:bg-panel-2 rounded-base focus-visible:ring-accent-dim block border p-3 text-right text-[13px] outline-none focus-visible:ring-[3px]"
          >
            <div className="text-text-dim text-[10px] tracking-wider uppercase">Next</div>
            <div className="text-text mt-0.5">{next.title} →</div>
          </Link>
        )}
      </div>
    </nav>
  );
}
