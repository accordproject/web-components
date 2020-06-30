# Accord Project Web Components Storybook

[![Build Status](https://travis-ci.org/accordproject/web-components.svg?branch=master)](https://travis-ci.org/accordproject/web-components) 
[![join slack](https://img.shields.io/badge/Accord%20Project-Join%20Slack-blue)](https://accord-project-slack-signup.herokuapp.com/)

This repository contains a [React Storybook](https://storybook.js.org), and contains all the stories for all the sub-packages to discover the components and their properties.

### View Storybook

```sh
cd packages/storybook
npm run storybook
```

### Develop inside Storybook

While Storybook is running, if you make a change in a package that you want to see reflected in the demo, in a new terminal:

```sh
cd packages/<PACKAGE>
npm run build
```

Storybook will reload with the applied changes.

### Run tests

```sh
cd packages/storybook
npm run test
```

---

<a href="https://www.accordproject.org/">
  <img src="../../assets/APLogo.png" alt="Accord Project Logo" width="400" />
</a>

Accord Project is an open source, non-profit, initiative working to transform contract management and contract automation by digitizing contracts. Accord Project operates under the umbrella of the [Linux Foundation][linuxfound]. The technical charter for the Accord Project can be found [here][charter].

## Learn More About Accord Project

### [Overview][apmain]

### [Documentation][apdoc]

## Contributing

The Accord Project technology is being developed as open source. All the software packages are being actively maintained on GitHub and we encourage organizations and individuals to contribute requirements, documentation, issues, new templates, and code.

Find out what’s coming on our [blog][apblog].

Join the Accord Project Technology Working Group [Slack channel][apslack] to get involved!

For code contributions, read our [CONTRIBUTING guide][contributing] and information for [DEVELOPERS][developers].

### README Badge

Using Accord Project? Add a README badge to let everyone know: [![accord project](https://img.shields.io/badge/powered%20by-accord%20project-19C6C8.svg)](https://www.accordproject.org/)

```
[![accord project](https://img.shields.io/badge/powered%20by-accord%20project-19C6C8.svg)](https://www.accordproject.org/)
```

## License <a name="license"></a>

Accord Project source code files are made available under the [Apache License, Version 2.0][apache].
Accord Project documentation files are made available under the [Creative Commons Attribution 4.0 International License][creativecommons] (CC-BY-4.0).

Copyright 2018-2019 Clause, Inc. All trademarks are the property of their respective owners. See [LF Projects Trademark Policy](https://lfprojects.org/policies/trademark-policy/).

[linuxfound]: https://www.linuxfoundation.org
[charter]: https://github.com/accordproject/governance/blob/master/accord-project-technical-charter.md
[apmain]: https://accordproject.org/ 
[apblog]: https://medium.com/@accordhq
[apdoc]: https://docs.accordproject.org/
[apslack]: https://accord-project-slack-signup.herokuapp.com

[contributing]: https://github.com/accordproject/web-components/blob/master/CONTRIBUTING.md
[developers]: https://github.com/accordproject/web-components/blob/master/DEVELOPERS.md

[apache]: https://github.com/accordproject/web-components/blob/master/LICENSE
[creativecommons]: http://creativecommons.org/licenses/by/4.0/