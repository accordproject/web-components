const path = require("path");
const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');

disableEsLint = (e) => {
  return e.module.rules.filter(e =>
    e.use && e.use.some(e => e.options && void 0 !== e.options.useEslintrc)).forEach(s => {
      e.module.rules = e.module.rules.filter(e => e !== s)
    }), e
}

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-links', 
    '@storybook/addon-knobs', 
    '@storybook/addon-a11y/register',
    '@storybook/addon-notes/register'
  ],
  webpackFinal: async (config, { configType }) => {

    config = disableEsLint(config);

    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../")
    });
    config.plugins.push(new webpack.IgnorePlugin(/jsdom$/));
    config = { ...config, node: { child_process: "empty", fs: "empty", net: "empty", tls: "empty" } };
    // Return the altered config
    return config;
  },
};
