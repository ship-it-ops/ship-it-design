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
  viteFinal: async (cfg) => mergeConfig(cfg, { plugins: [tailwindcss()] }),
};

export default config;
