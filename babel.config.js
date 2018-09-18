// https://babeljs.io/docs/en/config-files#project-wide-configuration

module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV === 'test');

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: [
            '> 1%',
            'last 2 versions',
            'not ie <= 8',
          ],
        },
      },
    ],
  ];

  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
  ];

  if (api.env('test')) {
    plugins.unshift('instanbul');
  }

  return {
    presets,
    plugins,
  };
};
