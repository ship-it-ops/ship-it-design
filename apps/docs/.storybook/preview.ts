import { withThemeByClassName } from '@storybook/addon-themes';
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
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
