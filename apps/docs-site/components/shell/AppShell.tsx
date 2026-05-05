'use client';

import { useState, type ReactNode } from 'react';

import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { DocsSearch } from '@/components/docs/DocsSearch';

/**
 * The chrome wrapping every docs page. Topbar (brand + search trigger + theme
 * toggle) on top, Sidebar on the left, content fills the rest. The middle
 * content column owns its own padding so MDX pages can choose their layout.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex h-svh flex-col">
      <AppTopbar onOpenSearch={() => setSearchOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
