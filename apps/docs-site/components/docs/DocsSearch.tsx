'use client';

import { CommandPalette, EmptyState, Kbd } from '@ship-it-ui/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';


interface SearchEntry {
  id: string;
  title: string;
  description?: string;
  section: string;
  slug: string;
  hash?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * ⌘K search. Built on `CommandPalette` from `@ship-it-ui/ui`. The index is
 * fetched lazily from `public/search-index.json` (built by
 * `scripts/build-search-index.ts`) on first open and filtered with a plain
 * substring match against title/description. Good enough for the current
 * content footprint; swap in FlexSearch (already in deps) once the corpus
 * grows past a couple hundred entries or once we want fuzzy matching.
 */
export function DocsSearch({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);

  // ⌘K opens / Escape closes (Escape is handled by Radix Dialog inside).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenChange]);

  // Lazy-load the index on first open.
  useEffect(() => {
    if (!open || entries) return;
    const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
    fetch(`${base}/search-index.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SearchEntry[]) => setEntries(data))
      .catch(() => setEntries([]));
  }, [open, entries]);

  const groups = useMemo(() => {
    if (!entries) return [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? entries.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            (e.description?.toLowerCase().includes(q) ?? false),
        )
      : entries.slice(0, 12);
    const bySection = new Map<string, SearchEntry[]>();
    for (const e of filtered) {
      const list = bySection.get(e.section) ?? [];
      list.push(e);
      bySection.set(e.section, list);
    }
    return Array.from(bySection.entries()).map(([label, items]) => ({
      label,
      items: items.map((e) => ({
        id: e.id,
        label: e.title,
        description: e.description,
      })),
    }));
  }, [entries, query]);

  const onSelect = (id: string) => {
    const e = entries?.find((x) => x.id === id);
    if (!e) return;
    onOpenChange(false);
    setQuery('');
    router.push(`/${e.slug}${e.hash ? `#${e.hash}` : ''}`);
  };

  return (
    <CommandPalette
      open={open}
      onOpenChange={onOpenChange}
      query={query}
      onQueryChange={setQuery}
      groups={groups}
      onSelect={onSelect}
      placeholder="Search docs…"
      emptyState={
        <EmptyState
          title="Nothing matches"
          description="Try a component name, a token, or a foundation topic."
        />
      }
      footer={
        <span className="text-text-dim flex items-center gap-2 text-[11px]">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> navigate
          <span className="mx-1">·</span>
          <Kbd>↵</Kbd> open
          <span className="mx-1">·</span>
          <Kbd>Esc</Kbd> close
        </span>
      }
    />
  );
}
