module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'template-curly-spacing': ['error', 'always'],
    'no-constant-condition': 'off',
    'no-this-assignment': 'off',
    'no-prototype-builtins': 'off',
    'no-return-await': 'off',
    'no-fallthrough': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ['error', 'always']
  }
};
