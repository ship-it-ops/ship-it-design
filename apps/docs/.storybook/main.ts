import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: [
    '../stories/**/*.mdx',
    '../../../packages/ui/src/**/*.mdx',
    '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
    '../../../packages/shipit/src/**/*.mdx',
    '../../../packages/shipit/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  docs: {
    autodocs: 'tag',
  },
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
      plugins: [tailwindcss()],
      base: process.env.STORYBOOK_BASE_URL ?? cfg.base,
    }),
};

export default config;
