module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@types': './src/types',
            '@services': './src/services',
            '@features': './src/features',
            '@components': './src/components',
            '@state': './src/state',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  };
};
