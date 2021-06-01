/* eslint-disable no-param-reassign */
import {
  Transforms, Node, Editor, Range
} from 'slate';

import { ReactEditor } from 'slate-react';

/**
 * Checks if the selection is a link or not.
 * 
 * @param {Object} editor Editor in which the link is to be checked
 * @returns {boolean} Selection in editor is link or not
 */
export const isSelectionLink = editor => Node.parent(editor, editor.selection.focus.path).type === 'link';

/**
 * Checks if the selection is at the end.
 * 
 * @param {Object} editor Editor in which the selection is made
 * @returns The selection is at end or not
 */
const atEnd = (editor) => {
  const textLength = Node.get(editor, editor.selection.focus.path).text.length;
  return textLength === editor.selection.focus.offset;
};

// checks if selection is in the body of the link and not at the end
export const isSelectionLinkBody = editor => isSelectionLink(editor) && !atEnd(editor)
    && Range.isCollapsed(editor.selection);

// checks if selection is at the end of a link
export const isSelectionLinkEnd = editor => isSelectionLink(editor) && atEnd(editor);

/**
 * Removes the link from the node/value.
 * 
 * @param {Object} editor Editor containing the node
 */
export const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'link' });
};

/**
 * Wraps the value in the link.
 * 
 * @param {Object} editor Editor containing the value/node
 * @param {string} url    URL of the link
 * @param {string} text   Text of the link
 */
const wrapLink = (editor, url, text) => {
  const link = {
    type: 'link',
    data: {
      href: url
    },
    children: text ? [{ text }] : [{ text: url }],
  };
  const isCollapsed = editor.selection && Range.isCollapsed(editor.selection);
  if (isCollapsed && isSelectionLink(editor)) {
    const linkNodePath = ReactEditor.findPath(
      editor, Node.parent(editor, editor.selection.focus.path)
    );
    if (text !== Editor.string(editor, linkNodePath)) {
      Transforms.insertText(editor, text, { at: linkNodePath });
    }
    Transforms.select(editor, linkNodePath);
    unwrapLink(editor);
    Transforms.wrapNodes(editor, link, { split: true });
    return;
  }
  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
    return;
  }
  if(isSelectionLink(editor)){
    unwrapLink(editor);
  }
  Editor.deleteBackward(editor);
  Transforms.insertNodes(editor, link);
};

/**
 * Inserts the link in the document.
 * 
 * @param {Object} editor Editor in which insertion is to be made
 * @param {string} url    URL of the link
 * @param {string} text   Text of the link
 */
export const insertLink = (editor, url, text) => {
  if (editor.selection) {
    wrapLink(editor, url, text);
  }
};

/**
 * Extends the editor's features by including the link feature.
 * 
 * @param {Object} editor Editor to be improved
 * @returns {Object} Editor with the links functionality
 */
export const withLinks = (editor) => {
  const { isInline, insertBreak } = editor;

  editor.isInline = element => (element.type === 'link' ? true : isInline(element));

  editor.insertBreak = () => {
    if (isSelectionLinkEnd(editor)) {
      const point = Editor.after(editor, editor.selection.focus.path);
      Transforms.setSelection(editor, {
        anchor: point,
        focus: point,
      });
      insertBreak();
    } else {
      insertBreak();
    }
  };

  return editor;
};
