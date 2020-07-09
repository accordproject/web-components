import { Node, Editor, Transforms } from 'slate';
import {
  LIST_ITEM, BLOCK_QUOTE, LIST_TYPES, PARAGRAPH
} from './schema';

export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  });

  return !!match;
};

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = input => LIST_TYPES.includes(input);
  const isQuote = input => input === BLOCK_QUOTE;
  const isListItem = input => input === LIST_ITEM;

  /* Clear selection of block types */
  Transforms.unwrapNodes(editor, { match: n => isQuote(n.type), split: true });
  Transforms.unwrapNodes(editor, { match: n => isListItem(n.type), split: true });
  Transforms.unwrapNodes(editor, { match: n => LIST_TYPES.includes(n.type), split: true });

  if (format === 'paragraph' || format.startsWith('heading')) {
    Transforms.setNodes(editor, { type: format });
    return;
  }

  if (!isActive) {
    const formattedBlock = {
      type: format, children: [], data: (isQuote(format) ? {} : { tight: true })
    };
    Transforms.wrapNodes(editor, formattedBlock);

    if (isList(format)) {
      const listItemBlock = { type: LIST_ITEM, children: [], data: { tight: true } };
      // eslint-disable-next-line no-restricted-syntax
      for (const [node, path] of Node.descendants(
        editor,
        { from: editor.selection.anchor.path, to: editor.selection.focus.path }
      )) {
        if (node.type === PARAGRAPH) {
          Transforms.wrapNodes(editor, listItemBlock, { at: path });
        }
      }
    }
  }
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const toggleHistory = (editor, format) => {
  if (format === 'undo') {
    editor.undo();
  } else { editor.redo(); }
};

export const insertThematicBreak = (editor, type) => {
  const text = { text: '' };
  const tBreakNode = [
    {
      object: 'block',
      type,
      children: [text],
      data: {},
      hr: true
    },
    {
      children: [text],
      data: {},
      object: 'block',
      type: PARAGRAPH
    },
  ];
  Transforms.insertNodes(editor, tBreakNode);
};
