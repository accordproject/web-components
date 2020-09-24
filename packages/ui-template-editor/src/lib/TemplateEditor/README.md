## Contract Editor

### Usage

```shell
npm install @accordproject/ui-template-editor @accordproject/markdown-slate slate slate-history slate-react semantic-ui-react semantic-ui-css
```

```js
import { render } from 'react-dom';
import React, { useCallback, useState } from 'react';
import TemplateEditor from '@accordproject/ui-template-editor';
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

const TemplateEditorRenderer = () => {
  const [slateValue, setSlateValue] = useState(() => {
    const slate = getContractSlateVal();
    return slate.document.children;
  });
  
  const onContractChange = useCallback((value) => { setSlateValue(value); }, []);

  return (
      <TemplateEditor
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

render(<TemplateEditorRenderer />, document.getElementById('root'));
```


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
You can support deletion, editing, and testing of the Clause Components within the `TemplateEditor`. An object may be passed down this component with the following possible functions:
```js
clauseProps = {
    CLAUSE_DELETE_FUNCTION,  // (Function)
    CLAUSE_EDIT_FUNCTION,    // (Function)
    CLAUSE_TEST_FUNCTION,    // (Function)
    HEADER_TITLE,            // (String)
    ICON_HOVER_COLOR,        // (String)
}
```