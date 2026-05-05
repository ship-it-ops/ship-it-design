import type { MDXComponents } from 'mdx/types';

import { Callout } from '@/components/docs/Callout';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { EditOnGithub } from '@/components/docs/EditOnGithub';
import { InstallTabs } from '@/components/docs/InstallTabs';
import { LivePreview } from '@/components/docs/LivePreview';
import { Pager } from '@/components/docs/Pager';
import { PropsTable } from '@/components/docs/PropsTable';
import { Shortcut } from '@/components/docs/Shortcut';

/**
 * Tells `@next/mdx` which React components to substitute for HTML elements
 * and which custom components are available unprefixed inside MDX. The MDX
 * router (`app/[[...slug]]/page.tsx`) calls `useMDXComponents` to compose
 * this map with the page-specific overrides.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: (props) => <CodeBlock {...props} />,
    Callout,
    LivePreview,
    PropsTable,
    InstallTabs,
    Shortcut,
    Pager,
    EditOnGithub,
    ...components,
  };
}
