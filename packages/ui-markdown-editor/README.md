# Accord Project Web Components Markdown Editor

[![downloads](https://img.shields.io/npm/dm/@accordproject/ui-markdown-editor)](https://www.npmjs.com/package/@accordproject/ui-markdown-editor)
[![npm version](https://badge.fury.io/js/%40accordproject%2Fui-markdown-editor.svg)](https://badge.fury.io/js/%40accordproject%2Fui-markdown-editor)
[![join slack](https://img.shields.io/badge/Accord%20Project-Join%20Slack-blue)](https://accord-project-slack-signup.herokuapp.com/)

This repository contains a WYSIWYG editor for markdown that conforms to the [CommonMark](https://spec.commonmark.org) specification.

The editor is based on React, [Slate](https://www.slatejs.org), and the Accord Project [`markdown-transform` project](https://github.com/accordproject/markdown-transform).

### Installation

```sh
npm install @accordproject/ui-markdown-editor @accordproject/markdown-slate slate slate-history slate-react semantic-ui-react
```

### Implementation

```js
import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { SlateTransformer } from '@accordproject/markdown-slate';
import { MarkdownEditor } from '@accordproject/ui-markdown-editor';

const slateTransformer = new SlateTransformer();
const defaultMarkdown = `This is text. You can edit it.`;

const App = () => {
  const [slateValue, setSlateValue] = useState(() => {
    const slate = slateTransformer.fromMarkdown(defaultMarkdown);
    return slate.document.children;
  });

  const onSlateValueChange = useCallback((slateChildren) => {
    localStorage.setItem('slate-editor-value', JSON.stringify(slateChildren));
    const slateValue = { document: { children: slateChildren } };
    setSlateValue(slateValue.document.children);
  }, []);

  return (<MarkdownEditor readOnly={false} value={slateValue} onChange={onSlateValueChange} />);
}

ReactDOM.render(<App />, document.getElementById('root'));
```

### Develop inside Storybook

While Storybook is running, if you make a change in a package that you want to see reflected in the demo, in a new terminal:

```sh
cd packages/ui-markdown-editor
npm run build
```

Storybook will reload with the applied changes.

## Props

### Required Properties

#### Values

- `value`: An `array` which is the initial contents of the editor (markdown text)

#### Functionality

- `onChange`: A callback `function` called when contents of the editor change, receives the markdown text

### Optional Properties

#### Values

- `readOnly`: A `boolean` to lock all text and remove the formatting toolbar
- `placeholder`: Placeholder `string` for text when the editor is blank
- `activeButton`: Optional `object` to change formatting button active state color
  - `{ background: '#FFF', symbol: '#000' }`

#### Functionality

- `onChange`: A callback `function` called when contents of the editor change, receives the markdown text
- `augmentEditor`: A higher order function to augment the methods on the Slate editor
- `customElements`: A `function` for extending elements rendered by editor
- `isEditable`: A `function` for determining if the current edit should be allowed
- `canBeFormatted`: A `function` that determines if current formatting change should be allowed
- `canCopy`: A `function` that determines if current selection copy should be allowed
- `canKeyDown`: A `function` that determines if current key event should be allowed
- `onDragStart`: A `function` to call when onDragStart event fires which will receive editor and event
- `onDrop`: A `function` to call when onDrop event fires which will receive editor and event
- `onDragOver`: A `function` to call when onDragOver event fires which will receive editor and event

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