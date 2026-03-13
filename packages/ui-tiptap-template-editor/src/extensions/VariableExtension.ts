import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateVariableNodeView } from '../nodeViews/TemplateVariableNodeView';

export const VariableExtension = Node.create({
  name: 'variable',
  group: 'inline',
  inline: true,
  content: 'text*',
  marks: '',

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
      identifiedBy: { default: null },
      decorators: { default: [] },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="variable"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'variable' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateVariableNodeView);
  },
});
