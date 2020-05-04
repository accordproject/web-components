[![Build Status](https://travis-ci.com/morewings/cra-template-npm-library.svg?branch=master)](https://travis-ci.com/morewings/cra-template-npm-library)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=morewings/cra-template-npm-library)](https://dependabot.com)
[![dependencies Status](https://david-dm.org/morewings/cra-template-npm-library/status.svg)](https://david-dm.org/morewings/cra-template-quickstart-redux)
[![Netlify Status](https://api.netlify.com/api/v1/badges/7448a6f6-8be5-4d26-b886-f59db21ebb4e/deploy-status)](https://app.netlify.com/sites/cra-template-npm-library/deploys)
[![yarn version](https://badge.fury.io/js/cra-template-npm-library.svg)](https://www.npmjs.com/package/cra-template-npm-library)
[![npm](https://img.shields.io/npm/dm/cra-template-npm-library)](https://www.npmjs.com/package/cra-template-npm-library)

# NPM library Create React App template

[Create React App](https://github.com/facebook/create-react-app) (CRA) template to build and publish NPM libraries with **rollup**, **eslint** and **stylelint** configurations. See [full documentation](https://cra-template-npm-library.netlify.com/).

## Usage

```shell script
npx create-react-app %PROJECT_NAME% --template npm-library
``` 
Or
```shell script
yarn create react-app %PROJECT_NAME% --template npm-library
```

Then

```shell script
cd %PROJECT_NAME%
node ./prepare.js # makes required package.json configuration
yarn start
```

## Features

- Handles all modern JS features.
- Bundles `commonjs` and `es` module formats.
- [Husky](https://github.com/typicode/husky) for git hooks.
- [Eslint](https://eslint.org/) and [stylelint](https://stylelint.io/).
- [Rollup](https://rollupjs.org/guide/en/) for bundling.
- [Babel](https://babeljs.io/) for transpiling.
- [Jest](https://jestjs.io/) and [react-testing-library](https://testing-library.com/docs/react-testing-library/intro) for testing.
- Supports CSS modules, SASS/SCSS, Less and PostCSS.
- [Docz](https://www.docz.site/) for documentation and demo.
- And [much more](https://cra-template-npm-library.netlify.com/).

