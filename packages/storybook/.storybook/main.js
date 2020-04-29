const path = require("path");
const webpack = require("webpack");

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links', 
    '@storybook/addon-knobs', 
    '@storybook/addon-docs',
    '@storybook/addon-a11y/register',
    '@storybook/addon-notes/register'
  ],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../")
    });
    config.plugins.push(new webpack.IgnorePlugin(/jsdom$/));
    config = { ...config, node: { fs: "empty", net: "empty", tls: "empty" } };
    // Return the altered config
    return config;
  },
};
