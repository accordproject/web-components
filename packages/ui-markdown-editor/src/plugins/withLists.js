/* eslint-disable no-param-reassign */
import { Transforms, Node } from 'slate';
import { ENTER_BLOCK, ENTER_LIST } from '../utilities/hotkeys';
import { LIST_ITEM, PARAGRAPH } from '../utilities/schema';

/**
 * Extends the editor's features by including the lists feature.
 * 
 * @param {Object} editor Editor to be improved
 * @returns {Object} Editor with the lists functionality
 */
export const withLists = (editor) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    const currNode = Node.get(editor, editor.selection.focus.path);
    if (currNode.text === '') {
      // eslint-disable-next-line no-restricted-syntax
      for (const [n] of Node.ancestors(editor, editor.selection.focus.path, { reverse: true })) {
        if (ENTER_BLOCK[n.type]) {
          if (ENTER_LIST[n.type]) {
            Transforms.unwrapNodes(editor, { match: n => n.type === LIST_ITEM, split: true });
          }
          Transforms.unwrapNodes(editor, { match: n => ENTER_BLOCK[n.type], split: true });
          return;
        }
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [currNode] of Node.ancestors(
      editor,
      editor.selection.focus.path,
      { reverse: true }
    )) {
      if (currNode.type === LIST_ITEM) {
        const block = {
          type: LIST_ITEM,
          children: [{
            object: 'block',
            type: PARAGRAPH,
            children: [{ object: 'text', text: '' }],
            data: {}
          }],
          data: { tight: true }
        };

        Transforms.insertNodes(editor, block, { match: n => n.type === LIST_ITEM });
        return;
      }
    }
    insertBreak();
  };

  return editor;
};
