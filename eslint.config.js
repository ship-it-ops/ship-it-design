/**
 * Root ESLint flat config. ESLint walks up from the file being linted to find this,
 * so per-package configs aren't needed.
 *
 * The React layer is file-scoped to *.tsx/jsx so non-React TS files (token modules,
 * build scripts) skip the React-specific rules.
 */
import baseConfig from '@ship-it/eslint-config';
import reactLayer from '@ship-it/eslint-config/react';

export default [...baseConfig, reactLayer];
