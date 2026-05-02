import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';

import '@ship-it-ui/ui/styles/globals.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    backgrounds: { disabled: true }, // we drive bg via the theme decorator
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    layout: 'centered',
  },
  decorators: [
    // Tokens are dark-first: `:root` is the dark theme, `[data-theme="light"]`
    // is the opt-in override. We set `parentSelector: 'html'` so the data-theme
    // attribute lands on the iframe's `<html>` element — that way the token
    // CSS variables cascade through *everything* (canvas, autodocs, MDX docs
    // pages) and the surfaces painted in `preview.css` flip with the toggle.
    withThemeByDataAttribute({
      themes: { dark: '', light: 'light' },
      defaultTheme: 'dark',
      attributeName: 'data-theme',
      parentSelector: 'html',
    }),
  ],
};

export default preview;
