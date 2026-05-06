import type { ReactNode } from 'react';

import { DocsArticle } from '@/components/docs/DocsArticle';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsArticle>{children}</DocsArticle>;
}
