module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, 
    sourceType: 'module',
    },
    env: {
    node: true, 
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', 
    'prettier',
    'plugin:prettier/recommended', 
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
