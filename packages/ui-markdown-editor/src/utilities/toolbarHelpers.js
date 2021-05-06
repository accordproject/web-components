import { Node, Editor, Transforms } from 'slate';
import {
  LIST_ITEM, BLOCK_QUOTE, LIST_TYPES, PARAGRAPH, LINEBREAK, HEADINGS, H1, H2, H3, H4, H5, H6
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
      const anchor = editor.selection.anchor.path.slice(0, -1).concat(0, editor.selection.anchor.path[editor.selection.anchor.path.length - 1]);
      const focus = editor.selection.focus.path.slice(0, -1).concat(0, editor.selection.focus.path[editor.selection.focus.path.length - 1]);
      // swap anchor and focus when selecting from bottom-top
      if(anchor[1]>focus[1]){
        [anchor[1],focus[1]]=[focus[1],anchor[1]];
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const [node, path] of Node.descendants(
        editor,
        { from: anchor, to: focus }
      )) {
        if (node.type === PARAGRAPH  || HEADINGS.includes(node.type)) {
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
  const text = { object: 'text', text: '' };
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

export const insertLineBreak = (editor) => {
  const text = { object: 'text', text: '' };
  const br = { type: LINEBREAK, children: [text], data: {} };
  Transforms.insertNodes(editor, br);
  Transforms.move(editor, { distance: 1, unit: 'character' });
};


export const insertParagraphBreak = (editor) => {
  editor.insertBreak();
  return;
}

export const insertHeadingBreak = (editor) => {
  const text = { object: 'text', text: '' };
  const n = { object: "block", type: 'paragraph', children: [text] };
  Transforms.insertNodes(editor, n);
  return;
}

export const isBlockHeading = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => { 
      return n.type === H1
        || n.type === H2
        || n.type === H3
        || n.type === H4
        || n.type === H5
        || n.type === H6
    },
  });
  return !!match;
};
