/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    //'plugin:import/recommended',
    //'plugin:import/typescript',
    //'plugin:@typescript-eslint/recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  /*settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },*/
  rules: {
    'no-duplicate-imports': 2,
  }
}
