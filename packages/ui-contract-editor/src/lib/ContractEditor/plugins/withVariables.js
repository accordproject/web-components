import { Transforms, Node, Editor } from 'slate';
import inVariable from '../../utilities/inVariable';
import { inReadOnlyVariable } from '../../utilities/variableDecorators';
import { VARIABLE } from './withClauseSchema';

/* eslint no-param-reassign: 0 */
const withVariables = (editor) => {
  const { insertText, isInline } = editor;
  editor.insertText = (text) => {
    const nextNode = Editor.next(editor, { at: editor.selection.focus.path });
    const textLength = Node.get(editor, editor.selection.focus.path).text.length;

    // if the current focus is at the end of a node and the next node is a variable
    // move focus to the start of the variable node
    if (nextNode && nextNode[0].type === VARIABLE && textLength === editor.selection.focus.offset) {
      Transforms.select(editor, nextNode[1]);
      Transforms.collapse(editor, { edge: 'start' });
    }

    // the default slate implementation of `insertText` moves the cursor
    // out of inlines before inserting text. Override this for variables
    // https://github.com/ianstormtaylor/slate/blob/1d7ab974292a3e831908a2ba0aab9fdd8a66fe10/packages/slate/src/create-editor.ts#L154
    if (Node.parent(editor, editor.selection.focus.path).type === VARIABLE) {
      Transforms.insertText(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.isInline = element => (element.type === VARIABLE ? true : isInline(element));
  return editor;
};

export const isEditableVariable = (lockText, editor, event) => {
  if (!lockText || !editor.isInsideClause()) return true;
  const { selection } = editor;
  const textLength = Node.get(editor, editor.selection.focus.path).text.length;
  const atEnd = editor => textLength === editor.selection.focus.offset;
  const editable = inVariable(editor) && !inReadOnlyVariable(editor);

  if (editable) {
    if (atEnd(editor) && event.inputType === 'deleteContentForward') {
      return false;
    }
    if (event.inputType === 'deleteContentBackward') {
      // Do not allow user to delete variable if only 1 char left
      if (textLength === 1) {
        return false;
      }
      // if we hit backspace and are at the zeroth position of a
      // variable prevent deleting the char that precedes the variable
      return selection.anchor.offset > 0;
    }
    // do not allow hitting enter or pasting inside variables
    if (event.inputType === 'insertFromPaste'
    || event.inputType === 'insertParagraph'
    || event.inputType === 'insertLineBreak') {
      return false;
    }
  }
  const nextNode = Editor.next(editor, { at: editor.selection.focus.path });
  // if the current focus is at the end of a node & the next node is a variable allow editing
  if (nextNode && nextNode[0].type === VARIABLE && textLength === editor.selection.focus.offset) {
    if (event.inputType === 'deleteContentBackward') {
      return false;
    }
    return true;
  }
  return editable;
};

export default withVariables;
