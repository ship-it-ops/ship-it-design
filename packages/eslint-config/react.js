import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

/**
 * React layer — file-scoped to *.tsx/jsx so non-React TS files (token modules,
 * scripts) skip these rules. Compose with the base config:
 *
 *   import base from '@ship-it/eslint-config';
 *   import react from '@ship-it/eslint-config/react';
 *   export default [...base, react];
 */
export default {
  files: ['**/*.{tsx,jsx}'],
  languageOptions: {
    globals: { ...globals.browser },
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooks,
    'jsx-a11y': jsxA11y,
  },
  settings: { react: { version: 'detect' } },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
    ...jsxA11y.configs.recommended.rules,
    'react/prop-types': 'off',
  },
};
