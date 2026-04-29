import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Ship-It Design System',
    brandUrl: 'https://github.com/ship-it-ops/ship-it-design',
  }),
});
