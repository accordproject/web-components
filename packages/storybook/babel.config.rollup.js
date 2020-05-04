const pkg = require('./package.json');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: pkg.browserslist.production,
      },
    ]  
  ],
  ignore: ['node_modules/**'],
};
