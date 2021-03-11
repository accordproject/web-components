# Accord Project Web Components Contract Editor

[![npm version](https://badge.fury.io/js/%40accordproject%2Fui-contract-editor.svg)](https://badge.fury.io/js/%40accordproject%2Fui-contract-editor)
[![join slack](https://img.shields.io/badge/Accord%20Project-Join%20Slack-blue)](https://accord-project-slack-signup.herokuapp.com/)

This repository contains a WYSIWYG editor for markdown that conforms to the [CommonMark](https://spec.commonmark.org) specification which can handle Accord Project's smart contract technology.

The editor is based on React, [Slate](https://www.slatejs.org), and the Accord Project [`markdown-transform` project](https://github.com/accordproject/markdown-transform).

### Installation

```shell
npm install @accordproject/ui-contract-editor @accordproject/markdown-slate slate slate-history slate-react semantic-ui-react semantic-ui-css
```

### Implementation

```js
import { render } from 'react-dom';
import React, { useCallback, useState } from 'react';
import ContractEditor from '@accordproject/ui-contract-editor';
import { SlateTransformer } from '@accordproject/markdown-slate';
import 'semantic-ui-css/semantic.min.css';

const slateTransformer = new SlateTransformer();
const getContractSlateVal = () => {
    const defaultContractMarkdown = `# Heading One
        This is text. This is *italic* text. This is **bold** text. This is \`inline code\`. Fin.`;
    return slateTransformer.fromMarkdown(defaultContractMarkdown);
};

const clausePropsObject = {
    CLAUSE_DELETE_FUNCTION (function),
    CLAUSE_EDIT_FUNCTION (function),
    CLAUSE_TEST_FUNCTION (function),
}

const parseClauseFunction = () => { /* ... */ }
const loadTemplateObjectFunction = () => { /* ... */ }
const pasteToContractFunction = () => { /* ... */ }

const ContractEditorRenderer = () => {
  const [slateValue, setSlateValue] = useState(() => {
    const slate = getContractSlateVal();
    return slate.document.children;
  });
  
  const onContractChange = useCallback((value) => { setSlateValue(value); }, []);

  return (
      <ContractEditor
        value={slateValue}
        lockText={false}
        readOnly={false}
        onChange={onContractChange}
        clauseProps={clausePropsObject}
        loadTemplateObject={loadTemplateObjectFunction}
        pasteToContract={pasteToContractFunction}
        onClauseUpdated={parseClauseFunction}
    />
  );
}

render(<ContractEditorRenderer />, document.getElementById('root'));
```

### Develop inside Storybook

While Storybook is running, if you make a change in a package that you want to see reflected in the demo, in a new terminal:

```sh
cd packages/ui-contract-editor
npm run build
```

Storybook will reload with the applied changes.
### Overview of Clause Props Object
- `clauseProps`: An `object` for the clauses in the editor which contains a deletion, edit, and test function, as well as a header title string and color for clause icons on hover see below.
## Props

### Expected Properties

#### Values

- `value` [OPTIONAL]: An `array` which is the initial contents of the editor.
- `lockText` [OPTIONAL]: A `boolean` to lock all non variable text.
- `readOnly` [OPTIONAL]: A `boolean` to lock all text and remove the formatting toolbar.
- `activeButton` [OPTIONAL]: Optional `object` to change formatting button active state color
  - `{ background: '#FFF', symbol: '#000' }`

#### Functionality

- `onChange` [OPTIONAL]: A callback `function` called when the contents of the editor change. Argument:
  - `value`: The Slate nodes `array` representing all the rich text
- `loadTemplateObject` [OPTIONAL]: A callback `function` to load a template. Argument:
  - `uri`: URI `string` source for loading the template
- `onClauseUpdated` [OPTIONAL]: A callback `function` called when text inside of a clause is changed. Arguments:
  - `clause`: The Slate node `object` representation of the clause
  - `justAdded`:  A `boolean` indicating if this was just added (likely via a paste action)
- `pasteToContract` [OPTIONAL]: A callback `function` to load a clause template via copy/paste. Arguments:
  - `clauseid`: Data `string` from the clause in Slate to indicate a `uuid`
  - `src`: URI `string` source for loading the template

### Available Functionality

- `clauseProps`: An `object` for the clauses in the editor which contains a deletion, edit, and test function, as well as a header title string and color for clause icons on hover see below.

`clauseProps`:
You can support deletion, editing, and testing of the Clause Components within the `ContractEditor`. An object may be passed down this component with the following possible functions:
```js
clauseProps = {
    CLAUSE_DELETE_FUNCTION,  // (Function)
    CLAUSE_EDIT_FUNCTION,    // (Function)
    CLAUSE_TEST_FUNCTION,    // (Function)
    HEADER_TITLE,            // (String)
    ICON_HOVER_COLOR,        // (String)
}
```
The functions in `clauseProps` like `CLAUSE_DELETE_FUNCTION`,`CLAUSE_EDIT_FUNCTION` and `CLAUSE_TEST_FUNCTION`  are not implemented by default because they typically require interaction with other components or the persistence layer of the embedding application.
These functions will be supplied by the user of the component.

---

<p align="center">
  <a href="https://www.accordproject.org/">
    <img src="../../assets/APLogo.png" alt="Accord Project Logo" width="400" />
  </a>
</p>

<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/accordproject/cicero?color=bright-green" alt="GitHub license">
  </a>
  <a href="https://accord-project-slack-signup.herokuapp.com/">
    <img src="https://img.shields.io/badge/Accord%20Project-Join%20Slack-blue" alt="Join the Accord Project Slack"/>
  </a>
</p>

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