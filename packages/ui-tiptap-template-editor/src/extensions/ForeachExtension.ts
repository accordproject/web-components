import { Node, mergeAttributes } from '@tiptap/core';

export const ForeachExtension = Node.create({
  name: 'foreach',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="foreach"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'foreach' }), 0];
  },
});
