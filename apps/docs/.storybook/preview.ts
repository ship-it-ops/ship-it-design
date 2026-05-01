import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';

import '@ship-it/ui/styles/globals.css';

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true }, // we drive bg via the theme decorator
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
    // is the opt-in override. Storybook's "dark" theme entry stays empty so
    // it falls back to `:root`; "light" sets the data-theme attribute.
    withThemeByDataAttribute({
      themes: { dark: '', light: 'light' },
      defaultTheme: 'dark',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
