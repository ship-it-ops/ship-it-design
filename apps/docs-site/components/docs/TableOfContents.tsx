'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Right-rail table of contents. Reads h2/h3 headings from the article on mount
 * (the `rehype-slug` plugin provides stable IDs) and uses an
 * IntersectionObserver to highlight whichever is currently in view.
 */
export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const article = document.querySelector('article.docs-prose');
    if (!article) return;
    const list: Heading[] = Array.from(article.querySelectorAll('h2[id], h3[id]')).map((h) => ({
      id: h.id,
      text: h.textContent ?? '',
      level: h.tagName === 'H2' ? 2 : 3,
    }));
    setHeadings(list);
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
  }, []);

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
