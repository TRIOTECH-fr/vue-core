// http://eslint.org/docs/user-guide/configuring

const path = require('path')

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  globals: {
    '$': true,
    '_': true,
  },
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, 'build/webpack.base.conf.js')
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    'object-shorthand': ['error', 'properties'],
    'no-param-reassign': ['error', {
      props: false
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': ['error', {
      allow: ['_links']
    }],
    'no-unused-vars': ['error', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      varsIgnorePattern: '^_',
    }],
  },
};
