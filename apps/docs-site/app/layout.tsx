import { ToastProvider } from '@ship-it-ui/ui';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';


import { AppShell } from '@/components/shell/AppShell';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ship-It Design System',
    template: '%s · Ship-It Design',
  },
  description:
    'Tokens, components, and patterns for Ship-It products — built on Radix UI and Tailwind v4.',
};

/**
 * Pre-paint inline script that reads the persisted theme from localStorage and
 * sets `data-theme` on `<html>` before the first frame. With static export
 * (`output: 'export'`) we can't read cookies in the server layout — every page
 * is generated at build time. The cost is one tiny synchronous script tag; the
 * benefit is no flash of dark→light when a user prefers light.
 */
const themeBootstrap = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="antialiased">
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
