import storybook from 'eslint-plugin-storybook';

/**
 * Storybook layer — file-scoped to story files and `.storybook/` config.
 * Lints common Storybook anti-patterns: stories without a default export,
 * use of forbidden APIs, args misuse, etc.
 *
 * Compose with the base + react configs:
 *
 *   import base from '@ship-it/eslint-config';
 *   import react from '@ship-it/eslint-config/react';
 *   import storybookLayer from '@ship-it/eslint-config/storybook';
 *   export default [...base, react, ...storybookLayer];
 */
export default storybook.configs['flat/recommended'];
