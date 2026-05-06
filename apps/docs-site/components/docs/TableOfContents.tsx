'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Right-rail table of contents. Reads h2/h3 headings from the article on
 * every route change (rehype-slug provides stable IDs) and uses an
 * IntersectionObserver to highlight whichever is currently in view.
 *
 * The component is mounted in the persistent `(docs)` layout, so client-
 * side navigation keeps the same instance — `pathname` in the deps array
 * is what re-runs the scan when the user lands on a new page.
 */
export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const article = document.querySelector('article.docs-prose');
    if (!article) {
      setHeadings([]);
      return;
    }
    const list: Heading[] = Array.from(article.querySelectorAll('h2[id], h3[id]')).map((h) => {
      // rehype-autolink-headings appends an `<a class="docs-anchor">#</a>`
      // inside each heading. Clone, strip the anchor, then read textContent
      // so the TOC label is "Variants" not "Variants#".
      const clone = h.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.docs-anchor').forEach((a) => a.remove());
      return {
        id: h.id,
        text: (clone.textContent ?? '').trim(),
        level: h.tagName === 'H2' ? 2 : 3,
      };
    });
    setHeadings(list);
    setActive(null);
    if (list.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 },
    );
    list.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden w-56 flex-shrink-0 px-4 py-8 lg:block">
      <div className="sticky top-20">
        <div className="text-text-dim mb-3 text-[10px] tracking-wider uppercase">On this page</div>
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${h.id}`}
                className={
                  active === h.id
                    ? 'text-accent text-[12px]'
                    : 'text-text-muted hover:text-text text-[12px]'
                }
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
