import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateOptionalNodeView } from '../nodeViews/TemplateOptionalNodeView';

export const OptionalExtension = Node.create({
  name: 'optional',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: '' },
      hasSome: { default: false },
      whenSomeJson: { default: '[]' },
      whenNoneJson: { default: '[]' },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="optional"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'optional' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateOptionalNodeView);
  },
});
