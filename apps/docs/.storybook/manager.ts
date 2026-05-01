// Storybook 8 moved these out of the standalone `@storybook/*` packages and
// into the `storybook/internal/*` subpath. Importing from the old paths
// resolves at runtime but breaks `tsc --noEmit` because the type stubs no
// longer ship under those names.
import { addons } from 'storybook/internal/manager-api';
import { create } from 'storybook/internal/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Ship-It Design System',
    brandUrl: 'https://github.com/ship-it-ops/ship-it-design',
  }),
});
