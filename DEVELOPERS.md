# Accord Project Web Components Development Guide

## ❗ Accord Project Development Guide ❗
We'd love for you to help develop improvements to Accord Project technology! Please refer to the [Accord Project Development guidelines][apdev] we'd like you to follow.

## Web Components Specific Information

### Creating New Packages

The packages have all been created by running `yarn create react-app %PROJECT_NAME% --template npm-library` in the packages directory.

After running the command above, you need to:

1. `cd MY_PACKAGE`
2. `node ./prepare.js`
3. Edit the `build` and `build:lib` targets in `package.json` so that the library is built when build is run, rather than the test app

```json
"build:app": "react-scripts build",
"build": "npx rollup -c",
```

The source code for libraries should be placed in the `src/lib` folder.

### Building

```sh
npm install -g lerna
lerna clean && lerna bootstrap && lerna run build
```

### View Storybook

```
cd packages/storybook
npm run storybook
```

[apdev]: https://github.com/accordproject/techdocs/blob/master/DEVELOPERS.md