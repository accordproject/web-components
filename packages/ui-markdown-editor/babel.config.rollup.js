module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: 'current'
        }
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ],
  ignore: ['node_modules/**'],
};
