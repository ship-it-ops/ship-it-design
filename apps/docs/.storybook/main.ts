import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';

/**
 * Resolve a package's install dir absolutely. Storybook 10 recommends this for
 * monorepos to avoid hoisting ambiguity when addons live multiple levels above
 * the docs app's `node_modules`.
 */
const resolveAddon = (pkg: string): string =>
  dirname(fileURLToPath(import.meta.resolve(`${pkg}/package.json`)));

const config: StorybookConfig = {
  framework: {
    name: resolveAddon('@storybook/react-vite'),
    options: {},
  },

  stories: [
    '../stories/**/*.mdx',
    '../../../packages/ui/src/**/*.mdx',
    '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
    '../../../packages/shipit/src/**/*.mdx',
    '../../../packages/shipit/src/**/*.stories.@(ts|tsx)',
  ],

  // Storybook 10: controls / actions / viewport / backgrounds / interactions
  // are now built in. We only register the addons not in core.
  addons: [
    {
      name: resolveAddon('@storybook/addon-docs'),
      options: {
        // MDX 2 dropped GitHub-flavored markdown as a built-in. `remark-gfm`
        // re-enables pipe tables, strikethrough, autolinks, task lists.
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    resolveAddon('@storybook/addon-links'),
    resolveAddon('@storybook/addon-a11y'),
    resolveAddon('@storybook/addon-themes'),
  ],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  // Inject the Tailwind v4 Vite plugin so utility classes are compiled at
  // dev + build time. Without this, the `@import 'tailwindcss'` in
  // globals.css emits nothing and every component renders unstyled.
  //
  // `STORYBOOK_BASE_URL` lets the Pages workflow build assets under the repo
  // subpath (e.g. `/ship-it-design/`) so absolute asset paths resolve when
  // hosted at `<owner>.github.io/<repo>/`. Empty in dev / local builds.
  viteFinal: async (cfg) =>
    mergeConfig(cfg, {
      plugins: [
        tailwindcss(),
        {
          // Storybook 10's MDX compiler emits absolute `file://` URLs for
          // `@storybook/addon-docs/dist/mdx-react-shim.js`. Vite's dev
          // server tolerates the scheme; Rollup (production build) doesn't.
          // Translate the URL into an OS path so Rollup can resolve it.
          name: 'ship-it:resolve-file-url',
          enforce: 'pre',
          resolveId(id: string) {
            if (id.startsWith('file://')) {
              return fileURLToPath(id);
            }
            return null;
          },
        },
      ],
      base: process.env.STORYBOOK_BASE_URL ?? cfg.base,
    }),
};

export default config;
