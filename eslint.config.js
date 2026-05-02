/**
 * Root ESLint flat config. ESLint walks up from the file being linted to find this,
 * so per-package configs aren't needed.
 *
 * The React layer is file-scoped to *.tsx/jsx so non-React TS files (token modules,
 * build scripts) skip the React-specific rules. The Storybook layer is file-scoped
 * to story files and `.storybook/` config inside the plugin's preset.
 */
import baseConfig from '@ship-it-ui/eslint-config';
import reactLayer from '@ship-it-ui/eslint-config/react';
import storybookLayer from '@ship-it-ui/eslint-config/storybook';

export default [...baseConfig, reactLayer, ...storybookLayer];
