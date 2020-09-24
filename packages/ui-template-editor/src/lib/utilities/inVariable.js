import { Node } from 'slate';
import { isEqual } from 'lodash';
import { VARIABLE } from '../TemplateEditor/plugins/withClauseSchema';

const inVariable = (editor) => {
  const { selection } = editor;
  if (!selection) return false;
  // check if the user has selected more than just a variable
  if (!isEqual(selection.anchor.path, selection.focus.path)) return false;
  return Node.parent(editor, editor.selection.focus.path).type === VARIABLE;
};

export default inVariable;
