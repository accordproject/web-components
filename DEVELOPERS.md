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

### Develop inside Storybook

While Storybook is running, if you make a change in a package that you want to see reflected in the demo, in a new terminal:

```
cd packages/<PACKAGE>
npm run build
```

Storybook will reload with the applied changes.

[apdev]: https://github.com/accordproject/techdocs/blob/master/DEVELOPERS.md

## Releasing

Releases are made manually by maintainers through GitHub. Version tags follow semantic-versioning conventions with a `v` prefix, for example `v1.2.3`.

### Generating release notes from Pull Requests

A markdown changelog that includes the contributors and links to changes can be generated automatically through the `lerna-changelog` tool.

1. You will need a GitHub [Personal Access Token](https://github.com/settings/tokens) with `public_repo` permissions.
2. Review [all merged PRs since the last release](https://github.com/accordproject/web-components/pulls?q=is%3Apr+is%3Aclosed+is%3Amerged) to ensure that they are appropriately labelled with one of the following labels.
    - `Type: Breaking Change 💥`
    - `Type: Enhancement ✨`
    - `Type: Bug 🐛`
    - `Type: Chore 🧼`
    - `Type: Documentation 📝`
    
> Note that `Type: Styling` and `Type: Feature Request` are not used, you should use `Type: Enhancement` instead.

3. Run the following command from the root folder of an up-to-date local clone of this repository to generate the markdown content.
```bash
GITHUB_AUTH=[YOUR_PERSONAL_ACCESS_TOKEN] npm run changelog:unreleased
```
4. Copy the markdown output from the terminal to the [GitHub release editor](https://github.com/accordproject/web-components/releases/new).
