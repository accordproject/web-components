## Cicero-UI - ContractEditor

### Usage

```shell
npm install @accordproject/cicero-ui
```

```js
import { render } from 'react-dom';
import React, { useCallback, useState } from 'react';
import { ContractEditor } from '@accordproject/cicero-ui';
import { SlateTransformer } from '@accordproject/markdown-slate';

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


## Props

### Expected Properties

#### Values

- `value`: An `object` which is the initial contents of the editor.
- `lockText`: A `boolean` to lock all non variable text.
- `readOnly`: A `boolean` to lock all text and remove the formatting toolbar.
- `activeButton`: Optional `object` to change formatting button active state color
  - `{ background: '#FFF', symbol: '#000' }`

#### Functionality

- `onChange`: A callback `function` called when the contents of the editor change.
- `loadTemplateObject`: A callback `function` to load a template.
- `onClauseUpdated`: A callback `function` called when text inside of a clause is changed.
- `pasteToContract`: A callback `function` to load a clause template via copy/paste.

### Available Functionality

- `clauseProps`: An `object` for the clauses in the editor which contains a deletion, edit, and test function, as well as a header title string and color for clause icons on hover see below.

#### Specifications

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