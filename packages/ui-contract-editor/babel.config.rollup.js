const pkg = require('./package.json');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: pkg.browserslist.production,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ],
  ignore: ['node_modules/**'],
};
