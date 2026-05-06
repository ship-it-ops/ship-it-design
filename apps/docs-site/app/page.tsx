import Link from 'next/link';

import { Badge } from '@ship-it-ui/ui';

import { navigation } from '@/content/navigation';
import { SYSTEM_VERSION } from '@/lib/version';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-16">
      <div className="mb-3 flex items-center gap-2">
        <span aria-hidden className="text-accent text-[18px]">
          ◆
        </span>
        <Badge variant="outline">{SYSTEM_VERSION}</Badge>
      </div>
      <h1 className="text-text text-[44px] leading-tight font-semibold tracking-tight">
        Ship-It Design System
      </h1>
      <p className="text-text-muted mt-4 max-w-xl text-[16px] leading-relaxed">
        Tokens, components, and patterns for Ship-It products — built on Radix UI and Tailwind v4,
        themed via OKLCH. Every component on this site is the same one consumed by every Ship-It
        app.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {navigation.map((section) => {
          const first = section.groups[0]?.items[0];
          if (!first) return null;
          return (
            <Link
              key={section.id}
              href={`/${first.slug}`}
              className="border-border bg-panel hover:bg-panel-2 rounded-base focus-visible:ring-accent-dim block border p-5 transition-colors duration-(--duration-micro) outline-none focus-visible:ring-[3px]"
            >
              <div className="text-text-dim text-[10px] tracking-wider uppercase">Section</div>
              <div className="text-text mt-2 text-[18px] font-medium">{section.label}</div>
              <div className="text-text-muted mt-1 text-[12px]">
                {section.groups.flatMap((g) => g.items).length} pages
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
