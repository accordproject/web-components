const fs = require('fs');
const pkg = require('./package.json');

const dependencies = ['prop-types', 'react', 'react-dom'];

const newPackage = {
  ...pkg,
  husky: {
    hooks: {
      'pre-commit': 'lint-staged',
      'pre-push': 'CI=true yarn test --passWithNoTests',
    },
  },
  dependencies: Object.fromEntries(
    Object.keys(pkg.dependencies)
      .filter(key => dependencies.some(dependency => dependency === key))
      .map(name => [name, pkg.dependencies[name]])
  ),
  devDependencies: Object.fromEntries(
    Object.keys(pkg.dependencies)
      .filter(key => dependencies.some(dependency => dependency !== key))
      .map(name => [name, pkg.dependencies[name]])
  ),
  peerDependencies: {
    react: '>=16.8.0',
    'react-dom': '>=16.8.0',
  },
  files: ['lib'],
  engines: {
    node: '>=10',
  },
  private: false,
};

fs.writeFileSync('package.json', JSON.stringify(newPackage, null, 2));
