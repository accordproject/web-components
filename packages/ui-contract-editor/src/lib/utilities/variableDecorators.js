import { Node } from 'slate';
import { Decorators } from '@accordproject/markdown-cicero';
import inVariable from './inVariable';

export const isReadOnlyVariable = (variableNode) => {
  try {
    const decorators = new Decorators(variableNode.data);
    return (decorators.getDecoratorValue('ContractEditor', 'readOnly') === true);
  } catch (err) {
    return false;
  }
};

export const getDecoratorArguments = (variableNode) => {
  try {
    const decorators = new Decorators(variableNode.data);
    return decorators.getArguments('ContractEditor');
  } catch (err) {
    return {};
  }
};

export const inReadOnlyVariable = (editor) => {
  if (inVariable(editor)) {
    const variableNode = Node.parent(editor, editor.selection.focus.path);
    return isReadOnlyVariable(variableNode);
  }
  return false;
};
