/* eslint-disable no-param-reassign */
import {
  Transforms, Node, Editor, Range
} from 'slate';

import { ReactEditor } from 'slate-react';

export const isSelectionLink = editor => Node.parent(editor, editor.selection.focus.path).type === 'link';

const atEnd = (editor) => {
  const textLength = Node.get(editor, editor.selection.focus.path).text.length;
  return textLength === editor.selection.focus.offset;
};

// checks if selection is in the body of the link and not at the end
export const isSelectionLinkBody = editor => isSelectionLink(editor) && !atEnd(editor)
    && Range.isCollapsed(editor.selection);

// checks if selection is at the end of a link
export const isSelectionLinkEnd = editor => isSelectionLink(editor) && atEnd(editor);

export const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'link' });
};

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
  unwrapLink(editor);
  Transforms.wrapNodes(editor, link, { split: true });
};

export const insertLink = (editor, url, text) => {
  if (editor.selection) {
    wrapLink(editor, url, text);
  }
};

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
