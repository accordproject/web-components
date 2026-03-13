import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateFormattedVariableNodeView } from '../nodeViews/TemplateVariableNodeView';

export const FormattedVariableExtension = Node.create({
  name: 'formattedVariable',
  group: 'inline',
  inline: true,
  content: 'text*',
  marks: '',

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
      format: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="formattedVariable"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'formattedVariable' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateFormattedVariableNodeView);
  },
});
