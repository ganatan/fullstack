import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    ignores: ['dist/**'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-console': 'off', 
      'import/extensions': 'off',
      'no-unused-vars': 'warn',
    },
  },
];