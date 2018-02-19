// http://eslint.org/docs/user-guide/configuring

const path = require('path')

module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  globals: {
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
  // custom rules
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
    'max-len': ['error', 140, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'func-names': ['warn', 'as-needed'],
    'vue/script-indent': ['error', 2, {
      baseIndent: 1,
      switchCase: 1,
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: {
        allowFirstLine: true,
      },
    }],
    'indent': 'off'
  },
};
