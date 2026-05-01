import { addons } from 'storybook/internal/manager-api';
import { create } from 'storybook/internal/theming/create';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Ship-It Design System',
    brandUrl: 'https://github.com/ship-it-ops/ship-it-design',
  }),
});
