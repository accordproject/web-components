import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateConditionalNodeView } from '../nodeViews/TemplateConditionalNodeView';

export const ConditionalExtension = Node.create({
  name: 'conditional',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: '' },
      condition: { default: null },
      dependencies: { default: [] },
      isTrue: { default: false },
      whenTrueJson: { default: '[]' },
      whenFalseJson: { default: '[]' },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="conditional"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'conditional' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateConditionalNodeView);
  },
});
