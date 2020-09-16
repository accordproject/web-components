import { Node } from 'slate';

export const isReadOnlyVariable = (variableNode) => {
  if (variableNode.data.decorators) {
    const decorator = variableNode.data.decorators.find(d => d.name === 'ContractEditor'
      && d.arguments && d.arguments.length === 1);
    return decorator && decorator.arguments[0].value === 'readOnly';
  }

  return false;
};

export const inReadOnlyVariable = (editor) => {
  const { selection } = editor;
  if (!selection) return false;
  const variableNode = Node.parent(editor, editor.selection.focus.path);
  return isReadOnlyVariable(variableNode);
};
