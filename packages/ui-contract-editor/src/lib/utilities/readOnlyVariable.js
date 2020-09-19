import { Node } from 'slate';
import { Decorators } from '@accordproject/markdown-cicero';

export const isReadOnlyVariable = (variableNode) => {
  const decorators = new Decorators(variableNode.data);
  return (decorators.getDecoratorValue('ContractEditor', 'readOnly') === true);
};

export const getOpacity = (variableNode) => {
  const decorators = new Decorators(variableNode.data);
  const opacity = decorators.getDecoratorValue('ContractEditor', 'opacity');
  return opacity !== undefined ? opacity : 1;
};

export const inReadOnlyVariable = (editor) => {
  const { selection } = editor;
  if (!selection) return false;
  const variableNode = Node.parent(editor, editor.selection.focus.path);
  return isReadOnlyVariable(variableNode);
};
