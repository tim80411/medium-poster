module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'max-len': ['error', { code: 140, ignoreComments: true }],
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
  },
};
