'use client';

import { Badge, Kbd, Topbar } from '@ship-it-ui/ui';

import { ThemeToggle } from './ThemeToggle';

import { SYSTEM_VERSION } from '@/lib/version';

const REPO_URL = 'https://github.com/ship-it-ops/ship-it-design';

interface Props {
  onOpenSearch: () => void;
}

export function AppTopbar({ onOpenSearch }: Props) {
  return (
    <Topbar
      title={
        <span className="flex items-center gap-2">
          <span className="text-text">Ship-It Design</span>
          <Badge variant="outline">{SYSTEM_VERSION}</Badge>
        </span>
      }
      leading={
        <span aria-hidden className="text-accent text-[15px]">
          ◆
        </span>
      }
      actions={
        <>
          <button
            type="button"
            onClick={onOpenSearch}
            className="border-border bg-panel-2 hover:bg-panel-2/80 text-text-muted focus-visible:ring-accent-dim flex h-8 w-64 items-center gap-2 rounded-xs border px-2 text-[12px] outline-none focus-visible:ring-[3px]"
            aria-label="Search docs"
          >
            <span aria-hidden>⌕</span>
            <span className="flex-1 text-left">Search…</span>
            <Kbd>⌘K</Kbd>
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-text-muted hover:text-text text-[13px]"
          >
            GitHub
          </a>
          <ThemeToggle />
        </>
      }
    />
  );
}
