import { Node, mergeAttributes } from '@tiptap/core';

export const WithExtension = Node.create({
  name: 'withBlock',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="withBlock"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'withBlock', 'data-name': node.attrs.name }), 0];
  },
});
