import { Node, mergeAttributes } from '@tiptap/core';

export const JoinExtension = Node.create({
  name: 'join',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
      separator: { default: ', ' },
      locale: { default: null },
      listFormatType: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="join"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'join' })];
  },
});
