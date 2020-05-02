## Cicero-UI - ContractEditor

### Usage

```
npm install @accordproject/cicero-ui
```

```
import { ContractEditor } from '@accordproject/cicero-ui';

function storeLocal(editor) {
  localStorage.setItem('markdown-editor', editor.getMarkdown());
}

ReactDOM.render(<ContractEditor onChange={storeLocal} />, document.getElementById('root'));
```

### Props

Available props incoming:
