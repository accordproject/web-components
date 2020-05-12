# Accord Project Web Components

This repository contains a library of user interface components that can be used to create web-applications based on Accord Project technology. The components use the [React](https://reactjs.org) web application framework.

Use the interactive [Storybook](https://accordproject.github.io/web-components) for the components to discover their properties.

## Repository Structure

This repository is a monorepo, built using [lerna](https://lerna.js.org). Each package is published as an independent npm module.

The `storybook` package is a [React Storybook](https://storybook.js.org), and contains all the stories for all the sub-packages.

GitHub Actions is used to automatically publish the static site generated by Storybook to GitHub pages.

## Creating new packages

The packages have all been created by running `yarn create react-app %PROJECT_NAME% --template npm-library` in the packages directory.

After running the command above, you need to:

1. cd MY_PACKAGE
2. node ./prepare.js
3. Edit the `build` and `build:lib` targets in package.json so that the library is built when build is run, rather than the test app

```
"build:app": "react-scripts build",
"build": "npx rollup -c",
```

The source code for libraries should be placed in the `src/lib` folder.

## Building

```
npm install -g lerna
lerna clean && lerna bootstrap && lerna run build
```

## View Storybook

```
cd packages/storybook
npm run storybook
```

## Build Storybook (Static)

```
lerna run storybook
open packages/storybook/storybook-static/index.html
```

