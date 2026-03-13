import { Node, mergeAttributes } from '@tiptap/core';

export const ListBlockExtension = Node.create({
  name: 'listBlock',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      name: { default: null },
      elementType: { default: null },
      listType: { default: 'bullet' },
      tight: { default: true },
      start: { default: 1 },
      delimiter: { default: null },
    };
  },

  parseHTML() {
    return [
      { tag: 'ul[data-type="listBlock"]' },
      { tag: 'ol[data-type="listBlock"]' },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const tag = node.attrs.listType === 'ordered' ? 'ol' : 'ul';
    return [tag, mergeAttributes(HTMLAttributes, { 'data-type': 'listBlock' }), 0];
  },
});
